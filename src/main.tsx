import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ErrorBoundary } from "./components/ErrorBoundary.tsx";
import QueryClientProviderJsx from "./providers/QueryClientProvider.tsx";
import BrowserRouterProvider from "./providers/BrowserRouterProvider.tsx";
import { Toaster } from "@/components/ui/toast";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProviderJsx>
        <BrowserRouterProvider>
          <App />
          <Toaster />
        </BrowserRouterProvider>
      </QueryClientProviderJsx>
    </ErrorBoundary>
  </StrictMode>,
);
