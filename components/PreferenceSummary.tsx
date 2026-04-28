import type { SummaryItemData } from "@/lib/types";
import { SummaryItem } from "./SummaryItem";

type PreferenceSummaryProps = {
  items: SummaryItemData[];
};

export function PreferenceSummary({ items }: PreferenceSummaryProps) {
  return (
    <section className="summary-panel" aria-labelledby="summary-title">
      <h2 id="summary-title" className="summary-panel__title">
        您的偏好总结
      </h2>
      <div className="summary-grid">
        {items.map((item) => (
          <SummaryItem key={item.label} item={item} />
        ))}
      </div>
    </section>
  );
}
