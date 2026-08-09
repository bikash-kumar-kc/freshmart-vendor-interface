// types/product.types.ts
export interface IProductListItem {
  id: number;
  name: string;
  localName: string | null;
  type: "inventory" | "display";
  totalQuantity: number;
  unitPrice: number;
  isAcceptedByAdmin: boolean;
  isRejectedByAdmin: boolean;
  createdAt: string;
}

export interface IProductListResponse {
  data: IProductListItem[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export interface IProductListParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export const mockApprovedProducts: IProductListItem[] = [
  {
    id: 101,
    name: "Tomato",
    localName: "Golbheda",
    type: "inventory",
    totalQuantity: 480,
    unitPrice: 65,
    isAcceptedByAdmin: true,
    isRejectedByAdmin: false,
    createdAt: "2026-08-01T10:00:00Z",
  },
  {
    id: 102,
    name: "Spinach",
    localName: "Palungo",
    type: "display",
    totalQuantity: 220,
    unitPrice: 40,
    isAcceptedByAdmin: true,
    isRejectedByAdmin: false,
    createdAt: "2026-08-02T09:30:00Z",
  },
  {
    id: 103,
    name: "Apple",
    localName: null,
    type: "inventory",
    totalQuantity: 150,
    unitPrice: 220,
    isAcceptedByAdmin: true,
    isRejectedByAdmin: false,
    createdAt: "2026-08-03T14:00:00Z",
  },
  {
    id: 104,
    name: "Whole Milk",
    localName: "Dudh",
    type: "display",
    totalQuantity: 90,
    unitPrice: 95,
    isAcceptedByAdmin: true,
    isRejectedByAdmin: false,
    createdAt: "2026-08-04T08:15:00Z",
  },
  {
    id: 105,
    name: "Brown Rice",
    localName: "Chamal",
    type: "inventory",
    totalQuantity: 600,
    unitPrice: 130,
    isAcceptedByAdmin: true,
    isRejectedByAdmin: false,
    createdAt: "2026-08-05T11:45:00Z",
  },
];

export const mockUnapprovedProducts: IProductListItem[] = [
  {
    id: 201,
    name: "Cauliflower",
    localName: "Kauli",
    type: "display",
    totalQuantity: 300,
    unitPrice: 55,
    isAcceptedByAdmin: false,
    isRejectedByAdmin: false,
    createdAt: "2026-08-06T10:00:00Z",
  },
  {
    id: 202,
    name: "Banana",
    localName: "Kera",
    type: "inventory",
    totalQuantity: 500,
    unitPrice: 70,
    isAcceptedByAdmin: false,
    isRejectedByAdmin: false,
    createdAt: "2026-08-07T12:00:00Z",
  },
  {
    id: 203,
    name: "Lentils (Masoor)",
    localName: "Musuro Dal",
    type: "inventory",
    totalQuantity: 400,
    unitPrice: 180,
    isAcceptedByAdmin: false,
    isRejectedByAdmin: true,
    createdAt: "2026-08-07T15:00:00Z",
  },
];

export const mockProductResponse = (
  source: IProductListItem[],
  search: string,
  page: number,
  pageSize: number,
) => {
  const filtered = search
    ? source.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          String(p.id).includes(search),
      )
    : source;

  const start = (page - 1) * pageSize;
  return {
    data: filtered.slice(start, start + pageSize),
    total: filtered.length,
    totalPages: page,
    currentPage: pageSize,
  };
};
