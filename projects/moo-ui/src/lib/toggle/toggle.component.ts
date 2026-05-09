import { Component, computed, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { createMooUniqueId, joinAriaDescribedBy, MooFieldSize } from '../shared/form-field.utils';

@Component({
  selector: 'moo-toggle',
  standalone: true,
  templateUrl: './toggle.component.html',
  styleUrl: './toggle.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToggleComponent),
      multi: true,
    },
  ],
})
export class ToggleComponent implements ControlValueAccessor {
  readonly label = input<string>('');
  readonly hint = input<string>('');
  readonly error = input<string>('');
  readonly disabled = input<boolean>(false);
  readonly readonly = input<boolean>(false);
  readonly inputId = input<string>('');
  readonly size = input<MooFieldSize>('md');

  protected readonly checked = signal<boolean>(false);
  protected readonly isDisabled = signal<boolean>(false);

  private readonly fallbackId = createMooUniqueId('moo-toggle');
  private readonly hintIdValue = `${this.fallbackId}-hint`;
  private readonly errorIdValue = `${this.fallbackId}-error`;

  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  protected readonly resolvedInputId = computed(() => this.inputId() || this.fallbackId);
  protected readonly describedBy = computed(() => joinAriaDescribedBy(
    this.error() ? this.errorIdValue : null,
    !this.error() && this.hint() ? this.hintIdValue : null
  ));
  protected readonly wrapperClass = computed(() => {
    const classes = ['moo-toggle', `moo-toggle--${this.size()}`];

    if (this.error()) {
      classes.push('has-error');
    }

    if (this.readonly()) {
      classes.push('is-readonly');
    }

    return classes.join(' ');
  });

  writeValue(value: boolean): void {
    this.checked.set(!!value);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  protected onCheckedChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;

    if (this.readonly()) {
      inputElement.checked = this.checked();
      return;
    }

    this.checked.set(inputElement.checked);
    this.onChange(inputElement.checked);
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
