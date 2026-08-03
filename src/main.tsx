import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ErrorBoundary } from "./components/ErrorBoundary.tsx";
import QueryClientProviderJsx from "./providers/QueryClientProvider.tsx";
import BrowserRouterProvider from "./providers/BrowserRouterProvider.tsx";
import { Toaster } from "@/components/ui/toast";
import { AuthContextProvider } from "./context/AuthContext.tsx";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthContextProvider>
        <QueryClientProviderJsx>
          <BrowserRouterProvider>
            <App />
            <Toaster />
          </BrowserRouterProvider>
        </QueryClientProviderJsx>
      </AuthContextProvider>
    </ErrorBoundary>
  </StrictMode>,
);
