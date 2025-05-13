import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { IoLogOutOutline } from 'react-icons/io5';
import { supabase } from '../lib/supabase';

export default function Settings() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [hasBusinessManager, setHasBusinessManager] = useState(null);
  const [businessData, setBusinessData] = useState({
    name: '',
    email: '',
    website: '',
    address: {
      streetAddress1: '',
      streetAddress2: '',
      city: '',
      state: '',
      zipPostal: '',
      country: '',
    },
    phone: {
      code: '',
      number: '',
    },
    timezone: '',
  });
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [status, setStatus] = useState('');
  const [phoneVerificationStatus, setPhoneVerificationStatus] = useState('');
  const [authCode, setAuthCode] = useState(''); // State untuk kode otorisasi
  const [wabaId, setWabaId] = useState(''); // State untuk WABA ID
  const [phoneNumberId, setPhoneNumberId] = useState(''); // State untuk Phone Number ID

  // Memeriksa status login pengguna
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        if (user) {
          setUser(user);
        } else {
          setStatus('Sesi tidak ditemukan. Silakan login kembali.');
          router.push('/login');
        }
      } catch (error) {
        console.error('Error fetching user:', error.message);
        setStatus('Gagal memuat data pengguna: ' + error.message);
        router.push('/login');
      }
    };

    fetchUser();
  }, [router]);

  // Inisialisasi Facebook JavaScript SDK
  useEffect(() => {
    window.fbAsyncInit = function () {
      FB.init({
        appId: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID,
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v22.0',
      });
    };

    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  }, []);

  // Message event listener
  useEffect(() => {
    if (!user) return;

    const handleMessage = (event) => {
      if (!event.origin.endsWith('facebook.com')) return;
      console.log('Raw message event data:', event.data);
      try {
        if (typeof event.data === 'string' && event.data.startsWith('cb=')) {
          console.log('Detected OAuth callback response');
          const params = new URLSearchParams(event.data);
          const code = params.get('code');
          if (code) {
            setStatus('Kode otorisasi diterima.');
            setAuthCode(code);
          } else {
            throw new Error('No authorization code found in callback data');
          }
        } else {
          const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
          if (data.type === 'WA_EMBEDDED_SIGNUP') {
            console.log('Parsed Embedded Signup event:', data);
            if (data.event === 'FINISH' || data.event === 'FINISH_ONLY_WABA' || data.event === 'FINISH_WHATSAPP_BUSINESS_APP_ONBOARDING') {
              setStatus(`Embedded Signup selesai: WABA ID: ${data.data.waba_id || 'N/A'}, Phone Number ID: ${data.data.phone_number_id || 'N/A'}`);
              setWabaId(data.data.waba_id || 'N/A');
              setPhoneNumberId(data.data.phone_number_id || 'N/A');
            } else if (data.event === 'CANCEL') {
              setStatus(`Embedded Signup dibatalkan pada langkah: ${data.data.current_step || 'Tidak diketahui'}`);
            } else if (data.data?.error_message) {
              setStatus(`Error: ${data.data.error_message} (Error ID: ${data.data.error_id}, Session ID: ${data.data.session_id})`);
            }
          }
        }
      } catch (error) {
        console.error('Message event parse error:', error.message, 'Raw data:', event.data);
        setStatus(`Gagal memproses respons: ${error.message}`);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [user]);

  // Logout
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      setStatus('Gagal logout: ' + error.message);
    }
  };

  // Menangani perubahan data form portofolio bisnis
  const handleBusinessDataChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('address.')) {
      const addressField = name.split('.')[1];
      setBusinessData((prev) => ({
        ...prev,
        address: { ...prev.address, [addressField]: value },
      }));
    } else if (name.includes('phone.')) {
      const phoneField = name.split('.')[1];
      setBusinessData((prev) => ({
        ...prev,
        phone: { ...prev.phone, [phoneField]: value },
      }));
    } else {
      setBusinessData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Menukar kode otorisasi menjadi access token (dipanggil manual)
  const exchangeToken = async () => {
    if (!user?.id) {
      console.error('No user ID available for token exchange');
      setStatus('Gagal menukar token: Pengguna tidak terautentikasi.');
      return;
    }

    if (!authCode) {
      console.error('No authorization code available');
      setStatus('Gagal menukar token: Kode otorisasi tidak tersedia.');
      return;
    }

    setStatus('Menukar token...');
    try {
      const res = await fetch('/api/exchange-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: authCode, user_id: user.id }),
      });
      const result = await res.json();
      if (res.ok) {
        const { access_token, waba_id, phone_number_id } = result;
        setWabaId(waba_id || 'N/A');
        setPhoneNumberId(phone_number_id || 'N/A');
        setStatus('Access token berhasil diperoleh.');
      } else {
        console.error('Token exchange failed:', result);
        setStatus(`Gagal menukar token: ${result.details?.message || result.error}`);
      }
    } catch (error) {
      console.error('Network error during token exchange:', error);
      setStatus(`Error jaringan saat menukar token: ${error.message}`);
    }
  };

  // Callback untuk FB.login
  const fbLoginCallback = (response) => {
    if (response.authResponse) {
      const code = response.authResponse.code;
      console.log('FB login response:', code);
      setAuthCode(code);
      setStatus('Kode otorisasi diterima.');
    } else {
      console.error('FB login failed:', response);
      setStatus('Login Facebook dibatalkan atau gagal.');
    }
  };

  // Memulai Embedded Signup
