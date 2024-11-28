import axios from 'axios';
import type { Message } from '../types';

const MAKE_WEBHOOK_URL = import.meta.env.VITE_MAKE_WEBHOOK_URL;

export const whatsappService = {
  async sendMessage(phoneNumber: string, message: string) {
    try {
      await axios.post(`${MAKE_WEBHOOK_URL}/send`, {
        phoneNumber,
        message
      });
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      throw error;
    }
  },

  async handleIncomingMessage(message: Message) {
    // Cette fonction sera appelée par le webhook de Make
    // quand un nouveau message WhatsApp arrive
    try {
      // Ici vous pouvez ajouter la logique pour :
      // 1. Sauvegarder le message dans votre base de données
      // 2. Générer une réponse automatique si nécessaire
      // 3. Notifier les administrateurs
      
      return {
        success: true,
        message: 'Message received'
      };
    } catch (error) {
      console.error('Error handling incoming WhatsApp message:', error);
      throw error;
    }
  }
};