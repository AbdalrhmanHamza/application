"use client";

import { useProduct } from "../contexts/ProductContext";
import { initializeFirebase } from "../../firebase_config";
import { useState } from "react";

export default function ProductCard({
  product,
  appId,
  moderator,
  errors,
  setErrors,
}) {
  const { setProduct } = useProduct();
  const [error, setError] = useState({
    error: null,
  });

  //   get the email of the authenticated user
  const { auth } = initializeFirebase();
  const user = auth.currentUser;
  const uid = user ? user.uid : null;
  const email = user ? user.email : null;
  const name = user ? user.displayName : null;

  const handleClick = () => {
    if (!email) {
      setError({ error: "يرجى تسجيل الدخول لشراء المنتج" });
      return;
    }
    if (!appId || appId.length !== 9) {
      setErrors({ ...errors, appIdError: "يرجى إدخال ID صالح" });
      return;
    }
    if (!moderator) {
      setErrors({ ...errors, moderatorError: "يرجى اختيار وكالة الشحن" });
      return;
    }
    setProduct(product.id);

    console.log("moderator: ", moderator);

    fetch(`/api/${product.id}/checkout_sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...product, name, email, appId, moderator, uid }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.url) {
          window.location.href = data.url;
        } else {
          console.error("no url returned: ", data);
        }
      })
      .catch((error) => {
        console.error("Error creating checkout session:", error);
      });
  };

  const { coins, price, productId } = product;
  //   format teh coins number and the price in the us
  const formattedPrice = price.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
  //   format teh coins number
  const formattedCoins = coins.toLocaleString("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return (
    <div className="p-4 border border-neutral-800 rounded-lg shadow-md">
      <div className="w-full flex flex-col gap-2 items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <h4 className="product-name text-lg">{formattedCoins} كوينز</h4>
          <h3 className="product-price text-3xl font-semibold">
            {formattedPrice}
          </h3>
        </div>
        <button
          onClick={handleClick}
          className="w-full py-2 px-8 mt-8 rounded-lg border border-neutral-800 bg-neutral-900 text-white hover:bg-neutral-800 transition-colors duration-300"
          type="submit"
        >
          شراء
        </button>
        {error.error && (
          <p className="text-red-500 text-sm mt-2">{error.error}</p>
        )}
      </div>
    </div>
  );
}
