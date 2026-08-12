import type {
  IApplyVendorPayload,
  IApplyVendorResponse,
} from "@/types/vendor/vendor.public.type";
import { api } from "../axios";

class VendorServices {
  async vendorApply(payload: IApplyVendorPayload) {
    const response = await api.post<IApplyVendorResponse>("/vendor/apply", {
      ...payload,
    });

    return response.data;
  }
}

const vendorService = new VendorServices();

export default vendorService;
