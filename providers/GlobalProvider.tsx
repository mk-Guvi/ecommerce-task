"use client";

import { apiEndpoints } from "@/constants/apiEndPoints";
import {  GetCartItems } from "@/types";
import axios from "axios";
import React from "react";

type GlobalProviderProps = {
  cartDetails: GetCartItems;
  setCartDetails: React.Dispatch<React.SetStateAction<GetCartItems>>;
  getCartDetails: () => Promise<void>;
};

const initialValues: GlobalProviderProps = {
  cartDetails: {
    carts:[],
    total:0
  },
  setCartDetails: () => undefined,
  getCartDetails: async () => {},
};

type WithChildProps = {
  children: React.ReactNode;
};

const context = React.createContext(initialValues);
const { Provider } = context;

export const GlobalProvider = ({ children }: WithChildProps) => {
  const [cartDetails, setCartDetails] = React.useState<GetCartItems>(initialValues.cartDetails);
  const getCartDetails = async () => {
    try {
      const response = await axios.get(apiEndpoints.carts);
      if (response?.data?.type === "success") {
        setCartDetails(response?.data?.data);
      } else {
        throw new Error(response?.data?.message || "Failed to get carts");
      }
    } catch (e) {
      console.log(e);
      setCartDetails({
        carts:[],
        total:0
      });
    }
  };

  const values = {
    cartDetails,
    setCartDetails,
    getCartDetails,
  };

  return <Provider value={values}>{children}</Provider>;
};

export const useGlobal = () => {
  const state = React.useContext(context);
  return state;
};
