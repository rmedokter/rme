// admin/components/UserTable.js
import { useState } from 'react';

export default function UserTable({ users, onUpdateUser }) {
  const [expandedRow, setExpandedRow] = useState(null); // Track baris yang dibuka di layar kecil
  const [modalOpen, setModalOpen] = useState(false); // Track status modal
  const [editUser, setEditUser] = useState(null); // Data pengguna yang diedit
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');

  const handleToggleRow = (contact) => {
    setExpandedRow(expandedRow === contact ? null : contact);
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setEditName(user.name || '');
    setEditEmail(user.email || '');
    setModalOpen(true);
  };

  const handleSave = () => {
    const updatedData = {};
    if (editName && editName !== editUser.name) updatedData.name = editName;
    if (editEmail && editEmail !== editUser.email) updatedData.email = editEmail;
    if (Object.keys(updatedData).length > 0) {
      onUpdateUser(editUser.contact, updatedData);
    }
    setModalOpen(false);
    setEditUser(null);
  };

  const handleCancel = () => {
    setModalOpen(false);
    setEditUser(null);
    setEditName('');
    setEditEmail('');
  };

  return (
    <div className="overflow-x-auto bg-gray-100">
      <div className="w-full bg-white rounded-lg">
        <table className="w-full text-sm sm:text-base">
          <thead className="bg-teal-700 text-white sticky top-0">
            <tr>
              <th className="p-3 sm:p-4 font-semibold text-left rounded-tl-lg">
                Contact
              </th>
              <th className="p-3 sm:p-4 font-semibold text-left hidden sm:table-cell">
                Category
              </th>
              <th className="p-3 sm:p-4 font-semibold text-left">Name</th>
              <th className="p-3 sm:p-4 font-semibold text-left hidden sm:table-cell">
                Email
              </th>
              <th className="p-3 sm:p-4 font-semibold text-left hidden sm:table-cell">
                Chat Count
              </th>
              <th className="p-3 sm:p-4 font-semibold text-left hidden sm:table-cell">
                Last Reset
              </th>
              <th className="p-3 sm:p-4 font-semibold text-left hidden sm:table-cell">
                Sub. End
              </th>
              <th className="p-3 sm:p-4 font-semibold text-left rounded-tr-lg">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <>
                <tr
                  key={user.contact}
                  className="border-b border-gray-200 hover:bg-gray-50 transition duration-200 cursor-pointer sm:cursor-default"
                  onClick={() => window.innerWidth < 640 && handleToggleRow(user.contact)}
                >
                  <td className="p-3 sm:p-4 text-gray-800 break-all">
                    <span className="flex items-center">
                      {user.contact}
                      <span className="ml-2 text-gray-500 sm:hidden">
                        {expandedRow === user.contact ? '▲' : '▼'}
                      </span>
                    </span>
                  </td>
                  <td className="p-3 sm:p-4 text-gray-800 hidden sm:table-cell">
                    {user.category || 'unregistered'}
                  </td>
                  <td className="p-3 sm:p-4 text-gray-800">
                    {user.name || 'N/A'}
                  </td>
                  <td className="p-3 sm:p-4 text-gray-800 hidden sm:table-cell">
                    {user.email || 'N/A'}
                  </td>
                  <td className="p-3 sm:p-4 text-gray-800 hidden sm:table-cell">
                    {user.chat_count || 0}
                  </td>
                  <td className="p-3 sm:p-4 text-gray-800 hidden sm:table-cell">
                    {user.last_reset
                      ? new Date(user.last_reset * 1000).toLocaleDateString('id-ID')
                      : 'N/A'}
                  </td>
                  <td className="p-3 sm:p-4 text-gray-800 hidden sm:table-cell">
                    {user.subscription_end
                      ? new Date(user.subscription_end * 1000).toLocaleDateString('id-ID')
                      : 'N/A'}
                  </td>
                  <td className="p-3 sm:p-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(user);
                      }}
                      className="px-3 py-1 bg-teal-600 text-white rounded-lg shadow-md hover:bg-teal-700 transition duration-300 ease-in-out text-sm"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
                {expandedRow === user.contact && (
                  <tr className="bg-gray-50 sm:hidden">
                    <td colSpan="8" className="p-3 text-gray-800">
                      <div className="space-y-2">
                        <p>
                          <strong>Category:</strong> {user.category || 'unregistered'}
                        </p>
                        <p>
                          <strong>Email:</strong> {user.email || 'N/A'}
                        </p>
                        <p>
                          <strong>Chat Count:</strong> {user.chat_count || 0}
                        </p>
                        <p>
                          <strong>Last Reset:</strong>{' '}
                          {user.last_reset
                            ? new Date(user.last_reset * 1000).toLocaleDateString('id-ID')
                            : 'N/A'}
                        </p>
                        <p>
                          <strong>Sub. End:</strong>{' '}
                          {user.subscription_end
                            ? new Date(user.subscription_end * 1000).toLocaleDateString('id-ID')
                            : 'N/A'}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal untuk Edit */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Edit Pengguna</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Nama</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none text-gray-800"
                  placeholder="Masukkan nama"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Email</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none text-gray-800"
                  placeholder="Masukkan email"
                />
              </div>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-end">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600 transition duration-300 ease-in-out text-sm"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg shadow-md hover:bg-teal-700 transition duration-300 ease-in-out text-sm"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS Khusus */}
      <style jsx>{`
        table {
          width: 100%;
          table-layout: auto;
        }
        @media (max-width: 639px) {
          .overflow-x-auto {
            overflow-x: hidden;
          }
          table {
            display: block;
          }
          thead {
            display: block;
            width: 100%;
          }
          thead tr {
            display: flex;
            justify-content: space-between;
            width: 100%;
          }
          th {
            flex: 1;
            text-align: left;
          }
          th.hidden {
            display: none;
          }
          tbody {
            display: block;
            width: 100%;
          }
          tbody tr {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            width: 100%;
          }
          td {
            flex: 1;
            width: 33.33%; /* 3 kolom utama */
          }
          td.hidden {
            display: none;
          }
          .p-3 {
            padding-left: 0.5rem;
            padding-right: 0.5rem;
          }
        }
        @media (min-width: 640px) {
          th:nth-child(1) { width: 20%; }
          th:nth-child(2) { width: 15%; }
          th:nth-child(3) { width: 15%; }
          th:nth-child(4) { width: 20%; }
          th:nth-child(5) { width: 10%; }
          th:nth-child(6) { width: 10%; }
          th:nth-child(7) { width: 10%; }
          th:nth-child(8) { width: 10%; }
          td {
            width: auto;
          }
        }
      `}</style>
    </div>
  );
}