import { Component, inject, input } from '@angular/core';
import { MooToastService } from './toast.service';
import { ToastComponent } from './toast.component';

export type MooToastViewportPosition = 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';

@Component({
  selector: 'moo-toast-viewport',
  standalone: true,
  templateUrl: './toast-viewport.component.html',
  styleUrl: './toast-viewport.component.scss',
  imports: [ToastComponent],
})
export class ToastViewportComponent {
  readonly position = input<MooToastViewportPosition>('top-end');

  protected readonly toastService = inject(MooToastService);
}
