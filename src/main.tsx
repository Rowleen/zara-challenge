import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "@/context/CartProvider";
import { ToastContainer } from "react-toastify";
import App from "./App";
import "@styles/global.sass";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <CartProvider>
        <App />
      </CartProvider>
      <ToastContainer position="top-center" />
    </BrowserRouter>
  </StrictMode>,
);
