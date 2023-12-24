"use client";

import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CardBlog, CardLoading } from "./ui/card";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationFirst,
  PaginationLast,
} from "@/components/ui/pagination";

import { usePathname, useSearchParams } from "next/navigation";
import { generateEndPage, generateNewUrl } from "@/lib/utils";
import { useRouter } from "next/navigation";

const ListBlog = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const checkImage = () => {
    const isImageAppend = searchParams.get("append[]") == "small_image" ? true : false;
    return isImageAppend;
  };

  const handleChangePage = (value: string) => {
    pageSize = parseInt(value);
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("page[size]", value);
    console.log(checkImage());
    if (checkImage() == false) {
      urlParams.append("append[]", "small_image");
      urlParams.append("append[]", "medium_image");
    }
    router.push(`ideas/?${urlParams}`);

    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const handleChangeDate = (value: string) => {
    pageSize = parseInt(value);
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("sort", value);
    if (!checkImage) {
      urlParams.append("append[]", "small_image");
      urlParams.append("append[]", "medium_image");
    }
    router.push(`ideas/?${urlParams}`);

    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handlePaginationNumber = (page: number) => {
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    url.searchParams.set("page[number]", page.toString());
    if (!checkImage) {
      url.searchParams.append("append[]", "small_image");
      url.searchParams.append("append[]", "medium_image");
    }

    router.push(url.toString());
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handlePaginationFirst = () => {
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    url.searchParams.set("page[number]", "1");
    if (!checkImage) {
      url.searchParams.append("append[]", "small_image");
      url.searchParams.append("append[]", "medium_image");
    }

    router.push(url.toString());
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handlePaginationLast = () => {
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    url.searchParams.set("page[number]", totalPages.toString());
    if (!checkImage) {
      url.searchParams.append("append[]", "small_image");
      url.searchParams.append("append[]", "medium_image");
    }

    router.push(url.toString());
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handlePaginationPrev = () => {
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    if (!checkImage) {
      url.searchParams.append("append[]", "small_image");
      url.searchParams.append("append[]", "medium_image");
    }

    if (pageNumber - 1 < 1) {
      url.searchParams.set("page[number]", "1");
      router.push(url.toString());
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      url.searchParams.set("page[number]", (pageNumber - 1).toString());
    }
  };

  const handlePaginationNext = () => {
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    if (!checkImage) {
      url.searchParams.append("append[]", "small_image");
      url.searchParams.append("append[]", "medium_image");
    }
    if (pageNumber + 1 > totalPages) {
      url.searchParams.set("page[number]", totalPages.toString());
      router.push(url.toString());
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      url.searchParams.set("page[number]", (pageNumber + 1).toString());
    }
  };

  let pageNumber: number = parseInt(searchParams.get("page[number]") || "1");
  let pageSize: number = parseInt(searchParams.get("page[size]") || "10");
  let sort: string = searchParams.get("sort") || "-published_at";

  try {
    if (pageNumber < 1 || !pageNumber || isNaN(pageNumber)) {
      pageNumber = 1;
    }
    if (pageSize < 10 || !pageSize || isNaN(pageSize)) {
      pageSize = 10;
    }

    if (sort !== "published_at" && sort !== "-published_at") {
      sort = "published_at";
    }
  } catch (error) {
    pageNumber = 1;
    pageSize = 10;
  }

  const apiUrl = `https://suitmedia-backend.suitdev.com/api/ideas?page[number]=${pageNumber}&page[size]=${pageSize}&append[]=small_image&append[]=medium_image&sort=${sort}`;
  const { data, isLoading } = useQuery({
    queryFn: async () => {
      const response = await axios.get(apiUrl, {
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
        },
        timeout: 10000,
      });

      return response as unknown as any;
    },
    queryKey: ["blog"],
  });

  const totalBlogs: number = data?.data.meta.total || 0;
  const totalPages: number = Math.ceil(totalBlogs / pageSize);

  const mapData: BlogData = data?.data.data;
  const link: Links = data?.data.links;

  let midPage = Math.ceil(5 / 2);

  const paginationItems = [];
  for (let page = 1; page <= midPage; page++) {
    page == midPage
      ? paginationItems.push(
          <PaginationItem key={page}>
            <PaginationEllipsis></PaginationEllipsis>
          </PaginationItem>
        )
      : paginationItems.push(
          <PaginationItem key={page}>
            <PaginationLink
              href={"#"}
              onClick={() => handlePaginationNumber(page)}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        );
  }

  for (let page = totalPages - 1; page <= totalPages; page++) {
    paginationItems.push(
      <PaginationItem key={page}>
        <PaginationLink href={`#`} onClick={() => handlePaginationNumber(page)}>
          {page}
        </PaginationLink>
      </PaginationItem>
    );
  }

  console.log(mapData);
  console.log(link);
  console.log(checkImage());

  // link.first ? console.log(generateNewUrl(link.first, apiUrl)) : console.log("tes")

  return (
    <div className="mx-36 mt-20">
      <div className="flex flex-row justify-between">
        <div className="">
          Showing {(pageNumber - 1) * pageSize + 1}-
          {Math.min(pageNumber * pageSize, totalBlogs)} of {totalBlogs}
        </div>
        <div className="flex space-x-5">
          <div className="flex align-middle">
            <div className="mr-4 my-auto">Sort per page</div>
            <Select onValueChange={handleChangePage}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex align-middle">
            <div className="mr-4 my-auto">Sort by</div>
            <Select onValueChange={handleChangeDate}>
              <SelectTrigger className="w-[180px]">
                <SelectValue
                  placeholder={sort == "published_at" ? "Oldest" : "Newest"}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="-published_at">Newest</SelectItem>
                <SelectItem value="published_at">Oldest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 mt-10 gap-8">
        {isLoading || !mapData
          ? Array.from({ length: 10 }, (_, index) => (
              <CardLoading key={index} />
            ))
          : mapData.map((blog: BlogData) => (
              <CardBlog
                key={blog.id}
                href={blog.slug}
                src={blog.small_image[0]?.url || blog.medium_image[0]?.url}
                alt={blog.small_image[0]?.file_name || blog.medium_image[0]?.file_name}
                date={blog.created_at.split(" ")[0]}
                title={blog.title}
              />
            ))}
      </div>
      <div className="my-20">
        {isLoading ? (
          <div> </div>
        ) : (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationFirst
                  href={"#"}
                  onClick={() => handlePaginationFirst()}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationPrevious
                  href={"#"}
                  onClick={() => {
                    handlePaginationPrev;
                  }}
                />
              </PaginationItem>
              {paginationItems}
              <PaginationItem>
                <PaginationNext
                  href={"#"}
                  onClick={() => handlePaginationNext()}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLast
                  href={"#"}
                  onClick={() => handlePaginationLast()}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
};

export default ListBlog;
