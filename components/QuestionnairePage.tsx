"use client";

import {
  ArrowLeft,
  ArrowRight,
  Calculator,
  Check,
  Crown,
  Gem,
  Minus,
  Palette,
  Ruler,
  Sparkles,
  Star,
  Waves,
} from "lucide-react";
import { useMemo, useState } from "react";
import { CompletionPage } from "@/components/CompletionPage";
import { colorPalette, initialQuestionnaireState } from "@/lib/questionnaire-data";
import type { PreferenceSummaryData, QuestionnaireState } from "@/lib/types";

const totalSteps = 8;

const beadOptions = [
  { value: "12-15mm", title: "12-15mm", description: "大气奢华", tone: "large" },
  { value: "8-10mm", title: "8-10mm", description: "精致小巧", tone: "small" },
];

const combinationOptions = [
  {
    value: "3种以内",
    title: "至简素雅",
    subtitle: "(3种以内的水晶)",
    badge: "19%顾客选择",
    badgeTone: "cool",
    imageSlot: "图3-1",
    description: "风格纯粹，经典耐看，更显素雅大气",
  },
  {
    value: "3-8种",
    title: "经典设计",
    subtitle: "(3-8种水晶)",
    badge: "72%顾客选择",
    badgeTone: "warm",
    imageSlot: "图3-2",
    description: "最受欢迎，在丰富与简约间的平衡，水晶之美交相辉映。",
  },
  {
    value: "8种以上",
    title: "缤纷多宝",
    subtitle: "(8种以上的水晶)",
    badge: "9%顾客选择",
    badgeTone: "rose",
    imageSlot: "图3-3",
    description: "汇聚尽可能多种的水晶，色彩缤纷而明亮",
  },
];

const budgetOptions = [
  ["500元以内", "入门级选择"],
  ["500-1000元", "性价比之选"],
  ["1000-2000元", "品质保证"],
  ["2000-3000元", "精品系列"],
  ["3000-5000元", "高端定制"],
  ["5000-8000元", "奢华体验"],
  ["8000-1.5万元", "顶级品质"],
  ["1.5万元以上", "收藏级别"],
];

const colorIntensityOptions = ["淡雅一点", "适中", "浓郁一点"];
const textureOptions = ["清透一点", "质感适中", "实感一点"];

const accessoryOptions = [
  ["水晶跑环/随形珠等", "闪耀夺目，凸显天然水晶之美", Gem],
  ["铜镀银/镀金配饰", "性价比高，款式多样，使用广泛", Star],
  ["银配饰", "优雅质感高级，比铜配贵但不会褪色", Sparkles],
  ["k金配饰", "真金永不变色，款式可定制，除了贵没缺点", Crown],
  ["无配饰", "极简，不要配饰", Minus],
] as const;

type QuestionnairePageProps = {
  initialState?: QuestionnaireState;
};

