"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import useGetCategories from "@/api/getProducts";
import { categoryPath } from "@/lib/routes";

type CategorySidebarProps = {
  activeSlug: string;
};

const CategorySidebar = ({ activeSlug }: CategorySidebarProps) => {
  const { result, loading } = useGetCategories();
  const searchParams = useSearchParams();
  const query = searchParams.toString();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Categorías</SidebarGroupLabel>

          {loading && (
            <div className="flex flex-col gap-1 px-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-9 w-full" />
              ))}
            </div>
          )}

          <SidebarMenu>
            {(result ?? []).map((category) => {
              const isActive = category.slug === activeSlug;
              const image = category.mainimage;

              return (
                <SidebarMenuItem key={category.id}>
                  <SidebarMenuButton
                    isActive={isActive}
                    tooltip={category.categoryName}
                    render={
                      <Link
                        href={`${categoryPath(category.slug)}${
                          query ? `?${query}` : ""
                        }`}
                      />
                    }
                    className="gap-2.5"
                  >
                    {image ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${
                          image.formats?.thumbnail?.url ?? image.url
                        }`}
                        alt=""
                        width={20}
                        height={20}
                        className="size-5 shrink-0 rounded object-cover"
                      />
                    ) : (
                      <span className="size-5 shrink-0 rounded bg-muted" />
                    )}
                    <span className="truncate">{category.categoryName}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default CategorySidebar;
