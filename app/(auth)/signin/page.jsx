"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useReducer, useActionState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { initializeFirebase } from "../../../firebase_config";

function formReducer(state, action) {
  switch (action.type) {
    case "SET_NAME":
      return { ...state, [action.field]: action.payload };
    case "SET_EMAIL":
      return { ...state, [action.field]: action.payload };
    case "SET_PASSWORD":
      return { ...state, [action.field]: action.payload };
    default:
      return state;
  }
}

export default function Page() {
  const router = useRouter();

  const [formValues, dispatch] = useReducer(formReducer, {
    email: "",
    password: "",
    name: "",
  });

  const formErrors = {
    nameError: null,
    emailError: null,
    passwordError: null,
    generalError: null,
  };

  async function action(prevState, formData) {
    const { auth, db } = initializeFirebase();
    const { email, password, name } = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const newState = { ...prevState };

    // Validate form data
    if (!email) {
      newState.emailError = "البريد الإلكتروني مطلوب";
    } else {
      newState.emailError = null;
    }
    if (!password) {
      newState.passwordError = "كلمة المرور مطلوبة";
    } else if (password.trim().length < 8) {
      newState.passwordError = "كلمة المرور يجب أن تكون 8 أحرف على الأقل";
    } else {
      newState.passwordError = null;
    }

    // If there are validation errors, return them
    if (newState.nameError || newState.emailError || newState.passwordError) {
      return { ...prevState, ...newState };
    }

    // Try to create the user
    try {
      // Sign in the user
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      // Redirect to dashboard
      router.push("/");
      return { ...prevState, generalError: null };
    } catch (error) {
      // Handle specific Firebase errors
      let errorMessage = "كلمة المرور او البريد الإلكتروني غير صحيح";

      return { ...prevState, generalError: errorMessage };
    }
  }

  const [formState, formAction, isPending] = useActionState(action, formErrors);

  return (
    <div className="flex flex-col flex-1 p-4 items-center justify-center">
      <div className="flex flex-col justify-center items-center max-w-md w-full py-8 px-4 rounded-lg border border-zinc-800">
        <h1 className="text-2xl font-bold mb-4">تسجيل الدخول</h1>
        {formState.generalError && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200 text-sm w-full max-w-sm">
            {formState.generalError}
          </div>
        )}
        <form
          action={formAction}
          className="w-full max-w-sm flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <div className="mb-4 flex flex-col gap-1">
              <label
                htmlFor="email"
                className="font-semibold text-white text-lg"
              >
                البريد الإلكتروني
              </label>
              <input
                className="block focus:outline-white focus:outline-2 py-2 px-4 w-full rounded border border-zinc-800 placehold:text-lg placeholder:text-gray-400 placeholder:font-semibold"
                type="email"
                id="email"
                name="email"
                placeholder="ادخل البريد الإلكتروني"
                value={formValues.email}
                onChange={(e) =>
                  dispatch({
                    type: "SET_EMAIL",
                    field: "email",
                    payload: e.target.value,
                  })
                }
              />
              {formState.emailError && (
                <p className="text-red-500 text-sm">{formState.emailError}</p>
              )}
            </div>
            <div className="mb-4 flex flex-col gap-1">
              <label
                htmlFor="password"
                className="font-semibold text-white text-lg"
              >
                كلمة المرور
              </label>
              <input
                className="block focus:outline-white focus:outline-2 py-2 px-4 w-full rounded border border-zinc-800 placehold:text-lg placeholder:text-gray-400 placeholder:font-semibold"
                type="password"
                id="password"
                name="password"
                placeholder="ادخل كلمة المرور"
                value={formValues.password}
                onChange={(e) =>
                  dispatch({
                    type: "SET_PASSWORD",
                    field: "password",
                    payload: e.target.value,
                  })
                }
              />
              {formState.passwordError && (
                <p className="text-red-500 text-sm">
                  {formState.passwordError}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <button
              type="submit"
              disabled={isPending}
              className="w-full cursor-pointer bg-black hover:bg-white text-white hover:text-black border-2 border-white font-semibold py-3 px-4 rounded-lg transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isPending && (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              )}
              تسجيل الدخول
            </button>
            <span className="text-center text-gray-400 flex gap-2">
              ليس لديك حساب؟
              <Link href="/signup" className="hover:underline text-white">
                تسجيل
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
