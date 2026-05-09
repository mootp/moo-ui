import { Component, computed, input } from '@angular/core';

export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

@Component({
  selector: 'moo-card',
  standalone: true,
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  readonly padding = input<CardPadding>('md');
  readonly shadow = input<boolean>(true);
  readonly bordered = input<boolean>(true);

  protected readonly cardClass = computed(() => {
    const classes = ['moo-card', `moo-card--padding-${this.padding()}`];
    if (this.shadow()) classes.push('has-shadow');
    if (this.bordered()) classes.push('has-border');
    return classes.join(' ');
  });
}
