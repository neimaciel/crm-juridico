import axios from 'axios';

const WHATSAPP_API_URL = process.env.VITE_WHATSAPP_API_URL;
const WHATSAPP_API_TOKEN = process.env.VITE_WHATSAPP_API_TOKEN;

const whatsappApi = axios.create({
  baseURL: WHATSAPP_API_URL,
  headers: {
    'Authorization': `Bearer ${WHATSAPP_API_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

export const sendWhatsAppMessage = async (to: string, message: string) => {
  try {
    const response = await whatsappApi.post('/messages', {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'text',
      text: {
        body: message
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao enviar mensagem WhatsApp:', error);
    throw error;
  }
};

export const setupWebhook = async (url: string) => {
  try {
    const response = await whatsappApi.post('/webhook', {
      url,
      fields: ['messages', 'message_status']
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao configurar webhook:', error);
    throw error;
  }
};

export const handleWebhookEvent = (event: any) => {
  const { entry } = event;
  
  entry.forEach((e: any) => {
    const { changes } = e;
    changes.forEach((change: any) => {
      const { value } = change;
      if (value.messages) {
        value.messages.forEach((message: any) => {
          // Processa a mensagem recebida
          console.log('Mensagem recebida:', message);
          // Aqui você pode implementar a lógica para salvar a mensagem no seu banco de dados
        });
      }
    });
  });
};