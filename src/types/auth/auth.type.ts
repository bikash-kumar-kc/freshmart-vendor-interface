export interface IAuthUser {
  id: string;
  email: string;
  role: "user" | "vendor" | "admin";
  vendorId: string;
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface ILoginResponse {
  user: IAuthUser;
}

export interface ISetupAccountPayload {
  email: string;
  password: string;
  isVendor: boolean;
}

// export interface ISetupAccountResponse {
//   id: string;
//   email: string;
//   role: "user" | "vendor" | "admin";
//   vendorId:string;
// }

export type ISetupAccountResponse = IAuthUser;

export interface IGetCurrentUserResponse {
  user: IAuthUser;
}

// POST /auth/logout — no body, no meaningful response
// POST /auth/refresh — no body, sets fresh cookies; response can be treated as void
