import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const submitSchema = z.object({
  beadSizes: z
    .array(z.string().max(50))
    .min(1, "请至少选择一种珠子大小")
    .max(10),
  height: z
    .string()
    .regex(/^\d+$/, "请输入有效身高")
    .refine((v) => {
      const n = Number(v);
      return n >= 120 && n <= 220;
    }, "身高需在120-220之间"),
  weight: z
    .string()
    .regex(/^\d+$/, "请输入有效体重")
    .refine((v) => {
      const n = Number(v);
      return n >= 30 && n <= 180;
    }, "体重需在30-180之间"),
  wristEstimate: z.string().max(50),
  combinations: z.array(z.string().max(50)).max(10),
  budgetPreset: z.string().max(50),
  exactBudget: z.string().max(50),
  colorIntensity: z.string().max(50),
  likedColors: z.array(z.string().max(10)).max(20),
  dislikedColors: z.array(z.string().max(10)).max(20),
  textures: z.array(z.string().max(50)).max(10),
  accessories: z.array(z.string().max(50)).max(10),
  requirements: z.string().max(500),
});

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;

// Periodic cleanup to prevent memory leak
if (typeof globalThis !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of rateLimitMap) {
      if (now > entry.resetAt) {
        rateLimitMap.delete(ip);
      }
    }
  }, 300_000); // every 5 minutes
}

function getRateLimitInfo(ip: string) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    return { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
  }
  return entry;
}

export async function POST(request: Request) {
  try {
    // Rate limit by IP
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const rateInfo = getRateLimitInfo(ip);
    if (rateInfo.count >= RATE_LIMIT_MAX) {
      return NextResponse.json(
        { error: "请求过于频繁，请稍后再试" },
        { status: 429 },
      );
    }
    rateLimitMap.set(ip, { count: rateInfo.count + 1, resetAt: rateInfo.resetAt });

    const body = await request.json();
    const result = submitSchema.safeParse(body);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      return NextResponse.json(
        { error: "表单数据无效", fieldErrors },
        { status: 400 },
      );
    }

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
    } = result.data;

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

    return NextResponse.json({ ok: true, id: registration.id }, { status: 201 });
  } catch (error) {
    console.error("提交失败:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "提交失败，请稍后重试" },
      { status: 500 },
    );
  }
}
