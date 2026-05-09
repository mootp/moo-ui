import { Component, computed, input } from '@angular/core';

export type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
export type BadgeSize = 'sm' | 'md';

@Component({
  selector: 'moo-badge',
  standalone: true,
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss',
})
export class BadgeComponent {
  readonly variant = input<BadgeVariant>('default');
  readonly size = input<BadgeSize>('md');
  readonly pill = input<boolean>(false);

  protected readonly badgeClass = computed(() => {
    const classes = ['moo-badge', `moo-badge--${this.variant()}`, `moo-badge--${this.size()}`];
    if (this.pill()) classes.push('moo-badge--pill');
    return classes.join(' ');
  });
}
