import axios, { AxiosError } from 'axios';
import { WhatsAppConfig } from '../config/whatsapp.config';

export interface WhatsAppMessage {
  to: string;
  type: 'text' | 'template' | 'image' | 'document';
  content?: string;
  template?: {
    name: string;
    language: {
      code: string;
    };
    components?: Array<{
      type: string;
      parameters: Array<{
        type: string;
        text?: string;
        image?: {
          link: string;
        };
      }>;
    }>;
  };
  media?: {
    link: string;
    caption?: string;
    filename?: string;
  };
}

interface UserInteraction {
  lastMessage: Date;
  messageCount: number;
  lastMessageId?: string;
}

export class WhatsAppService {
  private readonly baseUrl: string;
  private userInteractions = new Map<string, UserInteraction>();

  constructor() {
    WhatsAppConfig.validateConfig();
    this.baseUrl = `${WhatsAppConfig.baseUrl}/${WhatsAppConfig.apiVersion}/${WhatsAppConfig.phoneNumberId}`;
  }

  async sendMessage(message: WhatsAppMessage): Promise<boolean> {
    try {
      // Validation du numéro
      this.validatePhoneNumber(message.to);

      const payload = this.buildPayload(message);
      console.log('📬 Envoi du message...\nPayload:', JSON.stringify(payload, null, 2));
      
      const response = await axios.post(
        `${this.baseUrl}/messages`,
        payload,
        { headers: WhatsAppConfig.headers }
      );

      console.log('✅ Message envoyé avec succès:', response.data);
      return true;
    } catch (error) {
      this.handleError(error as AxiosError);
      return false;
    }
  }

  isWithin24hWindow(phoneNumber: string): boolean {
    const interaction = this.userInteractions.get(phoneNumber);
    if (!interaction) return false;

    const timeDiff = Date.now() - interaction.lastMessage.getTime();
    return timeDiff <= 24 * 60 * 60 * 1000; // 24h en ms
  }

  updateUserInteraction(phoneNumber: string, messageId?: string): void {
    const current = this.userInteractions.get(phoneNumber) || {
      messageCount: 0,
      lastMessage: new Date(0)
    };

    this.userInteractions.set(phoneNumber, {
      lastMessage: new Date(),
      messageCount: current.messageCount + 1,
      lastMessageId: messageId
    });
  }

  private validatePhoneNumber(phone: string): void {
    if (!/^\d{1,15}$/.test(phone)) {
      throw new Error(`Numéro invalide: ${phone}. Format attendu: E.164 sans +`);
    }
  }

  private buildPayload(message: WhatsAppMessage): any {
    const basePayload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: message.to,
    };

    switch (message.type) {
      case 'template':
        return {
          ...basePayload,
          type: 'template',
          template: message.template
        };

      case 'image':
      case 'document':
        return {
          ...basePayload,
          type: message.type,
          [message.type]: message.media
        };

      default:
        return {
          ...basePayload,
          type: 'text',
          text: { body: message.content }
        };
    }
  }

  private handleError(error: AxiosError): void {
    if (error.response) {
      console.error('❌ WhatsApp API Error:', {
        status: error.response.status,
        data: error.response.data,
      });
    } else if (error.request) {
      console.error('❌ Pas de réponse de l\'API WhatsApp');
    } else {
      console.error('❌ Erreur de configuration:', error.message);
    }
    throw error;
  }
}
