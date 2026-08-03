export interface IAuthUser {
  id: string;
  email: string;
  role: 'user' | 'vendor' | 'admin';
}

export interface ILoginPayload {
  email: string;
  password: string;
}