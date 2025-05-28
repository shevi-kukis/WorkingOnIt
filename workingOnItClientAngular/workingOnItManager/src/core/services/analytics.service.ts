import { Injectable, inject } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import  { Observable } from "rxjs"
import { environment } from "../../environments/environment"
import type { UserScore, AllUserScores } from "../models/interview.model"

@Injectable({
  providedIn: "root",
})
export class AnalyticsService {
  private http = inject(HttpClient)
  private apiUrl = `${environment.apiUrl}/Interview`

  getUserScores(userId: number): Observable<UserScore[]> {
    return this.http.get<UserScore[]>(`${this.apiUrl}/scores/${userId}`)
  }

  getAllUserScores(): Observable<AllUserScores> {
    return this.http.get<AllUserScores>(`${this.apiUrl}/scores/all`)
  }
}
