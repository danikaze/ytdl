import React, { DependencyList, MouseEventHandler, useCallback } from 'react';
import { ContextMenuData } from '@main/context-menu';

export function getContextMenuOpener(
  data: ContextMenuData = {}
): (ev: MouseEvent) => void {
  return (ev) => processEvent(ev, data);
}

export function useContextMenu<E extends Element = HTMLDivElement>(
  data: ContextMenuData,
  dependencies: DependencyList
): MouseEventHandler<E> {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback((ev) => processEvent(ev, data), dependencies);
}

function processEvent(
  ev: MouseEvent | React.MouseEvent<Element>,
  data: ContextMenuData
): void {
  window.ytdl.openContextMenu({
    ...data,
    x: ev.clientX,
    y: ev.clientY,
  });
  ev.stopPropagation();
}