export function QuestionnairePage({
  initialState = initialQuestionnaireState,
}: QuestionnairePageProps) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<QuestionnaireState>(initialState);
  const [isComplete, setIsComplete] = useState(false);

  const wristEstimateText = useMemo(
    () => getWristEstimateText(form.height, form.weight),
    [form.height, form.weight],
  );

  const isCurrentStepValid = useMemo(() => {
    switch (step) {
      case 1:
        return form.beadSizes.length > 0;
      case 2:
        return Number(form.height) > 0 && Number(form.weight) > 0;
      case 3:
        return form.combinations.length > 0;
      case 4:
        return Boolean(form.exactBudget.trim() || form.budgetPreset);
      case 5:
        return Boolean(form.colorIntensity);
      case 6:
        return form.textures.length > 0;
      case 7:
        return form.accessories.length > 0;
      default:
        return true;
    }
  }, [form, step]);

  if (isComplete) {
    return <CompletionPage data={toPreferenceSummary(form, wristEstimateText)} />;
  }

  function update<K extends keyof QuestionnaireState>(
    key: K,
    value: QuestionnaireState[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function toggleList(key: ListKey, value: string, maxItems?: number) {
    setForm((current) => {
      const values = current[key];
      const nextValues = values.includes(value)
        ? values.filter((item) => item !== value)
        : maxItems && values.length >= maxItems
          ? [...values.slice(1), value]
          : [...values, value];

      return { ...current, [key]: nextValues };
    });
  }

  function toggleColor(kind: "likedColors" | "dislikedColors", value: string) {
    const opposite = kind === "likedColors" ? "dislikedColors" : "likedColors";
    setForm((current) => {
      const exists = current[kind].includes(value);
      return {
        ...current,
        [kind]: exists
          ? current[kind].filter((item) => item !== value)
          : [...current[kind], value],
        [opposite]: current[opposite].filter((item) => item !== value),
      };
    });
  }

  function goNext() {
    if (!isCurrentStepValid) {
      return;
    }

    if (step === totalSteps) {
      setIsComplete(true);
      window.scrollTo({ top: 0, left: 0 });
      return;
    }

    setStep((value) => Math.min(totalSteps, value + 1));
    window.scrollTo({ top: 0, left: 0 });
  }

  function goBack() {
    setStep((value) => Math.max(1, value - 1));
    window.scrollTo({ top: 0, left: 0 });
  }

  return (
    <main className={`questionnaire-shell questionnaire-shell--step-${step}`}>
      <div className="questionnaire-progress" aria-label={`当前进度 ${step}/${totalSteps}`}>
        <div className="questionnaire-progress__track">
          <span
            className="questionnaire-progress__fill"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
        <span className="questionnaire-progress__text">
          {step}/{totalSteps}
        </span>
      </div>

      <section className="questionnaire-card" aria-live="polite">
        {step === 1 && (
          <QuestionStep
            title="选择您喜欢的珠子大小"
            icon={<span className="filled-gem-icon" />}
            description="可以选择多个尺寸，我们将为您推荐最适合的组合"
            multi
          >
            <div className="choice-grid choice-grid--two">
              {beadOptions.map((option) => (
                <button
                  className={choiceClass(form.beadSizes.includes(option.value))}
                  key={option.value}
                  type="button"
                  onClick={() => toggleList("beadSizes", option.value)}
                >
                  <span className={`bead-visual bead-visual--${option.tone}`} />
                  <strong>{option.title}</strong>
                  <span>{option.description}</span>
                </button>
              ))}
            </div>
            <BraceletSizeReference />
          </QuestionStep>
        )}

        {step === 2 && (
          <QuestionStep
            title="基本信息"
            icon={<Ruler />}
            description="请填写身高和体重，我们会估算您的大致手围"
          >
            <div className="form-grid">
              <label className="field-card">
                <span>身高（厘米）</span>
                <input
                  inputMode="decimal"
                  min="120"
                  max="220"
                  type="number"
                  value={form.height}
                  onChange={(event) => update("height", event.target.value)}
                  placeholder="请输入您的身高"
                />
              </label>
              <label className="field-card">
                <span>体重（公斤）</span>
                <input
                  inputMode="decimal"
                  min="30"
                  max="180"
                  type="number"
                  value={form.weight}
                  onChange={(event) => update("weight", event.target.value)}
                  placeholder="请输入您的体重"
                />
              </label>
            </div>
            <div className="result-card">
              <Calculator size={16} aria-hidden="true" />
              <span className="result-card__text">
                估算手围：<strong>{wristEstimateText}</strong>
              </span>
            </div>
          </QuestionStep>
        )}

        {step === 3 && (
          <QuestionStep
            title="用多少种水晶搭配"
            icon={<Gem />}
            description="请根据您的喜好选择 1-2 个搭配风格"
          >
            <div className="combination-list">
              {combinationOptions.map((option) => (
                <button
                  className={combinationClass(form.combinations.includes(option.value))}
                  key={option.value}
                  type="button"
                  onClick={() => toggleList("combinations", option.value, 2)}
                >
                  <span className="combination-preview">
                    <span className="illustration-placeholder__code">{option.imageSlot}</span>
                    <span className="illustration-placeholder__title">示意图待填入</span>
                    <span className="illustration-placeholder__meta">{option.value}水晶</span>
                  </span>
                  <span className="combination-copy">
                    <span className="combination-copy__head">
                      <span className="combination-title">
                        {option.title} <small>{option.subtitle}</small>
                      </span>
                      <span className={`combination-badge combination-badge--${option.badgeTone}`}>
                        {option.badge}
                      </span>
                    </span>
                    <span className="combination-desc">{option.description}</span>
                  </span>
                </button>
              ))}
            </div>
            <p className="soft-hint soft-hint--caption">
              示意图仅展示水晶种类数量简略所影响的风格，不代表为您设计的具体款式、水晶品质
            </p>
          </QuestionStep>
        )}

        {step === 4 && (
          <QuestionStep
            title="您的定制预算范围"
            icon={<Crown />}
            description="设计师会根据预算选用相应品级的水晶"
          >
            <div className="budget-grid">
              {budgetOptions.map(([value, desc]) => (
                <button
                  className={choiceClass(form.budgetPreset === value)}
                  key={value}
                  type="button"
                  onClick={() => update("budgetPreset", value)}
                >
                  <strong>{value}</strong>
                  <span>{desc}</span>
                </button>
              ))}
            </div>
            <label className="exact-budget">
              <span>也可输入具体预算：</span>
              <input
                inputMode="numeric"
                min="0"
                type="number"
                value={form.exactBudget}
                onChange={(event) => update("exactBudget", event.target.value)}
                placeholder="请输入"
              />
              <span>元</span>
            </label>
            <div className="benefit-list">
              <Benefit threshold="1000元以上" text="赠带有个人八字的专属智能芯片活扣挂坠" />
              <Benefit threshold="3000元以上" text="可按需附赠 CMA 国检证书" />
              <Benefit threshold="8000元以上" text="专家鉴选签名，高阶收藏级服务" />
            </div>
          </QuestionStep>
        )}

        {step === 5 && (
          <QuestionStep
            title="水晶颜色偏好"
            icon={<Palette />}
            description="请选择您喜欢的水晶色彩，可补充喜欢和不喜欢的颜色"
            multi
          >
            <SectionLabel>色彩偏好</SectionLabel>
            <div className="choice-grid choice-grid--three">
              {colorIntensityOptions.map((value) => (
                <button
                  className={choiceClass(form.colorIntensity === value)}
                  key={value}
                  type="button"
                  onClick={() => update("colorIntensity", value)}
                >
                  <span>{value}</span>
                </button>
              ))}
            </div>

            <SectionLabel>特别喜欢的</SectionLabel>
            <ColorChipGrid
              selected={form.likedColors}
              onToggle={(value) => toggleColor("likedColors", value)}
            />

            <SectionLabel>特别不喜欢的</SectionLabel>
            <ColorChipGrid
              selected={form.dislikedColors}
              onToggle={(value) => toggleColor("dislikedColors", value)}
              muted
            />
          </QuestionStep>
        )}

        {step === 6 && (
          <QuestionStep
            title="水晶质感偏好"
            icon={<Waves />}
            description="请选择您喜欢的水晶质感，可多选"
            multi
          >
            <section className="texture-panel" aria-label="质感偏好">
              <h2>质感偏好</h2>
              <div className="texture-grid">
                {textureOptions.map((value) => (
                  <button
                    className={`texture-card${form.textures.includes(value) ? " is-selected" : ""}`}
                    key={value}
                    type="button"
                    onClick={() => toggleList("textures", value)}
                  >
                    <span className="texture-card__sample" aria-hidden="true" />
                    <span>{value}</span>
                  </button>
                ))}
              </div>
            </section>
          </QuestionStep>
        )}

        {step === 7 && (
          <QuestionStep
            title="配饰类型偏好"
            icon={<Sparkles />}
            description="可以选择多种配饰类型"
            multi
          >
            <div className="accessory-list">
              {accessoryOptions.map(([value, description, Icon]) => (
                <button
                  className={accessoryClass(form.accessories.includes(value))}
                  key={value}
                  type="button"
                  onClick={() => toggleList("accessories", value)}
                >
                  <Icon size={20} aria-hidden="true" />
                  <span>
                    <strong>{value}</strong>
                    <small>{description}</small>
                  </span>
                </button>
              ))}
            </div>
          </QuestionStep>
        )}

        {step === 8 && (
          <QuestionStep
            title="其他要求"
            icon={<Sparkles />}
            description="请告诉我们您的特殊喜好或禁忌"
          >
            <label className="textarea-card">
              <span>喜欢或不喜欢的颜色，等其他偏好要求</span>
              <textarea
                value={form.requirements}
                onChange={(event) => update("requirements", event.target.value)}
                placeholder="例如：喜欢XX色/不喜欢XX色，喜欢水晶种类多一点/少一点..."
              />
            </label>
          </QuestionStep>
        )}
      </section>

      <nav
        className={step === 1 ? "questionnaire-nav questionnaire-nav--single" : "questionnaire-nav"}
        aria-label="问卷导航"
      >
        {step > 1 ? (
          <button className="nav-button nav-button--secondary" type="button" onClick={goBack}>
            <ArrowLeft size={18} aria-hidden="true" />
            上一步
          </button>
        ) : (
          null
        )}
        <button
          className="nav-button nav-button--primary"
          disabled={!isCurrentStepValid}
          type="button"
          onClick={goNext}
        >
          <span className="nav-button__content">
            {step === totalSteps ? "完成" : "下一步"}
            {step === totalSteps ? (
              <Check size={18} aria-hidden="true" />
            ) : (
              <ArrowRight size={18} aria-hidden="true" />
            )}
          </span>
          {step === 1 ? <Gem className="nav-button__gem" size={22} aria-hidden="true" /> : null}
        </button>
        {step > 1 ? <span className="questionnaire-nav__spacer" aria-hidden="true" /> : null}
      </nav>
    </main>
  );
}

type ListKey = "beadSizes" | "combinations" | "textures" | "accessories";

type StepProps = {
  title: string;
  icon: React.ReactNode;
  description: string;
  multi?: boolean;
  children: React.ReactNode;
};

function QuestionStep({ title, icon, description, multi, children }: StepProps) {
  return (
    <>
      <header className="question-step-header">
        <h1>
          <span aria-hidden="true">{icon}</span>
          {title}
        </h1>
        <p>✨ {description}</p>
        {multi ? <span className="multi-pill">可多选</span> : null}
      </header>
      <div className="question-step-body">{children}</div>
    </>
  );
}

function BraceletSizeReference() {
  return (
    <figure className="size-reference" aria-label="珠子大小参考">
      <div className="size-reference__stage">
        <span className="illustration-placeholder__code">图1-1</span>
        <span className="illustration-placeholder__title">示意图待填入</span>
        <span className="illustration-placeholder__meta">珠子大小对比</span>
      </div>
    </figure>
  );
}

function Benefit({ threshold, text }: { threshold: string; text: string }) {
  return (
    <div className="benefit-item">
      <strong>{threshold}</strong>
      <span>{text}</span>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h2 className="section-label">{children}</h2>;
}

function ColorChipGrid({
  selected,
  onToggle,
  muted,
}: {
  selected: string[];
  onToggle: (value: string) => void;
  muted?: boolean;
}) {
  return (
    <div className="color-chip-grid">
      {colorPalette.map((item) => (
        <button
          className={`color-chip-button${selected.includes(item.name) ? " is-selected" : ""}${
            muted ? " color-chip-button--muted" : ""
          }`}
          key={item.name}
          type="button"
          onClick={() => onToggle(item.name)}
        >
          <span style={{ backgroundColor: item.color }} />
          {item.name}
        </button>
      ))}
    </div>
  );
}

function getWristEstimateText(height: string, weight: string) {
  const heightValue = Number(height);
  const weightValue = Number(weight);

  if (!heightValue || !weightValue) {
    return "填写身高体重后估算";
  }

  return "待接入估算逻辑";
}

function toPreferenceSummary(
  form: QuestionnaireState,
  wristEstimateText: string,
): PreferenceSummaryData {
  const colorNotes = [
    form.likedColors.length ? `喜欢颜色：${form.likedColors.join("、")}` : "",
    form.dislikedColors.length ? `不喜欢颜色：${form.dislikedColors.join("、")}` : "",
  ].filter(Boolean);

  return {
    customerName: "用户名XX",
    beadSize: form.beadSizes.join("、"),
    wristSize: wristEstimateText,
    stylePreference: form.combinations.join("、"),
    budget: form.exactBudget.trim() || form.budgetPreset,
    colorPreference: form.colorIntensity,
    texturePreference: form.textures.join("、"),
    accessoryType: form.accessories.join("、"),
    specialRequest: [form.requirements.trim(), ...colorNotes].filter(Boolean).join("；"),
  };
}

function choiceClass(selected: boolean) {
  return selected ? "choice-card is-selected" : "choice-card";
}

function combinationClass(selected: boolean) {
  return selected ? "combination-card is-selected" : "combination-card";
}

function accessoryClass(selected: boolean) {
  return selected ? "accessory-option is-selected" : "accessory-option";
}
