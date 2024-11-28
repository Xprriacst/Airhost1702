import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import type { Conversation } from '../types';

const Conversations: React.FC = () => {
  const navigate = useNavigate();
  const { propertyId } = useParams();
  const location = useLocation();
  const propertyAutoPilot = location.state?.autoPilot;

  const [conversations] = useState<Conversation[]>([
    {
      id: 'conv1',
      propertyId: '1',
      guestName: 'John Smith',
      checkIn: '2024-03-10',
      checkOut: '2024-03-15',
      messages: [
        {
          id: '1',
          text: "Hi! I just checked in but I can't find the WiFi password. Could you help?",
          isUser: false,
          timestamp: new Date('2024-03-10T14:30:00'),
          sender: 'John Smith'
        },
        {
          id: '2',
          text: "Of course! The WiFi password is 'sunset2024'. Let me know if you need anything else!",
          isUser: true,
          timestamp: new Date('2024-03-10T14:31:00'),
          sender: 'Host'
        }
      ]
    },
    {
      id: 'conv2',
      propertyId: '2',
      guestName: 'Emma Davis',
      checkIn: '2024-03-15',
      checkOut: '2024-03-20',
      messages: [
        {
          id: '1',
          text: "Hello! Is early check-in possible tomorrow?",
          isUser: false,
          timestamp: new Date('2024-03-14T10:15:00'),
          sender: 'Emma Davis'
        }
      ]
    }
  ]);

  const filteredConversations = propertyId 
    ? conversations.filter(conv => conv.propertyId === propertyId)
    : conversations;

  const handleConversationClick = (conversation: Conversation) => {
    navigate(`/chat/${conversation.id}`, {
      state: {
        conversation,
        propertyAutoPilot
      }
    });
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        {propertyId && (
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
        )}
        <h1 className="text-2xl font-bold text-gray-900">
          {propertyId ? 'Property Conversations' : 'All Conversations'}
        </h1>
      </div>

      <div className="space-y-4">
        {filteredConversations.map((conversation) => (
          <button
            key={conversation.id}
            onClick={() => handleConversationClick(conversation)}
            className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:border-blue-300 transition-colors text-left"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-50 rounded-full">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{conversation.guestName}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(conversation.checkIn).toLocaleDateString()} - {new Date(conversation.checkOut).toLocaleDateString()}
                </p>
              </div>
              <div className="ml-auto text-sm text-gray-500">
                {conversation.messages.length} messages
              </div>
            </div>
            
            {conversation.messages.length > 0 && (
              <div className="mt-4 ml-14">
                <p className="text-sm text-gray-600">
                  Latest: {conversation.messages[conversation.messages.length - 1].text}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(conversation.messages[conversation.messages.length - 1].timestamp).toLocaleString()}
                </p>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Conversations;