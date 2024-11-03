import React, { useEffect, useCallback } from 'react';
import { Message } from '../types';
import { sendWhatsAppMessage } from '../services/whatsapp';

interface Props {
  messages: Message[];
  onNewMessage: (message: Message) => void;
}

export default function MessageHandler({ messages, onNewMessage }: Props) {
  const handleIncomingMessage = useCallback((event: MessageEvent) => {
    const message = JSON.parse(event.data);
    onNewMessage(message);
  }, [onNewMessage]);

  useEffect(() => {
    // Conecta ao webhook para receber mensagens em tempo real
    const eventSource = new EventSource('/api/messages/stream');
    eventSource.onmessage = handleIncomingMessage;

    return () => {
      eventSource.close();
    };
  }, [handleIncomingMessage]);

  return null; // Componente lógico, sem renderização
}