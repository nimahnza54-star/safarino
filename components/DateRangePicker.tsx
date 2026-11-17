"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import {
  getCurrentJalaliDate,
  getJalaliDaysInMonth,
  getJalaliMonthName,
  getJalaliMonthStartWeekday,
  getJalaliWeekdays,
  jalaliToGregorian,
  calcNights,
  formatDateRangeSummary,
  toPersianNumerals,
} from "@/components/jalali-utils";

type DateRangePickerProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

type JalaliDate = { jy: number; jm: number; jd: number };

export function DateRangePicker({
  value,
  onChange,
  placeholder = "تاریخ ورود و خروج",
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [checkIn, setCheckIn] = useState<JalaliDate | null>(null);
  const [checkOut, setCheckOut] = useState<JalaliDate | null>(null);
  const [viewYear, setViewYear] = useState<number>(0);
  const [viewMonth, setViewMonth] = useState<number>(0);
  const [hoveredDate, setHoveredDate] = useState<JalaliDate | null>(null);
  const [now, setNow] = useState<JalaliDate | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Defer current date to client-side to avoid Next.js prerender restriction on new Date()
  useEffect(() => {
    setNow(getCurrentJalaliDate());
  }, []);

  useEffect(() => {
    if (now && !checkIn && !checkOut) {
      setViewYear(now.jy);
      setViewMonth(now.jm);
    }
  }, [now, checkIn, checkOut]);

  const openCalendar = useCallback(() => {
    setOpen(true);
    const selected = checkIn || checkOut || now;
    if (selected) {
      setViewYear(selected.jy);
      setViewMonth(selected.jm);
    }
  }, [checkIn, checkOut, now]);

  const closeCalendar = useCallback(() => setOpen(false), []);

  const selectDate = useCallback(
    (date: JalaliDate) => {
      if (!checkIn) {
        setCheckIn(date);
        setCheckOut(null);
        setViewYear(date.jy);
        setViewMonth(date.jm);
      } else if (!checkOut) {
        const gi = jalaliToGregorian(checkIn.jy, checkIn.jm, checkIn.jd);
        const gd = jalaliToGregorian(date.jy, date.jm, date.jd);
        const diff =
          new Date(gd.gy, gd.gm - 1, gd.gd).getTime() -
          new Date(gi.gy, gi.gm - 1, gi.gd).getTime();
        if (diff > 0) {
          setCheckOut(date);
          const summary = formatDateRangeSummary(checkIn, date);
          onChange(summary);
          setTimeout(closeCalendar, 150);
        } else {
          setCheckIn(date);
          setCheckOut(null);
          setViewYear(date.jy);
          setViewMonth(date.jm);
        }
      } else {
        setCheckIn(date);
        setCheckOut(null);
        setViewYear(date.jy);
        setViewMonth(date.jm);
      }
    },
    [checkIn, checkOut, onChange, closeCalendar]
  );

  const goToToday = useCallback(() => {
    if (now) {
      setViewYear(now.jy);
      setViewMonth(now.jm);
    }
  }, [now]);

  const confirmDates = useCallback(() => {
    if (checkIn && checkOut) {
      const summary = formatDateRangeSummary(checkIn, checkOut);
      onChange(summary);
    }
    closeCalendar();
  }, [checkIn, checkOut, onChange, closeCalendar]);

  // Navigation
  const prevMonth = useCallback(() => {
    setViewMonth((m) => {
      if (m === 1) {
        setViewYear((y) => y - 1);
        return 12;
      }
      return m - 1;
    });
  }, []);

  const nextMonth = useCallback(() => {
    setViewMonth((m) => {
      if (m === 12) {
        setViewYear((y) => y + 1);
        return 1;
      }
      return m + 1;
    });
  }, []);

  // Build two months side by side
  const monthDays = useMemo(() => {
    if (!viewYear || !viewMonth) return [];

    const buildMonth = (y: number, m: number) => {
      const daysInMonth = getJalaliDaysInMonth(y, m);
      const startWeekday = getJalaliMonthStartWeekday(y, m);
      const days: (JalaliDate | null)[] = [];
      for (let i = 0; i < startWeekday; i++) days.push(null);
      for (let d = 1; d <= daysInMonth; d++) days.push({ jy: y, jm: m, jd: d });
      return { days, name: getJalaliMonthName(m), year: y, month: m };
    };

    let y2 = viewYear;
    let m2 = viewMonth + 1;
    if (m2 > 12) {
      m2 = 1;
      y2 += 1;
    }

    return [buildMonth(viewYear, viewMonth), buildMonth(y2, m2)];
  }, [viewYear, viewMonth]);

  const isSelected = useCallback(
    (date: JalaliDate) => {
      return (
        (checkIn && checkIn.jy === date.jy && checkIn.jm === date.jm && checkIn.jd === date.jd) ||
        (checkOut && checkOut.jy === date.jy && checkOut.jm === date.jm && checkOut.jd === date.jd)
      );
    },
    [checkIn, checkOut]
  );

  const isInRange = useCallback(
    (date: JalaliDate) => {
      if (!checkIn || !checkOut) return false;
      const gi = jalaliToGregorian(checkIn.jy, checkIn.jm, checkIn.jd);
      const go = jalaliToGregorian(checkOut.jy, checkOut.jm, checkOut.jd);
      const gd = jalaliToGregorian(date.jy, date.jm, date.jd);
      const d = new Date(gd.gy, gd.gm - 1, gd.gd).getTime();
      const s = new Date(gi.gy, gi.gm - 1, gi.gd).getTime();
      const e = new Date(go.gy, go.gm - 1, go.gd).getTime();
      return d > s && d < e;
    },
    [checkIn, checkOut]
  );

  const isToday = useCallback(
    (date: JalaliDate) => {
      if (!now) return false;
      return date.jy === now.jy && date.jm === now.jm && date.jd === now.jd;
    },
    [now]
  );

  const isBeforeToday = useCallback(
    (date: JalaliDate) => {
      if (!now) return false;
      const gi = jalaliToGregorian(date.jy, date.jm, date.jd);
      const gNow = jalaliToGregorian(now.jy, now.jm, now.jd);
      return (
        new Date(gi.gy, gi.gm - 1, gi.gd).getTime() <
        new Date(gNow.gy, gNow.gm - 1, gNow.gd).getTime()
      );
    },
    [now]
  );

  const isCheckOutDisabled = useCallback(
    (date: JalaliDate) => {
      if (!checkIn) return false;
      const gi = jalaliToGregorian(checkIn.jy, checkIn.jm, checkIn.jd);
      const gd = jalaliToGregorian(date.jy, date.jm, date.jd);
      return new Date(gd.gy, gd.gm - 1, gd.gd).getTime() <= new Date(gi.gy, gi.gm - 1, gi.gd).getTime();
    },
    [checkIn]
  );

  const weekdays = getJalaliWeekdays();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isBetween = useCallback(
    (date: JalaliDate, start: JalaliDate, end: JalaliDate) => {
      const gs = jalaliToGregorian(start.jy, start.jm, start.jd);
      const ge = jalaliToGregorian(end.jy, end.jm, end.jd);
      const gd = jalaliToGregorian(date.jy, date.jm, date.jd);
      const d = new Date(gd.gy, gd.gm - 1, gd.gd).getTime();
      const s = new Date(gs.gy, gs.gm - 1, gs.gd).getTime();
      const e = new Date(ge.gy, ge.gm - 1, ge.gd).getTime();
      return d > s && d < e;
    },
    []
  );

  if (!now) {
    // Render placeholder while loading current date on client
    return (
      <div
        ref={wrapperRef}
        className="relative md:col-span-4"
      >
        <div
          className="border border-[#e21b5b] rounded-2xl p-3 bg-[#e21b5b]/10 hover:border-[#d1134e] transition-all cursor-pointer group"
          onClick={openCalendar}
        >
          <label className="block text-[11px] font-semibold text-[#d1134e] mb-0.5">
            تاریخ ورود و خروج
          </label>
          <div className="flex items-center justify-between text-xs font-bold text-gray-800">
            <div className="flex items-center gap-2">
              <i className="fa-regular fa-calendar-days text-[#e21b5b]"></i>
              <span className="text-gray-400">انتخاب تاریخ</span>
            </div>
            <span className="text-gray-400 font-normal">تا</span>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">انتخاب تاریخ</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={wrapperRef}
      className="relative md:col-span-4"
    >
      <div
        className="border border-[#e21b5b] rounded-2xl p-3 bg-[#e21b5b]/10 hover:border-[#d1134e] transition-all cursor-pointer group"
        onClick={openCalendar}
      >
        <label className="block text-[11px] font-semibold text-[#d1134e] mb-0.5">
          تاریخ ورود و خروج
        </label>
        <div className="flex items-center justify-between text-xs font-bold text-gray-800">
          <div className="flex items-center gap-2">
            <i className="fa-regular fa-calendar-days text-[#e21b5b]"></i>
            <span>
              {value ? (
                <span className="text-right">
                  {value.split(" - ")[0]} تا {value.split(" - ")[1]?.split(" ")[0] ?? ""}
                </span>
              ) : (
                <span className="text-gray-400">انتخاب تاریخ</span>
              )}
            </span>
          </div>
          <span className="text-gray-400 font-normal">تا</span>
          <div className="flex items-center gap-2">
            <span>
              {value ? (
                <span className="text-right">
                  {value.split(" - ")[1]?.split(" ")[0] ?? ""}
                </span>
              ) : (
                <span className="text-gray-400">انتخاب تاریخ</span>
              )}
            </span>
          </div>
        </div>
      </div>

      {open && (
        <div className="absolute right-0 z-50 mt-1 w-full max-w-md bg-white border border-gray-200 shadow-2xl rounded-3xl p-5">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3 text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={prevMonth}
                className="p-1.5 text-gray-500 hover:text-[#e21b5b] rounded hover:bg-gray-50 transition-colors"
                aria-label="ماه قبل"
              >
                <i className="fa-solid fa-chevron-left text-xs"></i>
              </button>
              <span className="font-bold text-gray-700">
                {getJalaliMonthName(viewMonth)} {toPersianNumerals(viewYear)}
              </span>
              <button
                onClick={nextMonth}
                className="p-1.5 text-gray-500 hover:text-[#e21b5b] rounded hover:bg-gray-50 transition-colors"
                aria-label="ماه بعد"
              >
                <i className="fa-solid fa-chevron-right text-xs"></i>
              </button>
            </div>
            <button
              onClick={goToToday}
              className="text-[#e21b5b] hover:underline text-[11px] font-medium"
            >
              برو به امروز
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-2">
            {monthDays.map(({ days, name, year, month }, idx) => (
              <div key={idx} className="flex flex-col gap-1">
                <div className="font-bold text-xs text-gray-800 mb-1 text-center">
                  {name}
                </div>
                <div className="grid grid-cols-7 text-[10px] text-gray-400 mb-1 font-semibold">
                  {weekdays.map((w) => (
                    <span key={w}>{w}</span>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-0.5 text-[11px] font-medium text-gray-700">
                  {[...Array(days.filter((d) => d === null).length)].map((_, i) => (
                    <span key={`empty-${idx}-${i}`} />
                  ))}
                  {days
                    .filter((d) => d !== null)
                    .map((date) => {
                      const d = date!;
                      const selected = isSelected(d);
                      const inRange = isInRange(d);
                      const today = isToday(d);
                      const disabled = isBeforeToday(d) && !selected;
                      const isStart =
                        checkIn &&
                        checkIn.jy === d.jy &&
                        checkIn.jm === d.jm &&
                        checkIn.jd === d.jd;
                      const isEnd =
                        checkOut &&
                        checkOut.jy === d.jy &&
                        checkOut.jm === d.jm &&
                        checkOut.jd === d.jd;
                      return (
                        <span
                          key={`day-${idx}-${d.jd}`}
                          onClick={() => selectDate(d)}
                          onMouseEnter={() => setHoveredDate(d)}
                          onMouseLeave={() => setHoveredDate(null)}
                          className={`py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                            disabled
                              ? "text-gray-300 cursor-not-allowed"
                              : "text-gray-800 hover:bg-gray-50 hover:text-[#e21b5b]"
                          } ${
                            selected || isStart || isEnd
                              ? "bg-[#e21b5b] text-white rounded-lg font-bold"
                              : ""
                          } ${
                            (inRange ||
                              (hoveredDate &&
                                checkIn &&
                                !checkOut &&
                                isBetween(d, checkIn, hoveredDate))) &&
                            !selected
                              ? "bg-[#e21b5b]/10"
                              : ""
                          } ${
                            today && !selected
                              ? "border border-[#e21b5b]/30"
                              : ""
                          }`}
                        >
                          {toPersianNumerals(d.jd)}
                        </span>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>

          {checkIn && checkOut && (
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[11px] text-gray-500">
                {formatDateRangeSummary(checkIn, checkOut)}
              </span>
              <button
                onClick={confirmDates}
                className="bg-[#e21b5b] text-white px-5 py-1.5 rounded-xl text-xs font-bold hover:bg-[#d1134e] transition"
              >
                تایید
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
