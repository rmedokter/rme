import { format, isToday, isYesterday, isWithinInterval, startOfWeek } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

const CACHE_TTL = 60 * 60 * 1000; // 1 jam

export const isValidTimestamp = (timestamp) => {
  if (!timestamp || typeof timestamp !== 'string') {
    console.warn('Timestamp bukan string:', timestamp);
    return false;
  }
  const date = new Date(timestamp);
  const isValid = !isNaN(date.getTime());
  if (!isValid) console.warn('Timestamp tidak valid:', timestamp);
  return isValid;
};

export const normalizeTimestamp = (timestamp) => {
  if (!timestamp) return null;
  const date = new Date(timestamp);
  return isNaN(date.getTime()) ? null : date.toISOString();
};

export const loadFromLocalStorage = (key) => {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    const parsed = JSON.parse(cached);
    if (!parsed.data || !parsed.timestamp || Date.now() - parsed.timestamp > CACHE_TTL) {
      localStorage.removeItem(key);
      return null;
    }
    if (parsed.data.messages) {
      parsed.data.messages = parsed.data.messages.filter((msg) => isValidTimestamp(msg.timestamp));
    }
    if (parsed.data.lastMessages) {
      Object.keys(parsed.data.lastMessages).forEach((key) => {
        if (!isValidTimestamp(parsed.data.lastMessages[key].time)) {
          delete parsed.data.lastMessages[key];
        }
      });
    }
    return parsed;
  } catch (err) {
    console.error('Error loading from localStorage:', err);
    localStorage.removeItem(key);
    return null;
  }
};

export const saveToLocalStorage = (key, data) => {
  try {
    if (data.messages) {
      data.messages = data.messages
        .map((msg) => ({ ...msg, timestamp: normalizeTimestamp(msg.timestamp) }))
        .filter((msg) => msg.timestamp);
    }
    if (data.lastMessages) {
      Object.keys(data.lastMessages).forEach((key) => {
        const time = normalizeTimestamp(data.lastMessages[key].time);
        if (!time) delete data.lastMessages[key];
        else data.lastMessages[key].time = time;
      });
    }
    localStorage.setItem(key, JSON.stringify({ timestamp: Date.now(), data }));
  } catch (err) {
    console.error('Error saving to localStorage:', err);
  }
};

export const invalidateLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.error('Error invalidating localStorage:', err);
  }
};

export const sortContacts = (contacts, lastMessages) => {
  return contacts.sort((a, b) => {
    const timeA = lastMessages[a]?.time || '1970-01-01T00:00:00.000Z';
    const timeB = lastMessages[b]?.time || '1970-01-01T00:00:00.000Z';
    return timeB.localeCompare(timeA);
  });
};

export const formatMessageTime = (timestamp) => {
  if (!isValidTimestamp(timestamp)) return 'Invalid time';
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const date = utcToZonedTime(new Date(timestamp), timeZone);
  const now = new Date();
  const startOfThisWeek = startOfWeek(now, { weekStartsOn: 1 });

  if (isToday(date)) return format(date, 'HH:mm');
  if (isYesterday(date)) return `Kemarin, ${format(date, 'HH:mm')}`;
  if (isWithinInterval(date, { start: startOfThisWeek, end: now })) {
    return `${format(date, 'EEEE, HH:mm')}`;
  }
  return format(date, 'dd/MM/yyyy, HH:mm');
};

export const getLastMessagePreview = (contact, lastMessages) => {
  const lastMsg = lastMessages[contact];
  if (!lastMsg) return { text: 'Belum ada pesan', time: '' };
  if (!isValidTimestamp(lastMsg.time)) {
    console.warn('Invalid timestamp in lastMessages:', lastMsg.time, 'for contact:', contact);
    return { text: lastMsg.text || 'Belum ada pesan', time: 'Invalid time' };
  }
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const date = utcToZonedTime(new Date(lastMsg.time), timeZone);
  let timeStr = '';
  if (isToday(date)) timeStr = format(date, 'HH:mm');
  else if (isYesterday(date)) timeStr = 'Kemarin';
  else timeStr = format(date, 'dd/MM/yy');
  return { text: lastMsg.text, time: timeStr };
};