import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AlertComponent,
  AvatarComponent,
  BadgeComponent,
  ButtonComponent,
  CheckboxComponent,
  CardComponent,
  DropdownComponent,
  MooDropdownItem,
  MooRadioOption,
  MooSelectOption,
  MooToastService,
  InputComponent,
  ModalComponent,
  RadioComponent,
  SelectComponent,
  SpinnerComponent,
  TextareaComponent,
  ToastViewportComponent,
  ToggleComponent,
  TooltipComponent,
} from '@mootp/moo-ui';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    FormsModule,
    ButtonComponent,
    InputComponent,
    CardComponent,
    BadgeComponent,
    AlertComponent,
    SpinnerComponent,
    AvatarComponent,
    ModalComponent,
    SelectComponent,
    TextareaComponent,
    CheckboxComponent,
    RadioComponent,
    ToggleComponent,
    DropdownComponent,
    TooltipComponent,
    ToastViewportComponent,
  ],
})
export class AppComponent {
  private readonly toastService = inject(MooToastService);

  readonly emailValue = signal('');
  readonly selectValue = signal('ops');
  readonly notesValue = signal('We need to confirm deployment ownership before Friday.');
  readonly checkboxValue = signal(true);
  readonly radioValue = signal('email');
  readonly toggleValue = signal(true);
  readonly loading = signal(false);
  readonly modalOpen = signal(false);
  readonly lastMenuAction = signal('No action selected yet.');

  readonly teamOptions: ReadonlyArray<MooSelectOption> = [
    { label: 'Operations', value: 'ops' },
    { label: 'Support', value: 'support' },
    { label: 'Revenue', value: 'revenue' },
    { label: 'Executive review', value: 'exec', disabled: true },
  ];

  readonly notificationOptions: ReadonlyArray<MooRadioOption> = [
    { label: 'Email', value: 'email', hint: 'Summaries and account notices.' },
    { label: 'Slack', value: 'slack', hint: 'Immediate team collaboration.' },
    { label: 'SMS', value: 'sms', hint: 'Critical alerts only.' },
  ];

  readonly menuItems: ReadonlyArray<MooDropdownItem> = [
    { label: 'Create draft', description: 'Start with a prefilled workspace.' },
    { label: 'Duplicate record', description: 'Clone settings into a new draft.' },
    { label: 'Archive item', description: 'Hide it from active lists.', danger: true },
  ];

  toggleLoading(): void {
    this.loading.set(true);
    setTimeout(() => this.loading.set(false), 2000);
  }

  handleMenuSelect(item: MooDropdownItem): void {
    this.lastMenuAction.set(`${item.label} selected`);
  }

  showToast(variant: 'info' | 'success' | 'warning' | 'danger'): void {
    const titles = {
      info: 'Heads up',
      success: 'Saved',
      warning: 'Needs review',
      danger: 'Action failed',
    } as const;

    this.toastService.show({
      variant,
      title: titles[variant],
      message: `Toast notifications are managed by the shared MooToastService (${variant}).`,
    });
  }
}
