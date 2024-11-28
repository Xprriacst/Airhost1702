export interface Property {
  id: string;
  name: string;
  address: string;
  accessCodes: {
    wifi: {
      name: string;
      password: string;
    };
    door: string;
  };
  houseRules: string[];
  amenities: string[];
  checkInTime: string;
  checkOutTime: string;
  maxGuests: number;
  photos: string[];
  description?: string;
  parkingInfo?: string;
  restaurants?: string[];
  fastFood?: string[];
  emergencyContacts?: string[];
  additionalInfo?: {
    windows?: string;
    tv?: string;
    heating?: string;
    bikes?: string;
  };
}

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  sender: string;
}

export interface Conversation {
  id: string;
  propertyId: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  messages: Message[];
}

export interface Integration {
  id: string;
  name: string;
  apiKey: string;
  status: 'active' | 'inactive';
  lastSync: string;
}