import { Injectable, inject } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import type { Observable } from "rxjs"

import type { User, CreateUserRequest, UpdateUserRequest } from "../models/user.model"
import { environment } from "../../environments/environment"

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

  createUser(user: CreateUserRequest): Observable<any> {
    const roleName = user.roleId === 1 ? 'Admin' : 'User';
  
    const payload = {
      fullName: user.fullName,
      email: user.email,
      password: user.password, // נדרש שהטופס יספק את זה
      roleId: user.roleId,
      roleName
    };
  
    return this.http.post(`${environment.apiUrl}/Auth/register`, payload);
  }
  
  
  updateUser(user: UpdateUserRequest): Observable<User> {
    const roleName = user.roleId === 1 ? 'Admin' : 'User';
  
    const payload = {
      ...user,
      roleName
    };
  
    return this.http.put<User>(`${this.apiUrl}/${user.id}`, payload);
  }
  
  deleteUser(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`)
  }

  downloadUserResume(userId: number): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}/Resume/by-user/${userId}`, {
      responseType: "blob",
    })
  }

  getResumeDownloadUrl(userId: number): Observable<string> {
    return this.http.get<string>(`${environment.apiUrl}/resume/download-url/${userId}`);
  }
  
}
