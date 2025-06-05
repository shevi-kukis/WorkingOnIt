import { Component, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, type FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatSelectModule } from "@angular/material/select"
import { MatButtonModule } from "@angular/material/button"
import { MatSnackBar } from "@angular/material/snack-bar"
import { UserService } from "../../../core/services/user.service"
import { User } from "../../../core/models/user.model"

@Component({
  selector: "app-user-dialog",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: "./user-dialog.component.html",
  styleUrls: ["./user-dialog.component.scss"],
})
export class UserDialogComponent {
  private fb = inject(FormBuilder)
  private userService = inject(UserService)
  private snackBar = inject(MatSnackBar)
  private dialogRef = inject(MatDialogRef<UserDialogComponent>)
  private data = inject<User | null>(MAT_DIALOG_DATA)

  isEdit = !!this.data
  isLoading = false

  userForm: FormGroup = this.fb.group({
    fullName: [this.data?.fullName || "", Validators.required],
    email: [this.data?.email || "", [Validators.required, Validators.email]],
    password: ["", this.isEdit ? [] : [Validators.required, Validators.minLength(6)]],
    roleId: [this.data?.roleId || 2, Validators.required],
  })

  onSave() {
    if (this.userForm.valid) {
      this.isLoading = true

      if (this.isEdit && this.data) {
        const updateData = {
          id: this.data.id,
          fullName: this.userForm.value.fullName,
          email: this.userForm.value.email,
          roleId: this.userForm.value.roleId,
        }

        this.userService.updateUser(updateData).subscribe({
          next: () => {
            this.snackBar.open("User updated successfully", "Close", { duration: 3000 })
            this.dialogRef.close(true)
          },
          error: () => {
            this.snackBar.open("Error updating user", "Close", { duration: 3000 })
            this.isLoading = false
          },
        })
      } else {
        this.userService.createUser(this.userForm.value).subscribe({
          next: () => {
            this.snackBar.open("User created successfully", "Close", { duration: 3000 })
            this.dialogRef.close(true)
          },
          error: () => {
            this.snackBar.open("Error creating user", "Close", { duration: 3000 })
            this.isLoading = false
          },
        })
      }
    }
  }

  onCancel() {
    this.dialogRef.close(false)
  }
}
