import { FC, useRef } from 'react';

export interface Props {
  onInput: (url: string) => void;
}

export const YoutubeInput: FC<Props> = ({ onInput }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const clickHandler = () => {
    const value = inputRef.current?.value;
    if (!value) return;
    onInput(value);
  };

  return (
    <div>
      <input
        placeholder="Youtube URL"
        defaultValue="https://www.youtube.com/watch?v=zyhbEFhLSiw"
        ref={inputRef}
      />
      <button type="button" onClick={clickHandler}>
        Download
      </button>
    </div>
  );
};
