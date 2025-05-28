export interface Interview {
  id: number
  interviewDate: string
  score: number
  userId: number
}

export interface UserScore {
  date: string
  score: number
}

export interface AllUserScores {
  [userId: number]: UserScore[]
}
