import { useState, useEffect } from 'react';
import { subscribeToMessages, addMessage as addMessageService } from '../firebase/messagesService';

export const useMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToMessages((fetchedMessages) => {
      setMessages(fetchedMessages);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addMessage = async (messageData) => {
    await addMessageService(messageData);
  };

  return {
    messages,
    loading,
    addMessage,
  };
};
