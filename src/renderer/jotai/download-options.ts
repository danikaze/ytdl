import { atom, useAtom } from 'jotai';
import {
  YoutubeDlAudioOptions,
  YoutubeDlMetadata,
  YoutubeDlOptions,
  YoutubeDlVideoOptions,
} from '@utils/youtube/types';
import { useSettings } from './settings';

export type DownloadType = 'audio' | 'video';

interface ModalState {
  url: string;
  show: boolean;
  metadata?: YoutubeDlMetadata;
  downloadType: DownloadType;
  downloadOptions: Pick<YoutubeDlOptions, 'outputFile' | 'outputFolder'>;
  downloadAudioOptions: Omit<
    YoutubeDlAudioOptions,
    'outputFile' | 'outputFolder'
  >;
  downloadVideoOptions: Omit<
    YoutubeDlVideoOptions,
    'outputFile' | 'outputFolder'
  >;
  error?: string;
}

const rawModal = atom<ModalState>({
  url: '',
  show: false,
  downloadType: 'video',
  downloadOptions: {
    outputFile: '%(title)s',
    outputFolder: '',
  },
  downloadAudioOptions: {
    format: 'best',
  },
  downloadVideoOptions: {
    format: 'best',
  },
});

export function useDownloadOptions() {
  const [modal, setModal] = useAtom(rawModal);
  const { settings } = useSettings();

  async function openModal(url: string) {
    setModal({
      url,
      show: true,
      metadata: undefined,
      downloadType: 'video',
      downloadOptions: {
        outputFile: '%(title)s',
        outputFolder: settings.downloadFolder,
      },
      downloadAudioOptions: {
        format: 'best',
      },
      downloadVideoOptions: {
        format: 'best',
      },
    });
    try {
      const metadata = await window.ytdl.fetchMetadata(url);
      setModal((currentModal) => ({
        ...currentModal,
        url,
        metadata,
      }));
    } catch (error) {
      setModal((currentModal) => ({
        ...currentModal,
        error: String(error),
      }));
    }
  }

  function closeModal() {
    setModal((currentModal) => ({
      ...currentModal,
      url: modal.url,
      show: false,
    }));
  }

  function selectDownloadOutputFile(filename: string) {
    setModal((currentModal) => ({
      ...currentModal,
      downloadOptions: {
        ...currentModal.downloadOptions,
        outputFile: filename,
      },
    }));
  }

  function selectDownloadOutputFolder(folder: string) {
    setModal((currentModal) => ({
      ...currentModal,
      downloadOptions: {
        ...currentModal.downloadOptions,
        outputFolder: folder,
      },
    }));
  }

  function selectDownloadType(type: DownloadType) {
    setModal((currentModal) => ({
      ...currentModal,
      downloadType: type,
    }));
  }

  function updateDownloadAudioOptions<K extends keyof YoutubeDlAudioOptions>(
    key: K,
    value: YoutubeDlAudioOptions[K]
  ) {
    setModal((currentModal) => ({
      ...currentModal,
      downloadAudioOptions: {
        ...currentModal.downloadAudioOptions,
        [key]: value,
      },
    }));
  }

  function updateDownloadVideoOptions<K extends keyof YoutubeDlVideoOptions>(
    key: K,
    value: YoutubeDlVideoOptions[K]
  ) {
    setModal((currentModal) => ({
      ...currentModal,
      downloadVideoOptions: {
        ...currentModal.downloadVideoOptions,
        [key]: value,
      },
    }));
  }

  return {
    open: openModal,
    close: closeModal,
    selectDownloadOutputFile,
    selectDownloadOutputFolder,
    updateDownloadAudioOptions,
    updateDownloadVideoOptions,
    selectDownloadType,
    downloadType: modal.downloadType,
    downloadOptions: modal.downloadOptions,
    downloadAudioOptions: modal.downloadAudioOptions,
    downloadVideoOptions: modal.downloadVideoOptions,
    url: modal.url,
    isVisible: modal.show,
    metadata: modal.metadata,
    error: modal.error,
  };
}
