import { Component, computed, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { createMooUniqueId, joinAriaDescribedBy, MooFieldSize } from '../shared/form-field.utils';

export type MooTextareaResize = 'none' | 'vertical' | 'both';

@Component({
  selector: 'moo-textarea',
  standalone: true,
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true,
    },
  ],
})
export class TextareaComponent implements ControlValueAccessor {
  readonly label = input<string>('');
  readonly placeholder = input<string>('');
  readonly disabled = input<boolean>(false);
  readonly readonly = input<boolean>(false);
  readonly required = input<boolean>(false);
  readonly error = input<string>('');
  readonly hint = input<string>('');
  readonly inputId = input<string>('');
  readonly size = input<MooFieldSize>('md');
  readonly rows = input<number>(4);
  readonly resize = input<MooTextareaResize>('vertical');

  protected readonly value = signal<string>('');
  protected readonly isDisabled = signal<boolean>(false);

  private readonly fallbackId = createMooUniqueId('moo-textarea');
  private readonly hintIdValue = `${this.fallbackId}-hint`;
  private readonly errorIdValue = `${this.fallbackId}-error`;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  protected readonly resolvedInputId = computed(() => this.inputId() || this.fallbackId);
  protected readonly describedBy = computed(() => joinAriaDescribedBy(
    this.error() ? this.errorIdValue : null,
    !this.error() && this.hint() ? this.hintIdValue : null
  ));
  protected readonly textareaClass = computed(() => {
    const classes = ['moo-textarea', `moo-textarea--${this.size()}`, `moo-textarea--resize-${this.resize()}`];

    if (this.error()) {
      classes.push('has-error');
    }

    return classes.join(' ');
  });

  writeValue(value: string): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  protected onValueChange(event: Event): void {
    const nextValue = (event.target as HTMLTextAreaElement).value;
    this.value.set(nextValue);
    this.onChange(nextValue);
  }

  protected markTouched(): void {
    this.onTouched();
  }

  protected get hintId(): string {
    return this.hintIdValue;
  }

  protected get errorId(): string {
    return this.errorIdValue;
  }
}
