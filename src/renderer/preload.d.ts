import { ElectronYtdl } from '@main/preload';

declare global {
  interface Window {
    ytdl: ElectronYtdl;
  }
}

export {};
