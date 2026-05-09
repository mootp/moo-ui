import { Component, computed, effect, input, signal } from '@angular/core';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarShape = 'circle' | 'square';

@Component({
  selector: 'moo-avatar',
  standalone: true,
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
})
export class AvatarComponent {
  readonly src = input<string>('');
  readonly alt = input<string>('');
  readonly initials = input<string>('');
  readonly size = input<AvatarSize>('md');
  readonly shape = input<AvatarShape>('circle');

  protected readonly hasError = signal<boolean>(false);

  protected readonly avatarClass = computed(
    () => `moo-avatar moo-avatar--${this.size()} moo-avatar--${this.shape()}`
  );

  protected readonly showImage = computed(() => !!this.src() && !this.hasError());

  protected readonly displayInitials = computed(() => {
    const i = this.initials();
    if (i) return i.slice(0, 2).toUpperCase();
    const a = this.alt();
    if (!a) return '?';
    return a
      .split(' ')
      .slice(0, 2)
      .map(w => w[0])
      .join('')
      .toUpperCase();
  });

  constructor() {
    effect(() => {
      this.src();
      this.hasError.set(false);
    });
  }

  protected onImageError(): void {
    this.hasError.set(true);
  }
}
