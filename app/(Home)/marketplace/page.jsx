"use client";

import { useState, useEffect } from "react";
import ProductCard from "../../Components/ProductCard";
import { initializeFirebase } from "../../../firebase_config";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export default function Page() {
  const { db } = initializeFirebase();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appId, setAppId] = useState("");
  const [moderator, setModerator] = useState("");
  const [errors, setErrors] = useState({
    appIdError: null,
    moderatorError: null,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      // Create a query to order products by price (ascending)
      const q = query(collection(db, "products"), orderBy("price", "asc"));
      const querySnapshot = await getDocs(q);
      const productsData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id, // Include the document ID
          ...data,
        };
      });
      setLoading(false);
      setProducts(productsData);
    };

    fetchProducts();
  }, []);

  return (
    <div className="w-full h-full flex flex-col gap-6">
      <h1 className="text-4xl font-bold text-center mb-12">متجر غلا لايف</h1>
      {!loading && products.length === 0 && (
        <p className="text-gray-500">No products available</p>
      )}
      <div className="max-w-280 mx-auto w-full p-4 flex flex-col gap-4">
        <div>
          <ul className="grid w-full gap-6 md:grid-cols-2">
            <li>
              <input
                type="radio"
                id="moderator-1"
                name="moderator" // unified name
                value="boHg3y9qhQa5yqZezqaOyw7f5n62"
                className="hidden peer"
                onChange={() => {
                  setModerator("boHg3y9qhQa5yqZezqaOyw7f5n62");
                  setErrors({ ...errors, moderatorError: null });
                }}
                checked={moderator === "boHg3y9qhQa5yqZezqaOyw7f5n62"}
                required
              />
              <label
                htmlFor="moderator-1"
                className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 dark:peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <div className="block">
                  <div className="w-full text-lg font-semibold">وكالة سام</div>
                </div>
              </label>
            </li>
            <li>
              <input
                type="radio"
                id="moderator-2"
                name="moderator" // unified name
                value="jeZ2zLXL62WkZbjGO8mFDlNm9Sg1"
                className="hidden peer"
                onChange={() => {
                  setModerator("jeZ2zLXL62WkZbjGO8mFDlNm9Sg1");
                  setErrors({ ...errors, moderatorError: null });
                }}
                checked={moderator === "jeZ2zLXL62WkZbjGO8mFDlNm9Sg1"}
              />
              <label
                htmlFor="moderator-2"
                className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 dark:peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <div className="block">
                  <div className="w-full text-lg font-semibold">
                    وكالة جنجون
                  </div>
                </div>
              </label>
            </li>
          </ul>
          <div>
            {errors.moderatorError && (
              <p className="text-red-500 text-sm mt-2">
                {errors.moderatorError}
              </p>
            )}
          </div>
        </div>
        <div>
          <div>
            <input
              type="text"
              inputMode="numeric"
              name="id"
              value={appId}
              onChange={(e) => {
                // accept only numbers
                if (/^\d*$/.test(e.target.value)) {
                  setAppId(e.target.value);
                }
                if (e.target.value.length < 1 || e.target.value.length > 9) {
                  console.log("Invalid input");
                  setErrors({
                    ...errors,
                    appIdError: "(1-9 ارقام) يرجى إدخال ID صالح",
                  });
                }
                if (e.target.value.length <= 9 && e.target.value.length > 0) {
                  setErrors({ ...errors, appIdError: null });
                }
              }}
              placeholder="ادخل ID حسابك في التطبيق"
              className="py-2 px-4 rounded border border-neutral-700 focus:outline-white "
            />
            {errors.appIdError && (
              <p className="text-red-500 text-sm mt-2">{errors.appIdError}</p>
            )}
          </div>
        </div>
      </div>
      <div className="max-w-280 mx-auto grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3 w-full justify-center p-4">
        {loading && <p>Loading products...</p>}
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            appId={appId}
            moderator={moderator}
            setErrors={setErrors}
            errors={errors}
          />
        ))}
      </div>
    </div>
  );
}
