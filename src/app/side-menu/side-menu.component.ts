
import { Component, ViewChild } from '@angular/core';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { UserSettingsDialogComponent } from '../user-settings-dialog/user-settings-dialog.component';
import { MatToolbarModule } from "@angular/material/toolbar";
import { RouterOutlet } from "@angular/router";
import { UserSettingsComponent } from "../user-settings/user-settings.component";

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [MatSidenavModule, MatButtonModule, MatIconModule, MatToolbarModule, RouterOutlet, UserSettingsComponent],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.scss',
})
export class SideMenuComponent {
  @ViewChild('drawer') sidenav!: MatSidenav;

  constructor(private dialog: MatDialog) {}

  toggleSidenav() {
    // Scroll-Position merken
    const scrollY = window.scrollY;
    this.sidenav.toggle().then(() => {
      // Nach dem Öffnen/Schließen Scroll-Position wiederherstellen
      window.scrollTo({ top: scrollY });
    });
  }

  openSettingsDialog() {
    this.dialog.open(UserSettingsDialogComponent, {
      minWidth: '70vw',
      width: '70vw',
      maxWidth: '95vw',
      minHeight: '400px',
    });
  }
}
