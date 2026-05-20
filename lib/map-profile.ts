import type { Seller } from "@/lib/types";

export function mapProfileRowToSeller(data: {
  id: string;
  username: string;
  full_name?: string | null;
  avatar_url?: string | null;
  role?: string | null;
  whatsapp_num?: string | null;
  messenger_url?: string | null;
  instagram_handle?: string | null;
  tiktok_handle?: string | null;
}): Seller {
  return {
    id: data.id,
    username: data.username,
    fullName: data.full_name ?? undefined,
    displayName: data.full_name || data.username,
    avatarUrl: data.avatar_url ?? undefined,
    role: data.role ?? undefined,
    whatsappNum: data.whatsapp_num,
    messengerUrl: data.messenger_url ?? undefined,
    instagramHandle: data.instagram_handle,
    tiktokHandle: data.tiktok_handle,
  };
}
