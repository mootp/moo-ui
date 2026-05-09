import { Component, ElementRef, computed, effect, input, output, viewChild } from '@angular/core';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

@Component({
  selector: 'moo-modal',
  standalone: true,
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent {
  private readonly backdrop = viewChild<ElementRef<HTMLDivElement>>('backdrop');
  private readonly dialog = viewChild<ElementRef<HTMLDivElement>>('dialog');

  readonly open = input<boolean>(false);
  readonly title = input<string>('');
  readonly size = input<ModalSize>('md');
  readonly closeOnBackdrop = input<boolean>(true);
  readonly closeOnEsc = input<boolean>(true);

  readonly closed = output<void>();

  protected readonly dialogClass = computed(
    () => `moo-modal__dialog moo-modal__dialog--${this.size()}`
  );

  constructor() {
    effect(() => {
      if (this.open()) {
        queueMicrotask(() => {
          const [firstFocusable] = this.getFocusableElements();
          (firstFocusable ?? this.backdrop()?.nativeElement)?.focus();
        });
      }
    });
  }

  protected onBackdropClick(): void {
    if (this.closeOnBackdrop()) this.closed.emit();
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.closeOnEsc()) {
      this.closed.emit();
      return;
    }

    if (event.key !== 'Tab') {
      return;
    }

    const focusableElements = this.getFocusableElements();
    if (!focusableElements.length) {
      event.preventDefault();
      this.backdrop()?.nativeElement.focus();
      return;
    }

    const activeElement = document.activeElement as HTMLElement | null;
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      if (!activeElement || activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable.focus();
      }
      return;
    }

    if (!activeElement || activeElement === lastFocusable || activeElement === this.backdrop()?.nativeElement) {
      event.preventDefault();
      firstFocusable.focus();
    }
  }

  protected stopPropagation(event: Event): void {
    event.stopPropagation();
  }

  private getFocusableElements(): HTMLElement[] {
    return Array.from(
      this.dialog()?.nativeElement.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      ) ?? []
    ).filter(element => !element.hasAttribute('aria-hidden'));
  }
}
