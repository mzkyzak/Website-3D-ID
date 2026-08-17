import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, where, getDocs, limit } from 'firebase/firestore';
import { db } from './config';

const COLLECTION_NAME = 'messages';

/**
 * Add a new message to Firestore.
 * @param {Object} messageData
 * @param {string} messageData.name
 * @param {string} messageData.region
 * @param {string} messageData.education
 * @param {string} messageData.status
 * @param {string} messageData.impression
 * @param {string} messageData.message
 * @param {string} messageData.color
 */
export const addMessage = async (messageData) => {
  try {
    await addDoc(collection(db, COLLECTION_NAME), {
      ...messageData,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};

/**
 * Check if a user has already posted a message.
 * @param {string} uid - The user ID.
 * @returns {boolean} True if the user has already posted.
 */
export const checkUserHasPosted = async (uid) => {
  if (!uid) return false;
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('uid', '==', uid),
      limit(1)
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    console.error("Error checking user post: ", error);
    return false;
  }
};

/**
 * Subscribe to messages collection in real-time.
 * @param {function} callback - Function called with the new list of messages when data changes.
 * @returns {function} Unsubscribe function to stop listening to changes.
 */
export const subscribeToMessages = (callback) => {
  // Tampilkan semua pesan tanpa batas — semua suara rakyat terlihat
  const q = query(
    collection(db, COLLECTION_NAME),
    orderBy('createdAt', 'desc')
  );
  
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(messages);
  }, (error) => {
    console.error("Error fetching messages: ", error);
  });

  return unsubscribe;
};
