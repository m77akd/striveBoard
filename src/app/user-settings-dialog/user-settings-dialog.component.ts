import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { UserSettingsComponent } from '../user-settings/user-settings.component';

@Component({
  selector: 'app-user-settings-dialog',
  standalone: true,
  imports: [MatDialogModule, UserSettingsComponent],
  template: `<app-user-settings></app-user-settings>`,
  styleUrl: './user-settings-dialog.component.scss',
})
export class UserSettingsDialogComponent {}
