import { Checkbox, Dialog, Pane, Text } from 'evergreen-ui';
import { useConfirmationDownloadRemovalDialog } from './hooks';

export function ConfirmationDownloadRemovalDialog(): JSX.Element {
  const { isShown, removeData, onConfirm, onClose, onCheckboxUpdate } =
    useConfirmationDownloadRemovalDialog();

  return (
    <Dialog
      isShown={isShown}
      title="Remove download"
      onCloseComplete={onClose}
      onConfirm={onConfirm}
    >
      <Pane>
        <Text>Do you want to remove the download from the library?</Text>
      </Pane>
      <Pane>
        <Checkbox
          label="Remove data from disk too"
          checked={removeData}
          onChange={onCheckboxUpdate}
        />
      </Pane>
    </Dialog>
  );
}
