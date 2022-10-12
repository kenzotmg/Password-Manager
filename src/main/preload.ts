import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

contextBridge.exposeInMainWorld('electron', {
	ipcRenderer: {
		sendMessage(channel: string, args: unknown[]) {
			ipcRenderer.send(channel, args);
		},
		on(channel: string, func: (...args: unknown[]) => void) {
			const subscription = (
				_event: IpcRendererEvent,
				...args: unknown[]
			) => func(...args);
			ipcRenderer.on(channel, subscription);

			return () => ipcRenderer.removeListener(channel, subscription);
		},
		invoke(channel: string, args: object) {
			return ipcRenderer.invoke(channel, args);
		},
		once(channel: string, func: (...args: unknown[]) => void) {
			ipcRenderer.once(channel, (_event, ...args) => func(...args));
		},
	},
});
