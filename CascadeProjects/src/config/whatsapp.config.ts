import { config } from 'dotenv';

config();

export const WhatsAppConfig = {
  accessToken: process.env.WHATSAPP_ACCESS_TOKEN,
  phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
  appSecret: process.env.APP_SECRET,
  apiVersion: 'v17.0',
  baseUrl: 'https://graph.facebook.com',
  verifyToken: process.env.WHATSAPP_VERIFY_TOKEN || 'airhost_whatsapp_webhook_123',

  get headers() {
    return {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  },

  validateConfig() {
    const requiredEnvVars = [
      { key: 'WHATSAPP_ACCESS_TOKEN', value: this.accessToken },
      { key: 'WHATSAPP_PHONE_NUMBER_ID', value: this.phoneNumberId },
      { key: 'APP_SECRET', value: this.appSecret },
      { key: 'WHATSAPP_VERIFY_TOKEN', value: this.verifyToken }
    ];

    for (const { key, value } of requiredEnvVars) {
      if (!value) {
        throw new Error(`${key} is required in .env`);
      }
    }

    console.log('✅ WhatsApp configuration validated successfully');
  }
};
