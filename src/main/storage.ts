import Store from 'electron-store';
import { Settings } from '@interfaces/settings';
import { WindowBounds, WindowIds } from '../interfaces/app';

type StoredData = Partial<Record<`windowState.${WindowIds}`, WindowBounds>> & {
  settings: Settings;
};

export const store = new Store<StoredData>();
