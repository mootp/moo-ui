import { Injectable, signal } from '@angular/core';

export interface ModalConfig {
  title?: string;
  data?: unknown;
}

@Injectable({ providedIn: 'root' })
export class MooModalService {
  private readonly _open = signal<boolean>(false);
  private readonly _config = signal<ModalConfig>({});

  readonly isOpen = this._open.asReadonly();
  readonly config = this._config.asReadonly();

  open(config: ModalConfig = {}): void {
    this._config.set(config);
    this._open.set(true);
  }

  close(): void {
    this._open.set(false);
  }
}
