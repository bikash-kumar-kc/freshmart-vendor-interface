import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/components/ui/toast";
import type { ReactNode } from "react";
import type { IAuthUser } from "@/types/auth/auth.type";
import authServices from "@/api/auth/auth";
import "../api/interceptors/interceptor";
import { useLocation } from "react-router-dom";
import Cookies from "js-cookie";

interface AuthContextValue {
  user: IAuthUser | null;
  isLoading: boolean;
  refetchUser: (data: IAuthUser) => void;
  setUser: (data: null) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IAuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  const getCurrentUser = async () => {
    try {
      const response = await authServices.getCurrentUser();
      setUser({
        id: response.user.id,
        role: response.user.role,
        email: response.user.email,
        vendorId: response.user.vendorId,
      });
    } catch {
      toast.add({ type: "error", description: "User is not logged in !" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetUser = (data: IAuthUser) => setUser(data);
  const value = {
    user,
    isLoading,
    setUser: setUser,
    refetchUser: handleSetUser,
  };

  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (!token) {
      setIsLoading(false);
      return;
    }
    getCurrentUser();
  }, [location.pathname]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
