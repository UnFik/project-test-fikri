import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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

export function getParamsFromUrl(url: string) {
  url = url.split("?")[1];
  const keyValuePairs = url.split("&");

  const params: { [key: string]: string } = {};
  keyValuePairs.forEach((pair) => {
    const [key, value] = pair.split("="); // Mendapatkan kunci dan nilainya
    params[key] = decodeURIComponent(value); // Menambahkan ke objek params
  });

  return params;
}

export function generateNewUrl(params: { [key: string]: string }) {
  const url = new URL(window.location.href);
  const searchParams = url.searchParams;

  Object.keys(params).forEach((key) => {
    searchParams.set(key, params[key]);
  });

  return url.toString();
} 
