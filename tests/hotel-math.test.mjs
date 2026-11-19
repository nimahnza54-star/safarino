import test from "node:test";
import assert from "node:assert/strict";

import hotelMath from "../.test-build/services/hotel-math.js";

const {
  normalizeFa,
  matchesDestination,
  fitsCapacity,
  computeFinalPrice,
  isCampaignExpired,
  getCampaignRemainingMs,
} = hotelMath;

/** Minimal hotel fixtures mirroring the real dataset shape. */
const tehranHotel = {
  id: "hotel-tehran-01",
  name: "هتل اسپیناس پالاس",
  city: "tehran",
  cityLabel: "تهران",
  location: "تهران، سعادت‌آباد",
  rating: 4.8,
  reviewCount: 1284,
  pricePerNight: 4_800_000,
  description: "desc",
  image: "/assets/hotel-tehran-01.jpg",
  maxGuests: 6,
  amenities: [],
};

const kishHotel = {
  ...tehranHotel,
  id: "hotel-kish-01",
  name: "هتل مرجان کیش",
  city: "kish",
  cityLabel: "کیش",
  location: "جزیره کیش، بلوار مرجان",
  pricePerNight: 5_500_000,
  maxGuests: 5,
};

test("normalizeFa unifies Arabic and Persian characters and strips ZWNJ", () => {
  assert.equal(normalizeFa("تهران ‌"), "تهران");
  assert.equal(normalizeFa("كيش"), "کیش");
  assert.equal(normalizeFa("يزد"), "یزد");
  assert.equal(normalizeFa("قشم، بلوار"), "قشم، بلوار");
});

test("matchesDestination filters hotels by Persian city name", () => {
  assert.equal(matchesDestination(tehranHotel, "تهران"), true);
  assert.equal(matchesDestination(tehranHotel, "کیش"), false);
  assert.equal(matchesDestination(kishHotel, "کیش"), true);
  assert.equal(matchesDestination(kishHotel, "جزیره کیش"), true);
});

test("matchesDestination matches by hotel name and empty query matches all", () => {
  assert.equal(matchesDestination(tehranHotel, "هتل اسپیناس پالاس، تهران"), true);
  assert.equal(matchesDestination(kishHotel, "هتل اسپیناس پالاس، تهران"), false);
  assert.equal(matchesDestination(tehranHotel, ""), true);
});

test("matchesDestination tolerates Arabic-typed input", () => {
  assert.equal(matchesDestination(kishHotel, "كيش"), true); // Arabic kaf
});

test("fitsCapacity enforces guests against rooms × per-room capacity", () => {
  const base = { destination: "", checkIn: null, checkOut: null };
  assert.equal(
    fitsCapacity(tehranHotel, { ...base, adults: 2, children: 1, rooms: 1 }),
    true
  );
  assert.equal(
    fitsCapacity(tehranHotel, { ...base, adults: 9, children: 0, rooms: 1 }),
    false
  );
  assert.equal(
    fitsCapacity(tehranHotel, { ...base, adults: 9, children: 0, rooms: 2 }),
    true // 6 per room × 2 rooms = 12 ≥ 9
  );
  assert.equal(
    fitsCapacity(kishHotel, { ...base, adults: 6, children: 0, rooms: 1 }),
    false // kish hotel sleeps 5 per room
  );
});

test("computeFinalPrice applies percentage discounts with rounding", () => {
  assert.equal(computeFinalPrice(4_800_000, 15), 4_080_000);
  assert.equal(computeFinalPrice(2_400_000, 10), 2_160_000);
  assert.equal(computeFinalPrice(5_500_000, 30), 3_850_000);
  assert.equal(computeFinalPrice(1_900_000, 10), 1_710_000);
});

test("computeFinalPrice handles boundary percentages", () => {
  assert.equal(computeFinalPrice(2_000_000, 0), 2_000_000);
  assert.equal(computeFinalPrice(2_000_000, 100), 0);
  assert.equal(computeFinalPrice(2_000_000, -5), 2_000_000);
  assert.equal(computeFinalPrice(2_000_000, 150), 0);
});

test("isCampaignExpired is false for future timestamps and non-timed campaigns", () => {
  const future = new Date(Date.now() + 60_000).toISOString();
  const past = new Date(Date.now() - 60_000).toISOString();
  assert.equal(isCampaignExpired({ expiresAt: future }), false);
  assert.equal(isCampaignExpired({ expiresAt: past }), true);
  assert.equal(isCampaignExpired({}), false); // evergreen campaign
});

test("getCampaignRemainingMs returns positive remainder and clamps at zero", () => {
  const now = Date.now();
  const target = new Date(now + 90_000).toISOString();
  const remaining = getCampaignRemainingMs(target, now);
  assert.ok(remaining > 0 && remaining <= 90_000);
  assert.equal(getCampaignRemainingMs(new Date(now - 1_000).toISOString(), now), 0);
});
