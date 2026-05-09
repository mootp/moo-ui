import { Injectable, signal } from '@angular/core';
import { createMooUniqueId } from '../shared/form-field.utils';
import { MooToast, MooToastInput } from './toast.model';

@Injectable({ providedIn: 'root' })
export class MooToastService {
  private readonly _toasts = signal<ReadonlyArray<MooToast>>([]);
  private readonly timers = new Map<string, number>();

  readonly toasts = this._toasts.asReadonly();

  show(config: MooToastInput): string {
    const toast: MooToast = {
      id: config.id ?? createMooUniqueId('moo-toast'),
      title: config.title,
      message: config.message,
      variant: config.variant ?? 'info',
      duration: config.duration ?? 4000,
    };

    this._toasts.update(toasts => [...toasts, toast]);

    if (toast.duration > 0) {
      const timerId = window.setTimeout(() => this.dismiss(toast.id), toast.duration);
      this.timers.set(toast.id, timerId);
    }

    return toast.id;
  }

  dismiss(id: string): void {
    const timerId = this.timers.get(id);

    if (timerId !== undefined) {
      window.clearTimeout(timerId);
      this.timers.delete(id);
    }

    this._toasts.update(toasts => toasts.filter(toast => toast.id !== id));
  }

  clear(): void {
    this.timers.forEach(timerId => window.clearTimeout(timerId));
    this.timers.clear();
    this._toasts.set([]);
  }
}
