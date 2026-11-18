import type { Hotel } from "../types/hotel";
import type { SearchCriteria } from "../types/search";

/**
 * Pure business logic — no I/O, no mock imports.
 * Kept dependency-free so it can be unit-tested with the built-in
 * Node test runner (see tests/).
 */

/** Normalize Persian/Arabic text for robust matching. */
export function normalizeFa(text: string): string {
  return text
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/ة/g, "ه")
    .replace(/[‌‎‏]/g, "")
    .toLowerCase()
    .trim();
}

/** Destination match: hotel name, location or city label vs. free-text query. */
export function matchesDestination(hotel: Hotel, rawQuery: string): boolean {
  const query = normalizeFa(rawQuery);
  if (!query) return true;

  const tokens = query
    .split(/[،,]/)
    .map((t) => t.trim())
    .filter(Boolean);
  const haystacks = [
    normalizeFa(hotel.name),
    normalizeFa(hotel.location),
    normalizeFa(hotel.cityLabel),
  ];

  return tokens.some(
    (token) =>
      haystacks.some((h) => h.includes(token)) ||
      haystacks.some((h) => token.includes(h))
  );
}

/** Capacity check: rooms × per-room capacity must fit the party. */
export function fitsCapacity(hotel: Hotel, criteria: SearchCriteria): boolean {
  const guests = criteria.adults + criteria.children;
  const rooms = Math.max(1, criteria.rooms);
  return hotel.maxGuests * rooms >= guests;
}

/** Final nightly price after a percentage discount (rounded to toman). */
export function computeFinalPrice(price: number, discountPercent: number): number {
  if (discountPercent <= 0) return price;
  if (discountPercent >= 100) return 0;
  return Math.round(price * (1 - discountPercent / 100));
}

/** True when the campaign has an expiration timestamp in the past. */
export function isCampaignExpired(
  campaign: { expiresAt?: string },
  now: number = Date.now()
): boolean {
  return campaign.expiresAt !== undefined
    ? new Date(campaign.expiresAt).getTime() <= now
    : false;
}

/** Milliseconds remaining until expiry (0 when expired). */
export function getCampaignRemainingMs(
  expiresAt: string,
  now: number = Date.now()
): number {
  return Math.max(0, new Date(expiresAt).getTime() - now);
}
