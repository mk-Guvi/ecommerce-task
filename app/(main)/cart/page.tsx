"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { appRoutes, LANG } from "@/constants";
import { useGlobal } from "@/providers/GlobalProvider";
import { Home } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CartCard } from "./cartComponents/Cart";
import { CartItem, DiscountCode, Product } from "@/types";
import axios from "axios";
import { apiEndpoints } from "@/constants/apiEndPoints";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function CartPage() {
  const router = useRouter();
  const { getCartDetails, setCartDetails, cartDetails } = useGlobal();
  const [discountCode, setDiscountCode] = useState<DiscountCode | null>(null);
  const [updatedCartItems, setUpdatedCartItems] = useState<
    Record<string, CartItem>
  >({});
  const [disabledActions, setDisabledActionId] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    if (!cartDetails?.carts?.length) {
      getCartDetails();
    }
    getDiscountCode();
  }, []);

  const getDiscountCode = async () => {
    try {
      const response = await axios.get(apiEndpoints.getDiscount);
      if (response?.data?.type === "success") {
        setDiscountCode(response?.data?.discountCode);
      } else {
        throw new Error("Failed to get Discount code");
      }
    } catch (e) {
      console.log(e);
      setDiscountCode(null);
    }
  };
  const removeFromCart = async (product: Product) => {
    try {
      setDisabledActionId((prev) => ({
        ...prev,
        [`dl-${product.id}`]: true,
        [`up-${product.id}`]: true,
      }));
      const response = await axios.delete(apiEndpoints.carts, {
        data: { productId: product.id },
        validateStatus: () => true,
      });
      if (response?.data?.type === "success") {
        setCartDetails(response?.data?.data);
        toast("Success", {
          description: `Successfully removed from the cart`,
          className: "!bg-white",
          closeButton: true,
        });
      } else {
        throw new Error(response?.data?.message || LANG.NETWORK_ERROR);
      }
    } catch (e) {
      console.log(e);
      const errorMessage = (e as Error).message || LANG.NETWORK_ERROR;

      toast("Error", {
        description: errorMessage,
        className: "!bg-white",
        closeButton: true,
      });
    } finally {
      setDisabledActionId((prev) => ({
        ...prev,
        [`dl-${product.id}`]: false,
        [`up-${product.id}`]: false,
      }));
    }
  };

  const handleOnClick = async (evnt: React.MouseEvent<HTMLElement>) => {
    evnt.stopPropagation();
    const target = evnt?.target as HTMLElement;

    if (target?.id.includes("dl")) {
      const getProductDetails = cartDetails.carts.find(
        (e) => `dl-${e.product.id}` === target?.id
      );

      if (getProductDetails) {
        removeFromCart(getProductDetails.product);
      }
    } else if (target?.id?.includes("up")) {
      const getProductDetails = cartDetails.carts.find(
        (e) => `up-${e.product.id}` === target?.id
      );

      if (getProductDetails) {
        if (
          Number.isNaN(
            updatedCartItems?.[getProductDetails?.product?.id]?.quantity
          )
        ) {
          toast("Invalid Quanity", {
            description: `Enter a valid quanity.`,
            className: "!bg-white",
            closeButton: true,
          });
          return;
        }
        onUpdateCartItem(
          updatedCartItems?.[getProductDetails?.product?.id]?.product,
          updatedCartItems?.[getProductDetails?.product?.id]?.quantity
        );
      }
    }
  };
  const getDiscountValue = useMemo(() => {
    if (discountCode?.value && discountCode.type === "PERCENTAGE") {
      const discountAmount = (discountCode.value / 100) * cartDetails.total;
      return discountAmount;
    }
    return ''
  }, [cartDetails.total, discountCode]);

  const onPlaceOrder = async () => {
    try {
      const response = await axios.post(
        apiEndpoints.checkout,
        {
          discountCode,
        },
        {
          validateStatus: () => true,
        }
      );
      if (response?.data?.type === "success") {
        toast("Success", {
          description: "Successfully order placed.",
          className: "!bg-white",
          closeButton: true,
        });
        setCartDetails({
          carts: [],
          total: 0,
        });
        router.push(appRoutes.HOME_PAGE);
      } else {
        throw new Error(response?.data?.message || "");
      }
    } catch (e) {
      console.log(e);
      const errorMessage = (e as Error).message || LANG.NETWORK_ERROR;

      toast("Error", {
        description: errorMessage,
        className: "!bg-white",
        closeButton: true,
      });
    }
  };

  const onChangeCartValue = (cart: CartItem) => {
    setUpdatedCartItems((prev) => {
      return {
        ...prev,
        [cart.product.id]: cart,
      };
    });
  };
  const onUpdateCartItem = async (product: Product, quantity: number) => {
    try {
      setDisabledActionId((prev) => ({
        ...prev,
        [`dl-${product.id}`]: true,
        [`up-${product.id}`]: true,
      }));
      const response = await axios.post(
        apiEndpoints.carts,
        {
          productId: product.id,
          quantity,
        },
        {
          validateStatus: () => true,
        }
      );
      if (response?.data?.type === "success") {
        setCartDetails(response?.data?.data);
        toast("Success", {
          description: `Successfully updated the cart`,
          className: "!bg-white",
          closeButton: true,
        });
      } else {
        throw new Error(response?.data?.message || LANG.NETWORK_ERROR);
      }
    } catch (e) {
      console.log(e);
      const errorMessage = (e as Error).message || LANG.NETWORK_ERROR;

      toast("Error", {
        description: errorMessage,
        className: "!bg-white",
        closeButton: true,
      });
    } finally {
      setDisabledActionId((prev) => ({
        ...prev,
        [`dl-${product.id}`]: false,
        [`up-${product.id}`]: false,
      }));
    }
  };
  console.log(discountCode, "---", getDiscountValue);

  return (
    <Card className="container  mx-auto px-4 py-8 flex flex-col gap-5">
      <CardHeader className="font-semibold text-lg border-b">
        <div className="flex items-center w-full gap-2">
          <Link
            href={appRoutes.HOME_PAGE}
            className="text-secondary-foreground"
          >
            <Home size={16} />
          </Link>
          <p>Shopping Cart</p>
        </div>
      </CardHeader>
      <CardContent className=" flex flex-col gap-2" onClick={handleOnClick}>
        {cartDetails.carts?.length ? (
          cartDetails.carts?.map((e) => {
            return (
              <CartCard
                disabledActions={disabledActions}
                cart={e}
                key={e.product.id}
                onChangeCartValue={onChangeCartValue}
                updatedCartItems={updatedCartItems}
              />
            );
          })
        ) : (
          <div className="text-lg text-center p-4 flex flex-col gap-2 w-full justify-between items-center font-semibold">
            {"Add items to Cart"}
            <Link href={appRoutes.HOME_PAGE}>
              <Button>Go Home</Button>
            </Link>
          </div>
        )}
      </CardContent>
      {cartDetails.carts?.length ? (
        <CardFooter className="border-t flex flex-col gap-4 items-end p-4 px-6 sm:px-8">
          <p>Subtotal : {cartDetails.total}</p>
          {getDiscountValue ? (
            <>
            <p>
              Discount Applied({discountCode?.name}) : {getDiscountValue}
            </p>

            <p>
              Total({discountCode?.name}) : {cartDetails.total-getDiscountValue}
            </p>
            
            </>
          ) : null}
          <Button onClick={onPlaceOrder} className="w-full sm:w-fit">
            Place order
          </Button>
        </CardFooter>
      ) : null}
    </Card>
  );
}

export default CartPage;
