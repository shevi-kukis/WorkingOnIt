import { Component, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, type FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import { Router } from "@angular/router"
import { MatCardModule } from "@angular/material/card"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatSnackBar } from "@angular/material/snack-bar"
import { AuthService } from "../../../core/services/auth.service"

@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
  private fb = inject(FormBuilder)
  private authService = inject(AuthService)
  private router = inject(Router)
  private snackBar = inject(MatSnackBar)

  loginForm: FormGroup
  hidePassword = true
  isLoading = false
  errorMessage = ""

  constructor() {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    })

    // Clear error message when user starts typing
    this.loginForm.valueChanges.subscribe(() => {
      this.errorMessage = ""
    })
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true
      this.errorMessage = ""

      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          // Check if user is admin
          if (response.user.roleId === 1) {
            this.snackBar.open("Welcome Admin! Login successful.", "Close", {
              duration: 3000,
              panelClass: ["success-snackbar"],
            })
            this.router.navigate(["/dashboard"])
          } else {
            this.errorMessage = "Access denied. Administrator privileges required."
            this.authService.logout()
          }
        },
        error: (error) => {
          console.error("Login error:", error)

          if (error.message && error.message.includes("Admin privileges required")) {
            this.errorMessage = "Access denied. Only administrators can access this system."
          } else if (error.status === 401 || error.status === 400) {
            this.errorMessage = "Invalid email or password. Please try again."
          } else {
            this.errorMessage = "Login failed. Please check your credentials and try again."
          }

          this.snackBar.open(this.errorMessage, "Close", {
            duration: 5000,
            panelClass: ["error-snackbar"],
          })
        },
        complete: () => {
          this.isLoading = false
        },
      })
    }
  }
}
