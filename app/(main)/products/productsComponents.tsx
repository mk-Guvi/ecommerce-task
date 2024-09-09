import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from "@/types";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export function ProductCardLoader() {
  return (
    <div className="flex flex-col space-y-2">
      <Skeleton className="h-[150px] bg-gray-200 w-[250px] rounded-xl" />
      <div className="gap-2 flex justify-evenly">
        <Skeleton className="h-8 bg-gray-300 flex-1" />
        <Skeleton className="h-8 bg-gray-300 flex-1" />
      </div>
    </div>
  );
}
interface ProductCardPropsI {
  product: Product;
}
export const ProductCard = (props: ProductCardPropsI) => {
  const { product } = props;
  return (
    <div className="flex flex-col space-y-1">
      <Carousel className="h-[150px] w-[250px]">
        <CarouselContent className="h-[150px] p-4 w-full">
          {product.images.map((e, index) => (
            <CarouselItem key={index} className="h-[120px]  ">
                <Card>
              <Image
                src={e}
                className="object-contain h-[120px] !w-full"
                alt={product.title}
                width={100}
                height={20}
              />
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <p className="p-2 text-sm ">{product.title}</p>

      <div className="gap-2 items-center flex">
        <p>${product.price}</p>
        <Input
          className="w-16"
          min={1}
          max={product?.stock}
          defaultValue={1}
          type="number"
        />
        <Button size={"sm"}>Add To Cart</Button>
      </div>
    </div>
  );
};

interface ProductsPaginationPropsI {
  totalPages: number;
  currentPageNumber: number;
  onClickPage: (value: number) => void;
}

export function ProductsPagination(props: ProductsPaginationPropsI) {
  const { totalPages, currentPageNumber, onClickPage } = props;

  const renderPageLinks = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPageNumber - 1 && i <= currentPageNumber + 1)
      ) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => onClickPage(i)}
              isActive={i === currentPageNumber}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      } else if (i === currentPageNumber - 2 || i === currentPageNumber + 2) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }
    return pages;
  };

  const handlePrevClick = () => {
    if (currentPageNumber > 1) {
      onClickPage(currentPageNumber - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPageNumber < totalPages) {
      onClickPage(currentPageNumber + 1);
    }
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={handlePrevClick}
            className={
              currentPageNumber === 1 ? "opacity-50 cursor-not-allowed" : ""
            }
          />
        </PaginationItem>
        {renderPageLinks()}
        <PaginationItem>
          <PaginationNext
            onClick={handleNextClick}
            className={
              currentPageNumber === totalPages
                ? "opacity-50 cursor-not-allowed"
                : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
