import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';

export default function Users({
  wabaId,
  phoneNumberId,
  accessToken,
  hasCompleteData,
  user,
}) {
  const router = useRouter();
  const [status, setStatus] = useState('');
  const [isProcessingToken, setIsProcessingToken] = useState(false);

  // Fungsi untuk simpan data ke Supabase
  const saveToSupabase = async (newWabaId, newPhoneNumberId, access_token) => {
    if (!user?.id) {
      console.warn('saveToSupabase dipanggil tapi user belum ada');
      setStatus('Gagal menyimpan: User belum terautentikasi.');
      return false;
    }

    try {
      const dataToSave = {
        user_id: user.id,
        waba_id: newWabaId !== 'Belum tersedia' ? newWabaId : null,
        phone_number_id: newPhoneNumberId !== 'Belum tersedia' ? newPhoneNumberId : null,
        access_token: access_token || null,
      };
      console.log('Menyimpan data WABA ke Supabase:', dataToSave);

      const { data, error } = await supabase
        .from('waba_data')
        .upsert(dataToSave, { onConflict: ['user_id'] })
        .select()
        .single();

      if (error) {
        console.error('Error simpan data WABA:', JSON.stringify(error, null, 2));
        if (error.code === '42P10') {
          setStatus(
            'Gagal menyimpan data ke Supabase: Kolom user_id tidak memiliki unique constraint. Hubungi admin untuk perbaiki skema database.'
          );
        } else {
          setStatus(`Gagal menyimpan data ke Supabase: ${error.message} (Kode: ${error.code})`);
        }
        return false;
      }

      console.log('Data WABA berhasil disimpan:', data);
      setStatus('Data berhasil disimpan ke Supabase.');
      return true;
    } catch (error) {
      console.error('Error tak terduga saat simpan data WABA:', error);
      setStatus(`Gagal menyimpan data ke Supabase: ${error.message}`);
      return false;
    }
  };

  // Fungsi untuk tukar kode otorisasi ke access token
  const exchangeToken = async (code) => {
    if (!user?.id) {
      console.error('User ID tidak tersedia');
      setStatus('Gagal menukar token: Pengguna belum login.');
      return null;
    }

    if (!code) {
      console.error('Kode otorisasi tidak tersedia');
      setStatus('Gagal menukar token: Kode otorisasi belum ada.');
      return null;
    }

    setIsProcessingToken(true);
    setStatus('Menukar kode otorisasi ke access token...');

    try {
      const res = await fetch('/api/exchange-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, user_id: user.id }),
      });
      const result = await res.json();
      if (res.ok) {
        const { access_token } = result;
        console.log('Access token berhasil diperoleh:', access_token);
        setStatus('Access token berhasil diperoleh.');
        return access_token;
      } else {
        console.error('Gagal tukar token:', result);
        setStatus(`Gagal menukar token: ${result.details?.message || result.error}`);
        return null;
      }
    } catch (error) {
      console.error('Error jaringan saat tukar token:', error);
      setStatus(`Error jaringan saat menukar token: ${error.message}`);
      return null;
    } finally {
      setIsProcessingToken(false);
    }
  };

  // Inisialisasi Facebook SDK
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
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  }, []);

  // Handle pesan dari Embedded Signup
  useEffect(() => {
    if (!user) {
      console.log('Handle message menunggu user, skip untuk sekarang');
      return;
    }

    const handleMessage = async (event) => {
      if (!event.origin.endsWith('facebook.com')) return;
      console.log('Data pesan dari Facebook:', event.data);
      try {
        if (typeof event.data === 'string' && event.data.startsWith('cb=')) {
          console.log('Menerima kode otorisasi dari OAuth');
          const params = new URLSearchParams(event.data);
          const code = params.get('code');
          if (code) {
            setStatus('Kode otorisasi diterima.');
            const access_token = await exchangeToken(code);
            if (access_token && wabaId !== 'Belum tersedia' && phoneNumberId !== 'Belum tersedia') {
              await saveToSupabase(wabaId, phoneNumberId, access_token);
            }
          } else {
            throw new Error('Kode otorisasi tidak ditemukan');
          }
        } else {
          const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
          if (data.type === 'WA_EMBEDDED_SIGNUP') {
            console.log('Event Embedded Signup:', data);
            if (
              data.event === 'FINISH' ||
              data.event === 'FINISH_ONLY_WABA' ||
              data.event === 'FINISH_WHATSAPP_BUSINESS_APP_ONBOARDING'
            ) {
              const newWabaId = data.data.waba_id || 'Belum tersedia';
              const newPhoneNumberId = data.data.phone_number_id || 'Belum tersedia';
              setStatus(`Embedded Signup selesai: WABA ID: ${newWabaId}, Phone Number ID: ${newPhoneNumberId}`);
              await saveToSupabase(newWabaId, newPhoneNumberId, accessToken);
            } else if (data.event === 'CANCEL') {
              setStatus(`Embedded Signup dibatalkan di langkah: ${data.data.current_step || 'Tidak diketahui'}`);
            } else if (data.data?.error_message) {
              setStatus(`Error: ${data.data.error_message} (ID: ${data.data.error_id})`);
            }
          }
        }
      } catch (error) {
        console.error('Error parsing pesan:', error.message, 'Data:', event.data);
        setStatus(`Gagal memproses respons: ${error.message}`);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [user, wabaId, phoneNumberId, accessToken]);

  // Fungsi untuk mulai Embedded Signup
  const launchWhatsAppSignup = () => {
    if (hasCompleteData) return;
    setStatus('Memulai proses Embedded Signup...');
    const redirectUri = 'https://wa.aibiz.id/users';
    FB.login((response) => {
      if (response.authResponse) {
        console.log('FB login response:', response.authResponse);
        setStatus('Login Facebook berhasil, menunggu Embedded Signup selesai...');
      } else {
        console.error('FB login gagal:', response);
        setStatus('Login Facebook dibatalkan atau gagal.');
      }
    }, {
      config_id: process.env.NEXT_PUBLIC_WHATSAPP_CONFIG_ID,
      response_type: 'code',
      override_default_response_type: true,
      redirect_uri: redirectUri,
      scope: 'whatsapp_business_management,whatsapp_business_messaging,business_management',
      extras: {
        featureType: 'whatsapp_embedded_signup',
        sessionInfoVersion: '3',
      },
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#ECE5DD]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="h-8 w-8 border-4 border-t-[#25D366] border-gray-200 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 w-full">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            WhatsApp Embedded Signup
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            Login dengan Facebook untuk mengambil atau memperbarui data WhatsApp Business Account (WABA) Anda.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <div className="mb-6">
            <button
              onClick={launchWhatsAppSignup}
              disabled={hasCompleteData}
              className={`w-full sm:w-auto px-6 py-2 text-white rounded-lg font-bold text-base transition duration-300 ease-in-out ${
                hasCompleteData
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#1877f2] hover:bg-[#1666d2]'
              }`}
              style={{ fontFamily: 'Helvetica, Arial, sans-serif', height: '40px' }}
            >
              Login with Facebook
            </button>
            {status && (
              <p
                className={`text-sm mt-2 ${
                  status.includes('berhasil') || status.includes('selesai') || status.includes('ditemukan')
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {status}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Data Autentikasi
            </h2>
            <div>
              <label className="block text-sm text-gray-600">WABA ID</label>
              <p className="text-sm font-mono bg-gray-100 p-2 rounded">
                {wabaId}
              </p>
            </div>
            <div>
              <label className="block text-sm text-gray-600">Phone Number ID</label>
              <p className="text-sm font-mono bg-gray-100 p-2 rounded">
                {phoneNumberId}
              </p>
            </div>
            <div>
              <label className="block text-sm text-gray-600">Access Token</label>
              <p className="text-sm font-mono bg-gray-100 p-2 rounded break-all">
                {isProcessingToken ? 'Sedang memproses...' : accessToken}
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 640px) {
          .max-w-3xl {
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