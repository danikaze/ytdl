import {
  screen,
  BrowserWindow,
  BrowserWindowConstructorOptions,
} from 'electron';
import { WindowBounds, WindowIds } from '../../interfaces/app';
import { store } from '../storage';

/**
 * Create a window via new BrowserWindow and handles its size and position
 * storing it via electron-store and using it the next time is created, if exists
 */
export function createPositionedWindow(
  windowName: WindowIds,
  options: BrowserWindowConstructorOptions
): BrowserWindow {
  const defaultSize = {
    width: options.width,
    height: options.height,
  };
  let state = {} as WindowBounds;
  let win: BrowserWindow;

  const ensureVisibleOnSomeDisplay = (
    windowState: WindowBounds
  ): WindowBounds => {
    const visible = screen.getAllDisplays().some((display) => {
      return isWindowWithinBounds(windowState, display.bounds);
    });
    if (!visible) {
      // Window is partially or fully not visible now.
      // Reset it to safe defaults.
      return resetToDefaults(defaultSize);
    }
    return windowState;
  };

  const saveState = () => {
    if (!win.isMinimized() && !win.isMaximized()) {
      Object.assign(state, getCurrentPosition(win));
    }
    store.set(`windowState.${windowName}`, state);
  };

  const storedState = store.get(`windowState.${windowName}`);
  state = storedState
    ? ensureVisibleOnSomeDisplay(storedState)
    : resetToDefaults(defaultSize);

  const browserOptions: BrowserWindowConstructorOptions = {
    ...options,
    ...state,
    webPreferences: {
      nodeIntegration: true,
      ...options.webPreferences,
    },
  };
  win = new BrowserWindow(browserOptions);

  win.on('close', saveState);

  return win;
}

function getCurrentPosition(win: BrowserWindow): WindowBounds {
  const position = win.getPosition();
  const size = win.getSize();

  return {
    x: position[0],
    y: position[1],
    width: size[0],
    height: size[1],
  };
}

function resetToDefaults(
  defaultSize: Partial<Pick<WindowBounds, 'width' | 'height'>>
): WindowBounds {
  const { bounds } = screen.getPrimaryDisplay();
  return {
    ...defaultSize,
    x: (bounds.width - defaultSize.width!) / 2,
    y: (bounds.height - defaultSize.height!) / 2,
  } as WindowBounds;
}

function isWindowWithinBounds(
  windowState: WindowBounds,
  bounds: WindowBounds
): boolean {
  return (
    windowState.x >= bounds.x &&
    windowState.y >= bounds.y &&
    windowState.x + windowState.width <= bounds.x + bounds.width &&
    windowState.y + windowState.height <= bounds.y + bounds.height
  );
}
