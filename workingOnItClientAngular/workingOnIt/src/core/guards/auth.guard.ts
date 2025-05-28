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
    if (this.authService.isAuthenticated()) {
      return true
    } else {
      this.router.navigate(["/login"])
      return false
    }
  }
}
