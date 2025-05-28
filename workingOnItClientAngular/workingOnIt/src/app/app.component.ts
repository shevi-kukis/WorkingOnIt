import { Component, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterOutlet, Router } from "@angular/router"
import { MatToolbarModule } from "@angular/material/toolbar"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatSidenavModule } from "@angular/material/sidenav"
import { MatListModule } from "@angular/material/list"
import { AuthService } from "../core/services/auth.service"
import { environment } from "../environments/environment"

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
  title(title: any) {
    throw new Error('Method not implemented.')
  }
  authService = inject(AuthService)
  router = inject(Router)

  logout() {
    this.authService.logout()
    this.router.navigate(["/login"])
  }
  // Move the console.log statement to the constructor
   
}
