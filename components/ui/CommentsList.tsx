"use client";

import React, { useState, useEffect } from "react";
import { ProductComment, Seller } from "@/lib/types";
import { RatingStars } from "./RatingStars";
import { Skeleton } from "./Skeleton";
import { createClient } from "@/lib/supabase/client";
import { mapProfileRowToSeller } from "@/lib/map-profile";

interface CommentsListProps {
  productId: string;
  onCommentDeleted?: () => void;
  viewerUserId?: string | null;
  refreshKey?: number;
}

const COMMENTS_PER_PAGE = 5;

export function CommentsList({
  productId,
  onCommentDeleted,
  viewerUserId,
  refreshKey = 0,
}: CommentsListProps) {
  const supabase = createClient();
  const [comments, setComments] = useState<ProductComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    loadComments(0);
  }, [productId, refreshKey]);

  const loadComments = async (pageNum: number) => {
    setLoading(true);
    try {
      const offset = pageNum * COMMENTS_PER_PAGE;

      // Fetch comments with pagination
      const { data: commentsData, error: commentsError } = await supabase
        .from("product_comments")
        .select("id,user_id,product_id,comment_text,created_at,updated_at")
        .eq("product_id", productId)
        .order("created_at", { ascending: false })
        .range(offset, offset + COMMENTS_PER_PAGE);

      if (commentsError) throw commentsError;

      // Fetch ratings for these comments
      const { data: ratingsData, error: ratingsError } = await supabase
        .from("product_ratings")
        .select("user_id,rating")
        .eq("product_id", productId);

      if (ratingsError) throw ratingsError;

      // Create map of user ratings
      const ratingMap = new Map(
        ratingsData?.map((r: any) => [r.user_id, r.rating]) || [],
      );

      // Fetch user profiles for comments
      const userIds = commentsData?.map((c: any) => c.user_id) || [];
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id,username,full_name,avatar_url")
        .in("id", userIds);

      if (profilesError) throw profilesError;

      // Create map of profiles
      const profileMap = new Map(
        profilesData?.map((p: any) => [p.id, mapProfileRowToSeller(p)]) || [],
      );

      // Combine data
      const processedComments =
        commentsData?.map((c: any) => ({
          id: c.id,
          userId: c.user_id,
          productId: c.product_id,
          commentText: c.comment_text,
          createdAt: c.created_at,
          updatedAt: c.updated_at,
          author: profileMap.get(c.user_id),
          rating: ratingMap.get(c.user_id),
        })) || [];

      if (pageNum === 0) {
        setComments(processedComments);
      } else {
        setComments((prev) => [...prev, ...processedComments]);
      }

      setPage(pageNum);
      setHasMore((commentsData?.length || 0) === COMMENTS_PER_PAGE + 1);
    } catch (err) {
      console.error("Error loading comments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from("product_comments")
        .delete()
        .eq("id", commentId);

      if (error) throw error;

      setComments((prev) => prev.filter((c) => c.id !== commentId));
      onCommentDeleted?.();
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  if (loading && comments.length === 0) {
    return (
      <div className="space-y-4">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm text-zinc-400">
          No comments yet. Be the first to share your thoughts!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="p-4 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors"
        >
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {comment.author?.avatarUrl && (
                <img
                  src={comment.author.avatarUrl}
                  alt={comment.author.displayName}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-zinc-900 truncate">
                  {comment.author?.displayName || "Anonymous"}
                </p>
                <p className="text-xs text-zinc-500">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {viewerUserId === comment.userId && (
              <button
                onClick={() => handleDeleteComment(comment.id)}
                className="text-xs text-red-600 hover:text-red-700 font-semibold flex-shrink-0"
              >
                Delete
              </button>
            )}
          </div>

          {comment.rating && (
            <div className="mb-2">
              <RatingStars
                rating={comment.rating}
                count={0}
                interactive={false}
                size="sm"
              />
            </div>
          )}

          <p className="text-sm text-zinc-700 whitespace-pre-wrap break-words">
            {comment.commentText}
          </p>
        </div>
      ))}

      {hasMore && (
        <button
          onClick={() => loadComments(page + 1)}
          disabled={loading}
          className="w-full py-2 text-sm font-semibold text-pink-600 hover:text-pink-700 disabled:text-zinc-400"
        >
          {loading ? "Loading..." : "Load more comments"}
        </button>
      )}
    </div>
  );
}
