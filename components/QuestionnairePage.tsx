"use client";

import {
  ArrowLeft,
  ArrowRight,
  Calculator,
  Check,
  Crown,
  Gem,
  Info,
  Minus,
  Palette,
  Ruler,
  Sparkles,
  Star,
  Waves,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { CompletionPage } from "@/components/CompletionPage";
import { colorPalette, initialQuestionnaireState } from "@/lib/questionnaire-data";
import type { PreferenceSummaryData, QuestionnaireState } from "@/lib/types";
import type { FittyInstance } from "fitty";

const totalSteps = 8;
const largeBeadSizeValue = "12-15mm";
const blockedLargeBeadBudgetValue = "500元以内";
const largeBeadBudgetWarningText =
  "亲，选择大珠珠时，预算500元以内无法保障纯天然水晶品质，请调整预算或珠子大小";
const maxTextureSelections = 2;
const textureLimitWarningText = "最多只能选择两项";
const maxAccessorySelections = 2;
const accessoryLimitWarningText = "最多只能选择两项配饰";
const silverAccessoryValue = "银配饰";
const kGoldAccessoryValue = "k金配饰";
const accessoryBudgetHintText =
  "亲，目前黄金价格太高，预算2000元以内难以搭配k金配饰；类似的预算500元以内难以搭配纯银配饰哦";

const beadOptions = [
  { value: largeBeadSizeValue, title: "12-15mm", description: "大气奢华", tone: "large" },
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
    imageSrc: "/reference-images/3-1.jpg",
    description: "风格纯粹，经典耐看，更显素雅大气",
  },
  {
    value: "3-8种",
    title: "经典设计",
    subtitle: "(3-8种水晶)",
    badge: "72%顾客选择",
    badgeTone: "warm",
    imageSlot: "图3-2",
    imageSrc: "/reference-images/3-2.jpg",
    description: "最受欢迎，在丰富与简约间的平衡，水晶之美交相辉映。",
  },
  {
    value: "8种以上",
    title: "缤纷多宝",
    subtitle: "(8种以上的水晶)",
    badge: "9%顾客选择",
    badgeTone: "rose",
    imageSlot: "图3-3",
    imageSrc: "/reference-images/3-3.jpg",
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

const colorIntensityOptions = [
  { value: "淡雅一点", label: "淡雅一点", color: "#FFE4E1" },
  { value: "适中", label: "颜色适中", color: "#FF6B6B" },
  { value: "浓郁一点", label: "浓郁一点", color: "#8B0000" },
] as const;
const textureOptions = [
  { value: "清透一点", label: "清透一点", tone: "clear" },
  { value: "质感适中", label: "质感适中", tone: "balanced" },
  { value: "实感一点", label: "实感一点", tone: "solid" },
] as const;

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
  const [hasStarted, setHasStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showBudgetWarning, setShowBudgetWarning] = useState(false);
  const [showTextureWarning, setShowTextureWarning] = useState(false);
  const [showAccessoryWarning, setShowAccessoryWarning] = useState(false);
  const budgetWarningTimerRef = useRef<number | null>(null);
  const textureWarningTimerRef = useRef<number | null>(null);
  const accessoryWarningTimerRef = useRef<number | null>(null);
  const hasLargeBeadSize = form.beadSizes.includes(largeBeadSizeValue);

  const wristEstimateText = useMemo(
    () => getWristEstimateText(form.height, form.weight),
    [form.height, form.weight],
  );
  const accessoryBudgetRestriction = useMemo(
    () => getAccessoryBudgetRestriction(form.budgetPreset, form.exactBudget),
    [form.budgetPreset, form.exactBudget],
  );
  const budgetBlockedAccessories = useMemo(
    () => getBudgetBlockedAccessories(accessoryBudgetRestriction),
    [accessoryBudgetRestriction],
  );

  useEffect(() => {
    if (!hasLargeBeadSize && showBudgetWarning) {
      hideBudgetWarning();
    }
  }, [hasLargeBeadSize, showBudgetWarning]);

  useEffect(() => {
    setForm((current) =>
      current.beadSizes.includes(largeBeadSizeValue) &&
      current.budgetPreset === blockedLargeBeadBudgetValue
        ? { ...current, budgetPreset: "" }
        : current,
    );
  }, [form.beadSizes, form.budgetPreset]);

  useEffect(() => {
    return () => {
      clearBudgetWarningTimer();
      clearTextureWarningTimer();
      clearAccessoryWarningTimer();
    };
  }, []);

  useEffect(() => {
    if (step !== 6 && showTextureWarning) {
      hideTextureWarning();
    }
  }, [showTextureWarning, step]);

  useEffect(() => {
    if (step !== 7 && showAccessoryWarning) {
      hideAccessoryWarning();
    }
  }, [showAccessoryWarning, step]);

  useEffect(() => {
    if (budgetBlockedAccessories.length === 0) {
      return;
    }

    setForm((current) => {
      const nextAccessories = current.accessories.filter(
        (value) => !budgetBlockedAccessories.includes(value),
      );

      return nextAccessories.length === current.accessories.length
        ? current
        : { ...current, accessories: nextAccessories };
    });
  }, [budgetBlockedAccessories]);

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

  if (!hasStarted) {
    return (
      <WelcomeScreen
        onStart={() => {
          setHasStarted(true);
          window.scrollTo({ top: 0, left: 0 });
        }}
      />
    );
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

  function clearBudgetWarningTimer() {
    if (budgetWarningTimerRef.current !== null) {
      window.clearTimeout(budgetWarningTimerRef.current);
      budgetWarningTimerRef.current = null;
    }
  }

  function hideBudgetWarning() {
    clearBudgetWarningTimer();
    setShowBudgetWarning(false);
  }

  function showLargeBeadBudgetWarning() {
    clearBudgetWarningTimer();
    setShowBudgetWarning(true);
    budgetWarningTimerRef.current = window.setTimeout(() => {
      setShowBudgetWarning(false);
      budgetWarningTimerRef.current = null;
    }, 5000);
  }

  function isLargeBeadBudgetBlocked(value: string) {
    return hasLargeBeadSize && value === blockedLargeBeadBudgetValue;
  }

  function handleBudgetPresetClick(value: string) {
    if (isLargeBeadBudgetBlocked(value)) {
      setForm((current) =>
        current.budgetPreset ? { ...current, budgetPreset: "" } : current,
      );
      showLargeBeadBudgetWarning();
      return;
    }

    hideBudgetWarning();
    update("budgetPreset", value);
  }

  function clearTextureWarningTimer() {
    if (textureWarningTimerRef.current !== null) {
      window.clearTimeout(textureWarningTimerRef.current);
      textureWarningTimerRef.current = null;
    }
  }

  function hideTextureWarning() {
    clearTextureWarningTimer();
    setShowTextureWarning(false);
  }

  function showTextureLimitWarning() {
    clearTextureWarningTimer();
    setShowTextureWarning(true);
    textureWarningTimerRef.current = window.setTimeout(() => {
      setShowTextureWarning(false);
      textureWarningTimerRef.current = null;
    }, 5000);
  }

  function handleTextureClick(value: string) {
    if (!form.textures.includes(value) && form.textures.length >= maxTextureSelections) {
      showTextureLimitWarning();
      return;
    }

    hideTextureWarning();
    toggleList("textures", value);
  }

  function clearAccessoryWarningTimer() {
    if (accessoryWarningTimerRef.current !== null) {
      window.clearTimeout(accessoryWarningTimerRef.current);
      accessoryWarningTimerRef.current = null;
    }
  }

  function hideAccessoryWarning() {
    clearAccessoryWarningTimer();
    setShowAccessoryWarning(false);
  }

  function showAccessoryLimitWarning() {
    clearAccessoryWarningTimer();
    setShowAccessoryWarning(true);
    accessoryWarningTimerRef.current = window.setTimeout(() => {
      setShowAccessoryWarning(false);
      accessoryWarningTimerRef.current = null;
    }, 5000);
  }

  function handleAccessoryClick(value: string) {
    if (budgetBlockedAccessories.includes(value)) {
      hideAccessoryWarning();
      return;
    }

    if (!form.accessories.includes(value) && form.accessories.length >= maxAccessorySelections) {
      showAccessoryLimitWarning();
      return;
    }

    hideAccessoryWarning();
    toggleList("accessories", value);
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
                    <img
                      className="combination-preview__image"
                      src={option.imageSrc}
                      alt={`${option.imageSlot} ${option.value}水晶搭配示意图`}
                    />
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
              <Info className="soft-hint__icon" size={13} aria-hidden="true" />
              <span>
                示意图仅展示水晶种类数量简略所影响的风格，不代表为您设计的具体款式、水晶品质
              </span>
            </p>
          </QuestionStep>
        )}

        {step === 4 && (
          <QuestionStep
            title="您的定制预算范围"
            icon={<Crown />}
            description="设计师会根据预算选用相应品级的水晶"
          >
            <div className="budget-options-layer">
              {showBudgetWarning ? (
                <div className="budget-warning" role="alert">
                  <Info className="budget-warning__icon" size={18} aria-hidden="true" />
                  <span>{largeBeadBudgetWarningText}</span>
                </div>
              ) : null}
              <div className="budget-grid">
                {budgetOptions.map(([value, desc]) => {
                  const isBlocked = isLargeBeadBudgetBlocked(value);

                  return (
                    <button
                      className={choiceClass(form.budgetPreset === value)}
                      data-blocked={isBlocked ? "true" : undefined}
                      key={value}
                      type="button"
                      onClick={() => handleBudgetPresetClick(value)}
                    >
                      <strong>{value}</strong>
                      <span>{desc}</span>
                    </button>
                  );
                })}
              </div>
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
              <Benefit threshold="所有价格段均赠送" text="喜马拉雅山脉能量原石、香片、擦银布、精美礼盒、终身售后服务" />
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
            <section className="color-intensity-panel" aria-label="色彩偏好">
              <h2 className="color-intensity-title">色彩偏好</h2>
              <div className="color-options three-columns">
                {colorIntensityOptions.map((option) => (
                  <button
                    aria-pressed={form.colorIntensity === option.value}
                    className={`color-option color-card${
                      form.colorIntensity === option.value ? " selected" : ""
                    }`}
                    key={option.value}
                    type="button"
                    onClick={() => update("colorIntensity", option.value)}
                  >
                    <span className="color-icon" aria-hidden="true">
                      <i
                        className="fas fa-gem"
                        style={{ fontSize: "32px", color: option.color }}
                      />
                    </span>
                    <span className="color-text">{option.label}</span>
                  </button>
                ))}
              </div>
            </section>

            <SectionLabel>颜色偏好（若无特别要求，可不选）</SectionLabel>

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
            <div className="texture-options-layer">
              {showTextureWarning ? (
                <div className="budget-warning texture-limit-warning" role="alert">
                  <Info className="budget-warning__icon" size={14} aria-hidden="true" />
                  <span>{textureLimitWarningText}</span>
                </div>
              ) : null}
              <section className="texture-panel" aria-label="质感偏好">
                <h2>质感偏好</h2>
                <div className="texture-grid">
                  {textureOptions.map((option) => (
                    <button
                      aria-pressed={form.textures.includes(option.value)}
                      className={`texture-card texture-card--${option.tone}${
                        form.textures.includes(option.value) ? " is-selected" : ""
                      }`}
                      key={option.value}
                      type="button"
                      onClick={() => handleTextureClick(option.value)}
                    >
                      <span className="texture-card__icon-box" aria-hidden="true">
                        <span className="texture-card__sample" />
                      </span>
                      <span className="texture-card__label">{option.label}</span>
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </QuestionStep>
        )}

        {step === 7 && (
          <QuestionStep
            title="配饰类型偏好"
            icon={<Sparkles />}
            description="可以选择多种配饰类型"
            multi
          >
            <div className="accessory-options-layer">
              {showAccessoryWarning ? (
                <div className="budget-warning accessory-limit-warning" role="alert">
                  <Info className="budget-warning__icon" size={14} aria-hidden="true" />
                  <span>{accessoryLimitWarningText}</span>
                </div>
              ) : null}
              <div className="accessory-list">
                {accessoryOptions.map(([value, description, Icon]) => {
                  const isBudgetBlocked = budgetBlockedAccessories.includes(value);

                  return (
                    <button
                      className={accessoryClass(form.accessories.includes(value), isBudgetBlocked)}
                      data-budget-blocked={isBudgetBlocked ? "true" : undefined}
                      key={value}
                      type="button"
                      onClick={() => handleAccessoryClick(value)}
                    >
                      <Icon size={20} aria-hidden="true" />
                      <span>
                        <strong>{value}</strong>
                        <small>{description}</small>
                      </span>
                    </button>
                  );
                })}
              </div>
              {budgetBlockedAccessories.length > 0 ? (
                <div className="accessory-budget-hint" role="note">
                  <Info className="accessory-budget-hint__icon" size={18} aria-hidden="true" />
                  <span>{accessoryBudgetHintText}</span>
                </div>
              ) : null}
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
          {step < totalSteps ? (
            <img
              className="nav-button__logo"
              src="/brand/nav-logo.png"
              alt=""
              aria-hidden="true"
            />
          ) : null}
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
        <img
          className="size-reference__image"
          src="/reference-images/1-1.jpg"
          alt="图1-1 珠子大小对比示意图"
        />
      </div>
    </figure>
  );
}

function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <main className="welcome-shell">
      <section className="welcome-card" aria-labelledby="welcome-title">
        <img
          className="welcome-logo"
          src="/brand/snow-design-logo.png"
          alt="Snow's Design Crystal Jewelry"
        />
        <AutoFitWelcomeTitle>🔮客户专属定制偏好</AutoFitWelcomeTitle>
        <p>请您开启Snow&apos;s Design专属能量定制之旅</p>
        <button className="welcome-start-button" type="button" onClick={onStart}>
          <span>开始定制</span>
          <ArrowRight size={23} strokeWidth={2.7} aria-hidden="true" />
        </button>
      </section>
    </main>
  );
}

function AutoFitWelcomeTitle({ children }: { children: string }) {
  const titleTextRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const titleText = titleTextRef.current;

    if (!titleText) {
      return;
    }

    let isMounted = true;
    let fittyInstance: FittyInstance | null = null;

    void import("fitty").then(({ default: fitty }) => {
      if (!isMounted || !titleText.isConnected) {
        return;
      }

      fittyInstance = fitty(titleText, {
        minSize: 1,
        maxSize: 23,
        multiLine: false,
      });
      fittyInstance.fit({ sync: true });

      void document.fonts?.ready.then(() => {
        if (isMounted) {
          fittyInstance?.fit({ sync: true });
        }
      });
    });

    return () => {
      isMounted = false;
      fittyInstance?.unsubscribe();
    };
  }, [children]);

  return (
    <h1 id="welcome-title">
      <span className="welcome-title-fit" ref={titleTextRef}>
        {children}
      </span>
    </h1>
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
type WristSizeCell = number | null;

const wristHeightValues = [
  140, 145, 150, 155, 160, 165, 170, 175, 180, 185, 190,
] as const;

const wristWeightValuesKg = [
  35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100,
] as const;

const wristSizeTable: WristSizeCell[][] = [
  // 35  40  45  50  55  60  65  70  75  80  85  90  95  100 kg
  [14, 14, 14, 14, 15, 15, 15, 16, 16, 16, 17, 17, 17, 18], // 140cm
  [14, 14, 15, 15, 15, 16, 16, 16, 17, 17, 17, 18, 18, 18], // 145cm
  [14, 15, 15, 15, 16, 16, 17, 17, 17, 18, 18, 18, 19, 19], // 150cm
  [15, 15, 15, 16, 16, 17, 17, 18, 18, 18, 19, 19, 19, 20], // 155cm
  [15, 15, 16, 16, 17, 17, 18, 18, 19, 19, 19, 20, 20, 20], // 160cm
  [15, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 20, 21, 21], // 165cm
  [16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 21, 22], // 170cm
  [16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 22], // 175cm
  [17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23], // 180cm
  [17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24], // 185cm
  [18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24], // 190cm
];

function getWristEstimateText(height: string, weight: string) {
  const heightValue = Number(height);
  const weightValue = Number(weight);

  if (!heightValue || !weightValue) {
    return "填写身高体重后估算";
  }

  const heightIndex = getNearestIndex(wristHeightValues, heightValue);
  const weightIndex = getNearestIndex(wristWeightValuesKg, weightValue);

  if (heightIndex === null || weightIndex === null) {
    return "超出参考范围，请人工确认";
  }

  const wristSize = wristSizeTable[heightIndex]?.[weightIndex];

  return wristSize ? formatWristSize(wristSize) : "超出参考范围，请人工确认";
}

function getNearestIndex(values: readonly number[], target: number) {
  const min = values[0];
  const max = values[values.length - 1];

  if (target < min || target > max) {
    return null;
  }

  return values.reduce((nearestIndex, value, index) => {
    const currentDiff = Math.abs(target - value);
    const nearestDiff = Math.abs(target - values[nearestIndex]);

    return currentDiff < nearestDiff ? index : nearestIndex;
  }, 0);
}

function formatWristSize(size: number) {
  return `${Number.isInteger(size) ? size.toFixed(0) : size.toFixed(1)}cm`;
}


type AccessoryBudgetRestriction = "under500" | "under2000" | null;

function getAccessoryBudgetRestriction(
  budgetPreset: string,
  exactBudget: string,
): AccessoryBudgetRestriction {
  const exactBudgetText = exactBudget.trim();

  if (exactBudgetText) {
    const exactBudgetValue = Number(exactBudgetText);

    if (Number.isFinite(exactBudgetValue)) {
      if (exactBudgetValue <= 500) {
        return "under500";
      }

      if (exactBudgetValue <= 2000) {
        return "under2000";
      }

      return null;
    }
  }

  if (budgetPreset === "500元以内") {
    return "under500";
  }

  if (budgetPreset === "500-1000元" || budgetPreset === "1000-2000元") {
    return "under2000";
  }

  return null;
}

function getBudgetBlockedAccessories(restriction: AccessoryBudgetRestriction) {
  if (restriction === "under500") {
    return [silverAccessoryValue, kGoldAccessoryValue];
  }

  if (restriction === "under2000") {
    return [kGoldAccessoryValue];
  }

  return [];
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

function accessoryClass(selected: boolean, budgetBlocked = false) {
  return [
    "accessory-option",
    selected ? "is-selected" : "",
    budgetBlocked ? "is-budget-blocked" : "",
  ]
    .filter(Boolean)
    .join(" ");
}
