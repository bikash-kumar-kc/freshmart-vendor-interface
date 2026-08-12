// mock/display-order.mock.ts
// Temporary — swap query hooks back to displayOrderServices once the real
// endpoints are live. Mirrors the shapes in display-order.types.ts exactly.

import type {
  IDisplayOrderDetail,
  IDisplayOrderListItem,
  IDisplayOrderListResponse,
} from "./display-order.types";

const hoursAgo = (h: number) =>
  new Date(Date.now() - h * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

const minutesAgo = (m: number) =>
  new Date()
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

export const mockDisplayOrders: IDisplayOrderListItem[] = [
  {
    orderId: "ord-8f3a1c9d-0001",
    userId: "usr-1001",
    email: "sabina.rai@gmail.com",
    displayOrderStatus: "pending",
    type: "display",
    isPayment: false,
    createdAt: minutesAgo(22), // well within the 1hr window — should show a plain countdown
    items: [
      {
        productId: "prod-201",
        productName: "Cauliflower",
        localName: "Kauli",
        slug: "cauliflower",
        variantId: "var-3301",
        weightValue: 1,
        weightUnit: "kg",
        quantity: 4,
      },
    ],
  },
  {
    orderId: "ord-8f3a1c9d-0002",
    userId: "usr-1002",
    email: "binod.shrestha@yahoo.com",
    displayOrderStatus: "pending",
    type: "display",
    isPayment: false,
    createdAt: minutesAgo(55), // 5 min left — should trigger the "urgent" red styling
    items: [
      {
        productId: "prod-202",
        productName: "Banana",
        localName: "Kera",
        slug: "banana",
        variantId: "var-3302",
        weightValue: 500,
        weightUnit: "g",
        quantity: 10,
      },
      {
        productId: "prod-105",
        productName: "Brown Rice",
        localName: "Chamal",
        slug: "brown-rice",
        variantId: "var-3105",
        weightValue: 2,
        weightUnit: "kg",
        quantity: 2,
      },
    ],
  },
  {
    orderId: "ord-8f3a1c9d-0003",
    userId: "usr-1003",
    email: "anita.gurung@hotmail.com",
    displayOrderStatus: "pending",
    type: "display",
    isPayment: false,
    createdAt: hoursAgo(2), // already past deadline — should show "Overdue"
    items: [
      {
        productId: "prod-102",
        productName: "Spinach",
        localName: "Palungo",
        slug: "spinach",
        variantId: "var-3202",
        weightValue: 250,
        weightUnit: "g",
        quantity: 6,
      },
    ],
  },
  {
    orderId: "ord-8f3a1c9d-0004",
    userId: "usr-1004",
    email: "ramesh.thapa@gmail.com",
    displayOrderStatus: "processing",
    type: "display",
    isPayment: true,
    createdAt: hoursAgo(5),
    items: [
      {
        productId: "prod-104",
        productName: "Whole Milk",
        localName: "Dudh",
        slug: "whole-milk",
        variantId: "var-3204",
        weightValue: 1,
        weightUnit: "l",
        quantity: 3,
      },
    ],
  },
  {
    orderId: "ord-8f3a1c9d-0005",
    userId: "usr-1005",
    email: "kabita.karki@gmail.com",
    displayOrderStatus: "processing",
    type: "display",
    isPayment: true,
    createdAt: hoursAgo(8),
    items: [
      {
        productId: "prod-101",
        productName: "Tomato",
        localName: "Golbheda",
        slug: "tomato",
        variantId: "var-3201",
        weightValue: 1,
        weightUnit: "kg",
        quantity: 5,
      },
    ],
  },
  {
    orderId: "ord-8f3a1c9d-0006",
    userId: "usr-1006",
    email: "suman.magar@gmail.com",
    displayOrderStatus: "delivered",
    type: "display",
    isPayment: true,
    createdAt: hoursAgo(30),
    items: [
      {
        productId: "prod-103",
        productName: "Apple",
        localName: null,
        slug: "apple",
        variantId: "var-3203",
        weightValue: 1,
        weightUnit: "kg",
        quantity: 2,
      },
    ],
  },
  {
    orderId: "ord-8f3a1c9d-0007",
    userId: "usr-1007",
    email: "nirmala.tamang@gmail.com",
    displayOrderStatus: "delivered",
    type: "display",
    isPayment: true,
    createdAt: hoursAgo(48),
    items: [
      {
        productId: "prod-105",
        productName: "Brown Rice",
        localName: "Chamal",
        slug: "brown-rice",
        variantId: "var-3105",
        weightValue: 5,
        weightUnit: "kg",
        quantity: 1,
      },
      {
        productId: "prod-201",
        productName: "Cauliflower",
        localName: "Kauli",
        slug: "cauliflower",
        variantId: "var-3301",
        weightValue: 1,
        weightUnit: "kg",
        quantity: 3,
      },
    ],
  },
  {
    orderId: "ord-8f3a1c9d-0008",
    userId: "usr-1008",
    email: "dipesh.rana@gmail.com",
    displayOrderStatus: "cancelled",
    type: "display",
    isPayment: false,
    createdAt: hoursAgo(15),
    items: [
      {
        productId: "prod-202",
        productName: "Banana",
        localName: "Kera",
        slug: "banana",
        variantId: "var-3302",
        weightValue: 500,
        weightUnit: "g",
        quantity: 8,
      },
    ],
  },
  {
    orderId: "ord-8f3a1c9d-0009",
    userId: "usr-1009",
    email: "sarita.limbu@gmail.com",
    displayOrderStatus: "cancelled",
    type: "display",
    isPayment: false,
    createdAt: hoursAgo(20),
    items: [
      {
        productId: "prod-104",
        productName: "Whole Milk",
        localName: "Dudh",
        slug: "whole-milk",
        variantId: "var-3204",
        weightValue: 1,
        weightUnit: "l",
        quantity: 4,
      },
    ],
  },
  {
    orderId: "ord-8f3a1c9d-0010",
    userId: "usr-1010",
    email: "bishal.adhikari@gmail.com",
    displayOrderStatus: "processing",
    type: "display",
    isPayment: true,
    createdAt: hoursAgo(1),
    items: [
      {
        productId: "prod-102",
        productName: "Spinach",
        localName: "Palungo",
        slug: "spinach",
        variantId: "var-3202",
        weightValue: 250,
        weightUnit: "g",
        quantity: 10,
      },
      {
        productId: "prod-101",
        productName: "Tomato",
        localName: "Golbheda",
        slug: "tomato",
        variantId: "var-3201",
        weightValue: 500,
        weightUnit: "g",
        quantity: 6,
      },
    ],
  },
  {
    orderId: "ord-8f3a1c9d-0011",
    userId: "usr-1011",
    email: "sunita.basnet@gmail.com",
    displayOrderStatus: "pending",
    type: "display",
    isPayment: false,
    createdAt: minutesAgo(3),
    items: [
      {
        productId: "prod-103",
        productName: "Apple",
        localName: null,
        slug: "apple",
        variantId: "var-3203",
        weightValue: 1,
        weightUnit: "kg",
        quantity: 3,
      },
    ],
  },
  {
    orderId: "ord-8f3a1c9d-0012",
    userId: "usr-1012",
    email: "prakash.oli@gmail.com",
    displayOrderStatus: "delivered",
    type: "display",
    isPayment: true,
    createdAt: hoursAgo(72),
    items: [
      {
        productId: "prod-201",
        productName: "Cauliflower",
        localName: "Kauli",
        slug: "cauliflower",
        variantId: "var-3301",
        weightValue: 1,
        weightUnit: "kg",
        quantity: 5,
      },
    ],
  },
];

// Mirrors the same filter/search/paginate helper pattern used in product.mock.ts.
export const mockDisplayOrderResponse = (
  search: string,
  status: string,
  page: number,
  limit: number,
): IDisplayOrderListResponse => {
  let filtered = mockDisplayOrders;

  if (status && status !== "all") {
    filtered = filtered.filter((o) => o.displayOrderStatus === status);
  }

  if (search) {
    const term = search.toLowerCase();
    filtered = filtered.filter(
      (o) =>
        o.orderId.toLowerCase().includes(term) ||
        o.email.toLowerCase().includes(term),
    );
  }

  const start = (page - 1) * limit;
  const data = filtered.slice(start, start + limit);
  const totalPages = Math.max(1, Math.ceil(filtered.length / limit));

  return {
    data,
    currentPage: page,
    totalPages,
    hasNextPage: page < totalPages,
    limit,
    totalOrders: filtered.length,
  };
};

// Detail mock — keyed by orderId, matching the separate detail response shape
// (price/productListingId/productVariantId fields not present on the list item).
export const mockDisplayOrderDetails: Record<string, IDisplayOrderDetail> = {
  "ord-8f3a1c9d-0001": {
    id: "ord-8f3a1c9d-0001",
    createdAt: minutesAgo(12),
    isPayment: false,
    type: "display",
    userId: "usr-1001",
    displayOrderStatus: "pending",
    items: [
      {
        price: 55,
        productName: "Cauliflower",
        localName: "Kauli",
        id: 1,
        vendorId: "37c64c57-e422-4eee-a208-386249571d64",
        productId: "prod-201",
        productListingId: "pl-201",
        quantity: 4,
        orderId: "ord-8f3a1c9d-0001",
        slug: "cauliflower",
        weightValue: 1,
        weightUnit: "kg",
        productVariantId: "var-3301",
      },
    ],
  },
  "ord-8f3a1c9d-0002": {
    id: "ord-8f3a1c9d-0002",
    createdAt: minutesAgo(55),
    isPayment: false,
    type: "display",
    userId: "usr-1002",
    displayOrderStatus: "pending",
    items: [
      {
        price: 70,
        productName: "Banana",
        localName: "Kera",
        id: 2,
        vendorId: "37c64c57-e422-4eee-a208-386249571d64",
        productId: "prod-202",
        productListingId: "pl-202",
        quantity: 10,
        orderId: "ord-8f3a1c9d-0002",
        slug: "banana",
        weightValue: 500,
        weightUnit: "g",
        productVariantId: "var-3302",
      },
      {
        price: 130,
        productName: "Brown Rice",
        localName: "Chamal",
        id: 3,
        vendorId: "37c64c57-e422-4eee-a208-386249571d64",
        productId: "prod-105",
        productListingId: "pl-105",
        quantity: 2,
        orderId: "ord-8f3a1c9d-0002",
        slug: "brown-rice",
        weightValue: 2,
        weightUnit: "kg",
        productVariantId: "var-3105",
      },
    ],
  },
  "ord-8f3a1c9d-0004": {
    id: "ord-8f3a1c9d-0004",
    createdAt: hoursAgo(5),
    isPayment: true,
    type: "display",
    userId: "usr-1004",
    displayOrderStatus: "processing",
    items: [
      {
        price: 95,
        productName: "Whole Milk",
        localName: "Dudh",
        id: 4,
        vendorId: "37c64c57-e422-4eee-a208-386249571d64",
        productId: "prod-104",
        productListingId: "pl-104",
        quantity: 3,
        orderId: "ord-8f3a1c9d-0004",
        slug: "whole-milk",
        weightValue: 1,
        weightUnit: "l",
        productVariantId: "var-3204",
      },
    ],
  },
  "ord-8f3a1c9d-0006": {
    id: "ord-8f3a1c9d-0006",
    createdAt: hoursAgo(30),
    isPayment: true,
    type: "display",
    userId: "usr-1006",
    displayOrderStatus: "delivered",
    items: [
      {
        price: 220,
        productName: "Apple",
        localName: "Apple",
        id: 5,
        vendorId: "37c64c57-e422-4eee-a208-386249571d64",
        productId: "prod-103",
        productListingId: "pl-103",
        quantity: 2,
        orderId: "ord-8f3a1c9d-0006",
        slug: "apple",
        weightValue: 1,
        weightUnit: "kg",
        productVariantId: "var-3203",
      },
    ],
  },
  "ord-8f3a1c9d-0008": {
    id: "ord-8f3a1c9d-0008",
    createdAt: hoursAgo(15),
    isPayment: false,
    type: "display",
    userId: "usr-1008",
    displayOrderStatus: "cancelled",
    items: [
      {
        price: 70,
        productName: "Banana",
        localName: "Kera",
        id: 6,
        vendorId: "37c64c57-e422-4eee-a208-386249571d64",
        productId: "prod-202",
        productListingId: "pl-202",
        quantity: 8,
        orderId: "ord-8f3a1c9d-0008",
        slug: "banana",
        weightValue: 500,
        weightUnit: "g",
        productVariantId: "var-3302",
      },
    ],
  },
};
