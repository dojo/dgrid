export * from './intern';

export const environments = [
	{ browserName: 'MicrosoftEdge', platform: 'Windows 10' },
	{ browserName: 'Firefox', platform: 'Windows' },
	{ browserName: 'chrome', platform: 'Windows 10' }
];

export const maxConcurrency = 2;
export const tunnelOptions = {};
export const tunnel = 'BrowserstackTunnel';
