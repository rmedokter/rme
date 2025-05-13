/**
 * components/ChatPanel.js
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import { IoSend, IoSearchOutline, IoArrowBack, IoRefresh, IoAdd } from 'react-icons/io5';
import { formatMessageTime } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatPanel({
  messages,
  onSend,
  onLoadMore,
  loading,
  hasMore,
  contactName,
  onBack,
  search,
  onRefresh,
  contacts,
  setSelectedContact,
  showNewChatInput,
  setShowNewChatInput,
  newContactNumber,
  setNewContactNumber,
  handleNewChat,
  isSearchExpanded,
  setIsSearchExpanded,
  setSearch,
  getLastMessagePreview,
  lastMessages,
}) {
  const [text, setText] = useState('');
  const [localSearch, setLocalSearch] = useState('');
  const [localError, setLocalError] = useState(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [mobileTextareaHeight, setMobileTextareaHeight] = useState(48); // Default min height in px
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const textareaRef = useRef(null);
  const mobileTextareaRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setLocalError('Pesan tidak boleh kosong');
      return;
    }
    setLocalError(null);
    try {
      await onSend(text);
      setText('');
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      textareaRef.current?.focus();
      mobileTextareaRef.current?.focus();
    } catch (err) {
      setLocalError(`Gagal mengirim pesan: ${err.message}`);
    }
  };

  const handleRefresh = () => {
    if (onRefresh && !loading) onRefresh();
  };

  const adjustTextareaHeight = useCallback((textarea, setHeight) => {
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 120); // Max height: 120px (~5 lines)
      textarea.style.height = `${newHeight}px`;
      if (setHeight) setHeight(newHeight); // Update state for mobile textarea height
    }
  }, []);

  useEffect(() => {
    adjustTextareaHeight(textareaRef.current);
    adjustTextareaHeight(mobileTextareaRef.current, setMobileTextareaHeight);
  }, [text, adjustTextareaHeight]);

  useEffect(() => {
    if (!loading && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  useEffect(() => {
    const handleKeyboard = () => {
      const viewport = window.visualViewport;
      if (!viewport) return;
      const newKeyboardHeight = Math.max(0, window.innerHeight - viewport.height);
      setKeyboardHeight(newKeyboardHeight);
    };

    window.visualViewport?.addEventListener('resize', handleKeyboard);
    window.addEventListener('resize', handleKeyboard);

    return () => {
      window.visualViewport?.removeEventListener('resize', handleKeyboard);
      window.removeEventListener('resize', handleKeyboard);
    };
  }, []);

  const filteredMessages = messages.filter((msg) =>
    msg.message.toLowerCase().includes((localSearch || search).toLowerCase())
  );

  const highlightText = (text, keyword) => {
    if (!keyword) return text;
    const parts = text.split(new RegExp(`(${keyword})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === keyword.toLowerCase() ? (
        <span key={i} className="bg-yellow-200 text-black">{part}</span>
      ) : part
    );
  };

  const filteredContacts = contacts.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex w-full h-[calc(100vh-4rem)] font-roboto">
      {/* Contact List Sidebar */}
      <div
        className={`md:w-80 w-full bg-white border-r border-gray-200 flex flex-col md:fixed md:top-0 md:left-16 md:h-screen z-30 ${
          contactName !== 'Pilih Kontak' ? 'hidden md:flex' : 'flex'
        }`}
      >
        <div className="fixed top-0 w-full md:w-80 bg-[#075E54] p-4 z-40 flex items-center justify-between shadow-md">
          <h2 className="text-xl font-semibold text-white truncate">WA AIBIZ ID</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowNewChatInput(true)}
              className="text-white p-2 rounded-full hover:bg-[#128C7E]"
              aria-label="Mulai chat baru"
            >
              <IoAdd size={20} />
            </button>
            <button
              onClick={handleRefresh}
              className="text-white p-2 rounded-full hover:bg-[#128C7E]"
              aria-label="Refresh kontak"
            >
              <IoRefresh size={20} />
            </button>
            <button
              onClick={() => setIsSearchExpanded(!isSearchExpanded)}
              className="text-white p-2 rounded-full hover:bg-[#128C7E]"
              aria-label="Cari kontak"
            >
              <IoSearchOutline size={20} />
            </button>
          </div>
        </div>
        <AnimatePresence>
          {isSearchExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="p-4 bg-gray-100 mt-16"
            >
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari kontak atau nomor"
                className="w-full p-3 rounded-full bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#25D366] shadow-sm"
                autoFocus
                aria-label="Cari kontak"
              />
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showNewChatInput && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="p-4 bg-gray-100 mt-16"
            >
              <input
                type="tel"
                value={newContactNumber}
                onChange={(e) => setNewContactNumber(e.target.value)}
                placeholder="Masukkan nomor telepon (contoh: +628123456789)"
                className="w-full p-3 rounded-lg bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#25D366] shadow-sm mb-2"
                aria-label="Nomor telepon baru"
              />
              <button
                onClick={handleNewChat}
                className="w-full p-3 bg-[#25D366] text-white rounded-lg hover:bg-[#128C7E] disabled:opacity-50 shadow-sm"
                disabled={!newContactNumber.trim()}
              >
                Mulai Chat
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 mt-16">
          <ul>
            {filteredContacts.map((c) => {
              const { text, time } = getLastMessagePreview(c, lastMessages);
              return (
                <li
                  key={c}
                  onClick={() => setSelectedContact(c)}
                  className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors ${
                    contactName === c ? 'bg-gray-100' : ''
                  }`}
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-3 shadow-sm">
                      <span className="text-lg font-medium text-gray-600">{c[0].toUpperCase()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className="text-base font-medium text-gray-800 truncate">{c}</p>
                        <p className="text-xs text-gray-500 ml-2 whitespace-nowrap">{time}</p>
                      </div>
                      <p className="text-sm text-gray-500 truncate">{text}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Chat Area */}
      {contactName !== 'Pilih Kontak' ? (
        <div className="flex-1 flex flex-col bg-[#ECE5DD] w-full h-[calc(100vh-4rem)] md:ml-80">
          <div className="fixed top-0 w-full md:w-[calc(100%-20rem)] bg-[#075E54] p-4 flex items-center justify-between z-50 shadow-md">
            <div className="flex items-center">
              <button
                onClick={onBack}
                className="text-white p-2 rounded-full hover:bg-[#128C7E] md:hidden"
                aria-label="Kembali ke daftar kontak"
              >
                <IoArrowBack size={24} />
              </button>
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3 shadow-md">
                <span className="text-lg font-medium text-gray-600">{contactName[0].toUpperCase()}</span>
              </div>
              <h2 className="text-lg font-semibold text-white truncate max-w-[50%]">{contactName}</h2>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleRefresh}
                className="text-white p-2 rounded-full hover:bg-[#128C7E]"
                disabled={loading}
                aria-label="Refresh pesan"
              >
                <IoRefresh size={20} />
              </button>
              <button
                onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                className="text-white p-2 rounded-full hover:bg-[#128C7E]"
                aria-label="Cari pesan"
              >
                <IoSearchOutline size={20} />
              </button>
            </div>
          </div>
          <AnimatePresence>
            {isSearchExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="p-4 bg-gray-100 mt-16 z-40"
              >
                <input
                  type="text"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder="Cari pesan dalam chat"
                  className="w-full p-3 rounded-full bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#25D366] shadow-sm"
                  autoFocus
                  aria-label="Cari pesan"
                />
              </motion.div>
            )}
          </AnimatePresence>
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 mt-16"
            style={{
              paddingBottom: `calc(${mobileTextareaHeight}px + 2rem + ${keyboardHeight}px + env(safe-area-inset-bottom))`,
              marginBottom: `calc(${mobileTextareaHeight}px + 1rem + env(safe-area-inset-bottom))`,
              overscrollBehaviorY: 'contain',
            }}
          >
            {hasMore && (
              <button
                onClick={onLoadMore}
                disabled={loading || !hasMore}
                className="w-full max-w-xs mx-auto p-2 bg-[#25D366] text-white rounded-lg mb-4 hover:bg-[#128C7E] disabled:opacity-50 shadow-sm"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="inline-block h-4 w-4 border-2 border-t-white border-gray-200 rounded-full"
                  />
                ) : hasMore ? (
                  'Muat Lebih Banyak'
                ) : (
                  'Tidak Ada Pesan Lagi'
                )}
              </button>
            )}
            {filteredMessages.map((msg, i) => (
              <motion.div
                key={`${msg.timestamp}-${msg.message}-${i}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`max-w-[70%] p-3 mb-3 rounded-lg shadow-md relative ${
                  msg.direction === 'in'
                    ? 'bg-white text-gray-800'
                    : 'bg-[#DCF8C6] text-gray-800 ml-auto'
                } ${msg.direction === 'in' ? 'bubble-in' : 'bubble-out'}`}
              >
                <span className="text-base leading-relaxed">{highlightText(msg.message, localSearch || search)}</span>
                <div className="text-xs text-gray-500 mt-1 flex items-center justify-end">
                  {formatMessageTime(msg.timestamp)}
                  {msg.direction === 'out' && (
                    <span className="ml-1 text-blue-500">
                      {msg.status === 'sending' ? '✓' : '✓✓'}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div
            className="fixed bottom-0 w-full md:w-[calc(100%-20rem)] bg-white border-t border-gray-200 z-50"
            style={{
              bottom: `calc(${keyboardHeight}px + env(safe-area-inset-bottom))`,
            }}
          >
            <div className={`p-3 md:pr-8 md:pl-2 w-full max-w-[90%] mx-auto ${keyboardHeight > 0 ? 'pb-0 pt-1' : ''}`}>
              <form onSubmit={handleSubmit} className="relative w-full">
                {/* Desktop: Textarea with internal send button */}
                <div className="hidden md:block relative">
                  <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Ketik pesan..."
                    disabled={false}
                    className="w-full p-3 pr-12 bg-gray-100 border-none rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#25D366] shadow-sm resize-none scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
                    style={{
                      minHeight: '48px',
                      maxHeight: '120px',
                      overflowY: 'auto',
                    }}
                    aria-label="Ketik pesan"
                  />
                  <button
                    type="submit"
                    disabled={!text.trim()}
                    className="absolute right-2 bottom-2 p-2 bg-[#25D366] rounded-full text-white hover:bg-[#128C7E] disabled:opacity-50 flex-shrink-0"
                    aria-label="Kirim pesan"
                  >
                    <IoSend size={20} />
                  </button>
                </div>
                {/* Mobile: Textarea with external send button */}
                <div className="md:hidden flex items-center space-x-2">
                  <textarea
                    ref={mobileTextareaRef}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Ketik pesan..."
                    disabled={false}
                    className="flex-1 p-3 bg-gray-100 border-none rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#25D366] shadow-sm resize-none scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
                    style={{
                      minHeight: '48px',
                      maxHeight: '120px',
                      overflowY: 'auto',
                    }}
                    aria-label="Ketik pesan"
                  />
                  <button
                    type="submit"
                    disabled={!text.trim()}
                    className="p-3 bg-[#25D366] rounded-full text-white hover:bg-[#128C7E] disabled:opacity-50 flex-shrink-0 shadow-sm"
                    aria-label="Kirim pesan"
                  >
                    <IoSend size={20} />
                  </button>
                </div>
              </form>
            </div>
            <AnimatePresence>
              {localError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="p-2 text-red-500 text-sm text-center"
                >
                  {localError}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center bg-[#ECE5DD] w-full h-[calc(100vh-4rem)] md:ml-80">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-gray-500 text-lg font-medium"
          >
            Pilih kontak untuk mulai chat
          </motion.p>
        </div>
      )}
      <style jsx>{`
        .bubble-in::before,
        .bubble-out::before {
          content: '';
          position: absolute;
          bottom: 0;
          width: 10px;
          height: 10px;
          background: inherit;
          clip-path: polygon(0 0, 100% 100%, 0 100%);
        }
        .bubble-in::before {
          left: -6px;
          transform: rotate(45deg);
        }
        .bubble-out::before {
          right: -6px;
          transform: rotate(-135deg);
        }
      `}</style>
    </div>
  );
}