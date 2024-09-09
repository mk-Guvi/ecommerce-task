"use client";

import { apiEndpoints } from "@/constants/apiEndPoints";
import { Product } from "@/types";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import {
  ProductCard,
  ProductCardLoader,
  ProductsPagination,
} from "./products/productsComponents";
import { useChangeListener } from "@/hooks.ts";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [changeWatcher, recordChanges] = useChangeListener(500);
  const [totalPages, setTotalPages] = useState(0);

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

  const handleChangePageNumber = useCallback((value: number) => {
    setPageNumber(value);
    recordChanges();
  }, [recordChanges]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-12">
        {loading
          ? Array.from({ length: 15 }).map((_, index) => (
              <ProductCardLoader key={index} />
            ))
          : products.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
      </div>
      <div className="mt-8">
        <ProductsPagination
          totalPages={totalPages}
          currentPageNumber={pageNumber}
          onClickPage={handleChangePageNumber}
        />
      </div>
    </div>
  );
}