/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import {
	app,
	BrowserWindow,
	shell,
	ipcMain,
	Tray,
	Menu,
	nativeImage,
} from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import pass_generator from 'generate-password';
import MenuBuilder from './menu';
import DatabaseManager from './db';
import { resolveHtmlPath } from './util';

let tray: Tray;
let isQuiting = false;

class AppUpdater {
	constructor() {
		log.transports.file.level = 'info';
		autoUpdater.logger = log;
		autoUpdater.checkForUpdatesAndNotify();
	}
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
	const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
	console.log(msgTemplate(arg));
	event.reply('ipc-example', msgTemplate('pong'));
});

ipcMain.handle('dialog:login', async (event, args) => {
	return DatabaseManager.login(args.username, args.password);
});

ipcMain.handle('dialog:save-pass', async (event, args) => {
	return DatabaseManager.savePassword(
		args.source,
		args.username,
		args.password
	);
});

ipcMain.handle('dialog:get-logo-path', (event, args) => {
	const RESOURCES_PATH = app.isPackaged
		? path.join(process.resourcesPath, 'assets/logo.png')
		: path.join(__dirname, '../../assets/logo.png');

	return RESOURCES_PATH as string;
});

ipcMain.handle('dialog:gen-pass', async (event, args) => {
	const password = pass_generator.generate({
		length: args.length,
		symbols: args.symbols,
		numbers: args.numbers,
		uppercase: args.uppercase,
		lowercase: args.lowercase,
	});
	return password;
});

ipcMain.on('dialog:retrieve-all-pass', (event, args) => {
	const passwords = DatabaseManager.retrieveAllPasswords();
	event.reply('dialog:retrieve-all-pass', passwords || []);
});

if (process.env.NODE_ENV === 'production') {
	const sourceMapSupport = require('source-map-support');
	sourceMapSupport.install();
}

const isDebug =
	process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
	require('electron-debug')();
}

const installExtensions = async () => {
	const installer = require('electron-devtools-installer');
	const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
	const extensions = ['REACT_DEVELOPER_TOOLS'];

	return installer
		.default(
			extensions.map((name) => installer[name]),
			forceDownload
		)
		.catch(console.log);
};

const createWindow = async () => {
	if (isDebug) {
		await installExtensions();
	}

	const RESOURCES_PATH = app.isPackaged
		? path.join(process.resourcesPath, 'assets')
		: path.join(__dirname, '../../assets');

	const getAssetPath = (...paths: string[]): string => {
		return path.join(RESOURCES_PATH, ...paths);
	};

	mainWindow = new BrowserWindow({
		show: false,
		width: 960,
		height: 700,
		icon: getAssetPath('icon.webp'),
		autoHideMenuBar: true,
		webPreferences: {
			sandbox: false,
			preload: app.isPackaged
				? path.join(__dirname, 'preload.js')
				: path.join(__dirname, '../../.erb/dll/preload.js'),
		},
	});

	mainWindow.loadURL(resolveHtmlPath('index.html'));
	mainWindow.setResizable(false);
	mainWindow.on('ready-to-show', () => {
		if (!mainWindow) {
			throw new Error('"mainWindow" is not defined');
		}
		if (process.env.START_MINIMIZED) {
			mainWindow.minimize();
		} else {
			mainWindow.show();
			if (process.env.NODE_ENV === 'development') {
				mainWindow.webContents.openDevTools({ mode: 'detach' });
			}
		}
	});

	mainWindow.on('close', (e: Event) => {
		if (!isQuiting) {
			e.preventDefault();
			mainWindow.hide();
		}
	});

	mainWindow.on('closed', () => {
		mainWindow = null;
	});

	const menuBuilder = new MenuBuilder(mainWindow);
	menuBuilder.buildMenu();

	// Open urls in the user's browser
	mainWindow.webContents.setWindowOpenHandler((edata) => {
		shell.openExternal(edata.url);
		return { action: 'deny' };
	});

	// Remove this if your app does not use auto updates
	// eslint-disable-next-line
	//new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
	// Respect the OSX convention of having the application in memory even
	// after all windows have been closed
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('before-quit', () => {
	isQuiting = true;
});

app.whenReady()
	.then(() => {
		createWindow();
		app.on('activate', () => {
			// On macOS it's common to re-create a window in the app when the
			// dock icon is clicked and there are no other windows open.
			if (mainWindow === null) createWindow();
		});

		const RESOURCES_PATH = app.isPackaged
			? path.join(process.resourcesPath, 'assets')
			: path.join(__dirname, '../../assets');
		tray = new Tray(path.join(RESOURCES_PATH, '/icon.ico'));

		tray.setContextMenu(
			Menu.buildFromTemplate([
				{
					label: 'Show App',
					click() {
						mainWindow.show();
					},
				},
				{
					label: 'Quit',
					click() {
						isQuiting = true;
						app.quit();
					},
				},
			])
		);

		tray.setToolTip('Password Manager');
		tray.on('double-click', () => {
			if (!mainWindow?.isVisible) {
				mainWindow?.show();
			}
		});
	})
	.catch(console.log);
