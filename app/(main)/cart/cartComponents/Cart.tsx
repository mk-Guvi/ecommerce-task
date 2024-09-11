"use client";
import { appRoutes } from "@/constants";
import { useGlobal } from "@/providers/GlobalProvider";
import { ShoppingCart, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/types";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import React, { useEffect, useMemo } from "react";

export function Cart() {
  const { cartDetails, getCartDetails } = useGlobal();
  useEffect(() => {
    getCartDetails();
  }, []);
  const cartsLength = useMemo(() => {
    return cartDetails?.carts?.length;
  }, [cartDetails.carts]);
  return (
    <Link
      href={appRoutes.CART}
      className="relative hover:bg-secondary p-2 rounded-lg"
    >
      {cartsLength ? (
        <div className="rounded-full absolute -top-0 -right-0  shadow-lg text-xs h-[1rem] w-[1rem] flex items-center justify-center bg-primary text-white">
          {cartsLength > 9 ? "9+" : cartsLength}
        </div>
      ) : null}
      <ShoppingCart size={16} />
    </Link>
  );
}

interface CartCardPropsI {
  cart: CartItem;
  disabledActions: Record<string, boolean>;
  updatedCartItems: Record<string, CartItem>;
  onChangeCartValue: (cart: CartItem) => void;
}
export const CartCard = (props: CartCardPropsI) => {
  const { cart, disabledActions, updatedCartItems, onChangeCartValue } = props;
  return (
    <Card className="p-4 w-full flex sm:flex-row gap-2 flex-col">
      <Carousel className="h-[150px] max-w-[20rem] flex-1">
        <CarouselContent className="h-[150px] p-4 w-full">
          {cart.product.images.map((e, index) => (
            <CarouselItem key={index} className="h-[120px]  ">
              <Card>
                <Image
                  src={e}
                  className="object-contain h-[120px] !w-full"
                  alt={cart.product.title}
                  width={100}
                  height={20}
                />
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="flex flex-col flex-1 gap-2">
        <p className="text-sm truncate" title={cart.product.title}>
          {cart.product.title}
        </p>
        <p className="text-sm truncate" title={`$${cart.product.price}`}>
          ${cart.product.price}
        </p>
        <Input
          className="w-16"
          min={1}
          value={
            updatedCartItems?.[cart.product.id]?.quantity || cart?.quantity
          }
          onChange={(e) => {
            onChangeCartValue({ ...cart, quantity: e.target.valueAsNumber });
          }}
          id={`qty-${cart.product.id}`}
          max={cart.product?.stock}
          defaultValue={1}
          type="number"
        />
      </div>
      <div className="gap-2 items-center justify-center flex flex-wrap">
        <Button
          size={"sm"}
          id={`dl-${cart.product.id}`}
          className="w-full sm:w-fit"
          disabled={disabledActions?.[`dl-${cart.product.id}`]}
        >
          <Trash2 id={`dl-${cart.product.id}`} />
        </Button>
        {updatedCartItems?.[cart.product.id] &&
        updatedCartItems?.[cart.product.id]?.quantity !== cart?.quantity ? (
          <Button
            size={"sm"}
            id={`up-${cart.product.id}`}
            className="w-full sm:w-fit"
            disabled={disabledActions?.[`up-${cart.product.id}`]}
          >
            Update Cart
          </Button>
        ) : null}
      </div>
    </Card>
  );
};
