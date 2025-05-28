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

  constructor() {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    })
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.snackBar.open("Login successful!", "Close", { duration: 3000 })
          this.router.navigate(["/dashboard"])
        },
        error: (error) => {
          this.snackBar.open("Login failed. Please check your credentials.", "Close", { duration: 5000 })
          this.isLoading = false
        },
        complete: () => {
          this.isLoading = false
        },
      })
    }
  }
}
