import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AlertComponent,
  AvatarComponent,
  BadgeComponent,
  ButtonComponent,
  CardComponent,
  InputComponent,
  ModalComponent,
  SpinnerComponent,
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
  ],
})
export class AppComponent {
  readonly emailValue = signal('');
  readonly loading = signal(false);
  readonly modalOpen = signal(false);

  toggleLoading(): void {
    this.loading.set(true);
    setTimeout(() => this.loading.set(false), 2000);
  }
}
