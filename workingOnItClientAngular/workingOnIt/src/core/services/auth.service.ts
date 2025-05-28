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
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken())

  isAuthenticated$ = this.isAuthenticatedSubject.asObservable()

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/Auth/login`, credentials).pipe(
      tap((response) => {
        localStorage.setItem("token", response.token)
        localStorage.setItem("user", JSON.stringify(response.user))
        this.isAuthenticatedSubject.next(true)
      }),
    )
  }

  logout(): void {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    this.isAuthenticatedSubject.next(false)
  }

  isAuthenticated(): boolean {
    return this.hasToken()
  }

  getToken(): string | null {
    return localStorage.getItem("token")
  }

  getCurrentUser() {
    const userStr = localStorage.getItem("user")
    return userStr ? JSON.parse(userStr) : null
  }

  private hasToken(): boolean {
    return !!localStorage.getItem("token")
  }
}
