export interface SignUpPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user?: {
    id: number;
    name?: string;
    email?: string;
  };
}
