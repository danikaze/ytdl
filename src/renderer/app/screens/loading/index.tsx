import { Overlay, Spinner } from 'evergreen-ui';

export function LoadingScreen(): JSX.Element {
  return (
    <>
      <Overlay
        isShown
        shouldCloseOnClick={false}
        shouldCloseOnEscapePress={false}
        containerProps={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Spinner />
      </Overlay>
    </>
  );
}
