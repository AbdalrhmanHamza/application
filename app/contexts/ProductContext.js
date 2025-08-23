"use client";

import { use, createContext, useState } from "react";

const ProductContext = createContext();

export default function ProductProvider({ children }) {
  const [product, setProduct] = useState("");
  return (
    <ProductContext.Provider
      value={{
        product,
        setProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProduct() {
  return use(ProductContext);
}
