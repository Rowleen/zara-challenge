export type ProductListEntity = {
  id: string;
  brand: string;
  name: string;
  basePrice: number;
  imageUrl: string;
};

export type ProductColorOption = {
  name: string;
  hexCode: string;
  imageUrl: string;
};

export type ProductStorageOption = {
  capacity: string;
  price: number;
};

export type ProductSpecs = {
  screen: string;
  resolution: string;
  processor: string;
  mainCamera: string;
  selfieCamera: string;
  battery: string;
  os: string;
  screenRefreshRate: string;
};

export type ProductEntity = {
  id: string;
  brand: string;
  name: string;
  description: string;
  basePrice: number;
  rating: number;
  specs: ProductSpecs;
  colorOptions: ProductColorOption[];
  storageOptions: ProductStorageOption[];
  similarProducts: ProductListEntity[];
};

export type ErrorEntity = {
  error?: string;
  message?: string;
};

export type ProductSummary = ProductListEntity;
export type ProductDetail = ProductEntity;
