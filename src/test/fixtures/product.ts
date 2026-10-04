import type { ProductDetail } from "@/lib/types/product";

export const sampleProduct: ProductDetail = {
  id: "p1",
  brand: "Apple",
  name: "iPhone 15",
  description: "A smartphone",
  basePrice: 999,
  rating: 4.5,
  specs: {
    screen: "6.1",
    resolution: "1179x2556",
    processor: "A16",
    mainCamera: "48MP",
    selfieCamera: "12MP",
    battery: "3349 mAh",
    os: "iOS",
    screenRefreshRate: "60Hz",
  },
  colorOptions: [
    { name: "Black", hexCode: "#000000", imageUrl: "/black.jpg" },
    { name: "Blue", hexCode: "#0000ff", imageUrl: "/blue.jpg" },
  ],
  storageOptions: [
    { capacity: "128 GB", price: 999 },
    { capacity: "256 GB", price: 1099 },
  ],
  similarProducts: [],
};
