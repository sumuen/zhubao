import { ArrowLeft, CheckCircle2, Gem } from "lucide-react";

const steps = [
  ["01", "发送您的生辰信息", "提供生辰、性别与希望助旺的方向，命理老师一对一排盘。"],
  ["02", "五行定制沟通", "根据五行生克与个人诉求，确认整体助旺思路。"],
  ["03", "填写水晶外观偏好", "完成定制偏好收集表，让设计师理解尺寸、颜色、预算与配饰喜好。"],
  ["04", "专业设计师进群设计", "结合命理建议和外观偏好，提供可调整的专属设计方案。"],
  ["05", "设计定版后祈福加持", "确认方案后安排制作，根据需求安排鉴定证书等专属服务。"],
  ["06", "包邮发出，期待返图", "随附护理物料与小配件，等待最终佩戴反馈。"],
];

export default function StepPage() {
  return (
    <main className="info-page-shell">
      <section className="info-hero">
        <a className="back-link" href="/prefer/1">
          <ArrowLeft size={16} aria-hidden="true" />
          返回偏好总结
        </a>
        <Gem size={44} aria-hidden="true" />
        <h1>Snow's Design能量水晶定制流程</h1>
        <p>专业命理分析、专属定制设计与交付流程预览。</p>
      </section>

      <section className="process-timeline" aria-label="定制流程">
        {steps.map(([number, title, description]) => (
          <article className="process-step" key={number}>
            <span>{number}</span>
            <div>
              <h2>{title}</h2>
              <p>{description}</p>
            </div>
            <CheckCircle2 size={20} aria-hidden="true" />
          </article>
        ))}
      </section>
    </main>
  );
}
