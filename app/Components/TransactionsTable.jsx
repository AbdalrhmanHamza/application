"use client";

export default function TransactionsTable({ transactions, role }) {
  const intl = new Intl.NumberFormat("en-US", {
    currency: "USD",
    style: "currency",
  });
  console.log("TransactionsTable role:", transactions);

  function showDetails() {
    // Open modal logic here
    const modalRoot = document.getElementById("modal-root");
    const portal = document.getElementById("portal");
    if (modalRoot && portal) {
      modalRoot.style.display = "block";
      portal.innerHTML = "<p>Transaction Details Here</p>"; // Replace with actual details
    }
  }
  return (
    <div className="w-full h-full flex justify-center p-1">
      <table>
        <thead>
          <tr>
            <th>التاريخ</th>
            {role === "admin" && <th>الاسم</th>}
            <th>id جلا لايف</th>
            <th>المبلغ</th>
            <th>الحالة</th>
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
              {/* name */}
              {(role === "admin" || role === "moderator") && (
                <td key="name" className="text-center">
                  {transaction.firstName + " " + transaction.lastName}
                </td>
              )}
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
                      : "bg-blue-700 text-white"
                  }  rounded-lg`}
                >
                  {transaction.status === "completed"
                    ? "نجحت"
                    : transaction.status === "pending"
                    ? "قيد المعالجة"
                    : "مرفوض"}
                </span>
              </td>
              {role === "admin" && (
                <td>
                  <button
                    onClick={showDetails}
                    className="p-2 border border-neutral-600 rounded-lg hover:bg-neutral-800"
                  >
                    عرض التفاصيل
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
