import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getProfileName = (name: string) => {
  const firstLetter = name?.split(" ")?.[0]?.[0] || "";
  return firstLetter.toUpperCase();
};
