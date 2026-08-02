import  { type ReactNode } from "react";

const ProtectedRoutes = ({ children }: { children: ReactNode }) => {
  return <div>{children}</div>;
};

export default ProtectedRoutes;
