import type { Handler } from '@netlify/functions';
import { whatsappService } from '../../src/services/whatsappService';

export const handler: Handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { message, sender, timestamp } = body;

    // Validate required fields
    if (!message || !sender) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          error: 'Missing required fields'
        })
      };
    }

    // Process the message
    const response = await whatsappService.handleIncomingMessage({
      id: Date.now().toString(),
      text: message,
      isUser: true,
      timestamp: new Date(timestamp || Date.now()),
      sender
    });

    return {
      statusCode: 200,
      body: JSON.stringify(response)
    };
  } catch (error) {
    console.error('Webhook error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: 'Internal server error'
      })
    };
  }
}