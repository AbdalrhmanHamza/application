"use client";
import { useState } from "react";

export default function Page() {
  const [selectedModerator, setSelectedModerator] = useState(null);
  const [errors, setErrors] = useState({
    choiceError: null,
  });

  function submitForm(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    if (selectedModerator) {
      console.log("Selected Moderator:", selectedModerator);
      // Here you can handle the submission, e.g., send to an API or process further

      fetch("/api/checkout_session", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selectedModerator }),
      });
    } else {
      console.error("No moderator selected");
      setErrors({ choiceError: "يرجى اختيار وكالة " });
    }
  }

  return (
    <div className="w-full">
      <div className="flex flex-col gap-8 py-4 items-start">
        <h1 className="text-center">اختر الوكاله التابع لها</h1>
        <div className="w-full">
          <form
            action="/api/checkout_session"
            method="POST"
            className="flex flex-col gap-4 w-full"
            onSubmit={submitForm}
          >
            <div className="w-full max-w-2xl">
              <ul className="grid w-full gap-6 md:grid-cols-2">
                <li>
                  <input
                    type="radio"
                    id="moderator-1"
                    name="moderator-sam"
                    value="moderator-sam"
                    className="hidden peer"
                    onChange={() => setSelectedModerator("moderator-sam")}
                    required
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
                <li>
                  <input
                    type="radio"
                    id="moderator-2"
                    name="moderator-gangon"
                    value="moderator-gangon"
                    className="hidden peer"
                    onChange={() => setSelectedModerator("moderator-gangon")}
                    required
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
              {errors.choiceError && (
                <p className="mt-2 text-red-600">{errors.choiceError}</p>
              )}
            </div>
            <button
              className="py-2 px-8 mt-8 rounded-lg border border-neutral-800 bg-neutral-900 text-white hover:bg-neutral-800 transition-colors duration-300"
              type="submit"
            >
              اكمل الدفع
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
