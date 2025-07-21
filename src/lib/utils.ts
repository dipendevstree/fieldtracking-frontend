import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const getProfileName = (name: string) => {
  return name?.split(' ')?.[0]?.[0]
}
