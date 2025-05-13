import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { IoMoon, IoSunny } from 'react-icons/io5';
import { supabase } from '../lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const router = useRouter();

  // Periksa sesi saat komponen dimuat
  useEffect(() => {
    const checkSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.push('/chat');
      }
    };
    checkSession();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!email || !password) {
      setError('Email dan kata sandi wajib diisi');
      setLoading(false);
      return;
    }
    if (isRegistering && (!firstName || !lastName)) {
      setError('Nama depan dan nama belakang wajib diisi');
      setLoading(false);
      return;
    }

    try {
      if (isRegistering) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName.trim(),
              last_name: lastName.trim(),
            },
          },
        });
        if (error) {
          setError(error.message || 'Gagal mendaftar');
          console.error('Registration error:', error);
        } else if (data.user) {
          console.log('Registration successful:', data.user);
          alert('Registrasi berhasil! Silakan cek email Anda untuk verifikasi.');
          setIsRegistering(false);
          setFirstName('');
          setLastName('');
          setEmail('');
          setPassword('');
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          setError(error.message || 'Kredensial tidak valid');
          console.error('Login error:', error);
        } else if (data.user) {
          console.log('Login successful:', data.user);
          router.push('/chat');
        }
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode
          ? 'bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-900'
          : 'bg-gradient-to-br from-gray-200 via-blue-100 to-teal-100'
      } transition-colors duration-500 flex items-center justify-center p-4 overflow-hidden`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className={`w-full max-w-md ${
          darkMode ? 'bg-gray-800 bg-opacity-80' : 'bg-white bg-opacity-90'
        } rounded-xl shadow-xl p-8 z-10`}
      >
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100, delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-3xl font-bold text-white animate-pulse">W</span>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isRegistering && (
            <>
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 100, delay: 0.4 }}
              >
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Nama Depan"
                  disabled={loading}
                  className={`w-full p-4 ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-500'
                  } border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300`}
                />
              </motion.div>
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 100, delay: 0.5 }}
              >
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Nama Belakang"
                  disabled={loading}
                  className={`w-full p-4 ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-500'
                  } border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300`}
                />
              </motion.div>
            </>
          )}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 100, delay: 0.6 }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              disabled={loading}
              className={`w-full p-4 ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-500'
              } border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300`}
            />
          </motion.div>
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 100, delay: 0.7 }}
          >
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Kata Sandi"
              disabled={loading}
              className={`w-full p-4 ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-500'
              } border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300`}
            />
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(34, 197, 94, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 100, delay: 0.8 }}
            type="submit"
            disabled={loading}
            className={`w-full p-4 bg-green-500 text-white rounded-lg font-semibold shadow-lg hover:bg-green-600 transition-all duration-300 flex items-center justify-center ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <motion.svg
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="h-5 w-5 mr-2 text-white"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z"
                />
              </motion.svg>
            ) : null}
            {loading ? 'Sedang memproses...' : isRegistering ? 'Daftar' : 'Masuk ke Dashboard'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 100, delay: 0.9 }}
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
            className="w-full p-4 text-green-500 font-semibold hover:text-green-600 transition-all duration-300 text-center"
          >
            {isRegistering ? 'Sudah punya akun? Masuk' : 'Belum punya akun? Daftar'}
          </motion.button>
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="text-red-400 text-sm text-center mt-4"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </form>
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        className={`fixed bottom-6 right-6 p-3 rounded-full shadow-lg ${
          darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-white text-gray-900'
        } transition-all duration-300`}
        onClick={toggleDarkMode}
      >
        <AnimatePresence mode="wait">
          {darkMode ? (
            <motion.div
              key="sun"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.3 }}
            >
              <IoSunny size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.3 }}
            >
              <IoMoon size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        @media (max-width: 640px) {
          .max-w-md {
            max-width: 100%;
            margin: 0 1rem;
          }
          .p-8 {
            padding: 1.5rem;
          }
          .w-16 {
            width: 3rem;
            height: 3rem;
          }
          .text-3xl {
            font-size: 1.5rem;
          }
          .p-4 {
            padding: 0.875rem;
          }
        }
      `}</style>
    </div>
  );
}