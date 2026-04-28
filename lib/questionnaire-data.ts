import type { QuestionnaireState } from "./types";

export const initialQuestionnaireState: QuestionnaireState = {
  beadSizes: [],
  height: "",
  weight: "",
  combinations: [],
  budgetPreset: "",
  exactBudget: "",
  colorIntensity: "",
  likedColors: [],
  dislikedColors: [],
  textures: [],
  accessories: [],
  requirements: "",
};

export const colorPalette = [
  { name: "红", color: "#f87171" },
  { name: "紫", color: "#a78bfa" },
  { name: "黄", color: "#facc15" },
  { name: "绿", color: "#4ade80" },
  { name: "白", color: "#f8fafc" },
  { name: "黑", color: "#111827" },
  { name: "蓝", color: "#60a5fa" },
  { name: "粉", color: "#f9a8d4" },
];
