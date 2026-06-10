import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (cookiesToSet) => {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          },
        },
      },
    );

    // Get authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { productId, rating, commentText } = body;

    // Require productId and either rating (1-5) or comment
    if (!productId) {
      return NextResponse.json(
        { error: "Missing product ID" },
        { status: 400 },
      );
    }

    // Fetch product to get seller_id
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("seller_id")
      .eq("id", productId)
      .single();

    if (productError || !product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Prevent product owner from rating/commenting on their own product
    if (product.seller_id === user.id) {
      return NextResponse.json(
        { error: "You cannot rate or comment on your own product" },
        { status: 403 },
      );
    }

    // Check if at least one of rating or comment is provided
    const hasValidRating =
      rating !== undefined && rating !== null && rating >= 1 && rating <= 5;
    const hasValidComment = commentText?.trim();

    if (!hasValidRating && !hasValidComment) {
      return NextResponse.json(
        { error: "Please provide a rating or comment" },
        { status: 400 },
      );
    }

    // If rating is provided, validate it
    if (rating !== undefined && rating !== null) {
      if (rating < 1 || rating > 5) {
        return NextResponse.json(
          { error: "Rating must be between 1 and 5" },
          { status: 400 },
        );
      }

      // Upsert the rating
      const { error: ratingError } = await supabase
        .from("product_ratings")
        .upsert(
          {
            user_id: user.id,
            product_id: productId,
            rating,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id,product_id" },
        );

      if (ratingError) {
        console.error("Rating error:", ratingError);
        return NextResponse.json(
          { error: "Failed to save rating" },
          { status: 500 },
        );
      }
    }

    // If comment is provided, save or update it
    let commentResult = null;
    if (commentText?.trim()) {
      // Check if comment already exists
      const { data: existingComment, error: checkError } = await supabase
        .from("product_comments")
        .select("id")
        .eq("product_id", productId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (checkError) {
        console.error("Check error:", checkError);
        return NextResponse.json(
          { error: "Failed to check comment" },
          { status: 500 },
        );
      }

      if (existingComment) {
        // Update existing comment
        commentResult = await supabase
          .from("product_comments")
          .update({
            comment_text: commentText,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingComment.id)
          .select()
          .single();
      } else {
        // Insert new comment
        commentResult = await supabase
          .from("product_comments")
          .insert({
            user_id: user.id,
            product_id: productId,
            comment_text: commentText,
          })
          .select()
          .single();
      }

      if (commentResult.error) {
        console.error("Comment error:", commentResult.error);
        return NextResponse.json(
          { error: "Failed to save comment" },
          { status: 500 },
        );
      }
    }

    return NextResponse.json(
      { success: true, data: commentResult || { message: "Rating saved" } },
      { status: 200 },
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (cookiesToSet) => {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          },
        },
      },
    );

    // Get authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { commentId, rating, commentText } = body;

    // Require commentId for PATCH
    if (!commentId) {
      return NextResponse.json(
        { error: "Missing comment ID" },
        { status: 400 },
      );
    }

    // Verify user owns this comment
    const { data: comment, error: fetchError } = await supabase
      .from("product_comments")
      .select("user_id,product_id")
      .eq("id", commentId)
      .single();

    if (fetchError || !comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    if (comment.user_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const productId = comment.product_id;

    // Fetch product to verify it still exists and get seller info
    const { data: product, error: productFetchError } = await supabase
      .from("products")
      .select("seller_id")
      .eq("id", productId)
      .single();

    if (productFetchError || !product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Check if at least one of rating or comment is being updated
    // Note: We allow updating ONLY the rating OR ONLY the comment without requiring the other
    const hasValidRating =
      rating !== undefined && rating !== null && rating >= 1 && rating <= 5;
    const hasValidComment =
      commentText !== undefined &&
      commentText !== null &&
      commentText.trim() !== "";

    if (!hasValidRating && !hasValidComment) {
      return NextResponse.json(
        { error: "Please provide a rating or comment to update" },
        { status: 400 },
      );
    }

    // Update rating if provided
    if (rating !== undefined && rating !== null) {
      if (rating < 1 || rating > 5) {
        return NextResponse.json(
          { error: "Rating must be between 1 and 5" },
          { status: 400 },
        );
      }

      const { error: ratingError } = await supabase
        .from("product_ratings")
        .upsert(
          {
            user_id: user.id,
            product_id: productId,
            rating,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id,product_id" },
        );

      if (ratingError) {
        console.error("Rating error:", ratingError);
        return NextResponse.json(
          { error: "Failed to update rating" },
          { status: 500 },
        );
      }
    }

    // Update comment if provided
    if (commentText?.trim()) {
      const { error: commentError } = await supabase
        .from("product_comments")
        .update({
          comment_text: commentText,
          updated_at: new Date().toISOString(),
        })
        .eq("id", commentId);

      if (commentError) {
        console.error("Comment error:", commentError);
        return NextResponse.json(
          { error: "Failed to update comment" },
          { status: 500 },
        );
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
