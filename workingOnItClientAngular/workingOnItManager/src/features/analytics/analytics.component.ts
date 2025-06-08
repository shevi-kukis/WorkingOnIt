
import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
// Removed incorrect import of NgChartsModule
import { Chart, ChartConfiguration, ChartType, registerables } from "chart.js";
import { AnalyticsService } from "../../core/services/analytics.service";
import { UserService } from "../../core/services/user.service";
import  { User } from "../../core/models/user.model";
import  { AllUserScores } from "../../core/models/interview.model";
import { NgChartsModule } from 'ng2-charts';
Chart.register(...registerables);

@Component({
  selector: "app-analytics",
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    NgChartsModule
    // Removed incorrect usage of NgChartsModule
  ],
  templateUrl: "./analytics.component.html",
  styleUrls: ["./analytics.component.scss"],
})
export class AnalyticsComponent implements OnInit {
  private analyticsService = inject(AnalyticsService);
  private userService = inject(UserService);

  users: User[] = [];
  selectedUserId: number = 0;

  allUserScores: AllUserScores = {};

  totalTests = 0;
  averageScore = 0;
  highestScore = 0;
  activeUsers = 0;

  globalChartType: ChartType = "bar";
  globalChartData: ChartConfiguration["data"] = {
    labels: [],
    datasets: [
      {
        label: "Average Score",
        data: [],
        backgroundColor: "#00bcd4",
        borderColor: "#00acc1",
        borderWidth: 1,
      },
    ],
  };
  globalChartOptions: ChartConfiguration["options"] = {
    responsive: true,
    plugins: {
      legend: { display: true, position: "top" },
      title: { display: true, text: "User Performance Overview" },
    },
    scales: { y: { beginAtZero: true, max: 100 } },
  };

  userChartType: ChartType = "line";
  userChartData: ChartConfiguration["data"] = {
    labels: [],
    datasets: [
      {
        label: "Score",
        data: [],
        backgroundColor: "rgba(0, 188, 212, 0.2)",
        borderColor: "#00bcd4",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };
  userChartOptions: ChartConfiguration["options"] = {
    responsive: true,
    plugins: {
      legend: { display: true, position: "top" },
      title: { display: true, text: "Individual User Performance" },
    },
    scales: { y: { beginAtZero: true, max: 100 } },
  };

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.userService.getUsers().subscribe((users) => {
      this.users = users;
      this.activeUsers = users.length;
    });

    this.analyticsService.getAllUserScores().subscribe((scores) => {
      this.allUserScores = scores;
      this.calculateStatistics();
      this.updateGlobalChart();
    });
  }

  private calculateStatistics() {
    let totalScore = 0;
    let maxScore = 0;
    this.totalTests = 0;

    Object.values(this.allUserScores).forEach((userScores) => {
      userScores.forEach((score: { score: number; }) => {
        totalScore += score.score;
        maxScore = Math.max(maxScore, score.score);
        this.totalTests++;
      });
    });

    this.averageScore = this.totalTests > 0 ? Math.round(totalScore / this.totalTests) : 0;
    this.highestScore = maxScore;
  }

  private updateGlobalChart() {
    const userLabels: string[] = [];
    const userAverages: number[] = [];

    this.users.forEach((user) => {
      const userScores = this.allUserScores[user.id] || [];
      if (userScores.length > 0) {
        const avg = userScores.reduce((sum, s) => sum + s.score, 0) / userScores.length;
        userLabels.push(user.fullName);
        userAverages.push(Math.round(avg));
      }
    });

    this.globalChartData = {
      labels: userLabels,
      datasets: [
        {
          label: "Average Score",
          data: userAverages,
          backgroundColor: "#00bcd4",
          borderColor: "#00acc1",
          borderWidth: 1,
        },
      ],
    };
  }

  onUserSelect() {
    if (!this.selectedUserId || this.selectedUserId === 0) {
      this.updateGlobalChart();
      return;
    }

    const userScores = this.allUserScores[this.selectedUserId] || [];
    const scoresByDate = new Map<string, number[]>();

    userScores.forEach((score) => {
      const date = score.date;
      if (!scoresByDate.has(date)) scoresByDate.set(date, []);
      scoresByDate.get(date)!.push(score.score);
    });

    const labels: string[] = [];
    const data: number[] = [];

    Array.from(scoresByDate.entries())
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .forEach(([date, scores]) => {
        labels.push(new Date(date).toLocaleDateString());
        const avg = scores.reduce((sum, s) => sum + s, 0) / scores.length;
        data.push(Math.round(avg));
      });

    this.userChartData = {
      labels,
      datasets: [
        {
          label: "Score",
          data,
          backgroundColor: "rgba(0, 188, 212, 0.2)",
          borderColor: "#00bcd4",
          borderWidth: 2,
          fill: true,
          tension: 0.4,
        },
      ],
    };
  }
}
