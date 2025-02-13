import { Request, Response } from 'express';
import crypto from 'crypto';
import { WhatsAppConfig } from '../config/whatsapp.config';
import { WhatsAppService } from '../services/whatsapp.service';

export default class WhatsAppController {
  private service: WhatsAppService;

  constructor() {
    this.service = new WhatsAppService();
  }

  verifyWebhook = (req: Request, res: Response): void => {
    try {
      console.log('🟡 Vérification du webhook...');
      const mode = req.query['hub.mode'];
      const token = req.query['hub.verify_token'];
      const challenge = req.query['hub.challenge'];

      console.log('Mode:', mode);
      console.log('Token reçu:', token);
      console.log('Challenge:', challenge);

      if (mode === 'subscribe' && token === WhatsAppConfig.verifyToken) {
        console.log('✅ Webhook vérifié avec succès');
        res.status(200).send(challenge);
      } else {
        console.error('❌ Vérification du webhook échouée');
        res.sendStatus(403);
      }
    } catch (error) {
      console.error('❌ Erreur verifyWebhook:', error);
      res.sendStatus(500);
    }
  }

  handleMessage = async (req: Request, res: Response): Promise<void> => {
    try {
      // Vérification de la signature
      if (!this.verifySignature(req)) {
        console.error('❌ Signature invalide');
        return res.sendStatus(403);
      }

      const entry = req.body.entry?.[0];
      const changes = entry?.changes?.[0];
      const message = changes?.value?.messages?.[0];

      if (!message) {
        console.log('ℹ️ Requête sans message, ignorée');
        return res.sendStatus(202);
      }

      // Mise à jour de l'interaction utilisateur
      this.service.updateUserInteraction(message.from, message.id);

      // Traitement asynchrone du message
      this.processMessage(message)
        .catch(error => console.error('❌ Erreur processMessage:', error));

      // Réponse rapide pour respecter le délai de 20s
      res.sendStatus(200);

    } catch (error) {
      console.error('❌ Erreur handleMessage:', error);
      res.sendStatus(500);
    }
  }

  private async processMessage(message: any): Promise<void> {
    const from = message.from;
    const type = message.type;
    const content = message[type];

    console.log(`📬 Message ${type} reçu de ${from}:`, content);

    try {
      // Vérification de la fenêtre de 24h
      const canRespondFreely = this.service.isWithin24hWindow(from);

      if (canRespondFreely) {
        // Réponse personnalisée selon le type de message
        switch (type) {
          case 'text':
            await this.handleTextMessage(from, content.body);
            break;

          case 'image':
            await this.handleMediaMessage(from, 'image', content);
            break;

          case 'document':
            await this.handleMediaMessage(from, 'document', content);
            break;

          default:
            await this.sendDefaultResponse(from);
        }
      } else {
        // Envoi d'un template si hors fenêtre de 24h
        await this.sendTemplateResponse(from);
      }
    } catch (error) {
      console.error(`❌ Erreur traitement message ${type}:`, error);
      throw error;
    }
  }

  private async handleTextMessage(from: string, text: string): Promise<void> {
    await this.service.sendMessage({
      to: from,
      type: 'text',
      content: `✅ Message reçu : "${text}"
Nous traitons votre demande...`
    });
  }

  private async handleMediaMessage(from: string, type: 'image' | 'document', content: any): Promise<void> {
    const caption = content.caption || '';
    await this.service.sendMessage({
      to: from,
      type: 'text',
      content: `✅ ${type.charAt(0).toUpperCase() + type.slice(1)} reçu${caption ? ` avec description : "${caption}"` : ''}`
    });
  }

  private async sendDefaultResponse(from: string): Promise<void> {
    await this.service.sendMessage({
      to: from,
      type: 'text',
      content: '✅ Message reçu. Notre équipe va l\'examiner.'
    });
  }

  private async sendTemplateResponse(from: string): Promise<void> {
    await this.service.sendMessage({
      to: from,
      type: 'template',
      template: {
        name: 'support_response',
        language: {
          code: 'fr'
        }
      }
    });
  }

  private verifySignature(req: Request): boolean {
    const signature = req.headers['x-hub-signature-256'];
    if (!signature || !WhatsAppConfig.appSecret) return false;

    const hmac = crypto.createHmac('sha256', WhatsAppConfig.appSecret);
    const digest = hmac.update(JSON.stringify(req.body)).digest('hex');
    return `sha256=${digest}` === signature;
  }
}
