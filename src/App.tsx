import { Route, Routes } from "react-router-dom";
import "./App.css";
import ProtectedRoutes from "./protectedRoutes/ProtectedRoutes";
import {
  DashBoard,
  Login,
  Notification,
  Order,
  Product,
  Quotation,
  Signup,
  VendorRegistration,
  VerifyEmail,
} from "./pages";

import { AuthLayout, UnAuthLayout } from "./layout";

const authenticatedPages = [
  {
    component: <DashBoard />,
    path: "/",
  },
  {
    component: <Notification />,
    path: "/notification",
  },
  {
    component: <Order />,
    path: "/order",
  },
  {
    component: <Product />,
    path: "/product",
  },
  {
    component: <Quotation />,
    path: "/quotation",
  },
];

const unauthenticatedPages = [
  {
    component: <Signup />,
    path: "/signup",
  },
  {
    component: <Login />,
    path: "/login",
  },
];

function App() {
  return (
    <Routes>
      {authenticatedPages.map((i) => (
        <Route
          key={i.path}
          path={i.path}
          element={
            <ProtectedRoutes>
              <AuthLayout>{i.component}</AuthLayout>
            </ProtectedRoutes>
          }
        />
      ))}

      {unauthenticatedPages.map((i) => (
        <Route
          key={i.path}
          path={i.path}
          element={
            <ProtectedRoutes>
              <UnAuthLayout>{i.component}</UnAuthLayout>
            </ProtectedRoutes>
          }
        />
      ))}

      <Route
        path={"/vendor-registration"}
        element={
          <ProtectedRoutes>
            <VendorRegistration />
          </ProtectedRoutes>
        }
      />

      <Route
        path={"/verify-email"}
        element={
          <ProtectedRoutes>
            <VerifyEmail />
          </ProtectedRoutes>
        }
      />
    </Routes>
  );
}

export default App;
