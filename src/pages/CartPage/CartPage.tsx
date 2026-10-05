import { useCart } from "@/context/useCart";

import { CartItemRow } from "@components/CartItem/CartItem";
import { Button } from "@components/Button/Button";

import { formatPrice } from "@lib/format/price";

import "./cart-page.sass";

export function CartPage() {
  const { items, count, total, removeItem } = useCart();

  return (
    <main className="cart-page">
      <h1 className="cart-page__title">CART ({count})</h1>

      {count === 0 ? (
        <p className="cart-page__empty" role="status">
          Your cart is empty.
        </p>
      ) : (
        <ul className="cart-page__list">
          {items.map((item) => (
            <li key={item.cartItemId}>
              <CartItemRow item={item} onRemove={removeItem} />
            </li>
          ))}
        </ul>
      )}

      <footer
        className={
          count === 0
            ? "cart-page__footer is-empty"
            : "cart-page__footer"
        }
      >
        <Button variant="ghost" to="/" className="cart-page__continue">
          CONTINUE SHOPPING
        </Button>

        {count > 0 ? (
          <div className="cart-page__checkout">
            <p className="cart-page__total" aria-live="polite">
              <span>TOTAL</span>
              <span>{formatPrice(total)}</span>
            </p>

            <Button variant="solid" className="cart-page__pay">
              PAY
            </Button>
          </div>
        ) : null}
      </footer>
    </main>
  );
}
