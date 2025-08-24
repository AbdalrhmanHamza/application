"use client";

import Modal from "./Modal";
import { useState } from "react";
import sendNotification from "../../utils/sendNotification";
import { doc, setDoc } from "firebase/firestore";
import { initializeFirebase } from "../../firebase_config";

export default function WithdrawsTable({ transactions, role }) {
  const [focusedTransaction, setFocusedTransaction] = useState(null);

  const intl = new Intl.NumberFormat("en-US", {
    currency: "USD",
    style: "currency",
  });

  function changeStatus(newStatus, uid, transactionId) {
    if (focusedTransaction.status == newStatus || !focusedTransaction) return;
    // Update transaction status in Firestore
    const { db } = initializeFirebase();
    if (!db) {
      console.error("Firestore database is not initialized.");
      return;
    }

    const userRef = doc(db, "users", uid);
    const transactionRef = doc(userRef, "withdrawOrders", transactionId);

    setDoc(transactionRef, { status: newStatus }, { merge: true })
      .then(() => {
        console.log("Transaction status updated successfully");
        // Send notification to user
        switch (newStatus) {
          case "completed":
            sendNotification(
              uid,
              "تم اكمال المعاملة بنجاح",
              `تم اكمال معاملتك بمبلغ ${intl.format(
                focusedTransaction.amount
              )} بنجاح 🎉🎉`
            );
            break;
          case "rejected":
            sendNotification(
              uid,
              "⚠تم رفض المعاملة",
              `تم رفض معاملتك بمبلغ ${intl.format(
                focusedTransaction.amount
              )}. يرجى التواصل مع الدعم لمزيد من المعلومات.`
            );
            break;
        }
      })
      .catch((error) => {
        console.error("Error updating transaction status:", error);
      });
  }

  console.log("TransactionsTable role:", transactions);
  return (
    <div className="w-full h-full flex justify-center p-1">
      {/* details modal */}
      {focusedTransaction && (
        <Modal isOpen={true} onClose={() => setFocusedTransaction(null)}>
          <div className="flex flex-col gap-4">
            <h2 className="text-center font-bold underline mb-4">
              تفاصيل المعاملة
            </h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
              <div>
                <strong>الاسم</strong>
                <span className="inline-block mr-2 border border-neutral-700 px-2 py-1 rounded-lg">
                  {focusedTransaction.firstName +
                    " " +
                    focusedTransaction.lastName}
                </span>
              </div>
              <div>
                <strong>رقم الهاتف</strong>
                <span className="inline-block mr-2 border border-neutral-700 px-2 py-1 rounded-lg">
                  {focusedTransaction.phone}
                </span>
              </div>
              <div>
                <strong>التاريخ:</strong>{" "}
                <span className="inline-block mr-2 border border-neutral-700 px-2 py-1 rounded-lg">
                  {new Date(
                    focusedTransaction.createdAt?.seconds * 1000
                  ).toLocaleDateString()}
                </span>
              </div>
              <div>
                <strong>id جلا لايف:</strong>
                <span className="inline-block mr-2 border border-neutral-700 px-2 py-1 rounded-lg">
                  {focusedTransaction.appId}
                </span>
              </div>
              <div>
                <strong>المبلغ:</strong>{" "}
                <span className="inline-block mr-2 border border-neutral-700 px-2 py-1 rounded-lg">
                  {intl.format(focusedTransaction.amount)}
                </span>
              </div>
              <div>
                <strong>الحالة:</strong>{" "}
                <span className="inline-block mr-2 border border-neutral-700 px-2 py-1 rounded-lg">
                  {focusedTransaction.status === "completed"
                    ? "نجحت"
                    : focusedTransaction.status === "pending"
                    ? "قيد المعالجة"
                    : "مرفوض"}
                </span>
              </div>
              <div>
                <strong>الدولة:</strong>
                <span className="inline-block mr-2 border border-neutral-700 px-2 py-1 rounded-lg">
                  {focusedTransaction.country}
                </span>
              </div>
              <div>
                <strong>طريقة السحب:</strong>
                <span className="inline-block mr-2 border border-neutral-700 px-2 py-1 rounded-lg">
                  {focusedTransaction.method}
                </span>
              </div>
              <div className="flex flex-col col-span-full gap-2">
                <strong>معلومات حساب التحويل :</strong>{" "}
                <div className="px-4 py-2 border border-neutral-700 rounded-lg bg-neutral-900">
                  <p className="text-lg text-blue-500">
                    {focusedTransaction.methodInfo}
                  </p>
                </div>
              </div>
              <div className="flex col-span-full flex-col gap-2">
                <strong>صورة الايصال:</strong>{" "}
                <img
                  data-zoomable
                  style={{ objectFit: "contain" }}
                  className="w-[95%] mx-auto  rounded-lg"
                  src={focusedTransaction.imageUrl}
                  alt="صوره ايصال التحويل"
                />
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <div>
                <button
                  onClick={() => {
                    changeStatus(
                      "completed",
                      focusedTransaction.uid,
                      focusedTransaction.id
                    );
                    setFocusedTransaction(null);
                  }}
                  className="bg-green-600 transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  <strong>موافقة</strong>
                </button>
              </div>
              <div>
                <button
                  onClick={() => {
                    changeStatus(
                      "rejected",
                      focusedTransaction.uid,
                      focusedTransaction.id
                    );
                    setFocusedTransaction(null);
                  }}
                  className="bg-red-600 transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  <strong>رفض</strong>
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
      <table>
        <thead>
          <tr>
            <th>التاريخ</th>
            <th>الاسم</th>
            <th>id جلا لايف</th>
            <th>المبلغ</th>
            <th>الحالة</th>
            {(role === "admin" || role === "moderator") && <th>التفاصيل</th>}
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, i) => (
            <tr key={i} className="border-b border-neutral-800">
              <td key="1">
                {new Date(
                  transaction.createdAt?.seconds * 1000
                ).toLocaleDateString()}
              </td>
              <td key="name" className="text-center">
                {transaction.firstName + " " + transaction.lastName}
              </td>
              <td key="2" className="text-center">
                {transaction.appId}
              </td>
              <td key="3" className="text-center">
                {intl.format(transaction.amount)}
              </td>
              <td key="4" className="flex justify-center py-4">
                <span
                  className={`text-center w-fit px-4 py-1 border border-neutral-700 ${
                    transaction.status == "completed"
                      ? "bg-amber-200 text-neutral-900"
                      : transaction.status == "pending"
                      ? "bg-blue-700 text-white"
                      : "bg-red-500 text-black"
                  }  rounded-lg`}
                >
                  {transaction.status === "completed"
                    ? "نجحت"
                    : transaction.status === "pending"
                    ? "قيد المعالجة"
                    : "مرفوض"}
                </span>
              </td>
              {role === "admin" ||
                (role === "moderator" && (
                  <td>
                    <button
                      onClick={() => setFocusedTransaction(transaction)}
                      className="p-2 border border-neutral-600 rounded-lg hover:bg-neutral-800"
                    >
                      عرض التفاصيل
                    </button>
                  </td>
                ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
