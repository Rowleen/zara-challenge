import { Outlet } from "react-router-dom";
import Header from "@components/Header/Header";

import "./layout.sass";

export function Layout() {
  return (
    <div className="layout">
      <div className="layout__shell">
        <Header />
        <Outlet />
      </div>
    </div>
  );
}
