declare global {
	interface Window {
		electron: {
			ipcRenderer: {
				sendMessage(channel: string, args: unknown[]): void;
				on(
					channel: string,
					func: (...args: unknown[]) => void
				): (() => void) | undefined;
				invoke(channel: string, args: object): unknown;
				once(channel: string, func: (...args: unknown[]) => void): void;
			};
		};
	}
}

export {};
