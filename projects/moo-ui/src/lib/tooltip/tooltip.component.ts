import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  Renderer2,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { createMooUniqueId } from '../shared/form-field.utils';
import { computeConnectedOverlayPosition, isTargetWithin, MooOverlayPlacement } from '../shared/overlay.utils';

@Component({
  selector: 'moo-tooltip',
  standalone: true,
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.scss',
})
export class TooltipComponent implements OnDestroy {
  private readonly triggerRef = viewChild<ElementRef<HTMLSpanElement>>('trigger');
  private readonly panelRef = viewChild<ElementRef<HTMLDivElement>>('panel');

  readonly text = input<string>('');
  readonly disabled = input<boolean>(false);
  readonly placement = input<MooOverlayPlacement>('top-start');
  readonly showDelay = input<number>(120);
  readonly hideDelay = input<number>(0);

  protected readonly isVisible = signal<boolean>(false);
  protected readonly overlayTop = signal<number>(0);
  protected readonly overlayLeft = signal<number>(0);

  private readonly tooltipIdValue = createMooUniqueId('moo-tooltip');
  private showTimeoutId: number | null = null;
  private hideTimeoutId: number | null = null;

  constructor(private readonly renderer: Renderer2) {}

  protected show(): void {
    if (this.disabled() || !this.text()) {
      return;
    }

    this.clearHideTimeout();
    this.clearShowTimeout();

    this.showTimeoutId = window.setTimeout(() => {
      this.isVisible.set(true);

      queueMicrotask(() => {
        this.updatePosition();
        this.syncAriaDescription(true);
      });
    }, this.showDelay());
  }

  protected hide(): void {
    this.clearShowTimeout();
    this.clearHideTimeout();

    this.hideTimeoutId = window.setTimeout(() => {
      this.isVisible.set(false);
      this.syncAriaDescription(false);
    }, this.hideDelay());
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.hide();
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (!this.isVisible()) {
      return;
    }

    if (isTargetWithin(event.target, this.triggerRef()?.nativeElement, this.panelRef()?.nativeElement)) {
      return;
    }

    this.hide();
  }

  @HostListener('window:resize')
  @HostListener('window:scroll')
  protected updatePosition(): void {
    if (!this.isVisible()) {
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
      this.placement(),
      10
    );

    this.overlayTop.set(position.top);
    this.overlayLeft.set(position.left);
  }

  ngOnDestroy(): void {
    this.clearShowTimeout();
    this.clearHideTimeout();
    this.syncAriaDescription(false);
  }

  private syncAriaDescription(isActive: boolean): void {
    const triggerElement = this.triggerRef()?.nativeElement;

    if (!triggerElement) {
      return;
    }

    const describedElement =
      triggerElement.querySelector<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') ??
      triggerElement;

    if (isActive) {
      this.renderer.setAttribute(describedElement, 'aria-describedby', this.tooltipIdValue);
      return;
    }

    this.renderer.removeAttribute(describedElement, 'aria-describedby');
  }

  private clearShowTimeout(): void {
    if (this.showTimeoutId !== null) {
      window.clearTimeout(this.showTimeoutId);
      this.showTimeoutId = null;
    }
  }

  private clearHideTimeout(): void {
    if (this.hideTimeoutId !== null) {
      window.clearTimeout(this.hideTimeoutId);
      this.hideTimeoutId = null;
    }
  }

  protected get tooltipId(): string {
    return this.tooltipIdValue;
  }
}
