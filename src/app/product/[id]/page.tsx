// /app/product/[productID]/page.tsx
"use client";

import { useParams } from "next/navigation";
import ProductViewPage from "@/components/ProductCardItem";

export default function ProductDetailPage() {
  const { id} = useParams();

  if (!id) {
    return <div className="p-4 text-red-500">Invalid product ID</div>;
  }

  return <ProductViewPage productId={id as string} />;
}
