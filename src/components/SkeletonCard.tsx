import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const SkeletonCard = () => {
  return (
    <div className="border rounded-3xl p-4 w-full sm:w-[280px] md:w-[260px] lg:w-[300px] flex flex-col items-start sm:items-center justify-start bg-white dark:bg-zinc-900 shadow-md">
      <Skeleton className="w-full h-40 sm:h-32 md:h-36 lg:h-40 xl:h-48 rounded-md bg-gray-200 dark:bg-gray-700" />
      <Skeleton className="h-4 w-3/4 mt-3 bg-gray-200 dark:bg-gray-700" />
      <Skeleton className="h-4 w-1/2 mt-2 bg-gray-200 dark:bg-gray-700" />
      <Skeleton className="h-4 w-1/3 mt-2 bg-gray-200 dark:bg-gray-700" />
    </div>
  );
};

export default SkeletonCard;
