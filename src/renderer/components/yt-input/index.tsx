import { FC, useMemo, useRef } from 'react';
import { Button, Pane, TextInputField } from 'evergreen-ui';

export interface Props {
  onInput: (url: string) => void;
}

export const YoutubeInput: FC<Props> = ({ onInput }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const clickHandler = useMemo(
    () => () => {
      const value = inputRef.current?.value;
      if (!value) return;
      onInput(value);
    },
    [onInput]
  );

  return (
    <Pane display="flex" alignItems="flex-end">
      <TextInputField
        label="Youtube URL"
        defaultValue="https://www.youtube.com/watch?v=B74xQqhu-pI"
        marginBottom={0}
        flexGrow={1}
        marginRight={8}
        ref={inputRef}
      />

      <Button type="button" appearance="primary" onClick={clickHandler}>
        Download
      </Button>
    </Pane>
  );
};
