import type { PreferenceSummaryData, SummaryItemData } from "./types";

export const mockPreferenceSummary: PreferenceSummaryData = {
  customerName: "用户名XX",
  beadSize: "8-10mm",
  wristSize: "待输入身高体重后估算",
  stylePreference: "3-8种",
  budget: "1000",
  colorPreference: "适中",
  texturePreference: "质感适中、实感一点",
  accessoryType: "水晶跑环/随形珠等",
  specialRequest: "暂无",
};

export function toSummaryItems(data: PreferenceSummaryData): SummaryItemData[] {
  return [
    { label: "珠子大小", value: data.beadSize },
    { label: "估算手围", value: data.wristSize },
    { label: "风格偏好", value: data.stylePreference },
    { label: "预算范围", value: data.budget },
    { label: "色彩偏好", value: data.colorPreference },
    { label: "质感偏好", value: data.texturePreference },
    { label: "配饰类型", value: data.accessoryType },
    { label: "特殊要求", value: data.specialRequest, wide: true },
  ];
}
