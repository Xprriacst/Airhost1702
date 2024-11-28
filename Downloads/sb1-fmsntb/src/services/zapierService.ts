import axios from 'axios';
import type { Property } from '../types';

export const zapierService = {
  async createProperty(data: Omit<Property, 'id'>) {
    const ZAPIER_WEBHOOK_URL = import.meta.env.VITE_ZAPIER_WEBHOOK_URL;
    
    try {
      const payload = {
        name: data.name,
        address: data.address,
        checkInTime: data.checkInTime,
        checkOutTime: data.checkOutTime,
        maxGuests: data.maxGuests,
        wifiName: typeof data.accessCodes.wifi === 'string' ? '' : data.accessCodes.wifi.name,
        wifiPassword: typeof data.accessCodes.wifi === 'string' ? data.accessCodes.wifi : data.accessCodes.wifi.password,
        doorCode: data.accessCodes.door
      };

      const response = await axios.post(ZAPIER_WEBHOOK_URL, payload);
      return response.data;
    } catch (error) {
      console.error('Error creating property via Zapier:', error);
      throw error;
    }
  },

  async updateProperty(id: string, data: Partial<Property>) {
    const ZAPIER_WEBHOOK_URL = import.meta.env.VITE_ZAPIER_WEBHOOK_URL;
    
    try {
      const payload = {
        id,
        ...data
      };

      const response = await axios.post(ZAPIER_WEBHOOK_URL, payload);
      return response.data;
    } catch (error) {
      console.error('Error updating property via Zapier:', error);
      throw error;
    }
  },

  async deleteProperty(id: string) {
    const ZAPIER_WEBHOOK_URL = import.meta.env.VITE_ZAPIER_WEBHOOK_URL;
    
    try {
      const response = await axios.post(ZAPIER_WEBHOOK_URL, { id, action: 'delete' });
      return response.data;
    } catch (error) {
      console.error('Error deleting property via Zapier:', error);
      throw error;
    }
  }
};