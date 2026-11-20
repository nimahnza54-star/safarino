import { useAnnouncementDismiss } from "@/hooks/useAnnouncementDismiss";
import { TOP_NOTIFICATION } from "@/mock/content/site-content.mock";

/**
 * Dismissible top announcement bar.
 *
 * Renders the announcement from `TOP_NOTIFICATION` by default. The close
 * button persists the dismissal to `localStorage` keyed by the
 * announcement's `id`, so the bar stays hidden after refreshes and future
 * visits. Changing `TOP_NOTIFICATION.id` shows the new announcement again.
 */
export function TopNotificationBar() {
  const { visible, dismiss } = useAnnouncementDismiss(TOP_NOTIFICATION.id);

  if (!visible) return null;

  return (
    <div
      className="bg-amber-100 text-amber-900 border-b border-amber-200 text-xs py-2 px-4 flex items-center justify-between text-center relative z-50"
      role="status"
    >
      <div className="max-w-7xl mx-auto flex items-center gap-2 font-medium">
        <i className="fa-solid fa-bullhorn text-amber-600" aria-hidden="true" />
        <span>{TOP_NOTIFICATION.message}</span>
      </div>
      <button
        type="button"
        onClick={dismiss}
        className="text-amber-700 hover:text-amber-950 px-2 font-bold text-sm"
        aria-label="بستن اطلاعیه"
      >
        <i className="fa-solid fa-xmark" aria-hidden="true" />
      </button>
    </div>
  );
}