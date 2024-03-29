import { forwardRef } from 'react';
import type { OpenDialogOptions } from 'electron';
import { clsx } from 'clsx';
import { Button, TextInput } from 'evergreen-ui';
import { usePathPicker } from './hooks';

import styles from './path-picker.module.scss';

export interface Props {
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  dialogOptions: OpenDialogOptions;
  defaultValue?: string;
  onChange?: (path: readonly string[] | false) => void;
  fullWidth?: boolean;
  className?: string;
}

export const PathPicker = forwardRef<HTMLInputElement, Props>(
  function PathPicker(props, ref) {
    const { showPickDialog, currentPath } = usePathPicker(props);
    const { className, placeholder, disabled } = props;
    const classes = clsx(
      styles.root,
      props.fullWidth && styles.fullWidth,
      className
    );

    return (
      <div className={classes}>
        <TextInput
          readOnly
          placeholder={placeholder}
          flexGrow={1}
          borderTopRightRadius={0}
          borderBottomRightRadius={0}
          value={currentPath}
          ref={ref}
          width="inherit"
        />
        <Button
          disabled={disabled}
          borderTopLeftRadius={0}
          borderBottomLeftRadius={0}
          onClick={showPickDialog}
          fontWeight={400}
        >
          {getLabel(props)}
        </Button>
      </div>
    );
  }
);

function getLabel({ label, dialogOptions }: Props): string {
  if (label) return label;

  const props = dialogOptions?.properties;
  let text = 'Select Path';

  if (props) {
    if (props.includes('openDirectory') || props.includes('createDirectory')) {
      text = 'Select Directory';
    }
    if (props.includes('openFile')) {
      text = 'Select File';
    }
    if (props.includes('multiSelections')) {
      text += 's';
    }
  }

  return text;
}
