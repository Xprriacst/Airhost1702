import OpenAI from 'openai';
import type { Message, Property } from '../types';

interface BookingContext {
  hasBooking: boolean;
  checkIn?: string;
  checkOut?: string;
}

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const generateSystemPrompt = (property: Property, bookingContext: BookingContext): string => {
  let prompt = `You are a helpful property manager assistant for ${property.name}. 
Here are the property details:
- Address: ${property.address}
- Check-in time: ${property.checkInTime}
- Check-out time: ${property.checkOutTime}
- Maximum guests: ${property.maxGuests}

${bookingContext.hasBooking ? `This guest has a confirmed booking:
- Check-in date: ${bookingContext.checkIn}
- Check-out date: ${bookingContext.checkOut}` : 'This guest has not made a booking yet.'}

Provide concise, friendly responses to guest inquiries. Be professional and welcoming.`;

  return prompt;
};

const generateResponse = async (
  message: Message, 
  property: Property,
  bookingContext: BookingContext = { hasBooking: false }
): Promise<string> => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-0125-preview",
      messages: [
        { 
          role: "system", 
          content: generateSystemPrompt(property, bookingContext)
        },
        {
          role: "user",
          content: `Guest message: "${message.text}"\n\nProvide a helpful response as the property manager.`
        }
      ],
      temperature: 0.7,
      max_tokens: 150
    });

    return completion.choices[0]?.message?.content || "I apologize, but I couldn't generate a response at the moment. Please try again.";
  } catch (error) {
    console.error('Error generating AI response:', error);
    return "I apologize, but I'm having trouble generating a response right now. Please try again in a moment.";
  }
};

export const aiService = {
  generateResponse,
};