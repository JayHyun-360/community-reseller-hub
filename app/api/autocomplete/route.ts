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

    // Use server-side fuzzy RPC if available (pg_trgm similarity)
    const { data: rpcData, error: rpcError } = await supabase.rpc(
      "search_autocomplete",
      { q },
    );
    if (rpcError) {
      console.warn(
        "RPC search_autocomplete failed, falling back to ILIKE",
        rpcError,
      );
      const productsRes = await supabase
        .from("products")
        .select("id,title,images,price")
        .ilike("title", `%${q}%`)
        .limit(6);

      const sellersRes = await supabase
        .from("profiles")
        .select("id,username,full_name,avatar_url")
        .or(`username.ilike.%${q}%,full_name.ilike.%${q}%`)
        .eq("role", "seller")
        .limit(6);

      return NextResponse.json({
        products: productsRes.data ?? [],
        sellers: sellersRes.data ?? [],
      });
    }

    const products = [];
    const sellers = [];
    (rpcData || []).forEach((row: any) => {
      if (row.kind === "product") {
        products.push({
          id: row.id,
          title: row.title,
          images: row.images,
          price: row.price,
        });
      } else if (row.kind === "seller") {
        sellers.push({
          id: row.id,
          username: row.username,
          full_name: row.full_name,
          avatar_url: row.avatar_url,
        });
      }
    });

    return NextResponse.json({ products, sellers });
  } catch (error) {
    console.error("Autocomplete error", error);
    return NextResponse.json({ products: [], sellers: [] }, { status: 500 });
  }
}
