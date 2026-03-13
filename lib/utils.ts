import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPhone(phone: string | null | undefined): string {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11 && digits.startsWith("1")) {
    return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return phone;
}

export function daysSince(dateStr: string): number {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getScoreColor(score: string): string {
  switch (score) {
    case "Hot":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Warm":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "Cold":
      return "bg-stone-100 text-stone-500 border-stone-200";
    default:
      return "bg-stone-50 text-stone-400 border-stone-200";
  }
}

export function getWebsiteStatusLabel(status: string): string {
  switch (status) {
    case "NO_WEBSITE":
      return "No Website";
    case "TEMPLATE_SITE":
      return "Template Site";
    case "HAS_WEBSITE":
      return "Has Website";
    case "UNCHECKED":
      return "Unchecked";
    default:
      return status;
  }
}

export function getWebsiteStatusColor(status: string): string {
  switch (status) {
    case "NO_WEBSITE":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "TEMPLATE_SITE":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "HAS_WEBSITE":
      return "bg-stone-100 text-stone-500 border-stone-200";
    case "UNCHECKED":
      return "bg-stone-50 text-stone-400 border-stone-200";
    default:
      return "bg-stone-50 text-stone-400 border-stone-200";
  }
}
