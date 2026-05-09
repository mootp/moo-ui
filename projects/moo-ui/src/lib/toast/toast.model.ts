export type MooToastVariant = 'info' | 'success' | 'warning' | 'danger';

export interface MooToastInput {
  readonly id?: string;
  readonly title?: string;
  readonly message: string;
  readonly variant?: MooToastVariant;
  readonly duration?: number;
}

export interface MooToast extends Required<Pick<MooToastInput, 'message'>> {
  readonly id: string;
  readonly title?: string;
  readonly variant: MooToastVariant;
  readonly duration: number;
}
