export type MooOverlayPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';

export interface MooOverlayPosition {
  readonly top: number;
  readonly left: number;
  readonly minWidth: number;
  readonly placement: MooOverlayPlacement;
}

const VIEWPORT_PADDING = 8;

export function computeConnectedOverlayPosition(
  triggerRect: DOMRect,
  panelRect: Pick<DOMRect, 'width' | 'height'>,
  preferredPlacement: MooOverlayPlacement,
  offset = 8
): MooOverlayPosition {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const spaceAbove = triggerRect.top - VIEWPORT_PADDING;
  const spaceBelow = viewportHeight - triggerRect.bottom - VIEWPORT_PADDING;

  let placement = preferredPlacement;

  if (preferredPlacement.startsWith('bottom') && panelRect.height > spaceBelow && spaceAbove > spaceBelow) {
    placement = preferredPlacement.replace('bottom', 'top') as MooOverlayPlacement;
  } else if (preferredPlacement.startsWith('top') && panelRect.height > spaceAbove && spaceBelow > spaceAbove) {
    placement = preferredPlacement.replace('top', 'bottom') as MooOverlayPlacement;
  }

  let top = placement.startsWith('bottom')
    ? triggerRect.bottom + offset
    : triggerRect.top - panelRect.height - offset;

  let left = placement.endsWith('end')
    ? triggerRect.right - panelRect.width
    : triggerRect.left;

  top = clamp(top, VIEWPORT_PADDING, viewportHeight - panelRect.height - VIEWPORT_PADDING);
  left = clamp(left, VIEWPORT_PADDING, viewportWidth - panelRect.width - VIEWPORT_PADDING);

  return {
    top: Math.round(top),
    left: Math.round(left),
    minWidth: Math.round(triggerRect.width),
    placement,
  };
}

export function isTargetWithin(target: EventTarget | null, ...elements: Array<HTMLElement | null | undefined>): boolean {
  if (!(target instanceof Node)) {
    return false;
  }

  return elements.some(element => !!element && element.contains(target));
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), Math.max(min, max));
}
