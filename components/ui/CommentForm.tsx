"use client";

import React, { useState, useRef } from "react";
import { ProductComment } from "@/lib/types";
import { RatingStars } from "./RatingStars";
import { createClient } from "@/lib/supabase/client";
import { getViewerUserId } from "@/lib/viewer-session";
import { useRouter } from "next/navigation";

interface CommentFormProps {
  productId: string;
  existingComment?: ProductComment;
  onCommentAdded: () => void;
  isAuthenticated: boolean;
}

export function CommentForm({
  productId,
  existingComment,
  onCommentAdded,
  isAuthenticated,
}: CommentFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [rating, setRating] = useState<number>(existingComment?.rating || 0);
  const [comment, setComment] = useState(existingComment?.commentText || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Sync form when existingComment changes (pre-populate on edit)
  React.useEffect(() => {
    if (existingComment) {
      setRating(existingComment.rating || 0);
      setComment(existingComment.commentText || "");
    } else {
      // Clear form if no existing comment
      setRating(0);
      setComment("");
    }
  }, [
    existingComment?.id,
    existingComment?.commentText,
    existingComment?.rating,
  ]);

  if (!isAuthenticated) {
    return (
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900 mb-2">
          Sign in to rate and comment on this product.
        </p>
        <button
          onClick={() => router.push("/login")}
          className="text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          Sign in →
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Allow either rating or comment (not require both)
    if (rating === 0 && !comment.trim()) {
      setError("Please provide a rating or write a comment");
      return;
    }

    setIsSubmitting(true);

    try {
      const userId = await getViewerUserId(supabase);
      if (!userId) {
        router.push("/login");
        return;
      }

      const endpoint = existingComment ? "/api/comments" : "/api/comments";
      const method = existingComment ? "PATCH" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          rating,
          commentText: comment,
          commentId: existingComment?.id,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save comment");
      }

      setComment("");
      setRating(0);
      onCommentAdded();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="space-y-4 p-4 border border-zinc-200 rounded-lg bg-zinc-50"
    >
      <div>
        <label className="block text-sm font-semibold text-zinc-900 mb-2">
          {existingComment?.rating ? "Update your rating" : "Rate this product"}
        </label>
        <RatingStars
          rating={rating > 0 ? rating : null}
          count={0}
          onRate={setRating}
          interactive
          size="lg"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-zinc-900 mb-2">
          {existingComment?.commentText
            ? "Update your comment"
            : "Add a comment"}
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this product..."
          maxLength={1000}
          className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
          rows={4}
        />
        <p className="text-xs text-zinc-400 mt-1">
          {comment.length}/1000 characters
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          {error}
        </div>
      )}

      {rating > 0 && !comment.trim() && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
          💭 You might want to share your experience with a comment
        </div>
      )}

      {comment.trim() && rating === 0 && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
          ⭐ You might want to rate this product
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-4 py-2 bg-pink-500 hover:bg-pink-600 disabled:bg-zinc-300 text-white font-semibold rounded-lg transition-colors"
      >
        {isSubmitting
          ? "Saving..."
          : existingComment
            ? "Update"
            : rating > 0 && comment.trim()
              ? "Post rating & comment"
              : rating > 0
                ? "Post rating"
                : "Post comment"}
      </button>
    </form>
  );
}
