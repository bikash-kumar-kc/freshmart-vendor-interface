import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  FileText,
  ShoppingBag,
  Boxes,
  Store,
  ChevronDown,
  Bell,
  LogOut,
  MoreHorizontal,
} from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import authServices from "@/api/auth/auth";
import { toast } from "../ui/toast";

const navItemBase =
  "flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-all duration-200";

const navItemInactive = "text-gray-600 hover:bg-green-50 hover:text-green-700";

const navItemActive = "bg-green-600 text-white hover:bg-green-700";

function NavItem({
  to,
  icon: Icon,
  label,
  badge,
}: {
  to: string;
  icon: React.ElementType;
  label: string;
  badge?: number;
}) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        `${navItemBase} ${isActive ? navItemActive : navItemInactive}`
      }
    >
      <Icon size={18} />

      <span className="flex-1">{label}</span>

      {badge !== undefined && badge > 0 && (
        <span className="min-w-5 rounded-full bg-orange-500 px-1.5 py-0.5 text-center text-[10px] font-semibold text-white">
          {badge}
        </span>
      )}
    </NavLink>
  );
}

export default function Sidebar({ unreadCount = 0 }: { unreadCount?: number }) {
  const location = useLocation();
  const { user, setUser,refetchUser } = useAuthContext();
  const navigate = useNavigate();

  const isOnOrdersRoute = location.pathname.startsWith("/order");

  const [ordersOpen, setOrdersOpen] = useState(isOnOrdersRoute);

  const handleLogout = async () => {
    try {
      void authServices.logout();
      setUser(null);
      navigate("/");
      toast.add({
        type: "success",
        title: "Logout",
        description: "Logout successfully",
      });
    } catch {
      toast.add({
        type: "error",
        title: "Logout Failed",
        description: "Failed doing login",
      });
    }
  };

  return (
    <aside className="flex h-screen w-[15%] fixed flex-col justify-between border-r border-gray-100 shadow-lg bg-white px-4 py-5">
      <div>
        {/* Brand */}
        <div className="mb-8 flex items-center gap-3 px-2 w-full ">
          <div>
            <h2 className="text-xl font-semibold tracking-wider text-gray-900">
              🌿 FreshMart
            </h2>

            <p className="text-sm tracking-wider text-gray-700 text-center">
              Vendor Portal
            </p>
          </div>
        </div>

        <nav className="space-y-1">
          <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />

          <NavItem to="/product" icon={Package} label="Products" />

          <NavItem to="/quotation" icon={FileText} label="Quotation" />

          {/* Orders */}
          <div>
            <button
              onClick={() => setOrdersOpen((prev) => !prev)}
              className={`${navItemBase} w-full ${
                isOnOrdersRoute ? "bg-green-50 text-green-700" : navItemInactive
              }`}
            >
              <ShoppingBag size={18} />

              <span className="flex-1 text-left">Orders</span>

              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${
                  ordersOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {ordersOpen && (
              <div className="mt-1 ml-4 space-y-1 border-l border-gray-200 pl-3">
                <NavItem to="/order/inventory" icon={Boxes} label="Inventory" />

                <NavItem to="/order/display" icon={Store} label="Display" />
              </div>
            )}
          </div>
        </nav>
      </div>

      <div>
        <div className="mb-4 space-y-1">
          <NavItem
            to="/notification"
            icon={Bell}
            label="Notifications"
            badge={unreadCount}
          />

          <button
            onClick={handleLogout}
            className={`${navItemBase} w-full text-gray-600 hover:bg-rose-50 hover:text-rose-600`}
          >
            <LogOut size={18} />

            <span className="flex-1 text-left">Logout</span>
          </button>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-md border-2 border-gray-100 px-3 py-2.5">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-semibold text-green-700">
              {user?.email?.[0]?.toUpperCase() ?? "V"}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-gray-900">
                {user?.email ?? "Vendor"}
              </p>

              <p className="truncate text-xs text-gray-400">Vendor</p>
            </div>
          </div>

          <button className="rounded-md p-1 transition-colors hover:bg-gray-100">
            <MoreHorizontal size={18} className="text-gray-400" />
          </button>
        </div>
      </div>
    </aside>
  );
}
