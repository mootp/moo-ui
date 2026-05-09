import { Component, computed, input, output, signal } from '@angular/core';

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger';

const ICON_PATHS: Record<AlertVariant, string> = {
  info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
  danger: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
};

@Component({
  selector: 'moo-alert',
  standalone: true,
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
})
export class AlertComponent {
  readonly variant = input<AlertVariant>('info');
  readonly title = input<string>('');
  readonly dismissible = input<boolean>(false);

  readonly dismissed = output<void>();

  protected readonly visible = signal<boolean>(true);
  protected readonly alertClass = computed(() => `moo-alert moo-alert--${this.variant()}`);
  protected readonly iconPath = computed(() => ICON_PATHS[this.variant()]);

  protected dismiss(): void {
    this.visible.set(false);
    this.dismissed.emit();
  }
}
