import type {
  ICreateProductListingPayload,
  IUpdateProductListingPayload,
} from "@/types/productListing/productListing.type";
import { api } from "../axios";
import { toast } from "@/components/ui/toast";

type IGetProductListingDetails = ICreateProductListingPayload & { id: number };

// type IGetProductListingPagination = {
//   data: ICreateProductListingPayload & { id: number };
//   currentPage: number;
//   hasNextPage: boolean;
//   limit: number;
//   totalPages: number;
//   totalProducts: number;
// };

class ProductListingServices {
  async createProductListing(payload: ICreateProductListingPayload) {
    const { data } = await api.post("/vendor/product-listing", payload);
    return data;
  }

  async getProductListingDetails(id: string, isAuthenticated: boolean) {
    const { data } = await api.get<IGetProductListingDetails>(
      `vendor/product-listing/${id}`,
      {
        params: {
          isAuthenticated: isAuthenticated,
        },
      },
    );

    return data;
  }

  async updateProductListing(payload: IUpdateProductListingPayload) {
    if (!payload.productListingId) {
      toast.add({ type: "error", description: "ProductlistingId is required" });
      return;
    }
    const { productListingId, ...requiredPayload } = payload;
    await api.patch(`/vendor/${productListingId}`, {
      ...requiredPayload,
    });
  }
}

const productListingServices = new ProductListingServices();
export default productListingServices;
