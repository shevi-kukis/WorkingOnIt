import { Component, Inject,  OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder,  FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import {  MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatSelectModule } from "@angular/material/select"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatDialogModule } from "@angular/material/dialog" // Added import for MatDialogModule

export interface User {
  id?: number
  fullName: string
  email: string
  password?: string
  roleId: number
}

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
export class UserDialogComponent implements OnInit {
  userForm: FormGroup
  isEdit: boolean
  isLoading = false
  data: { user?: User; isEdit: boolean }

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) matDialogData: any, // Injected MAT_DIALOG_DATA correctly
  ) {
    this.data = matDialogData
    this.isEdit = this.data.isEdit
    this.userForm = this.createForm()
  }

  ngOnInit(): void {
    if (this.isEdit && this.data.user) {
      this.userForm.patchValue(this.data.user)
    }
  }

  private createForm(): FormGroup {
    const form = this.fb.group({
      fullName: ["", [Validators.required, Validators.minLength(2)]],
      email: ["", [Validators.required, Validators.email]],
      roleId: ["", Validators.required],
    })

    if (!this.isEdit) {
      form.addControl("password", this.fb.control("", [Validators.required, Validators.minLength(6)]))
    }

    return form
  }

  onSave(): void {
    if (this.userForm.valid) {
      this.isLoading = true

      // Simulate API call
      setTimeout(() => {
        this.dialogRef.close(this.userForm.value)
        this.isLoading = false
      }, 1000)
    }
  }

  onCancel(): void {
    this.dialogRef.close()
  }

  getErrorMessage(fieldName: string): string {
    const field = this.userForm.get(fieldName)
    if (field?.hasError("required")) {
      return `${fieldName} is required`
    }
    if (field?.hasError("email")) {
      return "Please enter a valid email"
    }
    if (field?.hasError("minlength")) {
      const minLength = field.errors?.["minlength"].requiredLength
      return `Minimum ${minLength} characters required`
    }
    return ""
  }
}
