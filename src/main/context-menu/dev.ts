import type { ContextMenuContext, ContextMenuTemplate } from '.';

export function addDevContextMenuOptions(
  { window, x, y }: ContextMenuContext,
  template: ContextMenuTemplate
): void {
  if (
    process.env.NODE_ENV !== 'development' &&
    process.env.DEBUG_PROD !== 'true'
  ) {
    return;
  }

  if (template.length) {
    template.push({ type: 'separator' });
  }

  template.push({
    label: '※ Inspect element',
    click: () => {
      window.webContents.inspectElement(x, y);
    },
  });
}
