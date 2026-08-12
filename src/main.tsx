import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ErrorBoundary } from "./components/ErrorBoundary.tsx";
import QueryClientProviderJsx from "./providers/QueryClientProvider.tsx";
import BrowserRouterProvider from "./providers/BrowserRouterProvider.tsx";
import { AuthContextProvider } from "./context/AuthContext.tsx";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"
import './toast-overrides.css'

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouterProvider>
        <AuthContextProvider>
          <QueryClientProviderJsx>
            <ToastContainer
              position="bottom-right"
              autoClose={4000}
              hideProgressBar={true}
              newestOnTop
              closeOnClick
              pauseOnHover
              theme="light"
              transition={Slide}
            />
            <App />
          </QueryClientProviderJsx>
        </AuthContextProvider>
      </BrowserRouterProvider>
    </ErrorBoundary>
  </StrictMode>,
);
