"use client";

import { useParams } from "next/navigation";
import ProductViewPage from "@/components/ProductCardItem";

export default function ProductDetailPage() {
  const { productID } = useParams();

  if (!productID) {
    return <div className="p-4 text-red-500">Invalid product ID</div>;
  }

  return <ProductViewPage productId={productID} />;
}
