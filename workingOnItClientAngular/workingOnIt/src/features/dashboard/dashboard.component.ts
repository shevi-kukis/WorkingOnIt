import { Component, inject, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatCardModule } from "@angular/material/card"
import { MatIconModule } from "@angular/material/icon"
import { MatButtonModule } from "@angular/material/button"
import { RouterModule } from "@angular/router"
import { UserService } from "../../core/services/user.service"
import { AnalyticsService } from "../../core/services/analytics.service"

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, RouterModule],
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  private userService = inject(UserService)
  private analyticsService = inject(AnalyticsService)

  totalUsers = 0
  totalInterviews = 0
  averageScore = 0
  usersWithResumes = 0

  ngOnInit() {
    this.loadDashboardData()
  }

  private loadDashboardData() {
    this.userService.getUsers().subscribe((users) => {
      this.totalUsers = users.length
      this.usersWithResumes = users.filter((user) => user.roleId !== 1).length
    })

    this.analyticsService.getAllUserScores().subscribe((allScores) => {
      let totalScore = 0
      let totalCount = 0

      Object.values(allScores).forEach((userScores) => {
        userScores.forEach((score: { score: number }) => {
          totalScore += score.score
          totalCount++
        })
      })

      this.totalInterviews = totalCount
      this.averageScore = totalCount > 0 ? Math.round(totalScore / totalCount) : 0
    })
  }
}
