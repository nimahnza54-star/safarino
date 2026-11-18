import type { DestinationOption } from "@/types/hotel";

/**
 * Sample dataset of hotels and accommodations across Iranian cities.
 * Used by the destination dropdown and the hotel search filter.
 * Replace with backend-driven suggestions when the API is available.
 */
export const DESTINATIONS: DestinationOption[] = [
  // Tehran
  { id: "dest-th-1", name: "هتل اسپیناس پالاس", city: "تهران", type: "hotel" },
  { id: "dest-th-2", name: "هتل دیپلماتیک تهران", city: "تهران", type: "hotel" },
  { id: "dest-th-3", name: "اقامتگاه بوم‌گردی تهران", city: "تهران", type: "accommodation" },
  // Mazandaran
  { id: "dest-mz-1", name: "هتل آرامش نوشهر", city: "مازندران، نوشهر", type: "hotel" },
  { id: "dest-mz-2", name: "هتل کلاردشت", city: "مازندران، کلاردشت", type: "hotel" },
  { id: "dest-mz-3", name: "اقامتگاه بوم‌گردی کلاردشت", city: "مازندران، کلاردشت", type: "accommodation" },
  { id: "dest-mz-4", name: "ویلا جنگلی چلیک", city: "مازندران، نوشهر", type: "villa" },
  // Shiraz
  { id: "dest-sh-1", name: "هتل باغ‌ایران شیراز", city: "شیراز", type: "hotel" },
  { id: "dest-sh-2", name: "هتل تخت‌جمشید شیراز", city: "شیراز", type: "hotel" },
  { id: "dest-sh-3", name: "باغ قصر شیراز", city: "شیراز", type: "villa" },
  { id: "dest-sh-4", name: "اقامتگاه سنتی قلات", city: "شیراز، قلات", type: "accommodation" },
  // Mashhad
  { id: "dest-mh-1", name: "هتل رضوی مشهد", city: "مشهد", type: "hotel" },
  { id: "dest-mh-2", name: "هتل حرم‌طلایی مشهد", city: "مشهد", type: "hotel" },
  { id: "dest-mh-3", name: "اقامتگاه طرقبه مشهد", city: "مشهد، طرقبه", type: "accommodation" },
  // Yazd
  { id: "dest-yz-1", name: "هتل باغ دولت‌آباد یزد", city: "یزد", type: "hotel" },
  { id: "dest-yz-2", name: "هتل بادگیر یزد", city: "یزد", type: "hotel" },
  { id: "dest-yz-3", name: "اقامتگاه بوم‌گردی بافت تاریخی", city: "یزد، بافت تاریخی", type: "accommodation" },
  // Kish
  { id: "dest-ki-1", name: "هتل مرجان کیش", city: "جزیره کیش", type: "hotel" },
  { id: "dest-ki-2", name: "هتل آفتاب کیش", city: "جزیره کیش", type: "hotel" },
  { id: "dest-ki-3", name: "ویلا ساحلی صدف", city: "جزیره کیش، مرجان", type: "villa" },
  // Qeshm
  { id: "dest-qe-1", name: "هتل ستاره قشم", city: "جزیره قشم", type: "hotel" },
  { id: "dest-qe-2", name: "هتل خلیج‌فارس قشم", city: "جزیره قشم", type: "hotel" },
  // Hamedan
  { id: "dest-hm-1", name: "هتل باباطاهر همدان", city: "همدان", type: "hotel" },
  { id: "dest-hm-2", name: "هتل گنبد علویان همدان", city: "همدان", type: "hotel" },
  { id: "dest-hm-3", name: "اقامتگاه بوم‌گردی همدان", city: "همدان", type: "accommodation" },
];
