export const DEFAULT_SESSIONS = ['main', 'work', 'logs'];
export const MAX_SIDEBAR_WIDTH = 36;
export const MIN_SIDEBAR_WIDTH = 20;

export const shell = process.env.SHELL ?? (process.platform === 'win32' ? 'powershell.exe' : 'bash');
