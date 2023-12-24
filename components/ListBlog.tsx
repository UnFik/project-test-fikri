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

import { useSearchParams } from "next/navigation";
import { generateEndPage, generateNewUrl } from "@/lib/utils";
import { useRouter } from "next/navigation";

const ListBlog = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

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

  const api =
    "https://suitmedia-backend.suitdev.com/api/ideas?page[number]=1&page[size]=10&append[]=small_image&append[]=medium_image&sort=published_at";
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
            <PaginationLink href={`#/page=${page}`}>{page}</PaginationLink>
          </PaginationItem>
        );
  }

  for (let page = totalPages - 1; page <= totalPages; page++) {
    paginationItems.push(
      <PaginationItem key={page}>
        <PaginationLink href={`#/page=${page}`}>{page}</PaginationLink>
      </PaginationItem>
    );
  }

  const handlePageSizeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedSize = event.target.value;
    const currentPage = searchParams.get("page[number]") || "1";

    router.push(`/?page[number]=${currentPage}&page[size]=${selectedSize}`);
  };

  console.log(mapData);
  console.log(link);

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
            <Select>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="10" />
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
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Newest" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Newest</SelectItem>
                <SelectItem value="dark">Oldest</SelectItem>
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
                src={blog.small_image[0].url}
                alt={blog.small_image[0].file_name}
                date={blog.created_at.split(" ")[0]}
                title={blog.title}
              />
            ))}
        {/* {mapData?.map((blog: BlogData) => {
          return isLoading || !mapData ? (
            <CardLoading key={blog.id} />
          ) : (
            <CardBlog
              key={blog.id}
              href={blog.slug}
              src={blog.small_image[0].url}
              alt={blog.small_image[0].file_name}
              date={blog.published_at}
              title={blog.title}
            />
          );
        })} */}
        {/* <CardLoading /> */}
      </div>
      <div className="my-20">
        {isLoading ? (
          <div> </div>
        ) : (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationFirst
                  href={generateNewUrl(link.prev || "#", apiUrl)}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationPrevious href={link.prev || "#"} />
              </PaginationItem>
              {paginationItems}
              <PaginationItem>
                <PaginationNext
                  href={generateNewUrl(link.next || "#", apiUrl)}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLast
                  href={generateNewUrl(link.last || "#", apiUrl)}
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
