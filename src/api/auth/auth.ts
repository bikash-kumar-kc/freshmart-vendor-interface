import type {
  IAuthUser,
  IGetCurrentUserResponse,
  ILoginPayload,
  ILoginResponse,
  ISetupAccountPayload,
  ISetupAccountResponse,
} from "@/types/auth/auth.type";
import { api } from "../axios";
import { toast } from "@/components/ui/toast";

class AuthServices {
  async create(payload: ISetupAccountPayload) {
    const { data } = await api.post<ISetupAccountResponse>(
      "/auth/setup-account",
      payload,
    );
    return data;
  }

  async login(payload: ILoginPayload) {
    const { data } = await api.post<ILoginResponse>("/auth/login", payload);
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

  async verifyOtp(data: { email: string; otp: string }) {
    if (!data.email || !data.otp) {
      toast.add({
        type: "error",
        title: "Data missing",
        description: "Email or otp is missing",
      });
    }

    console.log("data", data);
    return await api.post("/vendor/otp/verify", { ...data });
  }

  async resendOtp(data: { email: string }) {
    if (!data.email) {
      toast.add({
        type: "error",
        title: "Data missing",
        description: "Email or otp is missing",
      });
    }

    return await api.post("/vendor/otp/resend", {
      ...data,
    });
  }
}

const authServices = new AuthServices();

export default authServices;
