"use client";

import { CartItem } from "@/types";
import React from "react";

type GlobalProviderProps = {
  carts: CartItem[];
  setCarts: React.Dispatch<React.SetStateAction<CartItem[]>>;
};

const initialValues: GlobalProviderProps = {
  carts: [
    {
      product: {
        id: 1,
        images: [],
        title: "",
        price: 1,
      },
      quantity: 1,
    },
  ],
  setCarts: () => undefined,
};

type WithChildProps = {
  children: React.ReactNode;
};

const context = React.createContext(initialValues);
const { Provider } = context;

export const GlobalProvider = ({ children }: WithChildProps) => {
  const [carts, setCarts] = React.useState(initialValues.carts);

  const values = {
    carts,
    setCarts,
  };

  return <Provider value={values}>{children}</Provider>;
};

export const useGlobal = () => {
  const state = React.useContext(context);
  return state;
};
