import { JwtPayload } from "jwt-decode";

export interface ILoginInPayload {
  username: string;
  password: string;
}

export interface ISignUpPayload {
  username: string;
  email: string;
  name: string;
  password: string;
}

export interface ILogInResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    email: string;
    name: string;
    role: string;
    message?: string;
  };
}

export interface ILogoutResponse {
  message: string;
  statusCode: number;
}

export interface ISignUpResponse {
  id: string;
  email: string;
  name: string;
  role: string;
  status: number;
  message: string;
}

export interface IRefreshTokenResponse {
  accessToken: string;
  expires: number;
  statusCode: number;
}

export interface ICustomJwtPayload extends JwtPayload {
  email?: string;
  name?: string;
  picture?: string
}