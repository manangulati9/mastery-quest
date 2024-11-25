import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export type ProgressData = {
  month:
    | "Jan"
    | "Feb"
    | "Mar"
    | "Apr"
    | "May"
    | "Jun"
    | "Jul"
    | "Aug"
    | "Sep"
    | "Oct"
    | "Nov"
    | "Dec";
  math: number;
  science: number;
  english: number;
  social_science: number;
};

export type SearchParams = Promise<
  Record<string, string | string[] | undefined>
>;

export function decodeParams(params: Awaited<SearchParams>) {
  const decodedParams: Record<string, string | number> = {
    subject: "Maths",
    totalTests: 0,
    average: 0,
  };

  for (const param in params) {
    const val = params[param];
    if (typeof val === "string") {
      decodedParams[param] = decodeURIComponent(val);
    }
  }

  return decodedParams;
}
