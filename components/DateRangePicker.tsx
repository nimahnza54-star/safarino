
"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";

import {
  calcNights,
  formatDateRangeSummary,
  formatJalaliDate,
  getCurrentJalaliDate,
  getJalaliDaysInMonth,
  getJalaliMonthName,
  getJalaliMonthStartWeekday,
  getJalaliWeekdays,
  toPersianNumerals,
  type JalaliDate,
} from "@/components/jalali-utils";

import {
  getCalendarMonth,
  type CalendarDayEvents,
  type CalendarEvent,
} from "@/services/calendarService";

type DateRangePickerProps = {
  value: string;
  onChange: (value: string) => void;
  onRangeChange?: (
    checkIn: JalaliDate | null,
    checkOut: JalaliDate | null
  ) => void;
};

const MONTHS = Array.from(
  { length: 12 },
  (_, index) => index + 1
);

function dateKey(date: JalaliDate): number {
  return date.jy * 10000 + date.jm * 100 + date.jd;
}

function sameDate(
  a: JalaliDate | null,
  b: JalaliDate
): boolean {
  return Boolean(
    a &&
      a.jy === b.jy &&
      a.jm === b.jm &&
      a.jd === b.jd
  );
}

export function DateRangePicker({
  value,
  onChange,
  onRangeChange,
}: DateRangePickerProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [today, setToday] = useState<JalaliDate | null>(null);
  const [open, setOpen] = useState(false);

  const [checkIn, setCheckIn] = useState<JalaliDate | null>(null);
  const [checkOut, setCheckOut] = useState<JalaliDate | null>(null);

  const [view, setView] = useState<{
    jy: number;
    jm: number;
  } | null>(null);

  const [hoveredDate, setHoveredDate] =
    useState<JalaliDate | null>(null);

  const [calendarData, setCalendarData] =
    useState<CalendarDayEvents>({});

  const [calendarLoading, setCalendarLoading] = useState(false);
  const [calendarError, setCalendarError] = useState(false);

  const [showMonthlyEvents, setShowMonthlyEvents] =
    useState(false);

  // دریافت تاریخ امروز
  useEffect(() => {
    setToday(getCurrentJalaliDate());
  }, []);

  // ارسال بازه انتخاب‌شده به والد
  useEffect(() => {
    onRangeChange?.(checkIn, checkOut);
  }, [checkIn, checkOut, onRangeChange]);

  const viewYear = view?.jy ?? today?.jy ?? 1405;
  const viewMonth = view?.jm ?? today?.jm ?? 1;

  // تغییر ماه و سال نمایشی
  const showMonth = useCallback(
    (jy: number, jm: number) => {
      if (
        jm < 1 ||
        jm > 12 ||
        !Number.isInteger(jy)
      ) {
        return;
      }

      setView({ jy, jm });
      setShowMonthlyEvents(false);
      setHoveredDate(null);
    },
    []
  );

  // باز کردن تقویم
  const openCalendar = useCallback(() => {
    const initial = checkIn ?? today;

    if (initial) {
      setView({
        jy: initial.jy,
        jm: initial.jm,
      });
    }

    setShowMonthlyEvents(false);
    setOpen(true);
  }, [checkIn, today]);

  // بستن تقویم
  const closeCalendar = useCallback(() => {
    setOpen(false);
    setHoveredDate(null);
  }, []);

  // بستن با کلیک بیرون یا Escape
  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        closeCalendar();
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeCalendar();
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [closeCalendar]);

  // دریافت مناسبت‌های ماه
  useEffect(() => {
    let cancelled = false;

    setCalendarData({});
    setCalendarLoading(true);
    setCalendarError(false);

    getCalendarMonth(viewYear, viewMonth)
      .then((data) => {
        if (!cancelled) {
          setCalendarData(data);
        }
      })
      .catch((error) => {
        console.error("Calendar loading failed:", error);

        if (!cancelled) {
          setCalendarData({});
          setCalendarError(true);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setCalendarLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [viewYear, viewMonth]);

  // رفتن به امروز
  const goToToday = useCallback(() => {
    if (!today) return;

    showMonth(today.jy, today.jm);
  }, [today, showMonth]);

  // جابه‌جایی ماه‌ها
  const shiftMonth = useCallback(
    (delta: number) => {
      setView((current) => {
        const base = current ?? today ?? {
          jy: 1405,
          jm: 1,
        };

        const absoluteMonth =
          base.jy * 12 + (base.jm - 1) + delta;

        const jy = Math.floor(absoluteMonth / 12);

        const jm =
          ((absoluteMonth % 12) + 12) % 12 + 1;

        return { jy, jm };
      });

      setShowMonthlyEvents(false);
      setHoveredDate(null);
    },
    [today]
  );

  // انتخاب تاریخ ورود و خروج
  const selectDate = useCallback(
    (date: JalaliDate) => {
      if (!today) return;

      // جلوگیری از انتخاب روزهای گذشته
      if (dateKey(date) < dateKey(today)) return;

      // انتخاب ورود یا شروع مجدد بازه
      if (!checkIn || checkOut) {
        setCheckIn(date);
        setCheckOut(null);
        return;
      }

      // اگر تاریخ انتخابی قبل یا برابر ورود بود،
      // آن را به عنوان ورود جدید ثبت کن
      if (dateKey(date) <= dateKey(checkIn)) {
        setCheckIn(date);
        setCheckOut(null);
        return;
      }

      // انتخاب تاریخ خروج
      setCheckOut(date);
    },
    [today, checkIn, checkOut]
  );

  // تأیید بازه
  const confirmDates = useCallback(() => {
    if (!checkIn || !checkOut) return;

    onChange(formatDateRangeSummary(checkIn, checkOut));
    closeCalendar();
  }, [checkIn, checkOut, onChange, closeCalendar]);

  // پاک کردن تاریخ‌ها
  const clearDates = useCallback(() => {
    setCheckIn(null);
    setCheckOut(null);
    onChange("");
  }, [onChange]);

  // مناسبت‌های یک روز
  const getDayEvents = useCallback(
    (date: JalaliDate): CalendarEvent[] => {
      return calendarData[`${date.jm}-${date.jd}`] ?? [];
    },
    [calendarData]
  );

  const weekdays = getJalaliWeekdays();

  // ساخت روزهای ماه
  const days = useMemo(() => {
    const count = getJalaliDaysInMonth(
      viewYear,
      viewMonth
    );

    const offset = getJalaliMonthStartWeekday(
      viewYear,
      viewMonth
    );

    const result: (JalaliDate | null)[] = Array.from(
      { length: offset },
      () => null
    );

    for (let day = 1; day <= count; day++) {
      result.push({
        jy: viewYear,
        jm: viewMonth,
        jd: day,
      });
    }

    while (result.length % 7 !== 0) {
      result.push(null);
    }

    return result;
  }, [viewYear, viewMonth]);

  // روز انتخاب‌شده یا روز زیر نشانگر
  const selectedInfoDate =
    hoveredDate ?? checkOut ?? checkIn;

  const selectedEvents = selectedInfoDate
    ? getDayEvents(selectedInfoDate)
    : [];

  // تمام مناسبت‌های ماه
  const monthlyEvents = useMemo(() => {
    return Array.from(
      {
        length: getJalaliDaysInMonth(
          viewYear,
          viewMonth
        ),
      },
      (_, index) => {
        const day = index + 1;

        return {
          date: {
            jy: viewYear,
            jm: viewMonth,
            jd: day,
          },
          events:
            calendarData[`${viewMonth}-${day}`] ?? [],
        };
      }
    ).filter((item) => item.events.length > 0);
  }, [viewYear, viewMonth, calendarData]);

  // فقط تعطیلات رسمی
  const monthlyHolidays = useMemo(() => {
    return monthlyEvents
      .map((item) => ({
        ...item,
        events: item.events.filter(
          (event) => event.isHoliday
        ),
      }))
      .filter((item) => item.events.length > 0);
  }, [monthlyEvents]);

  // فقط مناسبت‌های غیرتعطیل
  const monthlyOtherEvents = useMemo(() => {
    return monthlyEvents
      .map((item) => ({
        ...item,
        events: item.events.filter(
          (event) => !event.isHoliday
        ),
      }))
      .filter((item) => item.events.length > 0);
  }, [monthlyEvents]);

  const totalHolidays = monthlyHolidays.reduce(
    (total, item) => total + item.events.length,
    0
  );

  const totalOtherEvents = monthlyOtherEvents.reduce(
    (total, item) => total + item.events.length,
    0
  );

  if (!today) {
    return (
      <div
        ref={wrapperRef}
        className="relative md:col-span-4"
        dir="rtl"
      >
        <button
          type="button"
          onClick={openCalendar}
          className="w-full rounded-2xl border border-[#e21b5b]/30 bg-[#e21b5b]/5 p-3 text-right"
        >
          <span className="mb-1 block text-[11px] font-semibold text-[#d1134e]">
            تاریخ ورود و خروج
          </span>

          <span className="flex items-center gap-2 text-xs text-gray-500">
            <CalendarDays className="h-4 w-4 text-[#e21b5b]" />
            در حال آماده‌سازی تقویم...
          </span>
        </button>
      </div>
    );
  }

  return (
    <div
      ref={wrapperRef}
      className="relative md:col-span-4"
      dir="rtl"
    >
      {/* دکمه اصلی انتخاب تاریخ */}
      <button
        type="button"
        onClick={openCalendar}
        className="w-full rounded-2xl border border-[#e21b5b]/40 bg-[#e21b5b]/5 p-3 text-right transition hover:border-[#d1134e]"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className="mb-1 block text-[11px] font-semibold text-[#d1134e]">
          تاریخ ورود و خروج
        </span>

        <span className="flex min-w-0 items-center justify-between gap-2 text-xs font-bold text-gray-800">
          <span className="flex min-w-0 items-center gap-2">
            <CalendarDays className="h-4 w-4 shrink-0 text-[#e21b5b]" />

            <span className="truncate">
              {checkIn
                ? `${toPersianNumerals(checkIn.jd)} ${getJalaliMonthName(checkIn.jm)}`
                : value || "انتخاب تاریخ ورود"}
            </span>
          </span>

          <span className="shrink-0 text-gray-400">
            تا
          </span>

          <span className="truncate">
            {checkOut
              ? `${toPersianNumerals(checkOut.jd)} ${getJalaliMonthName(checkOut.jm)}`
              : "انتخاب تاریخ خروج"}
          </span>
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="انتخاب تاریخ ورود و خروج"
          className="absolute right-0 z-[100] mt-2 w-[min(94vw,390px)] rounded-3xl border border-gray-200 bg-white p-3 shadow-2xl sm:p-5"
        >
          {/* سربرگ */}
          <div className="mb-4 space-y-3 border-b border-gray-100 pb-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => shiftMonth(-1)}
                  className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-[#e21b5b]"
                  aria-label="ماه قبل"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => shiftMonth(1)}
                  className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-[#e21b5b]"
                  aria-label="ماه بعد"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
              </div>

              <strong className="text-sm text-gray-800">
                {getJalaliMonthName(viewMonth)}{" "}
                {toPersianNumerals(viewYear)}
              </strong>

              <button
                type="button"
                onClick={goToToday}
                className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-semibold text-[#e21b5b] transition hover:bg-[#e21b5b]/5"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                برو به امروز
              </button>
            </div>

            {/* انتخاب ماه و سال */}
            <div className="grid grid-cols-2 gap-2">
              <label className="block">
                <span className="mb-1 block text-[10px] text-gray-500">
                  ماه
                </span>

                <select
                  value={viewMonth}
                  onChange={(event) =>
                    showMonth(
                      viewYear,
                      Number(event.target.value)
                    )
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 outline-none focus:border-[#e21b5b]"
                >
                  {MONTHS.map((month) => (
                    <option key={month} value={month}>
                      {getJalaliMonthName(month)}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1 block text-[10px] text-gray-500">
                  سال شمسی
                </span>

                <input
                  type="number"
                  inputMode="numeric"
                  min={1347}
                  max={1600}
                  value={viewYear}
                  onChange={(event) => {
                    const year = Number(event.target.value);

                    if (year >= 1347 && year <= 1600) {
                      showMonth(year, viewMonth);
                    }
                  }}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 outline-none focus:border-[#e21b5b]"
                />
              </label>
            </div>
          </div>

          {/* روزهای هفته */}
          <div className="mb-2 grid grid-cols-7 text-center text-[10px] font-semibold text-gray-400">
            {weekdays.map((weekday, index) => (
              <span
                key={weekday}
                className={index === 6 ? "text-rose-500" : ""}
              >
                {weekday}
              </span>
            ))}
          </div>

          {/* روزهای تقویم */}
          <div className="grid grid-cols-7 gap-y-1 text-center">
            {days.map((date, index) => {
              if (!date) {
                return (
                  <span
                    key={`empty-${index}`}
                    className="h-10 sm:h-11"
                  />
                );
              }

              const key = dateKey(date);
              const isPast = key < dateKey(today);

              const isStart = sameDate(checkIn, date);
              const isEnd = sameDate(checkOut, date);
              const isSelected = isStart || isEnd;

              const inRange = Boolean(
                checkIn &&
                  checkOut &&
                  key > dateKey(checkIn) &&
                  key < dateKey(checkOut)
              );

              const isToday = sameDate(today, date);
              const isFriday = index % 7 === 6;

              const dayEvents = getDayEvents(date);

              const isHoliday = dayEvents.some(
                (event) => event.isHoliday
              );

              const isHoveredRange = Boolean(
                hoveredDate &&
                  checkIn &&
                  !checkOut &&
                  key > dateKey(checkIn) &&
                  key <= dateKey(hoveredDate)
              );

              const eventTitle = [
                ...dayEvents.map((event) => event.title),
                ...(isFriday ? ["جمعه"] : []),
              ].join(" | ");

              return (
                <button
                  key={`${date.jy}-${date.jm}-${date.jd}`}
                  type="button"
                  disabled={isPast}
                  onClick={() => selectDate(date)}
                  onMouseEnter={() => setHoveredDate(date)}
                  onMouseLeave={() => setHoveredDate(null)}
                  title={eventTitle || undefined}
                  aria-label={
                    `${date.jd} ${getJalaliMonthName(date.jm)}` +
                    (eventTitle ? `، ${eventTitle}` : "")
                  }
                  className={[
                    "relative mx-auto flex h-10 w-full max-w-10 items-center justify-center rounded-xl text-xs transition sm:h-11 sm:max-w-11",

                    // روزهای گذشته
                    isPast
                      ? "cursor-not-allowed"
                      : "cursor-pointer hover:bg-rose-50",

                    // انتخاب ورود یا خروج
                    isSelected
                      ? "z-10 bg-[#e21b5b] font-bold !text-white hover:bg-[#d1134e] hover:!text-white"
                      : "",

                    // محدوده اقامت
                    !isSelected && (inRange || isHoveredRange)
                      ? "rounded-none bg-[#e21b5b]/10 text-gray-800"
                      : "",

                    // تعطیلی رسمی: عدد قرمز حتی برای روز گذشته
                    isHoliday && !isSelected
                      ? "font-bold !text-rose-600"
                      : "",

                    // جمعه‌ها
                    isFriday &&
                    !isHoliday &&
                    !isSelected &&
                    !isPast
                      ? "font-semibold !text-rose-400"
                      : "",

                    // امروز
                    isToday && !isSelected
                      ? "ring-1 ring-inset ring-[#e21b5b] font-bold"
                      : "",
                  ].join(" ")}
                >
                  {toPersianNumerals(date.jd)}
                </button>
              );
            })}
          </div>

          {/* راهنمای رنگ‌ها */}
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-gray-100 pt-3 text-[10px] text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="font-bold text-rose-600">
                ۱۲
              </span>
              تعطیلی رسمی
            </span>

            <span className="flex items-center gap-1.5">
              <span className="font-bold text-rose-400">
                ۱۲
              </span>
              جمعه
            </span>

            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full border border-[#e21b5b]" />
              امروز
            </span>
          </div>

          {/* تاریخ امروز */}
          <div className="mt-3 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5">
            <div className="mb-1 text-[10px] font-semibold text-gray-500">
              تاریخ امروز در ایران
            </div>

            <div className="text-xs font-bold text-gray-800">
              {formatJalaliDate(
                today.jy,
                today.jm,
                today.jd,
                { withYear: true }
              )}
            </div>
          </div>

          {/* اطلاعات روز انتخاب‌شده */}
          {selectedInfoDate && (
            <div className="mt-3 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5">
              <div className="text-[11px] font-bold text-gray-800">
                {formatJalaliDate(
                  selectedInfoDate.jy,
                  selectedInfoDate.jm,
                  selectedInfoDate.jd,
                  { withYear: true }
                )}
              </div>

              {selectedEvents.length > 0 ? (
                <div className="mt-2 space-y-1 text-[11px] leading-6">
                  {selectedEvents.map((event) => (
                    <div
                      key={event.slug}
                      className={
                        event.isHoliday
                          ? "font-medium text-rose-600"
                          : "text-gray-600"
                      }
                    >
                      · {event.title}

                      {event.estimated && (
                        <span className="mr-1 text-[9px] text-amber-600">
                          (تاریخ قمری تخمینی)
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-1 text-[11px] text-gray-400">
                  مناسبت ثبت‌شده‌ای ندارد
                </div>
              )}
            </div>
          )}

          {/* باکس تعطیلات و مناسبت‌ها */}
          <div className="mt-3 space-y-2">
            {/* باکس قرمز تعطیلات رسمی */}
            <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-rose-700">
                  تعطیلات رسمی {getJalaliMonthName(viewMonth)}{" "}
                  {toPersianNumerals(viewYear)}
                </span>

                <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-rose-600">
                  {toPersianNumerals(totalHolidays)} تعطیلی
                </span>
              </div>

              {calendarLoading ? (
                <p className="text-[11px] text-gray-500">
                  در حال دریافت اطلاعات تعطیلات...
                </p>
              ) : calendarError ? (
                <p className="text-[11px] text-rose-600">
                  دریافت اطلاعات تقویم ناموفق بود.
                </p>
              ) : monthlyHolidays.length > 0 ? (
                <ul className="max-h-36 space-y-2 overflow-y-auto">
                  {monthlyHolidays.map(({ date, events }) => (
                    <li
                      key={`${date.jy}-${date.jm}-${date.jd}`}
                      className="flex items-start gap-2 text-[11px] leading-5"
                    >
                      <span className="shrink-0 rounded-md bg-white px-2 py-0.5 font-bold text-rose-700">
                        {toPersianNumerals(date.jd)}{" "}
                        {getJalaliMonthName(date.jm)}
                      </span>

                      <div className="space-y-1">
                        {events.map((event) => (
                          <div
                            key={event.slug}
                            className="font-semibold text-rose-700"
                          >
                            {event.title}

                            {event.estimated && (
                              <span className="mr-1 text-amber-600">
                                (تخمینی)
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[11px] text-gray-500">
                  برای این ماه تعطیلی رسمی ثبت نشده است.
                </p>
              )}
            </div>

            {/* دکمه مناسبت‌ها */}
            <button
              type="button"
              onClick={() =>
                setShowMonthlyEvents((current) => !current)
              }
              aria-expanded={showMonthlyEvents}
              className="flex w-full items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-right transition hover:bg-amber-100"
            >
              <span className="text-[11px] font-bold text-amber-800">
                {showMonthlyEvents
                  ? "بستن مناسبت‌ها"
                  : "مناسبت‌ها"}
              </span>

              <span className="flex items-center gap-2">
                <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                  {toPersianNumerals(totalOtherEvents)} مناسبت
                </span>

                <ChevronLeft
                  className={`h-4 w-4 text-amber-700 transition-transform ${
                    showMonthlyEvents ? "-rotate-90" : ""
                  }`}
                />
              </span>
            </button>

            {/* باکس نارنجی مناسبت‌های غیرتعطیل */}
            {showMonthlyEvents && (
              <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3">
                <div className="mb-2 text-[11px] font-bold text-amber-800">
                  مناسبت‌های غیرتعطیل {getJalaliMonthName(viewMonth)}
                </div>

                {calendarLoading ? (
                  <p className="text-[11px] text-gray-500">
                    در حال دریافت مناسبت‌ها...
                  </p>
                ) : calendarError ? (
                  <p className="text-[11px] text-amber-700">
                    دریافت اطلاعات مناسبت‌ها ناموفق بود.
                  </p>
                ) : monthlyOtherEvents.length > 0 ? (
                  <ul className="max-h-44 space-y-2 overflow-y-auto">
                    {monthlyOtherEvents.map(({ date, events }) => (
                      <li
                        key={`${date.jy}-${date.jm}-${date.jd}`}
                        className="flex items-start gap-2 text-[11px] leading-5"
                      >
                        <span className="shrink-0 rounded-md bg-white px-2 py-0.5 font-bold text-amber-800">
                          {toPersianNumerals(date.jd)}{" "}
                          {getJalaliMonthName(date.jm)}
                        </span>

                        <div className="space-y-1">
                          {events.map((event) => (
                            <div
                              key={event.slug}
                              className="text-gray-700"
                            >
                              {event.title}

                              {event.estimated && (
                                <span className="mr-1 text-amber-700">
                                  (تخمینی)
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[11px] text-gray-500">
                    برای این ماه مناسبت غیرتعطیلی ثبت نشده است.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* خلاصه اقامت و دکمه‌ها */}
          <div className="mt-3 flex flex-col gap-3">
            {checkIn && (
              <div className="text-[11px] text-gray-600">
                {checkOut
                  ? `مدت اقامت: ${toPersianNumerals(
                      calcNights(checkIn, checkOut)
                    )} شب`
                  : "حالا تاریخ خروج را انتخاب کنید."}
              </div>
            )}

            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={clearDates}
                className="rounded-xl px-3 py-2 text-xs text-gray-500 transition hover:bg-gray-100"
              >
                پاک کردن
              </button>

              <button
                type="button"
                disabled={!checkIn || !checkOut}
                onClick={confirmDates}
                className="rounded-xl bg-[#e21b5b] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#d1134e] disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                تأیید تاریخ‌ها
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
