import { useAuthContext } from "@/context/AuthContext";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

// routes/ProtectedRoutes.tsx — requires auth
export default function ProtectedRoutes({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuthContext();
  const navigate = useNavigate();

  if (isLoading) return <p>loading...</p>;
  if (!user || user.role !== "vendor") navigate("/login");

  return <>{children}</>;
}
