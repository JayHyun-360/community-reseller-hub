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

    if (!productId || !rating || !commentText) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 },
      );
    }

    if (commentText.trim().length === 0) {
      return NextResponse.json(
        { error: "Comment cannot be empty" },
        { status: 400 },
      );
    }

    // First, upsert the rating
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

    let commentResult;
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

    return NextResponse.json(
      { success: true, data: commentResult.data },
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

    if (!commentId || !rating || !commentText) {
      return NextResponse.json(
        { error: "Missing required fields" },
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

    // Update rating
    const { error: ratingError } = await supabase
      .from("product_ratings")
      .update({
        rating,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .eq("product_id", comment.product_id);

    if (ratingError) {
      console.error("Rating error:", ratingError);
      return NextResponse.json(
        { error: "Failed to update rating" },
        { status: 500 },
      );
    }

    // Update comment
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

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
