import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout/Layout";
import { CartPage } from "./pages/CartPage";
import { HomePage } from "./pages/HomePage";
import { ProductDetailPage } from "./pages/ProductDetailPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Route>
    </Routes>
  );
}
