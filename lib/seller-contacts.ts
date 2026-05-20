import type { Seller } from "@/lib/types";

export const SELLER_CONTACTS_HASH = "seller-contacts";
export const ACCOUNT_CONTACTS_PATH = `/account#${SELLER_CONTACTS_HASH}`;

type SellerContactFields = Pick<
  Seller,
  "messengerUrl" | "whatsappNum" | "instagramHandle" | "tiktokHandle"
>;

export function sellerHasContact(
  seller: SellerContactFields | null | undefined,
): boolean {
  if (!seller) return false;
  return !!(
    seller.messengerUrl ||
    seller.whatsappNum ||
    seller.instagramHandle ||
    seller.tiktokHandle
  );
}

export function isProductOwner(
  viewerId: string | null | undefined,
  productSellerId: string | null | undefined,
): boolean {
  if (!viewerId || !productSellerId) return false;
  return viewerId === productSellerId;
}
