import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FetchApiDataService } from './fetch-api-data.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';

// import { UserSettingsComponent } from './user-settings/user-settings.component';
// import { SideMenuComponent } from './side-menu/side-menu.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserSettingsDialogComponent } from './user-settings-dialog/user-settings-dialog.component';
import { BottomTabBarComponent } from './bottom-tab-bar/bottom-tab-bar.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatSlideToggleModule, MatToolbarModule, MatIconModule, MatDialogModule, BottomTabBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})


export class AppComponent {
  isSubscribedToEmailsMessage = 'gurke';
  title = 'striveBoard';
  isTab0Active = false;

  constructor(private fetchAPIData: FetchApiDataService, private dialog: MatDialog) {
    console.log('about to start ');
    this.fetchAPIData.callToAPI();
  }

  onTabChange(index: number) {
    this.isTab0Active = index === 0;
  }

  openSettingsDialog() {
    this.dialog.open(UserSettingsDialogComponent, {
      minWidth: '70vw',
      width: '70vw',
      maxWidth: '95vw',
    });
  }
}
