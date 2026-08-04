import React from "react";

const UnAuthLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="w-full  bg-amber-50 min-h-screen">{children}</div>;
};

export default UnAuthLayout;
