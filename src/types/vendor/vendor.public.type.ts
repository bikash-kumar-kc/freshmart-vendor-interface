export interface IApplyVendorPayload {
  email: string;
  farmName: string;
  farmOriginCountry: string;
  farmDescription?: string;
  farmOwner: string;
  phoneNumber: string;
  addressLocation: string;
  vatNumber?: string;
  panVatCertificateUrl: string;
  certificates?: string[];
}

export interface IApplyVendorResponse {
  id: string;
  email: string;
  message: string;
}

export interface IVerifyOtpPayload {
  email: string;
  otp: string;
}

export interface IVerifyOtpResponse {
  message: string;
}

export interface IResendOtpPayload {
  email: string;
}

export interface IResendOtpResponse {
  message: string;
}