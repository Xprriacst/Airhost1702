import Airtable from 'airtable';
import type { Property } from '../types';

const base = new Airtable({
  apiKey: 'patWHbXxbcFkKGqP6.d6d71ef9ba74b567d7b19a5e66b151964edb0464db8a18e91846614f2f9e44bd'
}).base('app9QXNgVWVwSwipK');

export const airtableService = {
  async getProperties(): Promise<Property[]> {
    try {
      const records = await base('Properties').select({
        view: 'Grid view'
      }).all();

      return records.map(record => ({
        id: record.id,
        name: record.get('Name') as string || '',
        address: record.get('Address') as string || '',
        checkInTime: record.get('CheckIn Time') as string || '',
        checkOutTime: record.get('CheckOut Time') as string || '',
        maxGuests: record.get('Max Guests') as number || 0,
        accessCodes: {
          wifi: {
            name: record.get('WiFi Name') as string || '',
            password: record.get('WiFi Password') as string || ''
          },
          door: record.get('Door Code') as string || ''
        },
        amenities: (record.get('Amenities') as string[] || []),
        houseRules: (record.get('House Rules') as string[] || []),
        photos: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267']
      }));
    } catch (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }
  },

  async createProperty(data: Omit<Property, 'id'>) {
    try {
      const record = await base('Properties').create({
        Name: data.name,
        Address: data.address,
        'CheckIn Time': data.checkInTime,
        'CheckOut Time': data.checkOutTime,
        'Max Guests': data.maxGuests,
        'WiFi Name': data.accessCodes.wifi.name,
        'WiFi Password': data.accessCodes.wifi.password,
        'Door Code': data.accessCodes.door,
        'House Rules': data.houseRules,
        'Amenities': data.amenities
      });

      return {
        id: record.id,
        ...data
      };
    } catch (error) {
      console.error('Error creating property:', error);
      throw error;
    }
  },

  async updateProperty(id: string, data: Partial<Property>) {
    try {
      const record = await base('Properties').update(id, {
        ...(data.name && { Name: data.name }),
        ...(data.address && { Address: data.address }),
        ...(data.checkInTime && { 'CheckIn Time': data.checkInTime }),
        ...(data.checkOutTime && { 'CheckOut Time': data.checkOutTime }),
        ...(data.maxGuests && { 'Max Guests': data.maxGuests }),
        ...(data.accessCodes?.wifi.name && { 'WiFi Name': data.accessCodes.wifi.name }),
        ...(data.accessCodes?.wifi.password && { 'WiFi Password': data.accessCodes.wifi.password }),
        ...(data.accessCodes?.door && { 'Door Code': data.accessCodes.door }),
        ...(data.houseRules && { 'House Rules': data.houseRules }),
        ...(data.amenities && { 'Amenities': data.amenities })
      });

      return {
        id: record.id,
        ...data
      };
    } catch (error) {
      console.error('Error updating property:', error);
      throw error;
    }
  },

  async deleteProperty(id: string) {
    try {
      await base('Properties').destroy(id);
      return { success: true };
    } catch (error) {
      console.error('Error deleting property:', error);
      throw error;
    }
  }
};