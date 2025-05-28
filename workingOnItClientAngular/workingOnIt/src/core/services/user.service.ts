import { Injectable, inject } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import type { Observable } from "rxjs"

import type { User, CreateUserRequest, UpdateUserRequest } from "../models/user.model"
import { environment } from "@/src/environments/environment"

@Injectable({
  providedIn: "root",
})
export class UserService {
  private http = inject(HttpClient)
  private apiUrl = `${environment.apiUrl}/User`

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl)
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`)
  }

  createUser(user: CreateUserRequest): Observable<boolean> {
    return this.http.post<boolean>(this.apiUrl, user)
  }

  updateUser(user: UpdateUserRequest): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${user.id}`, user)
  }

  deleteUser(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`)
  }

  downloadUserResume(userId: number): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}/Resume/by-user/${userId}`, {
      responseType: "blob",
    })
  }
}
