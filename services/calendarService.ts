
const API_BASE = "https://www.persian-calendar.com/api";

export type CalendarEvent = {
  slug: string;
  title: string;
  category: string;
  isHoliday: boolean;
  estimated?: boolean;
};

export type CalendarDayEvents = Record<string, CalendarEvent[]>;

type ApiEvent = {
  slug?: string;
  title_fa: string;
  title_en?: string;
  category?: string;
  is_holiday?: boolean;
};

type HolidaysResponse = {
  year: number;
  data: {
    month_sh: number;
    day_sh: number;
    estimate?: boolean;
    events: ApiEvent[];
  }[];
};

type EventsResponse = {
  year: number;
  data: {
    month_sh: number;
    day_sh: number;
    slug?: string;
    title_fa: string;
    title_en?: string;
    category?: string;
    is_holiday?: boolean;
  }[];
};

// فقط مناسبت‌های مذهبی ایرانی که شناسه آن‌ها تأیید شده است
const IRANIAN_RELIGIOUS_SLUGS = new Set([
  "martyrdom-of-fatimah-zahra-one-narration",
  "martyrdom-of-fatimah-zahra",
  "birth-of-the-bab",
  "birth-of-bahaullah",
]);

// کش تعطیلات هر سال
const holidaysCache = new Map<number, HolidaysResponse>();

// کش مناسبت‌های هر ماه
const monthCache = new Map<string, CalendarDayEvents>();

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Calendar API error: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

async function getYearHolidays(
  year: number
): Promise<HolidaysResponse> {
  const cached = holidaysCache.get(year);

  if (cached) return cached;

  const result = await fetchJson<HolidaysResponse>(
    `${API_BASE}/holidays?year=${year}`
  );

  holidaysCache.set(year, result);

  return result;
}

function addEvent(
  target: CalendarDayEvents,
  month: number,
  day: number,
  event: CalendarEvent
) {
  const key = `${month}-${day}`;

  if (!target[key]) {
    target[key] = [];
  }

  const exists = target[key].some(
    (item) =>
      item.slug === event.slug ||
      item.title === event.title
  );

  if (!exists) {
    target[key].push(event);
  }
}

export async function getCalendarMonth(
  year: number,
  month: number
): Promise<CalendarDayEvents> {
  const cacheKey = `${year}-${month}`;

  const cached = monthCache.get(cacheKey);

  if (cached) return cached;

  const [holidays, nationalEvents, religiousEvents] =
    await Promise.all([
      getYearHolidays(year),

      fetchJson<EventsResponse>(
        `${API_BASE}/events?year=${year}&month_sh=${month}&category=national`
      ),

      fetchJson<EventsResponse>(
        `${API_BASE}/events?year=${year}&month_sh=${month}&category=religious`
      ),
    ]);

  const result: CalendarDayEvents = {};

  // 1. تعطیلات رسمی ایران
  for (const day of holidays.data) {
    for (const event of day.events) {
      if (!event.is_holiday) continue;

      addEvent(result, day.month_sh, day.day_sh, {
        slug: event.slug ?? event.title_fa,
        title: event.title_fa,
        category: event.category ?? "other",
        isHoliday: true,
        estimated: day.estimate,
      });
    }
  }

  // 2. مناسبت‌های ملی ایران
  for (const event of nationalEvents.data) {
    addEvent(result, event.month_sh, event.day_sh, {
      slug: event.slug ?? event.title_fa,
      title: event.title_fa,
      category: "national",
      isHoliday: false,
    });
  }

  // 3. فقط مناسبت‌های مذهبی ایرانی تأییدشده
  for (const event of religiousEvents.data) {
    const slug = event.slug ?? "";

    if (!IRANIAN_RELIGIOUS_SLUGS.has(slug)) {
      continue;
    }

    addEvent(result, event.month_sh, event.day_sh, {
      slug,
      title: event.title_fa,
      category: "religious",
      isHoliday: false,
    });
  }

  monthCache.set(cacheKey, result);

  return result;
}
