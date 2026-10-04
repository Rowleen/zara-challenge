import { Link, useLocation } from "react-router-dom";

import { useCart } from "@/context/useCart";

import Logo from "@assets/logo.svg";
import bagIcon from "@assets/bag_icon.svg";
import bagIconFilled from "@assets/bag_icon_filled.svg";

import "./header.sass";

export default function Header() {
  const { count } = useCart();
  const { pathname } = useLocation();
  const hasItems = count > 0;
  const isCartPage = pathname === "/cart";

  return (
    <header className="header">
      <Link to="/" className="header__logo" aria-label="Go to home">
        <img src={Logo} alt="" />
      </Link>

      {!isCartPage ? (
        <Link
          to="/cart"
          className={hasItems ? "header__bag is-filled" : "header__bag"}
          aria-label={`Cart, ${count} items`}
        >
          <img
            className="header__bag-icon"
            src={hasItems ? bagIconFilled : bagIcon}
            alt=""
            width={18}
            height={18}
            aria-hidden="true"
          />
          <span aria-hidden="true">{count}</span>
        </Link>
      ) : null}
    </header>
  );
}
