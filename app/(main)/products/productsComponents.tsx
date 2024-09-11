import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from "@/types";
import Image from "next/image";
import { Card } from "@/components/ui/card";
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
    <div className="flex flex-col space-y-2 w-full sm:w-[250px] ">
      <Skeleton className="h-[150px] bg-gray-200  w-full  rounded-xl" />
      <div className="gap-2 flex-wrap flex w-full justify-evenly">
        <Skeleton className="h-8 bg-gray-300 flex-1" />
        <Skeleton className="h-8 bg-gray-300 flex-1" />
      </div>
    </div>
  );
}
interface ProductCardPropsI {
  product: Product;
  disabledActions: Record<string, boolean>;
}
export const ProductCard = (props: ProductCardPropsI) => {
  const { product, disabledActions } = props;
  return (
    <Card className="flex py-4 flex-col space-y-1 w-full sm:w-[250px]">
      <Carousel className="h-[150px] w-full">
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

      <p className="p-2 text-sm truncate text-center" title={product.title}>
        {product.title}
      </p>

      <div className="gap-2 items-center justify-center flex">
        <p className="text-sm truncate" title={`$${product.price}`}>
          ${product.price}
        </p>
        <Input
          className="w-16"
          min={1}
          id={`qty-${product.id}`}
          max={product?.stock}
          defaultValue={1}
          type="number"
        />
        <Button
          size={"sm"}
          id={`atc-${product.id}`}
          disabled={disabledActions?.[product.id]}
        >
          Add To Cart
        </Button>
      </div>
    </Card>
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
    if (totalPages && currentPageNumber > 1) {
      onClickPage(currentPageNumber - 1);
    }
  };

  const handleNextClick = () => {
    if (totalPages && currentPageNumber < totalPages) {
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
              !totalPages || currentPageNumber === 1
                ? "opacity-50 cursor-not-allowed"
                : ""
            }
          />
        </PaginationItem>
        {renderPageLinks()}
        <PaginationItem>
          <PaginationNext
            onClick={handleNextClick}
            className={
              !totalPages || currentPageNumber === totalPages
                ? "opacity-50 cursor-not-allowed"
                : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
