import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Property, Conversation } from '../types';

const Properties: React.FC = () => {
  const navigate = useNavigate();
  const [properties] = useState<Property[]>([
    // ... (même contenu que dans desktop/Properties.tsx)
  ]);

  const handleViewConversations = (propertyId: string) => {
    navigate(`/conversations/${propertyId}`);
  };

  return (
    <div className="p-4 space-y-4">
      {properties.map(property => (
        <div key={property.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
          <img
            src={property.photos[0]}
            alt={property.name}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold">{property.name}</h3>
            <p className="text-gray-500 text-sm">{property.address}</p>
            <div className="mt-4">
              <button
                onClick={() => handleViewConversations(property.id)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                View Conversations
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Properties;