import { Button } from "@components/Button/Button";

import { formatPrice } from "@/lib/format/price";
import type { CartItem } from "@/lib/types/cart";

import "./cart-item.sass";

type CartItemRowProps = {
  item: CartItem;
  onRemove: (cartItemId: string) => void;
};

export function CartItemRow({ item, onRemove }: CartItemRowProps) {
  return (
    <article className="cart-item">
      <div className="cart-item__media">
        <img
          src={item.imageUrl}
          alt={`${item.brand} ${item.name}`}
          loading="lazy"
        />
      </div>

      <div className="cart-item__body">
        <h2 className="cart-item__name">{item.name}</h2>
        <p className="cart-item__specs">
          {item.storage} | {item.color}
        </p>
        <p className="cart-item__price">{formatPrice(item.price)}</p>
        <Button
          variant="danger"
          className="cart-item__remove"
          onClick={() => onRemove(item.cartItemId)}
        >
          Delete
        </Button>
      </div>
    </article>
  );
}
