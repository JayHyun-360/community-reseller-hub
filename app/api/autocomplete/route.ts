import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") || "").trim();
    const supabase = await createClient();

    if (!q) {
      return NextResponse.json({ products: [], sellers: [] });
    }

    // Simple ILIKE-based suggestions for now
    const productsPromise = supabase
      .from("products")
      .select("id,title,images,price")
      .ilike("title", `%${q}%`)
      .limit(6);

    const sellersPromise = supabase
      .from("profiles")
      .select("id,username,full_name,avatar_url")
      .or(`username.ilike.%${q}%,full_name.ilike.%${q}%`)
      .eq("role", "seller")
      .limit(6);

    const [productsRes, sellersRes] = await Promise.all([
      productsPromise,
      sellersPromise,
    ]);

    return NextResponse.json({
      products: productsRes.data ?? [],
      sellers: sellersRes.data ?? [],
    });
  } catch (error) {
    console.error("Autocomplete error", error);
    return NextResponse.json({ products: [], sellers: [] }, { status: 500 });
  }
}
