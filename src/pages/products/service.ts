import { api } from "@/api/axios";
import type {
  IProductListParams,
  IProductListResponse,
} from "./requiredUtilis";

class ProductServices {
  async getApprovedProducts(params: IProductListParams) {
    const { data } = await api.get<IProductListResponse>("/vendor", {
      params: { ...params, verified: true },
    });
    return data;
  }

  async getUnapprovedProducts(params: IProductListParams) {
    const { data } = await api.get<IProductListResponse>("/vendor", {
      params: { ...params, verified: false },
    });
    return data;
  }
}

const productServices = new ProductServices();
export default productServices;
