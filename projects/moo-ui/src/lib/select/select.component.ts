import { Component, computed, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { createMooUniqueId, joinAriaDescribedBy, MooFieldSize } from '../shared/form-field.utils';

export interface MooSelectOption {
  readonly label: string;
  readonly value: string;
  readonly disabled?: boolean;
}

@Component({
  selector: 'moo-select',
  standalone: true,
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent implements ControlValueAccessor {
  readonly label = input<string>('');
  readonly placeholder = input<string>('Select an option');
  readonly disabled = input<boolean>(false);
  readonly readonly = input<boolean>(false);
  readonly required = input<boolean>(false);
  readonly error = input<string>('');
  readonly hint = input<string>('');
  readonly inputId = input<string>('');
  readonly size = input<MooFieldSize>('md');
  readonly options = input<ReadonlyArray<MooSelectOption>>([]);

  protected readonly value = signal<string>('');
  protected readonly isDisabled = signal<boolean>(false);

  private readonly fallbackId = createMooUniqueId('moo-select');
  private readonly hintIdValue = `${this.fallbackId}-hint`;
  private readonly errorIdValue = `${this.fallbackId}-error`;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  protected readonly resolvedInputId = computed(() => this.inputId() || this.fallbackId);
  protected readonly describedBy = computed(() => joinAriaDescribedBy(
    this.error() ? this.errorIdValue : null,
    !this.error() && this.hint() ? this.hintIdValue : null
  ));
  protected readonly selectClass = computed(() => {
    const classes = ['moo-select', `moo-select--${this.size()}`];

    if (this.error()) {
      classes.push('has-error');
    }

    if (this.readonly()) {
      classes.push('is-readonly');
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
    const element = event.target as HTMLSelectElement;

    if (this.readonly()) {
      element.value = this.value();
      return;
    }

    this.value.set(element.value);
    this.onChange(element.value);
  }

  protected preventReadonlyInteraction(event: Event): void {
    if (!this.readonly()) {
      return;
    }

    event.preventDefault();
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
