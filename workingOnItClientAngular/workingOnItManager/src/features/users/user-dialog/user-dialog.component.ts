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
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar"
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
    MatSnackBarModule,
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
            this.handleError(error, 'update')
            this.isLoading = false
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
            this.handleError(error, 'create')
            this.isLoading = false
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

  private handleError(error: any, action: 'create' | 'update') {
    console.error(`${action} error:`, error)
    
    // בדיקה אם יש הודעת שגיאה מהשרת
    let errorMessage = ''
    
    // נסה מספר אפשרויות לגישה להודעת השגיאה
    const serverMessage = error?.error?.message || error?.message || ''
    
    console.log('Server message:', serverMessage) // לבדיקה
    
    if (serverMessage) {
      // טיפול בשגיאה של משתמש קיים
      if (serverMessage === 'User already exist' || serverMessage.includes('already exist')) {
        if (action === 'create') {
          errorMessage = "❌ משתמש עם כתובת אימייל זו כבר קיים במערכת"
          alert('User already exist')
        } else {
          errorMessage = "❌ כתובת האימייל החדשה כבר בשימוש על ידי משתמש אחר"
        }
      }
      // טיפול בשגיאות נוספות שיכולות להגיע מהשרת
      else if (serverMessage.includes('email') && serverMessage.includes('duplicate')) {
        errorMessage = action === 'create' 
          ? "❌ כתובת האימייל כבר קיימת במערכת" 
          : "❌ כתובת האימייל החדשה כבר בשימוש"
      }
      else if (serverMessage.includes('validation')) {
        errorMessage = "❌ נתונים לא תקינים, אנא בדוק את הפרטים"
      }
      else {
        // הודעת שגיאה כללית עם ההודעה מהשרת
        errorMessage = action === 'create' 
          ? `❌ שגיאה ביצירת המשתמש: ${serverMessage}` 
          : `❌ שגיאה בעדכון המשתמש: ${serverMessage}`
      }
    } 
    // שגיאת רשת או שגיאה לא צפויה
    else if (error?.status === 0) {
      errorMessage = "❌ שגיאת תקשורת - אנא בדוק את החיבור לאינטרנט"
    }
    else if (error?.status === 500) {
      errorMessage = "❌ שגיאה בשרת - אנא נסה שוב מאוחר יותר"
    }
    else {
      // הודעת שגיאה כללית
      errorMessage = action === 'create' 
        ? "❌ שגיאה ביצירת המשתמש - אנא נסה שוב" 
        : "❌ שגיאה בעדכון המשתמש - אנא נסה שוב"
    }
    
    this.showErrorMessage(errorMessage)
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
    console.log('Showing error message:', message) // לבדוק שהפונקציה נקראת
  
    this.snackBar.open(message, "סגור", { 
      duration: 6000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    })
  }
}