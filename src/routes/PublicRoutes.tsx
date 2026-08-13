import { useAuthContext } from "@/context/AuthContext";
import { useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

export default function PublicRoutes({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !isLoading) {
      navigate("/dashboard");
    }
  }, [user, navigate, isLoading]);

  // if (!user && isLoading) return <p>loading...public routes</p>;
  if (!user && isLoading) return <p></p>;

  return <>{children}</>;
}
