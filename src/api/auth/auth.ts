import type { IAuthUser, IGetCurrentUserResponse, ILoginPayload, ILoginResponse } from "@/types/auth/auth.type";
import { api } from "../axios";

class AuthServices {
  create() {}

  async login(payload: ILoginPayload) {
    const { data } = await api.post<ILoginResponse>(
      "/auth/login",
      payload,
    );
    return data;
  }

  async logout() {
    await api.post("/auth/logout");
  }

  async refreshToken() {
    const { data } = await api.post<IGetCurrentUserResponse>("/auth/refresh");
    return data;
  }

  async getCurrentUser() {
    const { data } = await api.get<{ user: IAuthUser }>("/auth");
    return data;
  }
}

const authServices = new AuthServices();

export default authServices;
