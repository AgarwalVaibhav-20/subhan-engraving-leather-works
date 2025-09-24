import { Skeleton } from "@/components/ui/skeleton";

export default function ProductSkeletonCard() {
  return (
    <div className="rounded-2xl p-4 shadow-md w-full h-full border">
      {/* Image Placeholder */}
      <Skeleton className="w-full h-[400px] rounded-xl mb-4 bg-gray-200 dark:bg-gray-700" />

      {/* Title */}
      <Skeleton className="h-5 w-3/4 mb-2 bg-gray-200 dark:bg-gray-700" />

      {/* Brand & Rating */}
      <div className="flex justify-between items-center mb-2">
        <Skeleton className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700" />
        <Skeleton className="h-4 w-12 bg-gray-200 dark:bg-gray-700" />
      </div>

      {/* Description */}
      <Skeleton className="h-4 w-full mb-1 bg-gray-200 dark:bg-gray-700" />
      <Skeleton className="h-4 w-2/3 mb-3 bg-gray-200 dark:bg-gray-700" />

      {/* Price & Stock */}
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-5 w-16 bg-gray-200 dark:bg-gray-700" />
        <Skeleton className="h-5 w-20 rounded-full bg-gray-200 dark:bg-gray-700" />
      </div>

      {/* Buttons */}
      <div className="flex justify-between gap-2">
        <Skeleton className="h-10 w-28 rounded bg-gray-200 dark:bg-gray-700" />
        <Skeleton className="h-10 w-28 rounded bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
  );
}
