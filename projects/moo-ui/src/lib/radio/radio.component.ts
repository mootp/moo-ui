import { Component, computed, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { createMooUniqueId, joinAriaDescribedBy, MooFieldSize } from '../shared/form-field.utils';

export interface MooRadioOption {
  readonly label: string;
  readonly value: string;
  readonly hint?: string;
  readonly disabled?: boolean;
}

@Component({
  selector: 'moo-radio',
  standalone: true,
  templateUrl: './radio.component.html',
  styleUrl: './radio.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioComponent),
      multi: true,
    },
  ],
})
export class RadioComponent implements ControlValueAccessor {
  readonly label = input<string>('');
  readonly hint = input<string>('');
  readonly error = input<string>('');
  readonly disabled = input<boolean>(false);
  readonly readonly = input<boolean>(false);
  readonly required = input<boolean>(false);
  readonly name = input<string>('');
  readonly inputId = input<string>('');
  readonly size = input<MooFieldSize>('md');
  readonly inline = input<boolean>(false);
  readonly options = input<ReadonlyArray<MooRadioOption>>([]);

  protected readonly value = signal<string>('');
  protected readonly isDisabled = signal<boolean>(false);

  private readonly fallbackId = createMooUniqueId('moo-radio');
  private readonly groupName = createMooUniqueId('moo-radio-group');
  private readonly hintIdValue = `${this.fallbackId}-hint`;
  private readonly errorIdValue = `${this.fallbackId}-error`;
  private readonly labelIdValue = `${this.fallbackId}-label`;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  protected readonly resolvedName = computed(() => this.name() || this.groupName);
  protected readonly wrapperClass = computed(() => {
    const classes = ['moo-radio-group', `moo-radio-group--${this.size()}`];

    if (this.inline()) {
      classes.push('is-inline');
    }

    if (this.error()) {
      classes.push('has-error');
    }

    return classes.join(' ');
  });
  protected readonly describedBy = computed(() => joinAriaDescribedBy(
    this.error() ? this.errorIdValue : null,
    !this.error() && this.hint() ? this.hintIdValue : null
  ));

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

  protected onSelectionChange(nextValue: string): void {
    if (this.readonly()) {
      return;
    }

    this.value.set(nextValue);
    this.onChange(nextValue);
  }

  protected isOptionDisabled(option: MooRadioOption): boolean {
    return !!option.disabled || this.disabled() || this.isDisabled();
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

  protected get labelId(): string {
    return this.labelIdValue;
  }
}
