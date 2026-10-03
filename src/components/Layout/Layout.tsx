import { Outlet } from "react-router-dom";
import "./layout.sass";

export function Layout() {
  return (
    <div className="layout">
      <div className="layout__shell">
        <Outlet />
      </div>
    </div>
  );
}
