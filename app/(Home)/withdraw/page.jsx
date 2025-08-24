"use client";

import { useReducer, useActionState, useState, useEffect } from "react";
import { initializeFirebase } from "../../../firebase_config";
import { doc, collection, addDoc, getDoc } from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

const formErrors = {
  nameError: null,
  nameValue: "",
  uidError: null,
  uidValue: "",
  phoneError: null,
  phoneValue: "",
  countryError: null,
  countryValue: "",
  amountError: null,
  amountValue: "",
  lastNameError: null,
  lastNameValue: "",
  appIdError: null,
  appIdValue: "",
  methodError: null,
  methodValue: "",
  methodInfoError: null,
  methodInfoValue: "",
  ImageError: null,
  moderator: null,
  moderatorError: null,
  ImageUrl: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_NAME_ERROR":
      return { ...state, nameError: action.payload };
    case "SET_NAME_VALUE":
      return { ...state, nameValue: action.payload };
    case "SET_UID_ERROR":
      return { ...state, uidError: action.payload };
    case "SET_UID_VALUE":
      return { ...state, uidValue: action.payload };
    case "SET_LAST_NAME_ERROR":
      return { ...state, lastNameError: action.payload };
    case "SET_LAST_NAME_VALUE":
      return { ...state, lastNameValue: action.payload };
    case "SET_PHONE_ERROR":
      return { ...state, phoneError: action.payload };
    case "SET_PHONE_VALUE":
      return { ...state, phoneValue: action.payload };
    case "SET_COUNTRY_ERROR":
      return { ...state, countryError: action.payload };
    case "SET_COUNTRY_VALUE":
      return { ...state, countryValue: action.payload };
    case "SET_AMOUNT_ERROR":
      return { ...state, amountError: action.payload };
    case "SET_AMOUNT_VALUE":
      return { ...state, amountValue: action.payload };
    case "SET_METHOD_ERROR":
      return { ...state, methodError: action.payload };
    case "SET_METHOD_VALUE":
      return { ...state, methodValue: action.payload };
    case "SET_APPID_ERROR":
      return { ...state, appIdError: action.payload };
    case "SET_APPID_VALUE":
      return { ...state, appIdValue: action.payload };
    case "SET_METHODINFO_ERROR":
      return { ...state, methodInfoError: action.payload };
    case "SET_METHODINFO_VALUE":
      return { ...state, methodInfoValue: action.payload };
    case "SET_IMAGE_ERROR":
      return { ...state, ImageError: action.payload };
    case "SET_MODERATOR":
      return { ...state, moderator: action.payload };
    case "SET_MODERATOR_ERROR":
      return { ...state, moderatorError: action.payload };
    case "SET_FORM":
      return { ...action.payload };
    default:
      return state;
  }
}

