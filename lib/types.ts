export type PreferenceSummaryData = {
  customerName: string;
  beadSize: string;
  wristSize: string;
  stylePreference: string;
  budget: string;
  colorPreference: string;
  texturePreference: string;
  accessoryType: string;
  specialRequest: string;
};

export type SummaryItemData = {
  label: string;
  value: string;
  wide?: boolean;
};

export type QuestionnaireState = {
  beadSizes: string[];
  height: string;
  weight: string;
  combinations: string[];
  budgetPreset: string;
  exactBudget: string;
  colorIntensity: string;
  likedColors: string[];
  dislikedColors: string[];
  textures: string[];
  accessories: string[];
  requirements: string;
};
