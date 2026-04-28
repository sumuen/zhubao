import { ArrowLeft, Heart, MessageCircle, Star } from "lucide-react";

const reviews = [
  "颜色搭配比预想更温柔，日常佩戴也很亮眼。",
  "设计师会解释每一颗水晶的搭配逻辑，沟通很细。",
  "收到实物很惊喜，包装和配件都挺完整。",
  "预算内给了好几个方案，最后定稿很顺。",
  "手围尺寸合适，佩戴不勒也不松。",
  "朋友看到以后也想做同款风格。",
];

export default function CustomerReviewPage() {
  return (
    <main className="info-page-shell">
      <section className="info-hero">
        <a className="back-link" href="/prefer/1">
          <ArrowLeft size={16} aria-hidden="true" />
          返回偏好总结
        </a>
        <MessageCircle size={44} aria-hidden="true" />
        <h1>Snow's Design客户反馈集锦</h1>
        <p>真实客户评价风格的本地演示页面。</p>
        <div className="review-stats">
          <span>
            <Heart size={16} aria-hidden="true" />
            已收录 975 条
          </span>
          <span>
            <Star size={16} aria-hidden="true" />
            高频好评
          </span>
        </div>
      </section>

      <section className="review-grid" aria-label="客户反馈">
        {reviews.map((review, index) => (
          <article className="review-card" key={review}>
            <div className="review-card__rating" aria-label="五星评价">
              {Array.from({ length: 5 }).map((_, starIndex) => (
                <Star key={starIndex} size={14} aria-hidden="true" />
              ))}
            </div>
            <p>{review}</p>
            <span>顾客反馈 #{index + 1}</span>
          </article>
        ))}
      </section>
    </main>
  );
}