export default function Page() {
  const { db, auth, firebase } = initializeFirebase();
  const user = auth.currentUser;
  const uid = user?.uid;
  const storage = getStorage(firebase);

  const [isDragOver, setIsDragOver] = useState(false);
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      startUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      startUpload(e.target.files[0]);
    }
  };

  function startUpload(file) {
    setFile(file);
    setProgress(0);
    dispatch({ type: "SET_IMAGE_ERROR", payload: null });
    console.log("Starting upload for file:", file.name);
    const storageRef = ref(
      storage,
      `withdrawImages/${uid}/${file.name}+${Date.now()}`
    );
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const prog = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(prog);
        console.log("Upload is " + prog + "% done");
      },
      (error) => {
        console.error("Upload failed:", error);
        dispatch({ type: "SET_IMAGE_ERROR", payload: "فشل رفع الصورة" });
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          setFileUrl(downloadURL); // Store the download URL instead of the File object
        });
      }
    );
  }

  const [errorsState, dispatch] = useReducer(reducer, formErrors);

  // Move uid error side effect out of render
  useEffect(() => {
    if (!user) {
      dispatch({ type: "SET_UID_ERROR", payload: "يجب تسجيل الدخول اولا" });
    } else if (errorsState.uidError) {
      dispatch({ type: "SET_UID_ERROR", payload: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const [formState, action, Pending] = useActionState(formAction, formErrors);

  // action function
  async function formAction(prevState, formData) {
    // Read inputs
    const firstName = String(formData.get("firstName") || "").trim();
    const lastName = String(formData.get("lastName") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const appId = String(formData.get("appId") || "").trim();
    const country = String(formData.get("country") || "").trim();
    const amountRaw = String(formData.get("amount") || "").trim();
    const amountNum = Number(amountRaw);
    const method = String(formData.get("method") || "").trim();
    const methodInfo = String(formData.get("methodInfo") || "").trim();
    const moderator = String(formData.get("moderator") || "");
    const file = fileUrl; // use the uploaded file URL
    console.log(moderator, "moderator id");

    // Build next state in one pass to avoid stale reads
    const nextState = { ...errorsState };

    // Values
    nextState.nameValue = firstName;
    nextState.lastNameValue = lastName;
    nextState.phoneValue = phone;
    nextState.appIdValue = appId;
    nextState.countryValue = country;
    nextState.amountValue = amountRaw;
    nextState.methodValue = method;
    nextState.methodInfoValue = methodInfo;

    // Errors
    nextState.nameError = firstName.length < 2 ? "الاسم الاول قصير جدا" : null;
    nextState.lastNameError =
      lastName.length < 2 ? "الاسم الاخير قصير جدا" : null;
    nextState.phoneError =
      phone.length < 5 || !/^\+?\d+$/.test(phone)
        ? "رقم الهاتف غير صالح"
        : null;
    nextState.appIdError =
      appId.length < 5 || !/^\d+$/.test(appId) ? "ID التطبيق غير صالح" : null;
    nextState.countryError = country.length < 2 ? "اسم الدولة غير صالح" : null;
    nextState.amountError =
      !Number.isFinite(amountNum) || amountNum <= 10
        ? "يجب ان يكون المبلغ اكبر من $10 دولار"
        : null;
    nextState.methodError = method.length < 2 ? "اسم الطريقة غير صالح" : null;
    nextState.methodInfoError =
      methodInfo.length < 9 ? "معلومات الطريقة غير صالحة" : null;
    nextState.ImageError = !fileUrl ? "يجب رفع صورة" : null;

    // Moderator validation: rely on selected radio or existing state
    const selectedModerator = moderator || nextState.moderator;
    nextState.moderatorError = selectedModerator ? null : "يجب اختيار الوكالة";

    // uid error
    nextState.uidError = user ? null : "يجب تسجيل الدخول اولا";

    const hasErrors = Boolean(
      nextState.uidError ||
        nextState.nameError ||
        nextState.lastNameError ||
        nextState.phoneError ||
        nextState.appIdError ||
        nextState.countryError ||
        nextState.amountError ||
        nextState.methodError ||
        nextState.methodInfoError ||
        nextState.moderatorError ||
        nextState.ImageError ||
        !fileUrl
    );

    // Push computed state to UI once
    dispatch({ type: "SET_FORM", payload: nextState });

    if (hasErrors) {
      // Stop submission
      return;
    }

    // Submit
    try {
      const docRef = collection(doc(db, "users", uid), "withdrawOrders");
      await addDoc(docRef, {
        firstName,
        lastName,
        phone,
        country,
        appId,
        method,
        methodInfo,
        amount: amountNum,
        uid,
        moderator,
        status: "pending",
        createdAt: new Date(),
        imageUrl: fileUrl, // store the file URL
      });

      // Reset form state and upload UI
      dispatch({ type: "SET_FORM", payload: { ...formErrors } });
      setFile(null);
      setFileUrl(null);
      setProgress(0);
      // get the moderators token
      const moderatorRef = doc(db, "users", moderator);
      const userDoc = await getDoc(moderatorRef);
      const fcmToken = userDoc.data()?.fcmToken || [];
      console.log("Moderator FCM Tokens:", fcmToken);

      fcmToken.forEach((token) => {
        fetch("/api/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            title: "طلب سحب جديد",
            body: `قام ${firstName} ${lastName} بإنشاء طلب سحب بمبلغ $${amountNum}`,
          }),
        });
      });
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  }

  return (
    <div className="py-4 px-2 flex flex-col gap-4 items-center justify-start flex-1">
      <h1 className="text-center">سحب راتب</h1>
      <div className="flex flex-1 w-full flex-col items-center justify-start">
        <h3>املاء البيانات المطلوبة لبدء عملية السحب.</h3>

        <form
          action={action}
          noValidate
          className="max-w-200 py-8 w-full grid grid-cols-6 gap-y-8 mt-4 px-6"
        >
          <div className="flex flex-wrap col-span-6 justify-between gap-8">
            <div className="flex flex-col gap-3 flex-1">
              <label htmlFor="firstName">الاسم الاول</label>
              <input
                type="text"
                value={errorsState.nameValue}
                onChange={(e) =>
                  dispatch({ type: "SET_NAME_VALUE", payload: e.target.value })
                }
                id="firstName"
                name="firstName"
                className="border focus:outline-2 focus:outline-white border-neutral-700 bg-neutral-900 px-2 py-1 rounded"
              />
              {errorsState.nameError && (
                <div className="text-red-500 text-sm mt-1">
                  {errorsState.nameError}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-3 flex-1">
              <label htmlFor="lastName">الاسم الاخير</label>
              <input
                type="text"
                value={errorsState.lastNameValue}
                onChange={(e) =>
                  dispatch({
                    type: "SET_LAST_NAME_VALUE",
                    payload: e.target.value,
                  })
                }
                id="lastName"
                name="lastName"
                className="border focus:outline-2 focus:outline-white border-neutral-700 bg-neutral-900 px-2 py-1 rounded  "
              />
              {errorsState.lastNameError && (
                <div className="text-red-500 text-sm mt-1">
                  {errorsState.lastNameError}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-wrap col-span-6 justify-between gap-8">
            <div className="flex flex-col gap-3 flex-1">
              <label htmlFor="phone">رقم الهاتف</label>
              <input
                type="text"
                value={errorsState.phoneValue}
                onChange={(e) =>
                  dispatch({ type: "SET_PHONE_VALUE", payload: e.target.value })
                }
                inputMode="numeric"
                id="phone"
                name="phone"
                className="border focus:outline-2 focus:outline-white border-neutral-700 bg-neutral-900 px-2 py-1 rounded  "
              />
              {errorsState.phoneError && (
                <div className="text-red-500 text-sm mt-1">
                  {errorsState.phoneError}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-3 flex-1">
              <label htmlFor="appId">ID حسابك في التطبيق</label>
              <input
                type="text"
                value={errorsState.appIdValue}
                onChange={(e) =>
                  dispatch({ type: "SET_APPID_VALUE", payload: e.target.value })
                }
                inputMode="numeric"
                id="appId"
                name="appId"
                className="border focus:outline-2 focus:outline-white border-neutral-700 bg-neutral-900 px-2 py-1 rounded  "
              />
              {errorsState.appIdError && (
                <div className="text-red-500 text-sm mt-1">
                  {errorsState.appIdError}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col col-span-6 md:col-span-4 gap-3 flex-1">
            <label htmlFor="country">الدولة</label>
            <input
              type="text"
              value={errorsState.countryValue}
              onChange={(e) =>
                dispatch({ type: "SET_COUNTRY_VALUE", payload: e.target.value })
              }
              id="country"
              name="country"
              className="border focus:outline-2 focus:outline-white border-neutral-700 bg-neutral-900 px-2 py-1 rounded  "
            />
            {errorsState.countryError && (
              <div className="text-red-500 text-sm mt-1">
                {errorsState.countryError}
              </div>
            )}
          </div>

          <div className="flex flex-col col-span-6 md:col-span-4 gap-3 flex-1">
            <label htmlFor="amount">المبلغ (بالدولار $)</label>
            <input
              type="text"
              inputMode="numeric"
              value={errorsState.amountValue}
              onChange={(e) =>
                dispatch({ type: "SET_AMOUNT_VALUE", payload: e.target.value })
              }
              id="amount"
              name="amount"
              className="border focus:outline-2 focus:outline-white border-neutral-700 bg-neutral-900 px-2 py-1 rounded  "
            />
            {errorsState.amountError && (
              <div className="text-red-500 text-sm mt-1">
                {errorsState.amountError}
              </div>
            )}
          </div>
          <div className="flex flex-col col-span-6 md:col-span-4 gap-3 flex-1">
            <label htmlFor="method">اسم طريقة السحب (مثل paypal)</label>
            <input
              type="text"
              value={errorsState.methodValue}
              onChange={(e) =>
                dispatch({ type: "SET_METHOD_VALUE", payload: e.target.value })
              }
              id="method"
              name="method"
              className="border focus:outline-2 focus:outline-white border-neutral-700 bg-neutral-900 px-2 py-1 rounded  "
            />
            {errorsState.methodError && (
              <div className="text-red-500 text-sm mt-1">
                {errorsState.methodError}
              </div>
            )}
          </div>
          <div className="flex flex-col col-span-6 md:col-span-4 gap-3 flex-1">
            <label htmlFor="methodInfo">
              ادخل معلوماتك داخل طريقة السحب حتي نقوم بتحويل الاموال
            </label>
            <textarea
              id="methodInfo"
              value={errorsState.methodInfoValue}
              onChange={(e) =>
                dispatch({
                  type: "SET_METHODINFO_VALUE",
                  payload: e.target.value,
                })
              }
              rows={4}
              name="methodInfo"
              className="border focus:outline-2 focus:outline-white border-neutral-700 bg-neutral-900 px-2 py-1 rounded  "
            />
            {errorsState.methodInfoError && (
              <div className="text-red-500 text-sm mt-1">
                {errorsState.methodInfoError}
              </div>
            )}
          </div>
          {/* upoloading area */}

          <div className="flex flex-col col-span-6 md:col-span-6 gap-3 flex-1">
            <label
              htmlFor="dropzone-file"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer 
          transition-colors duration-300 
          ${
            isDragOver
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900"
              : "border-gray-300 bg-gray-50 dark:bg-gray-700"
          }`}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className={`w-8 h-8 mb-4 ${
                    isDragOver ? "text-blue-500" : "text-gray-500"
                  }`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                {!file ? (
                  <>
                    <p className="mb-2 text-sm text-gray-400">
                      <span className="font-semibold">اضغط للرفع</span> او اسحب
                      و افلت
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PNG, JPG or PDF (MAX. 1.5MB)
                    </p>
                  </>
                ) : (
                  <p className="mb-2 text-sm text-gray-700 dark:text-gray-200">
                    {file.name}
                  </p>
                )}
              </div>
              <input
                id="dropzone-file"
                type="file"
                name="transactionImage"
                accept="image/*, application/pdf"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            {/* Progress Bar */}
            {file && (
              <div className="w-full mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-600">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <span className="truncate max-w-[70%]">{file.name}</span>
                <p className="text-xs text-gray-500 mt-1">{progress}%</p>
              </div>
            )}
          </div>
          {errorsState.ImageError && (
            <div className="text-red-500 text-sm mt-1 col-span-6">
              {errorsState.ImageError}
            </div>
          )}

          {/* moderators */}
          <div className="col-span-6">
            <h2 className="mb-4">اختر الوكالة</h2>
            <ul className="grid w-full gap-6 md:grid-cols-2">
              <li>
                <input
                  type="radio"
                  id="moderator-1"
                  name="moderator"
                  value="boHg3y9qhQa5yqZezqaOyw7f5n62"
                  className="hidden peer"
                  onChange={() => {
                    dispatch({
                      type: "SET_MODERATOR",
                      payload: "boHg3y9qhQa5yqZezqaOyw7f5n62",
                    });
                    dispatch({ type: "SET_MODERATOR_ERROR", payload: null });
                  }}
                  checked={
                    errorsState.moderator === "boHg3y9qhQa5yqZezqaOyw7f5n62"
                  }
                />
                <label
                  htmlFor="moderator-1"
                  className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 dark:peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <div className="block">
                    <div className="w-full text-lg font-semibold">
                      وكالة سام
                    </div>
                  </div>
                </label>
              </li>
              {/* radio button */}
              {/* <li>
                <input
                  type="radio"
                  id="moderator-2"
                  name="moderator"
                  value="moderator-gangon"
                  className="hidden peer"
                  onChange={() => {
                    dispatch({
                      type: "SET_MODERATOR",
                      payload: "jeZ2zLXL62WkZbjGO8mFDlNm9Sg1",
                    });
                    dispatch({ type: "SET_MODERATOR_ERROR", payload: null });
                  }}
                  checked={
                    errorsState.moderator === "jeZ2zLXL62WkZbjGO8mFDlNm9Sg1"
                  }
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
              </li> */}
            </ul>
            <div>
              {errorsState.moderatorError && (
                <p className="text-red-500 text-sm mt-2">
                  {errorsState.moderatorError}
                </p>
              )}
            </div>
          </div>

          {/* submit button */}
          <div className="col-span-6 flex justify-center">
            <button
              type="submit"
              disabled={Pending}
              className="bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 text-white hover:bg-blue-600 transition-colors duration-300 px-6 py-2 rounded"
            >
              {Pending ? (
                <div className="flex items-center gap-2 flex-row-reverse">
                  <span>جاري ارسال الطلب</span>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                </div>
              ) : (
                "سحب الراتب"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
