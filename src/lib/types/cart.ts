export type CartItem = {
  cartItemId: string;
  productId: string;
  brand: string;
  name: string;
  storage: string;
  color: string;
  price: number;
  imageUrl: string;
};

export type AddCartItemInput = Omit<CartItem, "cartItemId">;
