export interface AdminCredentials {
  email: string;
  password: string;
}

export interface AdminRegisterData extends AdminCredentials {
  name: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
}
