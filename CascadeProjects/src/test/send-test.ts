import { WhatsAppService } from '../services/whatsapp.service';
import dotenv from 'dotenv';

dotenv.config();

async function testWhatsApp() {
    const whatsapp = new WhatsAppService();
    const phoneNumber = "33617370484";

    try {
        console.log('🟢 Démarrage des tests WhatsApp...');

        // Test 1: Message texte simple
        console.log('\n📡 Test 1: Message texte simple');
        await whatsapp.sendMessage({
            to: phoneNumber,
            type: "text",
            content: "👋 Bonjour ! Ceci est un message de test depuis l'API WhatsApp."
        });

        // Test 2: Message formaté
        console.log('\n📡 Test 2: Message avec formatage');
        await whatsapp.sendMessage({
            to: phoneNumber,
            type: "text",
            content: `💻 *Test de Formatage*

✨ _Italique_
📌 *Gras*
📑 ~Barré~

🚀 API WhatsApp opérationnelle !`
        });

        // Test 3: Template message
        console.log('\n📡 Test 3: Message template');
        await whatsapp.sendMessage({
            to: phoneNumber,
            type: "template",
            template: {
                name: "bienvenue",
                language: {
                    code: "fr"
                }
            }
        });

        // Test 4: Message avec image
        console.log('\n📡 Test 4: Message avec image');
        await whatsapp.sendMessage({
            to: phoneNumber,
            type: "image",
            media: {
                link: "https://example.com/image.jpg",
                caption: "Test d'envoi d'image 📷"
            }
        });

        console.log('\n✅ Tous les tests sont terminés avec succès !');

    } catch (error) {
        console.error('\n❌ Erreur lors des tests:', error);
        process.exit(1);
    }
}

testWhatsApp();

