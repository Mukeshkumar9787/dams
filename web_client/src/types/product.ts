export type Product = {
  title: string;
  slug: string,
  price: number;
  stock: number;
  mrp: number;
  id: number;
  imgs?: [];
  img?: string;
  avgRating?: number;
  reviewCount?: number;
};
