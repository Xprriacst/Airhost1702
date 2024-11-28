import express from 'express';
import type { Request, Response } from 'express';
import { whatsappService } from '../services/whatsappService';

const router = express.Router();

// Webhook endpoint for Make.com
router.post('/whatsapp', async (req: Request, res: Response) => {
  try {
    const { message, sender, timestamp } = req.body;
    
    console.log('Received WhatsApp message:', {
      message,
      sender,
      timestamp
    });

    // Validate required fields
    if (!message || !sender) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Process the message
    const response = await whatsappService.handleIncomingMessage({
      id: Date.now().toString(),
      text: message,
      isUser: true,
      timestamp: new Date(timestamp || Date.now()),
      sender
    });

    res.status(200).json(response);
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router;