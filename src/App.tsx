import { Route, Routes } from "react-router-dom";

import { CartPage } from "@pages/CartPage/CartPage";
import { HomePage } from "@pages/HomePage/HomePage";
import { ProductDetailPage } from "@pages/ProductDetailPage/ProductDetailPage";

import { Layout } from "@components/Layout/Layout";

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
