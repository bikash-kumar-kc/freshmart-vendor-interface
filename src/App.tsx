import { Route, Routes } from "react-router-dom";
import "./App.css";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import {
  DashBoard,
  Display,
  DisplayOrdersPage,
  // Inventory,
  Login,
  Notification,
  // Order,
  OrderDetails,
  Product,
  ProductDetails,
  ProductsPage,
  Quotation,
  QuotationDetials,
  Signup,
  VendorRegistration,
  VerifyEmail,
  PasswordReset,
  ReqeustForPasswordReset,
} from "./pages";

import { AuthLayout, UnAuthLayout } from "./layout";
import PublicRoutes from "./routes/PublicRoutes";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";

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
    component: <Product />,
    path: "/product",
  },
  {
    component: <Product />,
    path: "/product/:id",
  },
  {
    component: <ProductDetails />,
    path: "product/:id",
  },

  {
    component: <ProductsPage />,
    path: "/product-layout",
  },

  {
    component: <Quotation />,
    path: "/quotation",
  },
  {
    component: <QuotationDetials />,
    path: "/quotation-details/:id",
  },
  {
    component: <Display />,
    path: "/order/display",
  },
  {
    component: <OrderDetails />,
    path: "/order/:id",
  },
  // {
  //   component: <Inventory />,
  //   path: "order/inventory",
  // },
  // {
  //   component: <Display />,
  //   path: "/order/display",
  // },

  {
    component: <DisplayOrdersPage />,
    path: "/order-details/:id",
  },

  {
    component: <Profile />,
    path: "/profile",
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
  {
    component: <PasswordReset />,
    path: "/passwordreset",
  },
  {
    component: <ReqeustForPasswordReset />,
    path: "/requestforpasswordreset",
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
