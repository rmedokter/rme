import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { IoLogOutOutline } from 'react-icons/io5';
import { supabase } from '../lib/supabase';

export default function Settings({ wabaId, phoneNumberId, user }) {
  const router = useRouter();
  const [status, setStatus] = useState('');
  const [ragData, setRagData] = useState({
    business_id: '',
    phone_number_id: '',
    rag_data: {
      business_name: '',
      business_type: '',
      description: '',
      operating_hours: { weekdays: '', weekends: '' },
      services: [],
      products: [],
      disclaimer: '',
      admin_name: ''
    }
  });

  // Cek autentikasi dan isi business_id, phone_number_id dari props
  useEffect(() => {
    if (!user) {
      setStatus('Sesi tidak ditemukan. Silakan login kembali.');
      router.push('/login');
      return;
    }

    // Isi business_id dan phone_number_id dari props jika tersedia
    setRagData((prev) => ({
      ...prev,
      business_id: wabaId !== 'Belum tersedia' ? wabaId : prev.business_id,
      phone_number_id: phoneNumberId !== 'Belum tersedia' ? phoneNumberId : prev.phone_number_id
    }));

    // Jika phone_number_id tersedia, ambil data RAG otomatis
    if (phoneNumberId !== 'Belum tersedia') {
      handleGetRag();
    }
  }, [user, wabaId, phoneNumberId, router]);

  // Handler untuk perubahan input form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('rag_data.')) {
      const field = name.split('.')[1];
      setRagData((prev) => ({
        ...prev,
        rag_data: { ...prev.rag_data, [field]: value }
      }));
    } else {
      setRagData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handler untuk GET data RAG
  const handleGetRag = async () => {
    if (!ragData.phone_number_id) {
      setStatus('Phone Number ID diperlukan untuk mengambil data.');
      return;
    }
    setStatus('Mengambil data RAG...');
    try {
      const response = await fetch(`/api/rag?phone_number_id=${ragData.phone_number_id}`, {
        method: 'GET'
      });
      const result = await response.json();
      if (response.ok) {
        setRagData({
          business_id: result.business_id,
          phone_number_id: result.phone_number_id,
          rag_data: result.rag_data
        });
        setStatus('Data RAG berhasil diambil.');
      } else {
        setStatus(`Gagal mengambil data: ${result.error}`);
      }
    } catch (error) {
      setStatus(`Error jaringan: ${error.message}`);
    }
  };

  // Handler untuk PUT (simpan/edit) data RAG
  const handleSaveRag = async () => {
    if (!ragData.business_id || !ragData.phone_number_id) {
      setStatus('Business ID dan Phone Number ID diperlukan untuk menyimpan data.');
      return;
    }
    setStatus('Menyimpan data RAG...');
    try {
      const response = await fetch(`/api/rag?phone_number_id=${ragData.phone_number_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_id: ragData.business_id,
          rag_data: ragData.rag_data
        })
      });
      const result = await response.json();
      if (response.ok) {
        setStatus('Data RAG berhasil disimpan.');
      } else {
        setStatus(`Gagal menyimpan data: ${result.error}`);
      }
    } catch (error) {
      setStatus(`Error jaringan: ${error.message}`);
    }
  };

  // Handler untuk DELETE data RAG
  const handleDeleteRag = async () => {
    if (!ragData.phone_number_id) {
      setStatus('Phone Number ID diperlukan untuk menghapus data.');
      return;
    }
    setStatus('Menghapus data RAG...');
    try {
      const response = await fetch(`/api/rag?phone_number_id=${ragData.phone_number_id}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      if (response.ok) {
        setRagData({
          business_id: wabaId !== 'Belum tersedia' ? wabaId : '',
          phone_number_id: phoneNumberId !== 'Belum tersedia' ? phoneNumberId : '',
          rag_data: {
            business_name: '',
            business_type: '',
            description: '',
            operating_hours: { weekdays: '', weekends: '' },
            services: [],
            products: [],
            disclaimer: '',
            admin_name: ''
          }
        });
        setStatus('Data RAG berhasil dihapus.');
      } else {
        setStatus(`Gagal menghapus data: ${result.error}`);
      }
    } catch (error) {
      setStatus(`Error jaringan: ${error.message}`);
    }
  };

  // Logout menggunakan Supabase
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/login');
    } catch (error) {
      setStatus('Gagal logout: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 w-full">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Pengaturan Data RAG Bisnis
          </h1>
          <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-lg">
              {user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
            <div className="mb-4 sm:mb-0">
              <p className="text-sm text-gray-600">Nama Pengguna</p>
              <p className="text-lg font-semibold text-gray-800">
                {user?.email || 'Tidak Diketahui'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-teal-600 text-white rounded-lg shadow-md hover:bg-teal-700 transition duration-300 ease-in-out"
            >
              <IoLogOutOutline size={20} className="mr-2" />
              Keluar
            </button>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Edit Data RAG Bisnis
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600">Business ID (WABA ID)</label>
                <input
                  type="text"
                  name="business_id"
                  value={ragData.business_id}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg bg-gray-100"
                  placeholder="Contoh: 1234567890"
                  readOnly={wabaId !== 'Belum tersedia'}
                  required
                />
                {wabaId === 'Belum tersedia' && (
                  <p className="text-xs text-gray-500 mt-1">WABA ID belum tersedia. Masukkan secara manual.</p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-600">Phone Number ID</label>
                <input
                  type="text"
                  name="phone_number_id"
                  value={ragData.phone_number_id}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg bg-gray-100"
                  placeholder="Contoh: 9876543210"
                  readOnly={phoneNumberId !== 'Belum tersedia'}
                  required
                />
                {phoneNumberId === 'Belum tersedia' && (
                  <p className="text-xs text-gray-500 mt-1">Phone Number ID belum tersedia. Masukkan secara manual.</p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-600">Nama Bisnis</label>
                <input
                  type="text"
                  name="rag_data.business_name"
                  value={ragData.rag_data.business_name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Contoh: Klinik Sehat"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Tipe Bisnis</label>
                <input
                  type="text"
                  name="rag_data.business_type"
                  value={ragData.rag_data.business_type}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Contoh: faskes"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Deskripsi Bisnis</label>
                <textarea
                  name="rag_data.description"
                  value={ragData.rag_data.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Contoh: Klinik kesehatan terpercaya."
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Jam Operasional (Hari Kerja)</label>
                <input
                  type="text"
                  name="rag_data.operating_hours.weekdays"
                  value={ragData.rag_data.operating_hours.weekdays}
                  onChange={(e) =>
                    setRagData((prev) => ({
                      ...prev,
                      rag_data: {
                        ...prev.rag_data,
                        operating_hours: { ...prev.rag_data.operating_hours, weekdays: e.target.value }
                      }
                    }))
                  }
                  className="w-full p-2 border rounded-lg"
                  placeholder="Contoh: 08:00-17:00 WIB"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Jam Operasional (Akhir Pekan)</label>
                <input
                  type="text"
                  name="rag_data.operating_hours.weekends"
                  value={ragData.rag_data.operating_hours.weekends}
                  onChange={(e) =>
                    setRagData((prev) => ({
                      ...prev,
                      rag_data: {
                        ...prev.rag_data,
                        operating_hours: { ...prev.rag_data.operating_hours, weekends: e.target.value }
                      }
                    }))
                  }
                  className="w-full p-2 border rounded-lg"
                  placeholder="Contoh: 09:00-14:00 WIB"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Disclaimer (untuk faskes)</label>
                <input
                  type="text"
                  name="rag_data.disclaimer"
                  value={ragData.rag_data.disclaimer}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Contoh: Konsultasikan ke dokter, ya!"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Nama Admin (Opsional)</label>
                <input
                  type="text"
                  name="rag_data.admin_name"
                  value={ragData.rag_data.admin_name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Contoh: Azi"
                />
              </div>
            </form>

            <div className="flex space-x-4 mt-6">
              <button
                onClick={handleGetRag}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Ambil Data
              </button>
              <button
                onClick={handleSaveRag}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
              >
                Simpan Data
              </button>
              <button
                onClick={handleDeleteRag}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Hapus Data
              </button>
            </div>

            {status && (
              <p
                className={`text-sm mt-2 ${
                  status.includes('berhasil') ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {status}
              </p>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 640px) {
          .max-w-7xl {
            max-width: 100%;
          }
          .px-4 {
            padding-left: 1rem;
            padding-right: 1rem;
          }
          .py-2 {
            padding-top: 0.5rem;
            padding-bottom: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}