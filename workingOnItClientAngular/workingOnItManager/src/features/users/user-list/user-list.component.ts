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
      width: '600px',
      maxWidth: '90vw',
      height: 'auto',
      maxHeight: '90vh',
      data: user || null,
      disableClose: false,
      autoFocus: true,
      restoreFocus: true,
      panelClass: 'custom-dialog-container',
      hasBackdrop: true,
      backdropClass: 'custom-backdrop'
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.loadUsers();
      }
    });
  }

  downloadResume(userId: number) {
    this.userService.getResumeDownloadUrl(userId).subscribe(url => {
      if (url) {
        window.open(url, "_blank");
      } else {
        console.error("No URL received");
      }
    });
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