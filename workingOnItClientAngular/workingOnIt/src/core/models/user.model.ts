export interface User {
  id: number
  fullName: string
  email: string
  passwordHash?: string
  roleId: number
  roleName: string
}

export interface CreateUserRequest {
  fullName: string
  email: string
  password: string
  roleId: number
}

export interface UpdateUserRequest {
  id: number
  fullName: string
  email: string
  roleId: number
}
