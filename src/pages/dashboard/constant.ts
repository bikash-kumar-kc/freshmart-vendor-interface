import type { IDashboardStats } from "@/types/dashboardState.type";

interface IStatCardConfig {
  key: keyof IDashboardStats;
  label: string;
  text: string;
  iconName: string;
  accent: string;
}

export const statCards: IStatCardConfig[] = [
  {
    key: "totalProducts",
    label: "Total Products",
    text: "Across all listings",
    // icon: <Package className="w-4 h-4" />,
    iconName: "Package",
    accent: "#3B6D11",
  },
  {
    key: "totalLiveProducts",
    label: "Live Products",
    text: "Currently orderable",
    iconName: "ShoppingCart",
    // icon: <ShoppingCart className="w-4 h-4" />,
    accent: "#3B6D11",
  },
  {
    key: "totalQuotationToReviewByVendor",
    label: "Pending Quotations",
    text: "Awaiting your response",
    iconName: "FileSpreadsheet",
    // icon: <FileSpreadsheet className="w-4 h-4" />,
    accent: "#C8742A",
  },
  {
    key: "totalProductOrders",
    label: "Active Display Orders",
    text: "Pending or processing",
    // icon: <Truck className="w-4 h-4" />,
    iconName: "Truck",
    accent: "#C8742A",
  },
  {
    key: "totalCancelledOrders",
    label: "Total Cancelled Orders",
    text: "Cancelled Orders",
    // icon: <Truck className="w-4 h-4" />,
    iconName: "Truck",
    accent: "red",
  },
  {
    key: "totalCompletedOrders",
    label: "Total Completed Orders",
    text: "Completed Orders",
    // icon: <Truck className="w-4 h-4" />,
    iconName: "Truck",
    accent: "green",
  },
];
