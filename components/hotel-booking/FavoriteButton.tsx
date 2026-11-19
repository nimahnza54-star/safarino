"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";

interface FavoriteButtonProps {
  hotelId: string;
  hotelName: string;
  /** Positioning/extra classes appended to the shared button styles. */
  className?: string;
}

/**
 * Shared wishlist toggle used by every hotel card. Keeps the favorites
 * store (FavoritesProvider/localStorage) and its accessible semantics in
 * one place so all hearts behave and look identically across the page.
 *
 * Inactive: outlined heart with a neutral color.
 * Active: filled heart in Safarino pink.
 */
export function FavoriteButton({
  hotelId,
  hotelName,
  className = "",
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite, hydrated } = useFavorites();
  const favorite = hydrated && isFavorite(hotelId);

  return (
    <button
      type="button"
      onClick={() => toggleFavorite(hotelId)}
      aria-pressed={favorite}
      aria-label={
        favorite
          ? `${hotelName} از علاقه‌مندی‌ها حذف شود`
          : `${hotelName} به علاقه‌مندی‌ها افزوده شود`
      }
      title={favorite ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
      className={`w-8 h-8 rounded-full bg-white/85 hover:bg-white flex items-center justify-center transition shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e21b5b] ${className}`}
    >
      <Heart
        aria-hidden="true"
        strokeWidth={2}
        className={`h-4 w-4 transition-colors ${
          favorite
            ? "fill-[#e21b5b] text-[#e21b5b]"
            : "fill-transparent text-gray-600"
        }`}
      />
    </button>
  );
}
