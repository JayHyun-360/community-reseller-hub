"use client";

import React, { useState, useEffect } from "react";
import { Product, ProductRatingSummary, ProductComment } from "@/lib/types";
import { RatingStars } from "./RatingStars";
import { CommentForm } from "./CommentForm";
import { CommentsList } from "./CommentsList";
import { Skeleton } from "./Skeleton";
import { createClient } from "@/lib/supabase/client";
import { getViewerUserId } from "@/lib/viewer-session";

interface CommentsTabProps {
  product: Product;
  viewerUserId?: string | null;
}

export function CommentsTab({
  product,
  viewerUserId: viewerUserIdProp,
}: CommentsTabProps) {
  const supabase = createClient();
  const [ratingSummary, setRatingSummary] =
    useState<ProductRatingSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewerUserId, setViewerUserId] = useState<string | null | undefined>(
    viewerUserIdProp,
  );
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    loadRatingSummary();
    getViewerUserId(supabase).then(setViewerUserId);
  }, [product.id]);

  const loadRatingSummary = async () => {
    setLoading(true);
    try {
      // Fetch product with ratings/comments
      const { data: productData, error: productError } = await supabase
        .from("products")
        .select("overall_rating,rating_count,comment_count")
        .eq("id", product.id)
        .single();

      if (productError) throw productError;

      // Debug: log what we received
      console.log("[CommentsTab] Product data:", {
        productId: product.id,
        overall_rating: productData.overall_rating,
        rating_count: productData.rating_count,
        comment_count: productData.comment_count,
      });

      // If aggregates are NULL/0, calculate them directly from source tables
      // (in case triggers haven't been set up yet)
      let finalRatingCount = productData.rating_count ?? 0;
      let finalOverallRating = productData.overall_rating ?? null;
      let finalCommentCount = productData.comment_count ?? 0;

      // If counts are 0, verify by querying the actual tables
      if (finalRatingCount === 0 || finalCommentCount === 0) {
        const [ratingsResult, commentsResult] = await Promise.all([
          supabase
            .from("product_ratings")
            .select("id", { count: "exact", head: true })
            .eq("product_id", product.id),
          supabase
            .from("product_comments")
            .select("id", { count: "exact", head: true })
            .eq("product_id", product.id),
        ]);

        if (!ratingsResult.error && ratingsResult.count !== null) {
          finalRatingCount = ratingsResult.count;
          console.log(
            "[CommentsTab] Actual rating count from table:",
            finalRatingCount,
          );
        }

        if (!commentsResult.error && commentsResult.count !== null) {
          finalCommentCount = commentsResult.count;
          console.log(
            "[CommentsTab] Actual comment count from table:",
            finalCommentCount,
          );
        }

        // If we found ratings, calculate the actual average
        if (finalRatingCount > 0) {
          const { data: ratingsData, error: ratingsError } = await supabase
            .from("product_ratings")
            .select("rating")
            .eq("product_id", product.id);

          if (!ratingsError && ratingsData && ratingsData.length > 0) {
            const sum = ratingsData.reduce((acc, r: any) => acc + r.rating, 0);
            finalOverallRating =
              Math.round((sum / ratingsData.length) * 10) / 10; // Round to 1 decimal
            console.log(
              "[CommentsTab] Calculated average rating:",
              finalOverallRating,
            );
          }
        }
      }

      // Fetch current user's comment and rating if exists
      const userId = await getViewerUserId(supabase);
      let userComment: ProductComment | undefined;
      let userRating: number | undefined;

      if (userId) {
        // Fetch rating first
        const { data: ratingData, error: ratingError } = await supabase
          .from("product_ratings")
          .select("rating")
          .eq("product_id", product.id)
          .eq("user_id", userId)
          .maybeSingle();

        if (!ratingError && ratingData) {
          userRating = ratingData.rating;
        }

        // Then fetch comment
        const { data: commentData, error: commentError } = await supabase
          .from("product_comments")
          .select("id,user_id,product_id,comment_text,created_at,updated_at")
          .eq("product_id", product.id)
          .eq("user_id", userId)
          .maybeSingle();

        if (!commentError && commentData) {
          userComment = {
            id: commentData.id,
            userId: commentData.user_id,
            productId: commentData.product_id,
            commentText: commentData.comment_text,
            createdAt: commentData.created_at,
            updatedAt: commentData.updated_at,
            rating: userRating,
          };
        } else if (userRating && !userComment) {
          // User has a rating but no comment yet - create a synthetic comment object
          // so the form can still show the pre-filled rating
          userComment = {
            id: "", // Empty ID indicates this is a synthetic object
            userId: userId,
            productId: product.id,
            commentText: "", // No comment text yet
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            rating: userRating,
          };
        }
      }

      setRatingSummary({
        overallRating: finalOverallRating,
        ratingCount: finalRatingCount,
        commentCount: finalCommentCount,
        userRating,
        userComment,
      });
    } catch (err) {
      console.error("Error loading rating summary:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentAdded = () => {
    // Wait a bit for triggers to execute, then refetch fresh data
    setTimeout(() => {
      loadRatingSummary().then(() => {
        // Update refresh key AFTER new data is loaded
        setRefreshKey((prev) => prev + 1);
      });
    }, 500);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 rounded-lg" />
        <Skeleton className="h-40 rounded-lg" />
        <Skeleton className="h-64 rounded-lg" />
      </div>
    );
  }

  if (!ratingSummary) {
    return (
      <div className="py-8 text-center text-sm text-zinc-400">
        Unable to load comments
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Rating Summary */}
      <div className="p-4 bg-gradient-to-br from-amber-50 to-pink-50 border border-amber-100 rounded-lg">
        <h3 className="text-sm font-bold text-zinc-900 mb-3">
          Customer Ratings
        </h3>
        <RatingStars
          rating={ratingSummary.overallRating}
          count={ratingSummary.ratingCount}
          interactive={false}
          size="lg"
        />
      </div>

      {/* User's Comment Form */}
      {viewerUserId && (
        <div>
          <h3 className="text-sm font-bold text-zinc-900 mb-3">
            {ratingSummary.userComment
              ? "Update your review"
              : "Share your review"}
          </h3>
          <CommentForm
            key={`form-${refreshKey}`}
            productId={product.id}
            existingComment={ratingSummary.userComment}
            onCommentAdded={handleCommentAdded}
            isAuthenticated={true}
          />
        </div>
      )}

      {!viewerUserId && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900 mb-2">
            Sign in to rate and comment on this product.
          </p>
          <a
            href="/login"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Sign in →
          </a>
        </div>
      )}

      {/* All Comments */}
      <div>
        <h3 className="text-sm font-bold text-zinc-900 mb-3">
          Comments ({ratingSummary.commentCount})
        </h3>
        <CommentsList
          key={`list-${refreshKey}`}
          productId={product.id}
          onCommentDeleted={handleCommentAdded}
          viewerUserId={viewerUserId}
          refreshKey={refreshKey}
        />
      </div>
    </div>
  );
}
