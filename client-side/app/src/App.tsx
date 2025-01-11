import { Suspense, lazy } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import { ColorModeContext, useMode } from "./theme";
import Navbar from "./scenes/global/Navbar";
import UserProvider from "./contexts/UserProvider";
import ProductsProvider from "./contexts/ProductsProvider";
import CartProvider from "./contexts/CartProvider";
import ErrorBoundary from "./ErrorBoundray";
import Loading from "./components/Loading";
import { Toaster } from "react-hot-toast";
import { Stack } from "@mui/system";

const LazyComponent = (Component: React.LazyExoticComponent<any>) => {
  return (
    <ErrorBoundary>
      <Suspense
        fallback={
          <Stack direction={"row"} justifyContent={"center"} mt={"7rem"}>
            <Loading size="large" />
          </Stack>
        }
      >
        <Component />
      </Suspense>
    </ErrorBoundary>
  );
};

const Signup = lazy(() => import("./scenes/forms/Signup"));
const Login = lazy(() => import("./scenes/forms/Login"));
const HomePage = lazy(() => import("./scenes/home/HomePage"));
const ProductDetails = lazy(() => import("./components/ProductDetailes"));
const Category = lazy(() => import("./scenes/category/Category"));
const Cart = lazy(() => import("./scenes/cart/Cart"));
const PurchaseSuccess = lazy(() => import("./components/PurchaseSuccess"));
const PurchaseCancelled = lazy(() => import("./components/PurchaseCancelled"));
const Layout = lazy(() => import("./scenes/dashboard/Layout"));
const Error404 = lazy(() => import("./components/Error404"));

const PersistLogin = lazy(() => import("./hooks/PersistLogin"));
const RequireAuth = lazy(() => import("./hooks/RequireAuth"));
const RequireAdmin = lazy(() => import("./hooks/RequireAdmin"));

const App = () => {
  const { theme, toggleColorMode } = useMode();

  return (
    <ColorModeContext.Provider value={{ toggleColorMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <UserProvider>
          <ProductsProvider>
            <CartProvider>
              <Navbar />
              <ErrorBoundary>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/signup" element={LazyComponent(Signup)} />
                  <Route path="/login" element={LazyComponent(Login)} />

                  {/* Persist Login */}
                  <Route element={LazyComponent(PersistLogin)}>
                    {/* Protected Routes */}
                    <Route path="/" element={LazyComponent(HomePage)} />
                    <Route path="/home" element={LazyComponent(HomePage)} />
                    <Route
                      path="/category/:category"
                      element={LazyComponent(Category)}
                    />
                    <Route
                      path="/product/:id"
                      element={LazyComponent(ProductDetails)}
                    />

                    <Route element={LazyComponent(RequireAuth)}>
                      <Route path="/cart" element={LazyComponent(Cart)} />
                      <Route
                        path="/purchase-cancel"
                        element={LazyComponent(PurchaseCancelled)}
                      />
                      <Route
                        path="/purchase-success"
                        element={LazyComponent(PurchaseSuccess)}
                      />

                      {/* Admin-only Routes */}
                      <Route element={LazyComponent(RequireAdmin)}>
                        <Route
                          path="/dashboard"
                          element={LazyComponent(Layout)}
                        />
                      </Route>
                    </Route>

                    {/* Catch-All Route */}
                    <Route path="/*" element={LazyComponent(Error404)} />
                  </Route>
                </Routes>
              </ErrorBoundary>
            </CartProvider>
          </ProductsProvider>
        </UserProvider>
        <Toaster />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
