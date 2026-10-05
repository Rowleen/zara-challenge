import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { useCart } from "@/context/useCart";

import { useProduct } from "@/hooks/useProduct";

import { BackLink } from "@components/BackLink/BackLink";
import { Button } from "@components/Button/Button";
import { ColorOptions } from "@components/ColorOptions/ColorOptions";
import { SimilarItems } from "@components/SimilarItems/SimilarItems";
import { Specifications } from "@components/Specifications/Specifications";
import { StorageOptions } from "@components/StorageOptions/StorageOptions";

import { formatPrice } from "@lib/format/price";

import "./product-detail-page.sass";

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { product, isLoading, error } = useProduct(id);
  const { addItem } = useCart();
  const [selectedStorage, setSelectedStorage] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  useEffect(() => {
    setSelectedStorage(null);
    setSelectedColor(null);
  }, [id]);

  if (isLoading) {
    return (
      <main className="product-detail">
        <BackLink />
        <p className="product-detail__status" role="status">
          Loading…
        </p>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="product-detail">
        <BackLink />
        <p className="product-detail__status" role="alert">
          {error ?? "Product not found."}
        </p>
      </main>
    );
  }

  const selectedStorageOption =
    product.storageOptions.find(
      (option) => option.capacity === selectedStorage,
    ) ?? null;
  const selectedColorOption =
    product.colorOptions.find((option) => option.name === selectedColor) ??
    null;
  const canAdd = Boolean(selectedStorage && selectedColor);
  const displayPrice = selectedStorageOption?.price ?? product.basePrice;
  const imageUrl =
    selectedColorOption?.imageUrl ?? product.colorOptions[0]?.imageUrl;

  const handleAddToCart = () => {
    if (!selectedStorageOption || !selectedColorOption) return;

    addItem({
      productId: product.id,
      brand: product.brand,
      name: product.name,
      storage: selectedStorageOption.capacity,
      color: selectedColorOption.name,
      price: selectedStorageOption.price,
      imageUrl: selectedColorOption.imageUrl,
    });
    toast.success("Item added to cart");
  };

  return (
    <>
      <BackLink />

      <main className="product-detail">
        <section
          className="product-detail__hero"
          aria-labelledby="product-title"
        >
          <div className="product-detail__media">
            <img
              src={imageUrl}
              alt={`${product.brand} ${product.name}${
                selectedColorOption ? ` in ${selectedColorOption.name}` : ""
              }`}
            />
          </div>

          <div className="product-detail__info">
            <header className="product-detail__header">
              <h1 id="product-title" className="product-detail__title">
                {product.name}
              </h1>
              <p className="product-detail__price">
                From {formatPrice(displayPrice)}
              </p>
            </header>

            <StorageOptions
              options={product.storageOptions}
              selected={selectedStorage}
              onSelect={setSelectedStorage}
            />

            <ColorOptions
              options={product.colorOptions}
              selected={selectedColor}
              onSelect={setSelectedColor}
            />

            <Button
              variant="solid"
              fullWidth
              disabled={!canAdd}
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
          </div>
        </section>

        <Specifications product={product} />

        <SimilarItems products={product.similarProducts} />
      </main>
    </>
  );
}
