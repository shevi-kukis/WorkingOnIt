import { Component, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, type FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatSelectModule } from "@angular/material/select"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
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
    MatIconModule,
    MatProgressSpinnerModule,
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
  hidePassword = true

  userForm: FormGroup = this.fb.group({
    fullName: [
      this.data?.fullName || "", 
      [Validators.required, Validators.minLength(2)]
    ],
    email: [
      this.data?.email || "", 
      [Validators.required, Validators.email]
    ],
    password: [
      "", 
      this.isEdit ? [] : [Validators.required, Validators.minLength(6)]
    ],
    roleId: [
      this.data?.roleId || 2, 
      Validators.required
    ],
  })

  onSave() {
    if (this.userForm.valid) {
      this.isLoading = true

      if (this.isEdit && this.data) {
        const updateData = {
          id: this.data.id,
          fullName: this.userForm.value.fullName.trim(),
          email: this.userForm.value.email.trim().toLowerCase(),
          roleId: this.userForm.value.roleId,
        }

        this.userService.updateUser(updateData).subscribe({
          next: () => {
            this.showSuccessMessage("המשתמש עודכן בהצלחה! ✅")
            this.dialogRef.close(true)
          },
          error: (error) => {
            this.showErrorMessage("שגיאה בעדכון המשתמש ❌")
            this.isLoading = false
            console.error('Update error:', error)
          },
        })
      } else {
        const createData = {
          ...this.userForm.value,
          fullName: this.userForm.value.fullName.trim(),
          email: this.userForm.value.email.trim().toLowerCase(),
        }

        this.userService.createUser(createData).subscribe({
          next: () => {
            this.showSuccessMessage("המשתמש נוצר בהצלחה! ✅")
            this.dialogRef.close(true)
          },
          error: (error) => {
            this.showErrorMessage("שגיאה ביצירת המשתמש ❌")
            this.isLoading = false
            console.error('Create error:', error)
          },
        })
      }
    } else {
      this.markFormGroupTouched()
      this.showErrorMessage("אנא מלא את כל השדות הנדרשים")
    }
  }

  onCancel() {
    if (this.userForm.dirty && !this.isLoading) {
      const confirmClose = confirm("יש לך שינויים שלא נשמרו. האם אתה בטוח שברצונך לסגור?")
      if (confirmClose) {
        this.dialogRef.close(false)
      }
    } else {
      this.dialogRef.close(false)
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.userForm.controls).forEach(key => {
      const control = this.userForm.get(key)
      if (control) {
        control.markAsTouched()
      }
    })
  }

  private showSuccessMessage(message: string) {
    this.snackBar.open(message, "סגור", { 
      duration: 4000,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    })
  }

  private showErrorMessage(message: string) {
    this.snackBar.open(message, "סגור", { 
      duration: 5000,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    })
  }
}