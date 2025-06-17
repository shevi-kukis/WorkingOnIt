import { Component, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterOutlet, Router } from "@angular/router"
import { MatToolbarModule } from "@angular/material/toolbar"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatSidenavModule } from "@angular/material/sidenav"
import { MatListModule } from "@angular/material/list"
import { AuthService } from "../core/services/auth.service"
import { ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
  ],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  authService = inject(AuthService);
  router = inject(Router);

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleSidenav() {
    this.sidenav.toggle();
  }

  closeSidenav() {
    if (this.sidenav) {
      this.sidenav.close();
    }
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  isAdmin(): boolean {
    const user = this.authService.getCurrentUser();
    return user && user.roleId === 1;
  }

  getCurrentUserName(): string {
    const user = this.authService.getCurrentUser();
    return user ? user.fullName : '';
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
    // סגור את הסיידבר במכשירים ניידים
    if (window.innerWidth < 768) {
      this.closeSidenav();
    }
  }
}