import { Settings } from '@interfaces/settings';
import Store from 'electron-store';

interface StoredData {
  settings: Settings;
}

export const store = new Store<StoredData>();
