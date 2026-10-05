export const catalog = [
  {
    id: "p1",
    brand: "Apple",
    name: "iPhone 15",
    basePrice: 999,
    imageUrl: "/iphone.jpg",
  },
  {
    id: "p2",
    brand: "Samsung",
    name: "Galaxy S24",
    basePrice: 899,
    imageUrl: "/galaxy.jpg",
  },
  {
    id: "p3",
    brand: "Xiaomi",
    name: "Redmi Note",
    basePrice: 199,
    imageUrl: "/redmi.jpg",
  },
];

export const productDetail = {
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
  similarProducts: [
    {
      id: "p2",
      brand: "Samsung",
      name: "Galaxy S24",
      basePrice: 899,
      imageUrl: "/galaxy.jpg",
    },
  ],
};
