import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { QuestionnaireState } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body: QuestionnaireState & { wristEstimate: string } =
      await request.json();

    const {
      beadSizes,
      height,
      weight,
      wristEstimate,
      combinations,
      budgetPreset,
      exactBudget,
      colorIntensity,
      likedColors,
      dislikedColors,
      textures,
      accessories,
      requirements,
    } = body;

    if (!beadSizes?.length || !height || !weight) {
      return NextResponse.json(
        { error: "缺少必填字段" },
        { status: 400 },
      );
    }

    const registration = await prisma.registration.create({
      data: {
        beadSizes: beadSizes.join("、"),
        height,
        weight,
        wristEstimate: wristEstimate || "",
        combinations: combinations.join("、"),
        budgetPreset: budgetPreset || "",
        exactBudget: exactBudget || "",
        colorIntensity: colorIntensity || "",
        likedColors: likedColors.join("、"),
        dislikedColors: dislikedColors.join("、"),
        textures: textures.join("、"),
        accessories: accessories.join("、"),
        requirements: requirements || "",
      },
    });

    return NextResponse.json({ ok: true, id: registration.id });
  } catch (error) {
    console.error("提交失败:", error);
    return NextResponse.json(
      { error: "提交失败，请稍后重试" },
      { status: 500 },
    );
  }
}
