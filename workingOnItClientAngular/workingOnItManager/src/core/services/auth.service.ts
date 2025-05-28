import { Injectable, inject } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { BehaviorSubject, type Observable, tap } from "rxjs"
import { environment } from "../../environments/environment"

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: {
    id: number
    fullName: string
    email: string
    roleId: number
  }
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private http = inject(HttpClient)
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidAdminToken())
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable()

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined'
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/Auth/login`, credentials).pipe(
      tap((response) => {
        if (response.user.roleId !== 1) {
          this.logout()
          throw new Error("Access denied. Admin privileges required.")
        }

        if (this.isBrowser()) {
          localStorage.setItem("token", response.token)
          localStorage.setItem("user", JSON.stringify(response.user))
        }
        this.isAuthenticatedSubject.next(true)
      }),
    )
  }

  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
    }
    this.isAuthenticatedSubject.next(false)
  }
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.roleId === 1;
  }
  
  
  
  isAuthenticated(): boolean {
    return this.hasValidAdminToken()
  }

  getToken(): string | null {
    return this.isBrowser() ? localStorage.getItem("token") : null
  }

  getCurrentUser() {
    if (!this.isBrowser()) return null
    const userStr = localStorage.getItem("user")
    return userStr ? JSON.parse(userStr) : null
  }

  private hasToken(): boolean {
    return !!this.getToken()
  }

  private hasValidAdminToken(): boolean {
    const token = this.getToken()
    const user = this.getCurrentUser()
    return !!(token && user && user.roleId === 1)
  }
}
