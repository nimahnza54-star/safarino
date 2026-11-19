"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getAccommodationCampaignById,
  getCampaignAccommodations,
} from "@/services/accommodation-campaigns.service";
import { useNowSeconds } from "@/hooks/useNowSeconds";
import { AccommodationGrid, type GridStatus } from "./AccommodationGrid";
import { Countdown } from "@/components/hotel-booking/Countdown";
import { Modal } from "@/components/hotel-booking/Modal";
import type {
  AccommodationCampaign,
  AccommodationCampaignId,
  DiscountedAccommodation,
} from "@/types/accommodation-campaign";

const PREVIEW_COUNT = 4;

interface CampaignAccommodationSectionProps {
  campaignId: AccommodationCampaignId;
  bg?: "white" | "gray";
}

/**
 * Promotional accommodation lists (first-booking / loyalty / last-minute).
 * Membership and pricing come entirely from the campaign service, so the
 * «همه اقامتگاه‌ها» toggle only ever shows eligible accommodations.
 * The last-minute variant renders a live countdown and switches to an
 * expired state once the stable timestamp in mock config passes.
 */
export function CampaignAccommodationSection({
  campaignId,
  bg = "white",
}: CampaignAccommodationSectionProps) {
  const [campaign, setCampaign] = useState<AccommodationCampaign | null>(null);
  const [accommodations, setAccommodations] = useState<DiscountedAccommodation[]>([]);
  const [status, setStatus] = useState<GridStatus>("loading");
  const [showAll, setShowAll] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);
  const nowSec = useNowSeconds();

  useEffect(() => {
    let alive = true;
    Promise.all([
      getAccommodationCampaignById(campaignId),
      getCampaignAccommodations(campaignId),
    ])
      .then(([campaignData, accommodationData]) => {
        if (!alive) return;
        setCampaign(campaignData ?? null);
        setAccommodations(accommodationData);
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
  const visible = showAll ? accommodations : accommodations.slice(0, PREVIEW_COUNT);
  const titleId = `accommodation-campaign-${campaignId}-title`;

  return (
    <section
      className={`py-8 ${bg === "gray" ? "bg-gray-50/50" : "bg-white"}`}
      aria-labelledby={titleId}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <h3 id={titleId} className="text-xl font-black text-gray-900">
              {campaign?.title ?? "در حال بارگذاری پیشنهادها…"}
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
          {accommodations.length > PREVIEW_COUNT && !expired && (
            <button
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
              aria-expanded={showAll}
              className="text-xs font-bold text-[#0070cd] hover:underline flex items-center gap-1"
            >
              <span>{showAll ? "نمایش کمتر" : "همه اقامتگاه‌ها"}</span>
              <i
                className={`fa-solid fa-chevron-${showAll ? "up" : "down"} text-[10px]`}
                aria-hidden="true"
              />
            </button>
          )}
        </div>

        {campaign && (
          <p className="text-[10px] text-gray-400 -mt-3 mb-4">{campaign.description}</p>
        )}

        {expired ? (
          <div className="text-center py-10 border border-dashed border-gray-200 rounded-2xl bg-gray-50">
            <i className="fa-solid fa-clock text-3xl text-gray-300 mb-3" aria-hidden="true" />
            <p className="text-sm font-black text-gray-700 mb-1">
              مهلت این پیشنهاد به پایان رسید
            </p>
            <p className="text-xs text-gray-500 max-w-md mx-auto leading-6">
              تخفیف لحظه آخری منقضی شده و دیگر اعمال نمی‌شود. پیشنهادهای فعال را در سایر بخش‌ها ببینید.
            </p>
          </div>
        ) : (
          <AccommodationGrid
            accommodations={visible}
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
