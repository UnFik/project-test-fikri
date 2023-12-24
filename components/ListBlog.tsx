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
} from "@/components/ui/pagination";

interface BlogData {
  map(arg0: (blog: BlogData) => React.JSX.Element): React.ReactNode;
  id: number;
  slug: string;
  title: string;
  content: string;
  published_at: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  small_image: Image[];
  medium_image: Image[];
}
import Link from "next/link";
import { useSearchParams } from 'next/navigation'
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

interface Image {
  id: number;
  mime: string;
  file_name: string;
  url: string;
}

const ListBlog = () => {
  // const[pageNumber, setPageNumber] = useState(1)
  // const[pageSize, setPageSize] = useState(10)
  // const[sort, setSort] = useState('-published_at')

  const searchParams = useSearchParams();

  let pageNumber: number = 1 || searchParams.get('pageNumber')
  let pageSize: number = 10 || searchParams.get('pageSize')
  let sort: string = searchParams.get('sort') || '-published_at'
  try {
    if (pageNumber < 1) {
      pageNumber = 1
    }
    if (pageSize < 1) {
      pageSize = 10
    }
  } catch (error) {
    console.log(error)
  }
  console.log(searchParams.get('pageNumber'))
  console.log(searchParams.get('pageSize'))
  console.log(searchParams.get('sort'))
  
  const api = 'https://suitmedia-backend.suitdev.com/api/ideas?page[number]=1&page[size]=10&append[]=small_image&append[]=medium_image&sort=published_at'
  const apiUrl = `https://suitmedia-backend.suitdev.com/api/ideas?page[number]]=${pageNumber}&page[size]=${pageSize}&append[]=small_image&append[]=medium_image&sort=${sort}`;
  const { data, isLoading } = useQuery({
    queryFn: async () => {
      const response = await axios.get(
        api,
        {
          headers: {
            "Content-type": "application/json",
            Accept: "application/json",
          },
        }
      );

      return response as unknown as any;
    },
    queryKey: ["blog"],
  });

  const totalBlogs: number = data?.data.meta.total || 0;
  const totalPages: number = Math.ceil(totalBlogs / pageSize);

  const mapData: BlogData = data?.data.data;
  // console.log(isLoading);
  // const pathname = usePathname()


  console.log(mapData)

  return (
    <div className="mx-36 mt-20">
      <div className="flex flex-row justify-between">
        <div className="">Showing 1-{pageSize} of {totalBlogs}</div>
        <div className="flex space-x-5">
          <div className="flex align-middle">
            <div className="mr-4 my-auto">Sort per page</div>
            <Select>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10" >10</SelectItem>
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
        {mapData?.map((blog: BlogData) => {
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
        })}
        {/* <CardLoading /> */}
      </div>
      <div className="my-20">
        

      </div>
    </div>
  );
};

export default ListBlog;
