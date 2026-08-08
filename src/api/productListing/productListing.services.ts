import type { ICreateProductListingPayload } from "@/types/productListing/productListing.type";
import { api } from "../axios";

class ProductListingServices {
  async createProductListing(payload: ICreateProductListingPayload) {
    const { data } = await api.post("/product-listing", payload);
    return data;
  }
}

const productListingServices = new ProductListingServices();
export default productListingServices;
