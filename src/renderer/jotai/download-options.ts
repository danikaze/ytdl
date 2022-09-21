import { atom, useAtom } from 'jotai';
import type { DownloadType } from '@interfaces/settings';
import { isValidFilename } from '@utils/is-valid-filename';
import { replaceMetadata } from '@utils/youtube/replace-metadata';
import {
  YoutubeDlAudioOptions,
  YoutubeDlMetadata,
  YoutubeDlOptions,
  YoutubeDlVideoOptions,
} from '@utils/youtube/types';
import { useSettings } from './settings';

interface ModalState {
  url: string;
  show: boolean;
  /** Filename input by the user */
  filename: string;
  isValidFilename: boolean;
  metadata?: YoutubeDlMetadata;
  downloadType: DownloadType;
  downloadOptions: Pick<
    YoutubeDlOptions,
    /** Filename after replacing the metadata */
    'outputFile' | 'outputFolder'
  >;
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
  filename: '[title]',
  isValidFilename: false,
  downloadType: 'video',
  downloadOptions: {
    outputFile: '[title]',
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
  const { getSetting, updateSetting } = useSettings();

  async function openModal(url: string) {
    const initialMetadata = undefined;
    const initialFilename = '[title]';
    const initialOutputFile = replaceMetadata(initialFilename, initialMetadata);

    setModal({
      url,
      show: true,
      filename: initialFilename,
      isValidFilename: isValidFilename(initialOutputFile),
      metadata: initialMetadata,
      downloadType: getSetting('downloads.downloadType', true),
      downloadOptions: {
        outputFile: initialOutputFile,
        outputFolder: getSetting('downloads.downloadFolder', true),
      },
      downloadAudioOptions: {
        format: getSetting('downloads.audio.audioFormat', true),
      },
      downloadVideoOptions: {
        format: getSetting('downloads.video.videoFormat', true),
      },
    });

    try {
      const metadata = await window.ytdl.fetchMetadata(url);
      setModal((currentModal) => {
        const finalFilename = replaceMetadata(currentModal.filename, metadata);
        return {
          ...currentModal,
          url,
          metadata,
          isValidFilename: isValidFilename(finalFilename),
          downloadOptions: {
            ...modal.downloadOptions,
            outputFile: finalFilename,
          },
        };
      });
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
    setModal((currentModal) => {
      const outputFile = replaceMetadata(filename, modal.metadata);
      return {
        ...currentModal,
        filename,
        isValidFilename: isValidFilename(outputFile),
        downloadOptions: {
          ...currentModal.downloadOptions,
          outputFile,
        },
      };
    });
  }

  function selectDownloadOutputFolder(folder: string) {
    updateSetting('last.downloads.downloadFolder', folder);
    setModal((currentModal) => ({
      ...currentModal,
      downloadOptions: {
        ...currentModal.downloadOptions,
        outputFolder: folder,
      },
    }));
  }

  function selectDownloadType(type: DownloadType) {
    updateSetting('last.downloads.downloadType', type);
    setModal((currentModal) => ({
      ...currentModal,
      downloadType: type,
    }));
  }

  function updateDownloadAudioOptions<K extends keyof YoutubeDlAudioOptions>(
    key: K,
    value: YoutubeDlAudioOptions[K]
  ) {
    // update last values if needed
    if (value !== undefined) {
      if (key === 'format') {
        updateSetting(
          'last.downloads.audio.audioFormat',
          value as Exclude<YoutubeDlAudioOptions['format'], undefined>
        );
      }
    }
    // update the modal
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
    // update last values if needed
    if (value !== undefined) {
      if (key === 'format') {
        updateSetting(
          'last.downloads.video.videoFormat',
          value as Exclude<YoutubeDlVideoOptions['format'], undefined>
        );
      }
    }
    // update the modal
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
    filename: modal.filename,
    isValidFilename: modal.isValidFilename,
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
