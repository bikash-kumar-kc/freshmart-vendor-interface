import type { ICategory, IMeasurementType, IPackagingType, IProductName } from '@/types/productListing/lookup.types';
import { api } from '../axios';


class LookupServices {
  async getProductNames() {
    const { data } = await api.get<IProductName[]>('/productname');
    return data;
  }

  async getCategories() {
    const { data } = await api.get<ICategory[]>('/categoryname');
    return data;
  }

  async getPackagingTypes() {
    const { data } = await api.get<IPackagingType[]>('/packagingtype');
    return data;
  }

  async getMeasurementTypes() {
    const { data } = await api.get<IMeasurementType[]>('/measurementtypename');
    return data;
  }
}

const lookupServices = new LookupServices();
export default lookupServices;