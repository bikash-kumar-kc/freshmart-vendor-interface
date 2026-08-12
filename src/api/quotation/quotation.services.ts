// services/quotation.services.ts
import { api } from "@/api/axios";
import type { ICounterQuotationPayload, IQuotationDetail, IQuotationListParams, IQuotationListResponse } from "@/types/quotation/types";


class QuotationServices {
  async getQuotations(params: IQuotationListParams) {
    const { data } = await api.get<IQuotationListResponse>(
      "/vendor/quotation",
      { params },
    );
    return data;
  }

  async getQuotationDetail(quotationId: number) {
    const { data } = await api.get<IQuotationDetail>(
      `/vendor/quotation/${quotationId}`,
    );
    return data;
  }

  async acceptQuotation(quotationId: number) {
    const { data } = await api.patch(`/vendor/quotation/${quotationId}/accept`);
    return data;
  }

  async counterQuotation(
    quotationId: number,
    payload: ICounterQuotationPayload,
  ) {
    const { data } = await api.patch(
      `/vendor/quotation/${quotationId}/counter`,
      payload,
    );
    return data;
  }
}

const quotationServices = new QuotationServices();
export default quotationServices;
