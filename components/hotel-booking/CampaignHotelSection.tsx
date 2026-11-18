"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getCampaignById,
  getCampaignHotels,
} from "@/services/campaigns.service";
import { useNowSeconds } from "@/hooks/useNowSeconds";
import { HotelGrid, type GridStatus } from "./HotelGrid";
import { Countdown } from "./Countdown";
import { Modal } from "./Modal";
import type { Campaign, CampaignId, DiscountedHotel } from "@/types/campaign";

const PREVIEW_COUNT = 4;

interface CampaignHotelSectionProps {
  campaignId: CampaignId;
}

/**
 * Promotional hotel lists («تخفیف اولین رزرو»، «وفاداری»، «لحظه آخری»).
 * Membership and pricing come entirely from the campaign service, so the
 * «همه هتل‌ها» toggle only ever shows hotels inside the campaign.
 * The last-minute variant renders a live countdown and switches to an
 * expired state once the stable timestamp in mock config passes.
 */
export function CampaignHotelSection({ campaignId }: CampaignHotelSectionProps) {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [hotels, setHotels] = useState<DiscountedHotel[]>([]);
  const [status, setStatus] = useState<GridStatus>("loading");
  const [showAll, setShowAll] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);
  const nowSec = useNowSeconds();

  useEffect(() => {
    let alive = true;
    Promise.all([getCampaignById(campaignId), getCampaignHotels(campaignId)])
      .then(([campaignData, hotelData]) => {
        if (!alive) return;
        setCampaign(campaignData ?? null);
        setHotels(hotelData);
        setStatus("success");
      })
      .catch(() => {
        if (alive) setStatus("error");
      });
    return () => {
      alive = false;
    };
  }, [campaignId, reloadToken]);

  const retry = useCallback(() => {
    setStatus("loading");
    setReloadToken((token) => token + 1);
  }, []);

  const expired =
    campaign?.expiresAt !== undefined && nowSec !== -1
      ? new Date(campaign.expiresAt).getTime() <= nowSec * 1000
      : false;

  const isLastMinute = campaignId === "lastMinute";
  const visible = showAll ? hotels : hotels.slice(0, PREVIEW_COUNT);
  const titleId = `campaign-${campaignId}-title`;

  return (
    <section className="py-8 bg-white" aria-labelledby={titleId}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <h3 id={titleId} className="text-xl font-black text-gray-900">
              {campaign?.title ?? "در حال بارگذاری…"}
            </h3>
            {isLastMinute && campaign?.expiresAt && !expired && status === "success" && (
              <Countdown expiresAt={campaign.expiresAt} />
            )}
            {campaign && (
              <button
                type="button"
                onClick={() => setTermsOpen(true)}
                className="text-[10px] font-bold text-[#0070cd] hover:underline inline-flex items-center gap-1"
              >
                <i className="fa-solid fa-circle-info" aria-hidden="true" />
                شرایط کمپین
              </button>
            )}
          </div>
          {hotels.length > PREVIEW_COUNT && !expired && (
            <button
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
              aria-expanded={showAll}
              className="text-xs font-bold text-[#0070cd] hover:underline flex items-center gap-1"
            >
              <span>{showAll ? "نمایش کمتر" : "همه هتل‌ها"}</span>
              <i
                className={`fa-solid fa-chevron-${showAll ? "up" : "down"} text-[10px]`}
                aria-hidden="true"
              />
            </button>
          )}
        </div>

        {expired ? (
          <div className="text-center py-10 border border-dashed border-gray-200 rounded-2xl bg-gray-50">
            <i className="fa-solid fa-clock text-3xl text-gray-300 mb-3" aria-hidden="true" />
            <p className="text-sm font-black text-gray-700 mb-1">مهلت این پیشنهاد به پایان رسید</p>
            <p className="text-xs text-gray-500 max-w-md mx-auto leading-6">
              کمپین لحظه آخری منقضی شده است و پیشنهادها دیگر قابل رزرو نیستند.
              به‌محض فعال شدن کمپین جدید، همین‌جا اعلام می‌شود.
            </p>
          </div>
        ) : (
          <HotelGrid
            hotels={visible}
            variant={campaignId}
            status={status}
            campaignLabel={campaign?.shortLabel}
            onRetry={retry}
          />
        )}
      </div>

      {campaign && (
        <Modal
          open={termsOpen}
          onClose={() => setTermsOpen(false)}
          title={`شرایط ${campaign.shortLabel}`}
        >
          <p className="text-xs text-gray-500 leading-6 mb-4">{campaign.description}</p>
          <ul className="space-y-2">
            {campaign.terms.map((term) => (
              <li key={term} className="flex items-start gap-2 text-xs text-gray-700 leading-6">
                <i className="fa-solid fa-check text-[#e21b5b] text-[10px] mt-1.5" aria-hidden="true" />
                <span>{term}</span>
              </li>
            ))}
          </ul>
        </Modal>
      )}
    </section>
  );
}
