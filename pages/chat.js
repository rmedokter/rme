/**
 * pages/chat.js
 */
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { IoSearchOutline, IoRefresh, IoAdd } from 'react-icons/io5';
import { motion } from 'framer-motion';
import ChatPanel from '../components/ChatPanel';
import {
  loadFromLocalStorage,
  saveToLocalStorage,
  invalidateLocalStorage,
  sortContacts,
  getLastMessagePreview,
  normalizeTimestamp,
} from '../lib/utils';
import { v4 as uuidv4 } from 'uuid';

export default function Chat({ wabaId, phoneNumberId, accessToken, hasCompleteData, user }) {
  const router = useRouter();
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [lastMessages, setLastMessages] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [search, setSearch] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [showNewChatInput, setShowNewChatInput] = useState(false);
  const [newContactNumber, setNewContactNumber] = useState('');
  const lastEvaluatedKeyRef = useRef(null);
  const MESSAGE_LIMIT = 20;

  useEffect(() => {
    if (!user || !hasCompleteData) {
      setError('Data WABA atau user tidak lengkap. Silakan selesaikan Embedded Signup di halaman Users.');
      router.push('/users');
    }
  }, [user, hasCompleteData, router]);

  const fetchContacts = async (invalidate = false) => {
    if (!phoneNumberId) return;
    const cacheKey = `waba_${wabaId}_contacts`;
    if (!invalidate) {
      const cached = loadFromLocalStorage(cacheKey);
      if (cached) {
        setContacts(sortContacts(cached.data.contacts, cached.data.lastMessages));
        setLastMessages(cached.data.lastMessages);
        return;
      }
    }
    try {
      setLoading(true);
      if (invalidate) invalidateLocalStorage(cacheKey);
      const response = await fetch('/api/get-contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumberId }),
      });
      const { success, contacts, lastMessages, error: apiError } = await response.json();
      if (!response.ok || !success) throw new Error(apiError || 'Gagal mengambil kontak');
      const normalizedLastMessages = {};
      Object.keys(lastMessages).forEach((key) => {
        const time = normalizeTimestamp(lastMessages[key].time, 'server');
        if (time) normalizedLastMessages[key] = { ...lastMessages[key], time };
      });
      const sortedContacts = sortContacts(contacts, normalizedLastMessages);
      setContacts(sortedContacts);
      setLastMessages(normalizedLastMessages);
      saveToLocalStorage(cacheKey, { contacts: sortedContacts, lastMessages: normalizedLastMessages });
    } catch (err) {
      console.error('Error ambil kontak:', err);
      setError('Gagal memuat kontak: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (isInitial = false) => {
    if (!selectedContact || !phoneNumberId) return;
    const cacheKey = `waba_${wabaId}_messages_${selectedContact}`;
    if (isInitial) {
      const cached = loadFromLocalStorage(cacheKey);
      if (cached) {
        setMessages(cached.data.messages.sort((a, b) => a.timestamp.localeCompare(b.timestamp)));
        setHasMore(cached.data.hasMore);
        lastEvaluatedKeyRef.current = cached.data.lastEvaluatedKey;
        return;
      }
    }
    try {
      setLoading(true);
      const response = await fetch('/api/get-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedContact,
          phoneNumberId,
          limit: MESSAGE_LIMIT,
          lastEvaluatedKey: isInitial ? null : lastEvaluatedKeyRef.current,
        }),
      });
      const { success, messages, lastEvaluatedKey, error: apiError } = await response.json();
      if (!response.ok || !success) throw new Error(apiError || 'Gagal mengambil pesan');
      const normalizedMessages = messages
        .map((msg) => ({ ...msg, timestamp: normalizeTimestamp(msg.timestamp, 'server'), status: msg.direction === 'out' ? 'sent' : undefined }))
        .filter((msg) => msg.timestamp);
      const sortedMessages = normalizedMessages.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
      if (isInitial) {
        setMessages(sortedMessages);
        setHasMore(messages.length === MESSAGE_LIMIT);
        lastEvaluatedKeyRef.current = lastEvaluatedKey;
      } else {
        setMessages((prev) => {
          const combined = [...sortedMessages, ...prev].sort((a, b) => a.timestamp.localeCompare(b.timestamp));
          return combined.slice(-MESSAGE_LIMIT);
        });
        setHasMore(messages.length === MESSAGE_LIMIT);
        lastEvaluatedKeyRef.current = lastEvaluatedKey;
      }
      if (sortedMessages.length > 0) {
        const latestMessage = sortedMessages[sortedMessages.length - 1];
        setLastMessages((prev) => ({
          ...prev,
          [selectedContact]: {
            text: latestMessage.message.slice(0, 30) + (latestMessage.message.length > 30 ? '...' : ''),
            time: latestMessage.timestamp,
          },
        }));
        setContacts((prev) => sortContacts(prev, {
          ...lastMessages,
          [selectedContact]: {
            text: latestMessage.message.slice(0, 30) + (latestMessage.message.length > 30 ? '...' : ''),
            time: latestMessage.timestamp,
          },
        }));
        const contactsCacheKey = `waba_${wabaId}_contacts`;
        saveToLocalStorage(contactsCacheKey, { contacts, lastMessages });
      }
      saveToLocalStorage(cacheKey, { messages: sortedMessages, hasMore: messages.length === MESSAGE_LIMIT, lastEvaluatedKey });
    } catch (err) {
      console.error('Error ambil pesan:', err);
      setError('Gagal memuat pesan: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (router.pathname === '/chat' && phoneNumberId) {
      // Always invalidate cache and fetch fresh contacts on initial load or when returning to chat page
      fetchContacts(true);
      if (selectedContact) {
        const cacheKey = `waba_${wabaId}_messages_${selectedContact}`;
        invalidateLocalStorage(cacheKey);
        fetchMessages(true);
      }
    }
  }, [router.pathname, phoneNumberId]);

  useEffect(() => {
    // Refresh messages when selectedContact changes (e.g., returning from message screen)
    if (selectedContact && phoneNumberId) {
      const cacheKey = `waba_${wabaId}_messages_${selectedContact}`;
      invalidateLocalStorage(cacheKey);
      fetchMessages(true);
    }
  }, [selectedContact, phoneNumberId]);

  const handleSend = async (text) => {
    if (!text.trim() || !selectedContact || !user || !accessToken || !phoneNumberId) {
      setError('Pastikan kontak dipilih, pesan terisi, dan data WABA lengkap.');
      return;
    }

    // Update UI secara optimistis
    const tempMessageId = uuidv4();
    const newMessage = {
      message_id: tempMessageId,
      contact: selectedContact,
      message: text,
      direction: 'out',
      timestamp: new Date().toISOString(),
      status: 'sending',
    };
    setMessages((prev) => {
      const updated = [...prev, newMessage].sort((a, b) => a.timestamp.localeCompare(b.timestamp));
      return updated.slice(-MESSAGE_LIMIT);
    });
    setLastMessages((prev) => ({
      ...prev,
      [selectedContact]: {
        text: text.slice(0, 30) + (text.length > 30 ? '...' : ''),
        time: newMessage.timestamp,
      },
    }));
    setContacts((prev) => sortContacts(prev, {
      ...lastMessages,
      [selectedContact]: {
        text: text.slice(0, 30) + (text.length > 30 ? '...' : ''),
        time: newMessage.timestamp,
      },
    }));

    // Simpan ke server di latar belakang
    try {
      setError(null);
      const response = await fetch('/api/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_number_id: phoneNumberId,
          to: selectedContact,
          text,
          access_token: accessToken,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || 'Gagal mengirim pesan');

      // Update message_id dan status dengan yang asli
      setMessages((prev) => {
        const updated = prev.map((msg) =>
          msg.message_id === tempMessageId ? { ...msg, message_id: result.message_id, status: 'sent' } : msg
        );
        return updated;
      });

      // Update cache tanpa menambah kontak duplikat
      const contactsCacheKey = `waba_${wabaId}_contacts`;
      const uniqueContacts = [...new Set([...contacts, selectedContact])]; // Pastikan kontak unik
      saveToLocalStorage(contactsCacheKey, { contacts: uniqueContacts, lastMessages });

      const cacheKey = `waba_${wabaId}_messages_${selectedContact}`;
      saveToLocalStorage(cacheKey, {
        messages: [...messages, { ...newMessage, message_id: result.message_id, status: 'sent' }].sort((a, b) =>
          a.timestamp.localeCompare(b.timestamp)
        ),
        hasMore,
        lastEvaluatedKey: lastEvaluatedKeyRef.current,
      });

      await fetchMessages(true); // Refresh untuk sinkronisasi
    } catch (err) {
      console.error('Error kirim pesan:', err);
      setError('Gagal mengirim pesan: ' + err.message);
      // Rollback UI
      setMessages((prev) => prev.filter((msg) => msg.message_id !== tempMessageId));
    }
  };

  const handleNewChat = async () => {
    if (!newContactNumber.trim()) return;
    try {
      setLoading(true);
      // Cek apakah nomor sudah ada di contacts
      if (!contacts.includes(newContactNumber)) {
        setContacts((prev) => [...new Set([...prev, newContactNumber])]); // Tambah hanya jika belum ada
        const contactsCacheKey = `waba_${wabaId}_contacts`;
        saveToLocalStorage(contactsCacheKey, {
          contacts: [...new Set([...contacts, newContactNumber])],
          lastMessages,
        });
      }
      setSelectedContact(newContactNumber);
      setShowNewChatInput(false);
      setNewContactNumber('');
    } catch (err) {
      console.error('Error mulai chat baru:', err);
      setError('Gagal memulai chat: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) fetchMessages(false);
  };

  const handleRefresh = () => {
    if (!loading) {
      const contactsCacheKey = `waba_${wabaId}_contacts`;
      fetchContacts(true);
      if (selectedContact) {
        const cacheKey = `waba_${wabaId}_messages_${selectedContact}`;
        invalidateLocalStorage(cacheKey);
        fetchMessages(true);
      }
    }
  };

  if (loading || !user || !hasCompleteData) {
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
    <ChatPanel
      messages={messages}
      onSend={handleSend}
      onLoadMore={handleLoadMore}
      loading={loading}
      hasMore={hasMore}
      contactName={selectedContact || 'Pilih Kontak'}
      onBack={() => setSelectedContact(null)}
      search={search}
      onRefresh={handleRefresh}
      contacts={contacts}
      setSelectedContact={setSelectedContact}
      showNewChatInput={showNewChatInput}
      setShowNewChatInput={setShowNewChatInput}
      newContactNumber={newContactNumber}
      setNewContactNumber={setNewContactNumber}
      handleNewChat={handleNewChat}
      isSearchExpanded={isSearchExpanded}
      setIsSearchExpanded={setIsSearchExpanded}
      setSearch={setSearch}
      getLastMessagePreview={getLastMessagePreview}
      lastMessages={lastMessages}
    />
  );
}