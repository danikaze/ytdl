import { Heading, Pane, Text } from 'evergreen-ui';
import { ReactNode } from 'react';

export interface Props {
  title: string;
  description?: string;
  children: ReactNode;
}

export function SettingsItem({
  title,
  description,
  children,
}: Props): JSX.Element {
  return (
    <Pane marginBottom={16}>
      <Heading size={500} marginBottom={8}>
        {title}
      </Heading>
      {getDescription(description)}
      {children}
    </Pane>
  );
}

function getDescription(description: string | undefined): ReactNode {
  if (!description) return undefined;
  return (
    <Text size={300} paddingBottom={16}>
      {description}
    </Text>
  );
}
