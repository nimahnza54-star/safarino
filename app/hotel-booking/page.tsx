import { Metadata } from "next";
import HotelBookingClient from "./client";

export const metadata: Metadata = {
  title: "رزرو هتل - سفرینو",
  description: "رزرو آنلاین هتل، بلیط هواپیما و اقامتگاه با سفرینو",
};

export default function HotelBookingPage() {
  return <HotelBookingClient />;
}
