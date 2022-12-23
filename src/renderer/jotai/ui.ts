import { atom, useAtom } from 'jotai';
import { AppUi } from '@interfaces/ui';

const rawAppUi = atom<AppUi>({
  confirmDownloadId: undefined,
});

export type AppUiApi = ReturnType<typeof useAppUi>;

export function useAppUi() {
  const [ui, setUi] = useAtom(rawAppUi);

  function setConfirmDownloadId(id: AppUi['confirmDownloadId']) {
    setUi({ ...ui, confirmDownloadId: id });
  }

  return {
    confirmDownloadId: ui.confirmDownloadId,
    setConfirmDownloadId,
  };
}
