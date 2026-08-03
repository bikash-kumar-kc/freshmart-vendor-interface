import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { toast } from "@/components/ui/toast";
import type { ReactNode } from "react";
import type { IAuthUser } from "@/types/auth/auth.type";
import authServices from "@/api/auth/auth";

interface AuthContextValue {
  user: IAuthUser | null;
  isLoading: boolean;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IAuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getCurrentUser = async () => {
    try {
      setIsLoading(true);
      const response = await authServices.getCurrentUser();
      setUser({
        id: response.user.id,
        role: response.user.role,
        email: response.user.email,
      });
    } catch (error) {
      toast.add({ type: "error", description: "User is not logged in !" });
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const value = { user, isLoading, refetchUser: getCurrentUser };

  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (!token) {
      setIsLoading(false);
      return;
    }
    getCurrentUser();
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
