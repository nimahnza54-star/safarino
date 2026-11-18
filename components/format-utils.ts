import { toPersianNumerals } from "@/components/jalali-utils";

const faNumber = new Intl.NumberFormat("fa-IR", {
  maximumFractionDigits: 0,
});

/** «۴٬۸۰۰٬۰۰۰ تومان» */
export function formatToman(amount: number): string {
  return `${faNumber.format(amount)} تومان`;
}

/** «۴٫۸» */
export function formatRating(rating: number): string {
  return new Intl.NumberFormat("fa-IR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(rating);
}

/** «۱٬۲۸۴» */
export function formatCount(count: number): string {
  return faNumber.format(count);
}

/** «۱۵٪» */
export function formatPercent(percent: number): string {
  return `${toPersianNumerals(percent)}٪`;
}
