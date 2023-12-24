import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateEndPage(totalPages: number, currentPage: number) {
  let visiblePages = 5;
  let endPage = totalPages;

  if (totalPages > visiblePages) {
    const half = Math.floor(visiblePages / 2);

    if (currentPage > half) {
      endPage = currentPage + half - 1;
      if (endPage > totalPages) {
        endPage = totalPages;
      }
    } else {
      endPage = visiblePages;
    }
  }

  return endPage;
}
