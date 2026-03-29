export type Product = {
  title: string;
  description?: string | null;
  categoryName?: string | null;
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
