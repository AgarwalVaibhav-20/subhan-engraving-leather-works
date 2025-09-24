'use client';

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { TrendingUp } from "lucide-react";
import StarRating from "./StarRating";
import RatingDistribution from "./RatingDistribution";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import StarInput from "./StarInput";
import axios from "axios";
import Image from "next/image";

type Review = {
  name: string;
  avatar: string;
  comment: string;
  rating: number;
  date: string;
  reviewCount: number;
};

function RatingForm() {
  const { data: session } = useSession();
  const user = session?.user as { _id: string; name: string; image?: string };

  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!user || !user._id) {
      setError("You must be logged in to submit a review.");
      return;
    }

    if (!comment || !rating) {
      setError("Please provide both a comment and a rating.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("/api/reviews", {
        comment,
        rating,
        _id: user._id,
      });

      const newReview = res.data;
      setReviews((prev) => [newReview, ...prev]);
      setComment("");
      setRating(0);
    } catch (error: any) {
      setError("Failed to submit review. Please try again.");
      console.error("Error submitting review:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get("/api/reviewsAll");
        setReviews(res.data);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      }
    };
    fetchReviews();
  }, []);

  // Calculate average rating
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  return (
    <main className="flex justify-center w-full items-center">
      <section className="w-full p-6 flex flex-col items-center justify-center">
        <div className="w-full mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Reviews</h1>
        </div>

        {/* Stats */}
        <section className="flex flex-col md:flex-row justify-center items-stretch w-full gap-8 md:gap-6">
          <div className="flex flex-col gap-2 flex-1">
            <h2 className="text-lg text-gray-700">Total Reviews</h2>
            <div className="flex items-center gap-4">
              <p className="text-2xl font-semibold text-gray-900">{reviews.length}</p>
              <span className="bg-green-100 text-green-700 rounded-full px-3 py-1 flex items-center gap-1 text-sm font-medium">
                +21% <TrendingUp size={16} />
              </span>
            </div>
            <span className="text-gray-500 text-sm">Growth Review in this year</span>
          </div>

          <div className="hidden md:flex items-center">
            <hr className="w-px h-full bg-gray-300" />
          </div>

          <div className="flex flex-col gap-2 flex-1">
            <h2 className="text-lg text-gray-700">Average Rating</h2>
            <div className="text-3xl font-bold flex items-center gap-3">
              <StarRating rating={averageRating} />
            </div>
            <span className="text-gray-500 text-sm">
              {averageRating.toFixed(1)} out of 5 this year
            </span>
          </div>

          <div className="hidden md:flex items-center">
            <hr className="w-px h-full bg-gray-300" />
          </div>

          <div className="flex-1">
            <RatingDistribution />
          </div>
        </section>

        {/* Review List */}
        <section className="overflow-y-scroll w-full flex justify-center items-center flex-col max-h-[100vh]">
          {reviews.map((item, index) => (
          <div
            key={index}
            className="w-full mx-auto p-6 rounded-xl shadow-md mt-5 mb-5 "
          >
            <div className="flex justify-between items-start gap-4 max-sm:flex-col max-sm:items-center">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gray-300 relative">
                  <Image
                    fill
                    src={item.avatar || "https://github.com/shadcn.png"}
                    alt="User Avatar"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-sm text-gray-500">
                    Total Reviews:
                    <span className="font-medium text-gray-800 ml-1">
                      {item.reviewCount}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <StarRating rating={item.rating} />
                <span className="text-sm text-gray-600">{item.date}</span>
              </div>
            </div>

            <div className="my-4 border-t border-gray-200" />
            <div className="text-gray-700 text-base italic leading-relaxed">
              “{item.comment}”
            </div>
          </div>
        ))}
        </section>
        

        {/* Form */}
        {session && (
          <section className="flex justify-center items-center w-full mt-6 ">
            <div className="grid w-full">
              <form onSubmit={handleSubmit}>
                <div className="flex justify-center items-center w-full space-x-4 max-sm:flex-col max-sm:space-x-0 max-sm:space-y-4">
                  <Textarea
                    placeholder="Type your message here..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <div className="flex flex-col items-center">
                    <StarInput rating={rating} setRating={setRating} />
                    <p className="text-sm text-gray-600">{rating} Stars</p>
                  </div>
                </div>

                {error && <p className="text-red-500 mt-2">{error}</p>}

                <Button className="mt-4" type="submit" disabled={loading}>
                  {loading ? "Submitting..." : "Add Comment"}
                </Button>
              </form>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}

export default RatingForm;
