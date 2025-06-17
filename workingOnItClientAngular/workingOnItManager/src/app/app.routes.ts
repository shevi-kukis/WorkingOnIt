import type { Routes } from "@angular/router"
import { AuthGuard } from "../core/guards/auth.guard"


export const routes: Routes = [
  {
    path: "login",
    loadComponent: () => import("../features/auth/login/login.component").then((m) => m.LoginComponent),
  },
  {
    path: "dashboard",
    loadComponent: () => import("../features/dashboard/dashboard.component").then((m) => m.DashboardComponent),
     canActivate: [AuthGuard], 
  },
  {
    path: "user-dialog",
    loadComponent: () => import("../features/users/user-dialog/user-dialog.component").then((m) => m.UserDialogComponent),
     canActivate: [AuthGuard], 
  },
  
  {
    path: "users",
    loadComponent: () => import("../features/users/user-list/user-list.component").then((m) => m.UserListComponent),
    canActivate: [AuthGuard],
  },
  {
    path: "analytics",
    loadComponent: () => import("../features/analytics/analytics.component").then((m) => m.AnalyticsComponent),
    canActivate: [AuthGuard],
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: "**",
    redirectTo: "/dashboard",
  },
  
]
