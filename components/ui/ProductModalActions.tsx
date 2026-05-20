"use client";

import { useRouter } from "next/navigation";
import {
  MessageCircle,
  Share2,
  ExternalLink,
  Phone,
  Instagram,
  Video,
  Heart,
  Pencil,
  Link2,
} from "lucide-react";
import type { Seller } from "@/lib/types";
import {
  ACCOUNT_CONTACTS_PATH,
  sellerHasContact,
} from "@/lib/seller-contacts";
import {
  getPreferredPlatform,
  setMessagingPreference,
} from "@/lib/messaging-preference";

interface VisitorActionsProps {
  seller: Seller | null;
  hasContact: boolean;
  showDropdown: boolean;
  showContactMenu: boolean;
  setShowContactMenu: (open: boolean) => void;
  preferredPlatform: ReturnType<typeof getPreferredPlatform>;
  onMessage: (via: "messenger" | "whatsapp" | "instagram" | "tiktok") => void;
  isLiked: boolean;
  likeCount: number;
  onLike: () => void;
  onShare: () => void;
  onVisitSeller: () => void;
  showVisitSeller: boolean;
  sellerLoading: boolean;
}

export function VisitorProductActions({
  seller,
  hasContact,
  showDropdown,
  showContactMenu,
  setShowContactMenu,
  preferredPlatform,
  onMessage,
  isLiked,
  likeCount,
  onLike,
  onShare,
  onVisitSeller,
  showVisitSeller,
  sellerLoading,
}: VisitorActionsProps) {
  const hasMessenger = !!seller?.messengerUrl;
  const hasWhatsApp = !!seller?.whatsappNum;
  const hasInstagram = !!seller?.instagramHandle;
  const hasTikTok = !!seller?.tiktokHandle;

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={onLike}
          className={`w-full sm:flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl sm:rounded-full font-black text-sm transition-colors shadow-lg ${
            isLiked
              ? "bg-rose-500 text-white hover:bg-rose-600"
              : "bg-zinc-900 text-white hover:bg-zinc-800"
          }`}
        >
          <Heart className={`w-5 h-5 ${isLiked ? "fill-white" : ""}`} />
          {likeCount}
        </button>
        {sellerLoading ? (
          <button
            disabled
            className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3.5 bg-zinc-100 rounded-2xl sm:rounded-full font-black text-sm text-zinc-400 cursor-not-allowed"
          >
            <MessageCircle className="w-5 h-5 animate-pulse" />
            Loading...
          </button>
        ) : hasContact ? (
          showDropdown ? (
            <div className="w-full sm:flex-1 relative">
              <button
                onClick={() => setShowContactMenu(!showContactMenu)}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-zinc-100 hover:bg-zinc-200 rounded-2xl sm:rounded-full font-black text-sm text-zinc-900 transition-colors shadow-lg"
              >
                <MessageCircle className="w-5 h-5" />
                Message
              </button>
              {showContactMenu && (
                <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-xl shadow-lg border border-zinc-100 overflow-hidden z-50">
                  {hasMessenger && (
                    <button
                      onClick={() => {
                        onMessage("messenger");
                        setMessagingPreference("messenger");
                      }}
                      className="flex items-center justify-center gap-2 px-4 py-3 hover:bg-zinc-50 w-full text-left text-sm font-medium text-zinc-900"
                    >
                      <MessageCircle className="w-4 h-4 text-[#0084FF]" />
                      Messenger
                      {preferredPlatform === "messenger" && (
                        <div className="ml-auto w-2 h-2 bg-zinc-900 rounded-full" />
                      )}
                    </button>
                  )}
                  {hasWhatsApp && (
                    <button
                      onClick={() => {
                        onMessage("whatsapp");
                        setMessagingPreference("whatsapp");
                      }}
                      className="flex items-center justify-center gap-2 px-4 py-3 hover:bg-zinc-50 w-full text-left text-sm font-medium text-zinc-900"
                    >
                      <Phone className="w-4 h-4 text-[#25D366]" />
                      WhatsApp
                      {preferredPlatform === "whatsapp" && (
                        <div className="ml-auto w-2 h-2 bg-zinc-900 rounded-full" />
                      )}
                    </button>
                  )}
                  {hasInstagram && (
                    <button
                      onClick={() => onMessage("instagram")}
                      className="flex items-center justify-center gap-2 px-4 py-3 hover:bg-zinc-50 w-full text-left text-sm font-medium text-zinc-900"
                    >
                      <Instagram className="w-4 h-4 text-[#E1306C]" />
                      Instagram
                    </button>
                  )}
                  {hasTikTok && (
                    <button
                      onClick={() => onMessage("tiktok")}
                      className="flex items-center justify-center gap-2 px-4 py-3 hover:bg-zinc-50 w-full text-left text-sm font-medium text-zinc-900"
                    >
                      <Video className="w-4 h-4 text-black" />
                      TikTok
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() =>
                onMessage(
                  preferredPlatform ||
                    (hasMessenger ? "messenger" : "whatsapp"),
                )
              }
              className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3.5 bg-zinc-100 hover:bg-zinc-200 rounded-2xl sm:rounded-full font-black text-sm text-zinc-900 transition-colors shadow-lg"
            >
              <MessageCircle className="w-5 h-5" />
              Message
            </button>
          )
        ) : (
          <button
            disabled
            className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3.5 bg-zinc-100 rounded-2xl sm:rounded-full font-black text-sm text-zinc-400 cursor-not-allowed"
          >
            <MessageCircle className="w-5 h-5" />
            No Contact
          </button>
        )}
      </div>
      <div
        className={`grid gap-3 ${showVisitSeller ? "grid-cols-2" : "grid-cols-1"}`}
      >
        <button
          onClick={onShare}
          className="flex items-center justify-center gap-2 py-3.5 bg-zinc-100 hover:bg-zinc-200 rounded-2xl sm:rounded-full font-black text-sm text-zinc-900 transition-colors"
        >
          <Share2 className="w-5 h-5 shrink-0" />
          Share
        </button>
        {showVisitSeller && (
          <button
            onClick={onVisitSeller}
            disabled={!seller?.username}
            className="flex items-center justify-center gap-2 py-3.5 bg-zinc-100 hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl sm:rounded-full font-black text-sm text-zinc-900 transition-colors"
          >
            <ExternalLink className="w-5 h-5 shrink-0" />
            <span className="truncate">{seller ? "Visit store" : "..."}</span>
          </button>
        )}
      </div>
    </div>
  );
}

interface OwnerActionsProps {
  productId: string;
  likeCount: number;
  hasContact: boolean;
  onShare: () => void;
  onVisitStorefront: () => void;
  showVisitStorefront: boolean;
}

export function OwnerProductActions({
  productId,
  likeCount,
  hasContact,
  onShare,
  onVisitStorefront,
  showVisitStorefront,
}: OwnerActionsProps) {
  const router = useRouter();
  const canEdit = productId !== "preview";

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-zinc-100 text-zinc-600 font-black text-sm w-full">
        <Heart className="w-5 h-5 fill-rose-500 text-rose-500 shrink-0" />
        <span>
          {likeCount} {likeCount === 1 ? "like" : "likes"}
        </span>
      </div>

      <div
        className={`grid gap-3 ${canEdit ? "grid-cols-2" : "grid-cols-1"}`}
      >
        {canEdit && (
          <button
            onClick={() => router.push(`/dashboard/products/${productId}`)}
            className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 py-3.5 bg-zinc-900 text-white hover:bg-zinc-800 rounded-2xl sm:rounded-full font-black text-xs sm:text-sm transition-colors shadow-lg min-h-[3.25rem]"
          >
            <Pencil className="w-5 h-5 shrink-0" />
            <span>Edit</span>
          </button>
        )}
        <button
          onClick={() => router.push(ACCOUNT_CONTACTS_PATH)}
          className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 py-3.5 rounded-2xl sm:rounded-full font-black text-xs sm:text-sm transition-colors shadow-lg min-h-[3.25rem] ${
            canEdit ? "" : "col-span-1"
          } ${
            hasContact
              ? "bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
              : "bg-amber-500 text-white hover:bg-amber-600"
          }`}
        >
          <Link2 className="w-5 h-5 shrink-0" />
          <span className="text-center leading-tight">
            {hasContact ? (
              <>
                <span className="sm:hidden">Manage</span>
                <span className="hidden sm:inline">Manage links</span>
              </>
            ) : (
              "Add links"
            )}
          </span>
        </button>
      </div>

      <div
        className={`grid gap-3 ${showVisitStorefront ? "grid-cols-2" : "grid-cols-1"}`}
      >
        <button
          onClick={onShare}
          className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 py-3.5 bg-zinc-100 hover:bg-zinc-200 rounded-2xl sm:rounded-full font-black text-xs sm:text-sm text-zinc-900 transition-colors min-h-[3.25rem]"
        >
          <Share2 className="w-5 h-5 shrink-0" />
          <span>Share</span>
        </button>
        {showVisitStorefront && (
          <button
            onClick={onVisitStorefront}
            className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 py-3.5 bg-zinc-100 hover:bg-zinc-200 rounded-2xl sm:rounded-full font-black text-xs sm:text-sm text-zinc-900 transition-colors min-h-[3.25rem]"
          >
            <ExternalLink className="w-5 h-5 shrink-0" />
            <span className="text-center leading-tight">
              <span className="sm:hidden">Store</span>
              <span className="hidden sm:inline">View storefront</span>
            </span>
          </button>
        )}
      </div>

      {!hasContact && (
        <p className="text-xs text-amber-800 bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3 text-center font-medium leading-relaxed">
          Add Messenger, WhatsApp, or social links so buyers can reach you.
        </p>
      )}
    </div>
  );
}
