import React, { useState } from 'react';
import { Send, RefreshCw, Calendar, Clock, User } from 'lucide-react';
import type { Message, Property } from '../types';
import { aiService } from '../services/aiService';
import ChatMessage from '../components/ChatMessage';

const ChatSandbox: React.FC = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [messageDate, setMessageDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [messageTime, setMessageTime] = useState<string>(new Date().toTimeString().slice(0, 5));
  const [hasBooking, setHasBooking] = useState(false);
  const [checkIn, setCheckIn] = useState<string>(new Date().toISOString().split('T')[0]);
  const [checkOut, setCheckOut] = useState<string>(
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  const [properties] = useState<Property[]>([
    {
      id: '1',
      name: 'Sunset Villa',
      address: '123 Ocean Drive, Miami Beach, FL',
      accessCodes: {
        wifi: 'sunset2024',
        door: '4080#',
      },
      houseRules: ['No smoking', 'No parties', 'Quiet hours 10 PM - 8 AM'],
      amenities: ['Pool', 'Beach access', 'Free parking'],
      checkInTime: '15:00',
      checkOutTime: '11:00',
      maxGuests: 6,
      photos: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6'],
    },
    {
      id: '2',
      name: 'Studio Blois',
      address: '13 rue des Papegaults, Blois',
      accessCodes: {
        wifi: {
          name: 'FREEBOX-AE4AC6',
          password: 'barbani@%-solvi38-irrogatura-cannetum?&'
        },
        door: '210',
      },
      houseRules: ['Max 4 people', 'No extra visitors', 'Respect noise levels'],
      amenities: ['TV', 'Kitchen', 'Heating'],
      checkInTime: '15:00',
      checkOutTime: '11:00',
      maxGuests: 4,
      photos: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267'],
      description: 'Bienvenue dans notre charmant studio...',
      parkingInfo: 'Parking gratuit : Parking du Mail...',
      restaurants: ['Brute Maison de Cuisine', 'Le Diffa', "Bro's Restaurant"],
      fastFood: ["Frenchy's", 'Le Berliner', 'Osaka'],
      emergencyContacts: ['+33 6 17 37 04 84', '+33 6 20 16 93 17'],
      additionalInfo: {
        windows: 'Pour éviter les pigeons, ne les ouvrez pas complètement.',
        tv: 'Vérifiez que la source est sur "HDMI 1"',
        heating: 'Géré à distance.',
        bikes: 'Aucun local dédié dans l\'immeuble.'
      }
    }
  ]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedProperty) return;

    const messageTimestamp = new Date(`${messageDate}T${messageTime}`);

    const guestMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      isUser: false,
      timestamp: messageTimestamp,
      sender: 'Guest'
    };

    setMessages(prev => [...prev, guestMessage]);
    setNewMessage('');
    setIsGenerating(true);

    try {
      const response = await aiService.generateResponse(guestMessage, selectedProperty, {
        hasBooking,
        checkIn: hasBooking ? checkIn : undefined,
        checkOut: hasBooking ? checkOut : undefined,
      });
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: true,
        timestamp: new Date(messageTimestamp.getTime() + 1000), // 1 second later
        sender: 'AI Assistant'
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Chat Sandbox</h1>
        <p className="text-gray-600 mb-4">
          Test AI responses for different properties. Select a property and start a conversation as a guest.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <select
            value={selectedProperty?.id || ''}
            onChange={(e) => {
              const property = properties.find(p => p.id === e.target.value);
              setSelectedProperty(property || null);
              clearChat();
            }}
            className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select a property</option>
            {properties.map(property => (
              <option key={property.id} value={property.id}>
                {property.name}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-gray-400" />
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={hasBooking}
                onChange={(e) => setHasBooking(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ms-3 text-sm font-medium text-gray-900">Has Booking</span>
            </label>
          </div>
        </div>

        {hasBooking && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-500">Check-in</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-500">Check-out</span>
            </div>
          </div>
        )}
      </div>

      {selectedProperty && (
        <>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
            <div className="p-4 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{selectedProperty.name}</h2>
                  <p className="text-sm text-gray-500">{selectedProperty.address}</p>
                </div>
                <button
                  onClick={clearChat}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900"
                >
                  <RefreshCw className="w-4 h-4" />
                  Clear Chat
                </button>
              </div>
            </div>

            <div className="h-[400px] overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isGenerating && (
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  AI is typing...
                </div>
              )}
            </div>

            <div className="p-4 border-t space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={messageDate}
                    onChange={(e) => setMessageDate(e.target.value)}
                    className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <input
                    type="time"
                    value={messageTime}
                    onChange={(e) => setMessageTime(e.target.value)}
                    className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a guest message..."
                  className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  disabled={isGenerating}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isGenerating}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatSandbox;