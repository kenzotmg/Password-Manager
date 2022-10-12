/* eslint-disable no-console */
import fs from 'fs';
import SimpleCrypto from 'simple-crypto-js';
import Database from 'better-sqlite3-multiple-ciphers';
import crypto from 'crypto';
import path from 'path';
import { app } from 'electron';

let KEY: string;
let conn: Database;

const RESOURCES_PATH = app.isPackaged
	? path.join(process.resourcesPath, 'db')
	: path.join(__dirname, '../../db');

const DatabaseManager = {
	setKey(key: string) {
		KEY = key;
	},

	createConnection() {
		const dbFile = path.join(RESOURCES_PATH, 'db.db');
		if (this.doesDbFileExists(dbFile)) {
			const db = new Database(dbFile);
			db.pragma(`key='${KEY}'`);
			conn = db;
			if (this.isKeyValid()) {
				return true;
			}
			conn = undefined;
			return false;
		}
		const dbTemp = new Database(dbFile);
		const sqlFile = path.join(RESOURCES_PATH, 'db.sql');
		const migration = fs.readFileSync(sqlFile, 'utf-8');
		dbTemp.exec(migration);
		dbTemp.pragma(`rekey='${KEY}'`);
		conn = dbTemp;
		return true;
	},

	doesDbFileExists(dbFile: string) {
		return fs.existsSync(dbFile);
	},

	isKeyValid() {
		try {
			const stmt = conn.prepare('SELECT * FROM passwords');
			stmt.get();
			return true;
		} catch (e) {
			this.print(`Encryption key is not valid: ${e}`);
			return false;
		}
	},

	savePassword(source: string, uname_email = null, password: string) {
		const simpleCrypto = new SimpleCrypto(KEY);
		const stmt = conn.prepare(
			'INSERT INTO passwords(source, username, password) VALUES(?, ?, ?)'
		);
		const encryptedPassword = simpleCrypto.encrypt(password);
		try {
			const info = stmt.run(source, uname_email, encryptedPassword);
			if (info.changes >= 1) {
				return true;
			}
			return false;
		} catch (err) {
			this.print(err);
			return false;
		}
	},

	generateKey(username: string, password: string) {
		const secret = username + password;
		const hash = crypto.createHash('sha256').update(secret).digest('hex');
		DatabaseManager.setKey(hash);
	},

	retrieveAllPasswords() {
		const stmt = conn.prepare('SELECT * FROM passwords');
		const cat = stmt.all();
		const simpleCrypto = new SimpleCrypto(KEY);
		if (cat.length >= 1) {
			const passwords = [];
			cat.forEach((item, index, arr) => {
				const newObject = {
					primary_key: item.primary_key,
					source: item.source,
					username: item.username,
					password: simpleCrypto.decrypt(item.password),
				};
				passwords.push(newObject);
			});
			return passwords;
		}
		return null;
	},

	login(username: string, password: string) {
		this.generateKey(username, password);
		if (this.createConnection()) {
			return true;
		}
		KEY = '';
		return false;
	},

	print(message: string) {
		if (process.env.NODE_ENV === 'development') {
			console.log(message);
		}
	},
};

export default DatabaseManager;
