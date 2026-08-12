import type {
  IAuthUser,
  IGetCurrentUserResponse,
  ILoginPayload,
  ILoginResponse,
  ISetupAccountPayload,
  ISetupAccountResponse,
} from "@/types/auth/auth.type";
import { api } from "../axios";
// import { toast } from "@/components/ui/toast";
import { showToast } from "@/components/ReactToast";

class AuthServices {
  // vendor register/apply.......
  async create(payload: ISetupAccountPayload) {
    const { data } = await api.post<ISetupAccountResponse>(
      "/auth/setup-account",
      payload,
    );
    return data;
  }

  // vendor login...
  async login(payload: ILoginPayload) {
    const { data } = await api.post<ILoginResponse>("/auth/login", payload);
    return data;
  }

  // vendor logout...
  async logout() {
    await api.post("/auth/logout");
  }

  // vendor use refreshtoken...
  async refreshToken() {
    const { data } = await api.post<IGetCurrentUserResponse>("/auth/refresh");
    return data;
  }

  // vendor get itself...
  async getCurrentUser() {
    const { data } = await api.get<{ user: IAuthUser }>("/auth");
    return data;
  }

  // vendor verify otp...
  async verifyOtp(data: { email: string; otp: string }) {
    if (!data.email || !data.otp) {

      showToast.error("Data missing", "Email or otp is missing ");
    }
    return await api.post("/vendor/otp/verify", { ...data });
  }

  // vendor ask for otp again...
  async resendOtp(data: { email: string }) {
    if (!data.email) {


      showToast.error("Data missing", "Email or otp is missing ");
    }

    return await api.post("/vendor/otp/resend", {
      ...data,
    });
  }
}

const authServices = new AuthServices();

export default authServices;
