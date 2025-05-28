import { Component, inject, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatTableModule } from "@angular/material/table"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatCardModule } from "@angular/material/card"
import { MatDialogModule, MatDialog } from "@angular/material/dialog"
import { MatSnackBar } from "@angular/material/snack-bar"
import { MatTooltipModule } from "@angular/material/tooltip"
import { UserService } from "../../../core/services/user.service"
import type { User } from "../../../core/models/user.model"
import { UserDialogComponent } from "../user-dialog/user-dialog.component"

@Component({
  selector: "app-user-list",
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatTooltipModule,
  ],
  templateUrl: "./user-list.component.html",
  styleUrls: ["./user-list.component.scss"],
})
export class UserListComponent implements OnInit {
  private userService = inject(UserService)
  private dialog = inject(MatDialog)
  private snackBar = inject(MatSnackBar)

  users: User[] = []
  displayedColumns: string[] = ["id", "fullName", "email", "role", "resume", "actions"]

  ngOnInit() {
    this.loadUsers()
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users
      },
      error: (error) => {
        this.snackBar.open("Error loading users", "Close", { duration: 3000 })
      },
    })
  }

  openUserDialog(user?: User) {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: "500px",
      data: user || null,
    })

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.loadUsers()
      }
    })
  }

  downloadResume(userId: number) {
    this.userService.downloadUserResume(userId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `user_${userId}_resume.pdf`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      },
      error: (error) => {
        this.snackBar.open("No resume found for this user", "Close", { duration: 3000 })
      },
    })
  }

  deleteUser(userId: number) {
    if (confirm("Are you sure you want to delete this user?")) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.snackBar.open("User deleted successfully", "Close", { duration: 3000 })
          this.loadUsers()
        },
        error: (error) => {
          this.snackBar.open("Error deleting user", "Close", { duration: 3000 })
        },
      })
    }
  }
}
