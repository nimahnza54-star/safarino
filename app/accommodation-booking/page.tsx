import { Metadata } from "next";
import AccommodationBookingClient from "./client";

export const metadata: Metadata = {
  title: "رزرو ویلا و اقامتگاه - سفرینو",
  description: "رزرو ویلا، سوئیت و اقامتگاه بوم‌گردی در سفرینو",
};

export default function AccommodationBookingPage() {
  return <AccommodationBookingClient />;
}
