import { Heading, Pane } from 'evergreen-ui';
import { ReactNode } from 'react';

export interface Props {
  title: string;
  children: ReactNode;
}

export function SettingsSection({ title, children }: Props): JSX.Element {
  return (
    <Pane marginBottom={32}>
      <Heading size={700} marginBottom={16}>
        {title}
      </Heading>
      {children}
    </Pane>
  );
}
