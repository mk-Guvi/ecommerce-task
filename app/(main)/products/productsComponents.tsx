import { Skeleton } from "@/components/ui/skeleton";
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
