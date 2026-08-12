export interface IVendor {
  id: string;
  email: string;
  isEmailVerified: boolean;
  farmName: string;
  farmOriginCountry: string;
  farmDescription: string | null;
  farmOwner: string;
  phoneNumber: string;
  addressLocation: string;
  vatNumber: string | null;
  panVatCertificateUrl: string;
  certificates: string[];
  isVendorApproved: boolean;
  createdAt: string;
  updatedAt: string;
}


export type IGetMyVendorProfileResponse = IVendor;