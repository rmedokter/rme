// admin/components/PaymentTable.js
import { useState } from 'react';

export default function PaymentTable({ payments, onVerify }) {
  const [verifying, setVerifying] = useState(null); // Track invoice yang sedang diverifikasi

  const handleVerifyClick = async (invoiceId) => {
    setVerifying(invoiceId);
    await onVerify(invoiceId);
    setVerifying(null);
  };

  return (
    <div className="overflow-x-auto p-4 sm:p-0 bg-gray-100">
      <div className="w-full bg-white rounded-lg">
        <table className="min-w-full text-sm sm:text-base">
          <thead className="bg-teal-700 text-white sticky top-0">
            <tr>
              {['Invoice ID', 'Contact', 'Amount', 'Date', 'Status', 'Actions'].map(
                (header) => (
                  <th
                    key={header}
                    className="p-3 sm:p-4 font-semibold text-left first:rounded-tl-lg last:rounded-tr-lg"
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr
                key={payment.invoice_id}
                className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition duration-200"
              >
                <td className="p-3 sm:p-4 text-gray-800 break-all">
                  {payment.invoice_id}
                </td>
                <td className="p-3 sm:p-4 text-gray-800">{payment.contact}</td>
                <td className="p-3 sm:p-4 text-gray-800">
                  {payment.amount ? `Rp ${payment.amount.toLocaleString('id-ID')}` : 'N/A'}
                </td>
                <td className="p-3 sm:p-4 text-gray-800">
                  {payment.timestamp
                    ? new Date(payment.timestamp * 1000).toLocaleDateString('id-ID')
                    : 'N/A'}
                </td>
                <td className="p-3 sm:p-4 text-gray-800">
                  {payment.status || 'PENDING'}
                </td>
                <td className="p-3 sm:p-4">
                  <button
                    onClick={() => handleVerifyClick(payment.invoice_id)}
                    disabled={verifying === payment.invoice_id}
                    className={`px-3 py-1 bg-teal-600 text-white rounded-lg shadow-md hover:bg-teal-700 transition duration-300 ease-in-out text-sm ${
                      verifying === payment.invoice_id ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {verifying === payment.invoice_id ? 'Verifying...' : 'Verify'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CSS khusus */}
      <style jsx>{`
        @media (max-width: 640px) {
          table {
            display: block;
            overflow-x: auto;
            white-space: nowrap;
          }
          th,
          td {
            min-width: 100px;
          }
        }
      `}</style>
    </div>
  );
}