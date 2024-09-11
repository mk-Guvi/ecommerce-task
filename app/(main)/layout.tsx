import { appRoutes, LANG } from "@/constants";
import React from "react";
import {Cart} from "./cart/cartComponents/Cart";
import Link from "next/link";

type Props = { children: React.ReactNode };

function MainLayout({ children }: Props) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full sticky top-0 z-10 bg-white bg-opacity-80 backdrop-blur-lg border-b shadow-sm">
        <div className="max-w-screen-xl flex items-center justify-between h-16  mx-auto px-4 sm:px-6 lg:px-8">
          <Link href={appRoutes.HOME_PAGE} className="flex-shrink-0">
            <h1 className="font-semibold text-lg">{LANG.ECOMMERCE}</h1>
          </Link>
          <Cart />
        </div>
      </header>
      <main className="flex-grow">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {children}
        </div>
      </main>
      <footer className="bg-gray-100">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} {LANG.ECOMMERCE}. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default MainLayout;
