import { Component, computed, input } from '@angular/core';

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type SpinnerVariant = 'primary' | 'secondary' | 'white' | 'current';

@Component({
  selector: 'moo-spinner',
  standalone: true,
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss',
})
export class SpinnerComponent {
  readonly size = input<SpinnerSize>('md');
  readonly variant = input<SpinnerVariant>('primary');
  readonly label = input<string>('Loading…');

  protected readonly spinnerClass = computed(
    () => `moo-spinner moo-spinner--${this.size()} moo-spinner--${this.variant()}`
  );
}
