import { Route, Routes } from "react-router-dom";
import "./App.css";
import ProtectedRoutes from "./routes/ProtectedRoutes";
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
import PublicRoutes from "./routes/PublicRoutes";
import Home from "./pages/home/Home";

const authenticatedPages = [
  {
    component: <DashBoard />,
    path: "/dashboard",
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
      <Route index element={<Home />} />
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
            <PublicRoutes>
              <UnAuthLayout>{i.component}</UnAuthLayout>
            </PublicRoutes>
          }
        />
      ))}

      <Route path={"/vendor-registration"} element={<VendorRegistration />} />

      <Route path={"/verify-email"} element={<VerifyEmail />} />
    </Routes>
  );
}

export default App;
