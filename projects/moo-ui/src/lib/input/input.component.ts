import { Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';

@Component({
  selector: 'moo-input',
  standalone: true,
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  readonly label = input<string>('');
  readonly placeholder = input<string>('');
  readonly type = input<InputType>('text');
  readonly disabled = input<boolean>(false);
  readonly readonly = input<boolean>(false);
  readonly required = input<boolean>(false);
  readonly error = input<string>('');
  readonly hint = input<string>('');
  readonly inputId = input<string>('');

  protected readonly value = signal<string>('');
  protected readonly isFocused = signal<boolean>(false);
  protected readonly isDisabled = signal<boolean>(false);

  private onChange: (v: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(val: string): void {
    this.value.set(val ?? '');
  }

  registerOnChange(fn: (v: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  protected onInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value.set(val);
    this.onChange(val);
  }

  protected onFocus(): void { this.isFocused.set(true); }

  protected onBlur(): void {
    this.isFocused.set(false);
    this.onTouched();
  }
}