const launchWhatsAppSignup = () => {
  setStatus('Memulai proses Embedded Signup...');
  const redirectUri = 'https://wa.aibiz.id/settings';
  console.log('Using redirect_uri for FB.login:', redirectUri);
  console.log('FB.login parameters:', {
    config_id: process.env.NEXT_PUBLIC_WHATSAPP_CONFIG_ID,
    redirect_uri: redirectUri,
    scope: 'whatsapp_business_management,whatsapp_business_messaging,business_management',
    response_type: 'code',
    override_default_response_type: true,
  });
  FB.login(fbLoginCallback, {
    config_id: process.env.NEXT_PUBLIC_WHATSAPP_CONFIG_ID,
    response_type: 'code',
    override_default_response_type: true,
    redirect_uri: redirectUri,
    scope: 'whatsapp_business_management,whatsapp_business_messaging,business_management',
    extras: {
      setup: hasBusinessManager
        ? { business: { id: '' } }
        : {
            business: {
              name: businessData.name,
              email: businessData.email,
              website: businessData.website,
              address: {
                streetAddress1: businessData.address.streetAddress1,
                streetAddress2: businessData.address.streetAddress2,
                city: businessData.address.city,
                state: businessData.address.state,
                zipPostal: businessData.address.zipPostal,
                country: businessData.address.country,
              },
              phone: {
                code: parseInt(businessData.phone.code) || 1,
                number: businessData.phone.number,
              },
              timezone: businessData.timezone,
            },
          },
      featureType: 'whatsapp_embedded_signup',
      sessionInfoVersion: '3',
    },
  });
};

  // Menangani pengiriman nomor telepon untuk verifikasi
  const handlePhoneVerification = async (e) => {
    e.preventDefault();
    setPhoneVerificationStatus('Mengirim nomor untuk verifikasi...');

    if (!user?.id) {
      setPhoneVerificationStatus('Gagal memverifikasi: Pengguna tidak terautentikasi.');
      return;
    }

    try {
      const response = await fetch('/api/verify-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_number: phoneNumber,
          user_id: user.id,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setPhoneVerificationStatus('Kode verifikasi telah dikirim ke nomor Anda.');
      } else {
        setPhoneVerificationStatus(`Gagal mengirim nomor: ${result.error}`);
      }
    } catch (error) {
      setPhoneVerificationStatus(`Error jaringan: ${error.message}`);
    }
  };

  // Menangani pengiriman kode verifikasi
  const handleCodeVerification = async (e) => {
    e.preventDefault();
    setPhoneVerificationStatus('Memverifikasi kode...');

    if (!user?.id) {
      setPhoneVerificationStatus('Gagal memverifikasi: Pengguna tidak terautentikasi.');
      return;
    }

    try {
      const response = await fetch('/api/verify-phone-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_number: phoneNumber,
          code: verificationCode,
          user_id: user.id,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        const { phone_number_id } = result;
        const { error } = await supabase
          .from('verified_phones')
          .insert([
            {
              user_id: user.id,
              phone_number_id,
              phone_number,
              created_at: new Date().toISOString(),
            },
          ]);
        if (error) {
          console.error('Supabase insert error:', error);
          setPhoneVerificationStatus(`Gagal menyimpan nomor: ${error.message}`);
        } else {
          setPhoneVerificationStatus('Nomor berhasil diverifikasi dan tersimpan!');
          setPhoneNumber('');
          setVerificationCode('');
        }
      } else {
        setPhoneVerificationStatus(`Gagal memverifikasi kode: ${result.error}`);
      }
    } catch (error) {
      setPhoneVerificationStatus(`Error jaringan: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 w-full">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Pengaturan WhatsApp Business
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
              Konfigurasi WhatsApp Business
            </h2>
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">
                Apakah Anda sudah memiliki akun Meta Business Manager?
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setHasBusinessManager(true)}
                  className={`px-4 py-2 rounded-lg ${
                    hasBusinessManager === true
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  Ya
                </button>
                <button
                  onClick={() => setHasBusinessManager(false)}
                  className={`px-4 py-2 rounded-lg ${
                    hasBusinessManager === false
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  Tidak
                </button>
              </div>
            </div>

            {hasBusinessManager === false && (
              <div className="mb-6">
                <h3 className="text-md font-semibold text-gray-800 mb-2">
                  Data Portofolio Bisnis
                </h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600">Nama Bisnis</label>
                    <input
                      type="text"
                      name="name"
                      value={businessData.name}
                      onChange={handleBusinessDataChange}
                      className="w-full p-2 border rounded-lg"
                      placeholder="Contoh: Wind & Wool"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Email Bisnis</label>
                    <input
                      type="email"
                      name="email"
                      value={businessData.email}
                      onChange={handleBusinessDataChange}
                      className="w-full p-2 border rounded-lg"
                      placeholder="Contoh: support@windandwool.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Website Bisnis</label>
                    <input
                      type="url"
                      name="website"
                      value={businessData.website}
                      onChange={handleBusinessDataChange}
                      className="w-full p-2 border rounded-lg"
                      placeholder="Contoh: https://windandwool.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Alamat Jalan 1</label>
                    <input
                      type="text"
                      name="address.streetAddress1"
                      value={businessData.address.streetAddress1}
                      onChange={handleBusinessDataChange}
                      className="w-full p-2 border rounded-lg"
                      placeholder="Contoh: 1 Hacker Way"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Alamat Jalan 2</label>
                    <input
                      type="text"
                      name="address.streetAddress2"
                      value={businessData.address.streetAddress2}
                      onChange={handleBusinessDataChange}
                      className="w-full p-2 border rounded-lg"
                      placeholder="Contoh: Suite 1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Kota</label>
                    <input
                      type="text"
                      name="address.city"
                      value={businessData.address.city}
                      onChange={handleBusinessDataChange}
                      className="w-full p-2 border rounded-lg"
                      placeholder="Contoh: Menlo Park"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Negara Bagian</label>
                    <input
                      type="text"
                      name="address.state"
                      value={businessData.address.state}
                      onChange={handleBusinessDataChange}
                      className="w-full p-2 border rounded-lg"
                      placeholder="Contoh: California"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Kode Pos</label>
                    <input
                      type="text"
                      name="address.zipPostal"
                      value={businessData.address.zipPostal}
                      onChange={handleBusinessDataChange}
                      className="w-full p-2 border rounded-lg"
                      placeholder="Contoh: 94025"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Negara</label>
                    <input
                      type="text"
                      name="address.country"
                      value={businessData.address.country}
                      onChange={handleBusinessDataChange}
                      className="w-full p-2 border rounded-lg"
                      placeholder="Contoh: US"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Kode Negara Telepon</label>
                    <input
                      type="number"
                      name="phone.code"
                      value={businessData.phone.code}
                      onChange={handleBusinessDataChange}
                      className="w-full p-2 border rounded-lg"
                      placeholder="Contoh: 1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Nomor Telepon</label>
                    <input
                      type="text"
                      name="phone.number"
                      value={businessData.phone.number}
                      onChange={handleBusinessDataChange}
                      className="w-full p-2 border rounded-lg"
                      placeholder="Contoh: 6505559999"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Zona Waktu</label>
                    <input
                      type="text"
                      name="timezone"
                      value={businessData.timezone}
                      onChange={handleBusinessDataChange}
                      className="w-full p-2 border rounded-lg"
                      placeholder="Contoh: UTC-07:00"
                    />
                  </div>
                </form>
              </div>
            )}

            {hasBusinessManager !== null && (
              <div className="mb-6">
                <button
                  onClick={launchWhatsAppSignup}
                  className="w-full sm:w-auto px-6 py-2 bg-[#1877f2] text-white rounded-lg font-bold text-base hover:bg-[#1666d2] transition duration-300 ease-in-out"
                  style={{ fontFamily: 'Helvetica, Arial, sans-serif', height: '40px' }}
                >
                  Login with Facebook
                </button>
                {status && (
                  <p
                    className={`text-sm mt-2 ${
                      status.includes('berhasil') || status.includes('selesai') ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {status}
                  </p>
                )}
                {(authCode || wabaId || phoneNumberId) && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">Informasi Autentikasi:</p>
                    {authCode && (
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-mono bg-gray-100 p-2 rounded mt-1 flex-1">
                          Kode Otorisasi: {authCode}
                        </p>
                        <button
                          onClick={exchangeToken}
                          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition duration-300 ease-in-out mt-1"
                        >
                          Tukar Token
                        </button>
                      </div>
                    )}
                    {wabaId && (
                      <p className="text-sm font-mono bg-gray-100 p-2 rounded mt-1">
                        WABA ID: {wabaId}
                      </p>
                    )}
                    {phoneNumberId && (
                      <p className="text-sm font-mono bg-gray-100 p-2 rounded mt-1">
                        Phone Number ID: {phoneNumberId}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="border-t border-gray-200 pt-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Verifikasi Nomor Telepon Baru
              </h2>
              <form onSubmit={handlePhoneVerification} className="space-y-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-600">Nomor Telepon</label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Contoh: +12025550123"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Masukkan nomor dengan kode negara (contoh: +12025550123).
                  </p>
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 py-2 bg-teal-600 text-white rounded-lg shadow-md hover:bg-teal-700 transition duration-300 ease-in-out"
                >
                  Kirim Kode Verifikasi
                </button>
              </form>

              {phoneVerificationStatus.includes('Kode verifikasi telah dikirim') && (
                <form onSubmit={handleCodeVerification} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600">Kode Verifikasi</label>
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      className="w-full p-2 border rounded-lg"
                      placeholder="Masukkan kode dari SMS"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-4 py-2 bg-teal-600 text-white rounded-lg shadow-md hover:bg-teal-700 transition duration-300 ease-in-out"
                  >
                    Verifikasi Kode
                  </button>
                </form>
              )}

              {phoneVerificationStatus && (
                <p
                  className={`text-sm mt-2 ${
                    phoneVerificationStatus.includes('berhasil')
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {phoneVerificationStatus}
                </p>
              )}
            </div>
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