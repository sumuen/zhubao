import type { SummaryItemData } from "@/lib/types";

type SummaryItemProps = {
  item: SummaryItemData;
};

export function SummaryItem({ item }: SummaryItemProps) {
  return (
    <article className={item.wide ? "summary-item summary-item--wide" : "summary-item"}>
      <span className="summary-item__label">{item.label}</span>
      <strong className="summary-item__value">{item.value}</strong>
    </article>
  );
}
