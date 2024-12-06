import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function arrayRemove<T>(array: T[], index: number) {
  return array.filter((_, i) => i !== index);
}

export function arrayInsert<T>(array: T[], index: number, value: T) {
  return [...array.slice(0, index), value, ...array.slice(index)];
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
