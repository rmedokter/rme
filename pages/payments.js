import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/router';

export default function Payments() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserAndSubscription = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
          return;
        }
        setUser(user);

        const { data, error } = await supabase
          .from('subscriptions')
          .select('status, subscription_end, payment_id, amount')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        if (error && error.code !== 'PGRST116') throw error;
        setSubscription(data);
      } catch (err) {
        setError('Gagal memuat langganan: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndSubscription();
  }, [router]);

  const handlePayment = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/midtrans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, amount: 100000 }),
      });
      const { token } = await response.json();
      if (!response.ok) throw new Error('Gagal memulai pembayaran');

      window.snap.pay(token, {
        onSuccess: async (result) => {
          const { error } = await supabase.from('subscriptions').insert({
            user_id: user.id,
            status: 'active',
            subscription_end: Math.floor(Date.now() / 1000) + 30 * 24 * 3600, // 30 hari
            payment_id: result.transaction_id,
            amount: 100000,
          });
          if (!error) {
            setSubscription({ ...result, status: 'active', amount: 100000 });
          }
        },
        onPending: () => setError('Pembayaran tertunda, silakan cek status'),
        onError: () => setError('Pembayaran gagal, coba lagi'),
      });
    } catch (err) {
      setError('Gagal memproses pembayaran: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
          Kelola Langganan
        </h1>
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          {loading ? (
            <p className="text-gray-600 text-center">Memuat langganan...</p>
          ) : error ? (
            <p className="text-red-600 text-center">{error}</p>
          ) : subscription ? (
            <div className="space-y-4">
              <p>
                Status:{' '}
                <span
                  className={subscription.status === 'active' ? 'text-green-600' : 'text-red-600'}
                >
                  {subscription.status}
                </span>
              </p>
              <p>
                Berakhir:{' '}
                {subscription.subscription_end
                  ? new Date(subscription.subscription_end * 1000).toLocaleString('id-ID')
                  : 'N/A'}
              </p>
              <p>Jumlah: Rp {subscription.amount || 'N/A'}</p>
              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full sm:w-auto px-4 py-2 bg-teal-600 text-white rounded-lg shadow-md hover:bg-teal-700 transition duration-300 ease-in-out"
              >
                {loading ? 'Memproses...' : 'Perpanjang Langganan'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600">Belum ada langganan aktif.</p>
              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full sm:w-auto px-4 py-2 bg-teal-600 text-white rounded-lg shadow-md hover:bg-teal-700 transition duration-300 ease-in-out"
              >
                {loading ? 'Memproses...' : 'Mulai Langganan'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}