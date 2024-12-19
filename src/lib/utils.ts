import { initialFormState, ServerFormState } from "@tanstack/react-form/nextjs"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function createInitialServerFormState<T>(values: T): ServerFormState<T> {
  return {
    ...initialFormState,
    values,
  }
}