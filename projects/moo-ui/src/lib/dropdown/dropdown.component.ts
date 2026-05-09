import {
  Component,
  ElementRef,
  HostListener,
  computed,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { createMooUniqueId, joinAriaDescribedBy, MooFieldSize } from '../shared/form-field.utils';
import { computeConnectedOverlayPosition, isTargetWithin, MooOverlayPlacement } from '../shared/overlay.utils';

export interface MooDropdownItem {
  readonly id?: string;
  readonly label: string;
  readonly description?: string;
  readonly disabled?: boolean;
  readonly danger?: boolean;
}

@Component({
  selector: 'moo-dropdown',
  standalone: true,
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
})
export class DropdownComponent {
  private readonly triggerRef = viewChild<ElementRef<HTMLButtonElement>>('trigger');
  private readonly panelRef = viewChild<ElementRef<HTMLDivElement>>('panel');

  readonly label = input<string>('');
  readonly hint = input<string>('');
  readonly buttonLabel = input<string>('Open menu');
  readonly disabled = input<boolean>(false);
  readonly size = input<MooFieldSize>('md');
  readonly placement = input<MooOverlayPlacement>('bottom-start');
  readonly items = input<ReadonlyArray<MooDropdownItem>>([]);
  readonly closeOnSelect = input<boolean>(true);

  readonly itemSelected = output<MooDropdownItem>();

  protected readonly isOpen = signal<boolean>(false);
  protected readonly activeIndex = signal<number>(-1);
  protected readonly overlayTop = signal<number>(0);
  protected readonly overlayLeft = signal<number>(0);
  protected readonly overlayMinWidth = signal<number>(0);

  private readonly fallbackId = createMooUniqueId('moo-dropdown');
  private readonly menuIdValue = `${this.fallbackId}-menu`;
  private readonly triggerIdValue = `${this.fallbackId}-trigger`;
  private readonly hintIdValue = `${this.fallbackId}-hint`;

  protected readonly triggerClass = computed(() => {
    const classes = ['moo-dropdown__trigger', `moo-dropdown__trigger--${this.size()}`];

    if (this.isOpen()) {
      classes.push('is-open');
    }

    return classes.join(' ');
  });
  protected readonly describedBy = computed(() => joinAriaDescribedBy(this.hint() ? this.hintIdValue : null));

  protected toggleMenu(): void {
    if (this.isOpen()) {
      this.closeMenu();
      return;
    }

    this.openMenu('first');
  }

  protected onTriggerKeydown(event: KeyboardEvent): void {
    if (this.disabled()) {
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.openMenu('first');
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.openMenu('last');
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleMenu();
    }
  }

  protected onMenuKeydown(event: KeyboardEvent): void {
    if (!this.isOpen()) {
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.moveActiveIndex(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.moveActiveIndex(-1);
        break;
      case 'Home':
        event.preventDefault();
        this.setActiveIndex(this.getEnabledIndex('first'));
        break;
      case 'End':
        event.preventDefault();
        this.setActiveIndex(this.getEnabledIndex('last'));
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.selectActiveItem();
        break;
      case 'Escape':
      case 'Tab':
        this.closeMenu(event.key === 'Escape');
        break;
    }
  }

  protected onItemHover(index: number): void {
    this.activeIndex.set(index);
  }

  protected onItemSelect(item: MooDropdownItem): void {
    if (item.disabled) {
      return;
    }

    this.itemSelected.emit(item);

    if (this.closeOnSelect()) {
      this.closeMenu(true);
    }
  }

  protected getItemId(index: number): string {
    return `${this.menuIdValue}-item-${index}`;
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (!this.isOpen()) {
      return;
    }

    if (isTargetWithin(event.target, this.triggerRef()?.nativeElement, this.panelRef()?.nativeElement)) {
      return;
    }

    this.closeMenu();
  }

  @HostListener('window:resize')
  @HostListener('window:scroll')
  protected updateOverlayPosition(): void {
    if (!this.isOpen()) {
      return;
    }

    const triggerElement = this.triggerRef()?.nativeElement;
    const panelElement = this.panelRef()?.nativeElement;

    if (!triggerElement || !panelElement) {
      return;
    }

    const position = computeConnectedOverlayPosition(
      triggerElement.getBoundingClientRect(),
      panelElement.getBoundingClientRect(),
      this.placement()
    );

    this.overlayTop.set(position.top);
    this.overlayLeft.set(position.left);
    this.overlayMinWidth.set(position.minWidth);
  }

  private openMenu(target: 'first' | 'last'): void {
    if (this.disabled() || !this.items().length) {
      return;
    }

    this.isOpen.set(true);
    this.activeIndex.set(this.getEnabledIndex(target));

    queueMicrotask(() => {
      this.updateOverlayPosition();
      this.focusActiveItem();
    });
  }

  private closeMenu(restoreFocus = false): void {
    this.isOpen.set(false);
    this.activeIndex.set(-1);

    if (restoreFocus) {
      queueMicrotask(() => this.triggerRef()?.nativeElement.focus());
    }
  }

  private moveActiveIndex(step: number): void {
    const items = this.items();

    if (!items.length) {
      return;
    }

    let nextIndex = this.activeIndex();

    for (let attempts = 0; attempts < items.length; attempts += 1) {
      nextIndex = (nextIndex + step + items.length) % items.length;

      if (!items[nextIndex]?.disabled) {
        this.setActiveIndex(nextIndex);
        return;
      }
    }
  }

  private setActiveIndex(index: number): void {
    if (index < 0) {
      return;
    }

    this.activeIndex.set(index);
    queueMicrotask(() => this.focusActiveItem());
  }

  private selectActiveItem(): void {
    const activeItem = this.items()[this.activeIndex()];

    if (activeItem) {
      this.onItemSelect(activeItem);
    }
  }

  private focusActiveItem(): void {
    const panelElement = this.panelRef()?.nativeElement;

    if (!panelElement) {
      return;
    }

    const target = panelElement.querySelector<HTMLElement>(`#${this.getItemId(this.activeIndex())}`);
    target?.focus();
  }

  private getEnabledIndex(target: 'first' | 'last'): number {
    const items = this.items();
    const indexes = items.map((_, index) => index);
    const orderedIndexes = target === 'first' ? indexes : indexes.reverse();
    const index = orderedIndexes.find(candidate => !items[candidate]?.disabled);

    return index ?? -1;
  }

  protected get menuId(): string {
    return this.menuIdValue;
  }

  protected get triggerId(): string {
    return this.triggerIdValue;
  }

  protected get hintId(): string {
    return this.hintIdValue;
  }
}
