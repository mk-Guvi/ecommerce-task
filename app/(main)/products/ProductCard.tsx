import { Button } from "@/components/ui/button";
import { Product } from "@/types";

import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import OptimizedImage from "@/components/optimizedImage";
interface ProductCardPropsI {
  product: Product;
  disabledActions: Record<string, boolean>;
}
const ProductCard = (props: ProductCardPropsI) => {
  const { product, disabledActions } = props;
  return (
    <Card className="flex py-4 flex-col space-y-1 w-full sm:w-[250px]">
      <Carousel className="h-[150px] w-full">
        <CarouselContent className="h-[150px] p-4 w-full">
          {product.images.map((e, index) => (
            <CarouselItem key={index} className="h-[120px]  ">
              <Card>
                <OptimizedImage
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

export default ProductCard;
