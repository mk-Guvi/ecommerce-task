"use client";
import { appRoutes } from "@/constants";
import { useGlobal } from "@/providers/GlobalProvider";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import React, { useMemo } from "react";

function Cart() {
  const { carts } = useGlobal();
  const cartsLength = useMemo(() => {
    return carts.length;
  }, [carts]);
  return (
    <Link href={appRoutes.CART} className="relative hover:bg-secondary p-2 rounded-lg">
      {cartsLength ? (
        <div className="rounded-full absolute -top-0 -right-0  shadow-lg text-xs h-[1rem] w-[1rem] flex items-center justify-center bg-primary text-white">
          {cartsLength > 9 ? "9+" : cartsLength}
        </div>
      ) : null}
      <ShoppingCart size={16}/>
    </Link>
  );
}

export default Cart;
