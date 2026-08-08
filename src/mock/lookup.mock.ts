import type { ICategory, IMeasurementType, IPackagingType, IProductName } from "@/types/productListing/lookup.types";


export const mockProductNames: IProductName[] = [
  { id: 1, name: 'Tomato', isVerified: true },
  { id: 2, name: 'Spinach', isVerified: true },
  { id: 3, name: 'Apple', isVerified: true },
  { id: 4, name: 'Whole Milk', isVerified: true },
  { id: 5, name: 'Brown Rice', isVerified: true },
  { id: 6, name: 'Cauliflower', isVerified: true },
  { id: 7, name: 'Banana', isVerified: true },
  { id: 8, name: 'Lentils (Masoor)', isVerified: true },
];

export const mockCategories: ICategory[] = [
  { id: 1, categoryName: 'Vegetables' },
  { id: 2, categoryName: 'Fruits' },
  { id: 3, categoryName: 'Dairy & Eggs' },
  { id: 4, categoryName: 'Grains & Cereals' },
  { id: 5, categoryName: 'Pulses & Lentils' },
];

export const mockPackagingTypes: IPackagingType[] = [
  { id: 1, name: 'Box', isVerified: true },
  { id: 2, name: 'Jars', isVerified: true },
  { id: 3, name: 'Carton', isVerified: true },
  { id: 4, name: 'Bottle', isVerified: true },
  { id: 5, name: 'Sack', isVerified: true },
];

export const mockMeasurementTypes: IMeasurementType[] = [
  { id: 1, name: 'g', isVerified: true },
  { id: 2, name: 'ml', isVerified: true },
  { id: 3, name: 'pcs', isVerified: true },
];