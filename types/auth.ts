// Authentication Request Types
export interface LoginRequest {
  email: string;
  password: string;
}

// Authentication Response Types
export interface LoginResponse {
  token: string;
}

// User Types (can be expanded based on your needs)
export interface User {
  email: string;
  // Add other user fields as needed
}

// Auth State Types
export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
}
