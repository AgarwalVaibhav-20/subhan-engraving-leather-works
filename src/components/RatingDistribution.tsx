"use client";

import { Star } from "lucide-react";
import axios from "axios";
const ratingData = [
  { star: 5, count: 2000, color: "bg-teal-500" },
  { star: 4, count: 1000, color: "bg-purple-400" },
  { star: 3, count: 500, color: "bg-yellow-400" },
  { star: 2, count: 200, color: "bg-cyan-400" },
  { star: 1, count: 0, color: "bg-orange-500" },
];

const maxCount = Math.max(...ratingData.map(r => r.count));

export default function RatingDistribution() {
  return (
    <div className="space-y-2">
      {ratingData.map(({ star, count, color }) => {
        const percentage = (count / maxCount) * 100;

        return (
          <div key={star} className="flex items-center gap-2 text-sm">
            {/* Star number */}
            <div className="flex items-center w-8 text-gray-500">
              <Star className="w-4 h-4 mr-1" />
              <span>{star}</span>
            </div>

            {/* Progress bar */}
            <div className="relative w-full h-3 bg-gray-200 rounded overflow-hidden">
              <div
                className={`absolute top-0 left-0 h-full ${color}`}
                style={{ width: `${percentage}%` }}
              />
            </div>

            {/* Count */}
            <div className="w-12 text-right font-medium text-gray-800">
              {count >= 1000 ? `${count / 1000}k` : count}
            </div>
          </div>
        );
      })}
    </div>
  );
}
