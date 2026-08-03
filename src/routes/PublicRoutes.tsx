import { useAuthContext } from "@/context/AuthContext";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

export default function PublicRoutes({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuthContext();
  const navigate = useNavigate();

  if (isLoading) return <p>loading...</p>;
  if (user) return void navigate("/");

  return <>{children}</>;
}
