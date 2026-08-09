import { useAuthContext } from "@/context/AuthContext";
import { useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoutes({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuthContext();
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (!user && !isLoading) {
  //     navigate("/login");
  //   }
  // }, [isLoading, navigate, user]);

  // if (!user && isLoading) return <p></p>;

  return <>{children}</>;
}
