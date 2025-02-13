import express from 'express';
import dotenv from 'dotenv';
import WhatsAppController from './controllers/whatsapp.controller';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const controller = new WhatsAppController();

// Middleware pour parser le JSON et les URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware pour logger les requêtes
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes WhatsApp
app.get('/api/whatsapp/webhook', controller.verifyWebhook);
app.post('/api/whatsapp/webhook', controller.handleMessage);

// Route de test
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Webhook URL: http://localhost:${port}/api/whatsapp/webhook`);
  console.log('Environment:', process.env.NODE_ENV || 'development');
});

// Gestion des erreurs globales
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});
