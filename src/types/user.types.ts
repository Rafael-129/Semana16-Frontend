export interface User {
  id: number;
  fullName: string;
  email: string;
  role: 'admin' | 'doctor' | 'patient';
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  dateOfBirth?: string;
}
