import { Check, Gem, PartyPopper, RotateCcw, Star } from "lucide-react";
import { ActionLink } from "@/components/ActionLink";
import { PreferenceSummary } from "@/components/PreferenceSummary";
import { toSummaryItems } from "@/lib/mock-data";
import type { PreferenceSummaryData } from "@/lib/types";

type CompletionPageProps = {
  data: PreferenceSummaryData;
  processHref?: string;
  reviewsHref?: string;
  editHref?: string;
};

export function CompletionPage({
  data,
  processHref = "/step",
  reviewsHref = "/CustomerReview",
  editHref = "/prefer/1?edit=True",
}: CompletionPageProps) {
  const summaryItems = toSummaryItems(data);

  return (
    <main className="page-shell">
      <section className="completion-sheet" aria-labelledby="completion-title">
        <header className="completion-hero">
          <div className="completion-hero__check" aria-hidden="true">
            <Check size={38} strokeWidth={3.5} />
          </div>
          <h1 id="completion-title" className="completion-hero__title">
            <PartyPopper size={31} strokeWidth={2.4} aria-hidden="true" />
            问卷完成！
          </h1>
          <p className="completion-hero__message">
            ✨ 好的，{data.customerName}，您的偏好们已经记下了，相信设计师一定能设计出您满意的水晶~
          </p>
        </header>

        <PreferenceSummary items={summaryItems} />

        <nav className="action-list" aria-label="后续操作">
          <ActionLink
            icon={Gem}
            title="了解定制过程"
            description="查看Snow's Design水晶定制流程"
            href={processHref}
          />
          <ActionLink
            icon={Star}
            title="查看顾客反馈"
            description="了解其他顾客的真实评价"
            href={reviewsHref}
          />
        </nav>

        <p className="resubmit-row">
          <a className="subtle-link" href={editHref}>
            <RotateCcw size={16} strokeWidth={2.4} aria-hidden="true" />
            需要修改您的偏好？
          </a>
        </p>
      </section>
    </main>
  );
}
