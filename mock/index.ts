/**
 * Central mock barrel — single entry point for all frontend mock data.
 * UI components must import from `@/mock` (or `@/services`), never
 * from individual mock file paths, so the backend swap is a one-line change.
 */
export * from "./hotels/hotels.mock";
export * from "./hotels/hotel-categories.mock";
export * from "./campaigns/campaigns.mock";
export * from "./destinations/destinations.mock";
export * from "./content/platform-features.mock";
export * from "./content/travel-card.mock";
export * from "./content/app-download.mock";
export * from "./content/footer.mock";
export * from "./content/faqs.mock";
export * from "./content/blog-posts.mock";
export * from "./content/site-content.mock";
