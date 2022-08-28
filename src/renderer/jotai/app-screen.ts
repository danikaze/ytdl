import { atom, useAtom } from 'jotai';
import { AppScreen } from '@interfaces/app';

const rawAppScreen = atom<AppScreen>('loading');

export function useAppScreen() {
  const [screen, setScreen] = useAtom(rawAppScreen);

  return {
    screen,
    setScreen,
  };
}
