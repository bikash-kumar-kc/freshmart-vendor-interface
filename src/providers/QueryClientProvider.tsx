import { queryClient } from "@/lib/tanstackquery/setup/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";

const QueryClientProviderJsx = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return(
     <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
};

export default QueryClientProviderJsx;
