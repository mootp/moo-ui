import { Component, input, output } from '@angular/core';
import { MooToast } from './toast.model';

@Component({
  selector: 'moo-toast',
  standalone: true,
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
})
export class ToastComponent {
  readonly toast = input.required<MooToast>();

  readonly dismissed = output<string>();

  protected dismiss(): void {
    this.dismissed.emit(this.toast().id);
  }
}
