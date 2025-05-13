import * as React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { IoChatbubblesOutline, IoPeopleOutline, IoCashOutline, IoSettingsOutline } from 'react-icons/io5';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';

export default function Layout({ children }) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [wabaId, setWabaId] = useState('Belum tersedia');
  const [phoneNumberId, setPhoneNumberId] = useState('Belum tersedia');
  const [accessToken, setAccessToken] = useState('Belum tersedia');
  const [hasCompleteData, setHasCompleteData] = useState(false);
  const [loading, setLoading] = useState(true);

  const clearLocalStorage = (wabaId) => {
    try {
      const keys = Object.keys(localStorage).filter((key) => key.startsWith(`waba_${wabaId}_`));
      keys.forEach((key) => localStorage.removeItem(key));
      console.log('LocalStorage cleared for wabaId:', wabaId);
    } catch (err) {
      console.error('Error clearing localStorage:', err);
    }
  };

  const refreshWabaData = async (userId) => {
    try {
      console.log('Mengambil data WABA dari Supabase untuk user:', userId);
      const { data: wabaData, error: wabaError } = await supabase
        .from('waba_data')
        .select('waba_id, phone_number_id, access_token')
        .eq('user_id', userId)
        .single();

      if (wabaError && wabaError.code !== 'PGRST116') {
        console.error('Error ambil data WABA:', wabaError);
        return;
      }

      if (wabaData) {
        console.log('Data WABA ditemukan:', wabaData);
        setWabaId(wabaData.waba_id || 'Belum tersedia');
        setPhoneNumberId(wabaData.phone_number_id || 'Belum tersedia');
        setAccessToken(wabaData.access_token || 'Belum tersedia');
        setHasCompleteData(
          !!wabaData.waba_id && !!wabaData.phone_number_id && !!wabaData.access_token
        );
      } else {
        console.log('Data WABA belum ada di database.');
        setWabaId('Belum tersedia');
        setPhoneNumberId('Belum tersedia');
        setAccessToken('Belum tersedia');
        setHasCompleteData(false);
      }
    } catch (error) {
      console.error('Error tak terduga saat muat data WABA:', error);
    }
  };

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError) {
          console.error('Error ambil user:', userError);
          throw userError;
        }

        if (session?.user && user) {
          setUser(user);
          setIsAuthenticated(true);
          await refreshWabaData(user.id);
        } else {
          setIsAuthenticated(false);
          router.push('/login');
        }
      } catch (error) {
        console.error('Error checking auth or fetching data:', error);
        setIsAuthenticated(false);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchData();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session?.user) {
        setIsAuthenticated(false);
        clearLocalStorage(wabaId);
        router.push('/login');
      } else if (event === 'SIGNED_IN') {
        setIsAuthenticated(true);
        supabase.auth.getUser().then(({ data: { user } }) => {
          setUser(user);
          refreshWabaData(user.id);
        });
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  if (loading) {
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

  if (!isAuthenticated) {
    return null;
  }

  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        wabaId,
        phoneNumberId,
        accessToken,
        hasCompleteData,
        user,
      });
    }
    return child;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#ECE5DD] text-gray-800">
      <aside className="hidden md:block fixed top-0 left-0 h-screen z-20">
        <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-16'}`}>
          <div className="bg-[#075E54] p-4 flex items-center justify-between">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-white">
              <IoChatbubblesOutline size={24} />
            </button>
          </div>
          <nav className="p-2">
            {[
              { path: '/chat', icon: <IoChatbubblesOutline size={24} />, label: 'Chats' },
              { path: '/users', icon: <IoPeopleOutline size={24} />, label: 'Users' },
              { path: '/payments', icon: <IoCashOutline size={24} />, label: 'Payments' },
              { path: '/settings', icon: <IoSettingsOutline size={24} />, label: 'Settings' },
            ].map(({ path, icon, label }) => (
              <Link key={path} href={path}>
                <span
                  className={`flex items-center p-3 rounded-lg text-lg cursor-pointer ${
                    router.pathname === path ? 'bg-[#25D366] text-white' : 'text-gray-800'
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  {icon}
                  {isSidebarOpen && <span className="ml-3">{label}</span>}
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      <main className="flex-1 md:ml-16 min-h-screen">
        {childrenWithProps}
      </main>

      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around py-2 h-16 pb-4 z-30">
        {[
          { path: '/chat', icon: <IoChatbubblesOutline size={24} />, label: 'Chats' },
          { path: '/users', icon: <IoPeopleOutline size={24} />, label: 'Users' },
          { path: '/payments', icon: <IoCashOutline size={24} />, label: 'Payments' },
          { path: '/settings', icon: <IoSettingsOutline size={24} />, label: 'Settings' },
        ].map(({ path, icon, label }) => (
          <Link key={path} href={path}>
            <span
              className={`flex flex-col items-center py-2 px-4 ${
                router.pathname === path ? 'text-[#25D366]' : 'text-gray-500'
              }`}
            >
              {icon}
              <span className="text-xs">{label}</span>
            </span>
          </Link>
        ))}
      </div>

      <style jsx global>{`
        body { font-family: 'Roboto', sans-serif; }
      `}</style>
    </div>
  );
}