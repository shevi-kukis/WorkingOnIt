import { Injectable, inject } from "@angular/core"
import { type CanActivate, Router } from "@angular/router"
import { AuthService } from "../services/auth.service"

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  private authService = inject(AuthService)
  private router = inject(Router)

  canActivate(): boolean {
    const user = this.authService.getCurrentUser()

    // Check if user is authenticated AND is admin (roleId = 1)
    if (this.authService.isAuthenticated() && user && user.roleId === 1) {
      return true
    } else {
      // If not admin or not authenticated, redirect to login
      this.authService.logout() // Clear any invalid tokens
      this.router.navigate(["/login"])
      return false
    }
  }
}
