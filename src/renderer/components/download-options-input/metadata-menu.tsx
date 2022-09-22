import { Menu, Pane } from 'evergreen-ui';
import { useMemo } from 'react';

export interface MetadataMenuProps {
  onSelect: (str: string) => void;
}

export function MetadataMenu({ onSelect }: MetadataMenuProps) {
  const tags = useMemo(
    () => [
      ['Age limit', '[age_limit]'],
      ['Audio bitrate', '[abr]'],
      ['Audio codec', '[acodec]'],
      ['Categories', '[categories]'],
      ['Channel ID', '[channel_id]'],
      ['Channel URL', '[channel_url]'],
      ['Channel', '[channel]'],
      ['Description', '[description]'],
      ['Display ID', '[display_id]'],
      ['Duration', '[duration]'],
      ['Extension', '[ext]'],
      ['Format ID', '[format_id]'],
      ['Format name', '[format]'],
      ['Framerate', '[fps]'],
      ['Full title', '[fulltitle]'],
      ['Height', '[height]'],
      ['Tags', '[tags]'],
      ['Thumbnail', '[thumbnail]'],
      ['Upload date', '[upload_date]'],
      ['Uploader ID', '[uploader_id]'],
      ['Uploader URL', '[uploader_url]'],
      ['Uploader', '[uploader]'],
      ['Video bitrate', '[vbr]'],
      ['Video codec', '[vcodec]'],
      ['Video ID', '[id]'],
      ['Video Title', '[title]'],
      ['View count', '[view_count]'],
      ['Webpage', '[webpage_url]'],
      ['Width', '[width]'],
    ],
    []
  );

  const items = useMemo(
    () =>
      tags.map(([title, str]) => (
        <Menu.Item key={str} title={str} onClick={() => onSelect(str)}>
          {title}
        </Menu.Item>
      )),
    [tags, onSelect]
  );

  return (
    <Menu>
      <Menu.Group title="Insert metadata">
        <Pane maxHeight={200} overflowY="auto">
          {items}
        </Pane>
      </Menu.Group>
    </Menu>
  );
}
