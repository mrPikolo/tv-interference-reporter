export interface User {
  id: number;
  username: string;
  email: string;
  role: 'MANAGER' | 'TECHNICIAN' | 'ADMIN';
  firstName: string;
  lastName: string;
  department?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
} 