"use client";

import { apiEndpoints } from "@/constants/apiEndPoints";
import { Product } from "@/types";
import axios from "axios";
import { useCallback, useEffect, useState, Suspense, lazy } from "react";
import {
  ProductCardLoader,
  ProductsPagination,
} from "./products/productsComponents";
import { useChangeListener } from "@/hooks.ts";
import { toast } from "sonner";
import { LANG } from "@/constants";
import { useGlobal } from "@/providers/GlobalProvider";

const ProductCard = lazy(() => import("./products/ProductCard"));

export default function Home() {
  const { setCartDetails } = useGlobal();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [changeWatcher, recordChanges] = useChangeListener(500);
  const [totalPages, setTotalPages] = useState(0);
  const [disabledActions, setDisabledActionId] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    getProducts();
  }, [changeWatcher]);

  const getProducts = async () => {
    try {
      setLoading(true);
      const productResponse = await axios.get(
        `${apiEndpoints.products}?skip=${(pageNumber - 1) * 25}&limit=25`
      );
      if (productResponse?.data?.products?.length) {
        setProducts(
          productResponse.data.products.map((e: Record<string, Product>) => ({
            id: e.id,
            title: e.title,
            price: e.price,
            images: e.images || [],
            stock: e.stock,
          }))
        );
        setTotalPages(Math.ceil(productResponse.data.total / 25));
      } else {
        throw new Error("Failed to get products");
      }
    } catch (e) {
      console.error(e);
      setProducts([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePageNumber = useCallback(
    (value: number) => {
      setPageNumber(value);
      recordChanges();
    },
    [recordChanges]
  );

  const addToCart = async (product: Product, quantity: number) => {
    try {
      setDisabledActionId((prev) => ({ ...prev, [product.id]: true }));
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
          description: `Successfully added to the cart`,
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
      setDisabledActionId((prev) => ({ ...prev, [product.id]: false }));
    }
  };

  const handleOnClick = async (evnt: React.MouseEvent<HTMLElement>) => {
    evnt.stopPropagation();
    const target = evnt?.target as HTMLElement;

    if (target?.id.includes("atc")) {
      const getProductDetails = products.find(
        (e) => `atc-${e.id}` === target?.id
      );

      if (getProductDetails) {
        const getProductQuantity = document.getElementById(
          `qty-${getProductDetails.id}`
        ) as HTMLInputElement;

        if (Number.isNaN(getProductQuantity.valueAsNumber)) {
          toast("Invalid Quanity", {
            description: `Enter a valid quanity.`,
            className: "!bg-white",
            closeButton: true,
          });
          return;
        }
        if (
          getProductQuantity?.valueAsNumber > (getProductDetails?.stock || 0)
        ) {
          toast("Quantity Exceeded", {
            description: `Max Stock is ${getProductDetails.stock || 1}`,
            className: "!bg-white",
            closeButton: true,
          });
        } else {
          addToCart(getProductDetails, getProductQuantity.valueAsNumber);
        }
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Products</h1>
      <div
        className="grid grid-cols-1 w-full sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-12"
        onClick={handleOnClick}
      >
        {loading
          ? Array.from({ length: 15 }).map((_, index) => (
              <ProductCardLoader key={index} />
            ))
          : products.map((product) => (
              <Suspense fallback={<ProductCardLoader />} key={product.id}>
                <ProductCard
                  product={product}
                  disabledActions={disabledActions}
                />
              </Suspense>
            ))}
      </div>
      {totalPages ? (
        <div className="mt-8">
          <ProductsPagination
            totalPages={totalPages}
            currentPageNumber={pageNumber}
            onClickPage={handleChangePageNumber}
          />
        </div>
      ) : null}
    </div>
  );
}
