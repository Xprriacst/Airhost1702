import axios from 'axios';
import type { Property } from '../types';

const MAKE_WEBHOOK_URL = import.meta.env.VITE_MAKE_WEBHOOK_URL;

const makeRequest = async (action: string, data?: any) => {
  try {
    console.log('Making request to Make.com:', { action, data });
    const response = await axios.post(MAKE_WEBHOOK_URL, {
      action,
      ...data
    }, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('Response from Make.com:', response.data);
    return response.data;
  } catch (error) {
    console.error('Make.com request failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Make.com request failed: ${errorMessage}`);
  }
};

export const makeService = {
  async getProperties(): Promise<Property[]> {
    try {
      const response = await makeRequest('list', {
        source: 'airtable',
        table: 'Properties'
      });
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch properties');
      }

      // Map Airtable records to our Property type
      return (response.data || []).map((record: any) => ({
        id: record.id,
        name: record.fields.Name || '',
        address: record.fields.Address || '',
        checkInTime: record.fields['CheckIn Time'] || '',
        checkOutTime: record.fields['CheckOut Time'] || '',
        maxGuests: record.fields['Max Guests'] || 0,
        accessCodes: {
          wifi: {
            name: record.fields['WiFi Name'] || '',
            password: record.fields['WiFi Password'] || ''
          },
          door: record.fields['Door Code'] || ''
        },
        amenities: record.fields.Amenities || [],
        houseRules: record.fields['House Rules'] || [],
        photos: record.fields.Photos ? 
          record.fields.Photos.map((photo: any) => photo.url) : 
          ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267']
      }));
    } catch (error) {
      console.error('Error fetching properties:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch properties';
      throw new Error(errorMessage);
    }
  },

  async createProperty(data: Omit<Property, 'id'>) {
    try {
      const response = await makeRequest('create', {
        source: 'airtable',
        table: 'Properties',
        data: {
          fields: {
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
          }
        }
      });

      if (!response.success) {
        throw new Error(response.error || 'Failed to create property');
      }
      return response.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create property';
      throw new Error(errorMessage);
    }
  },

  async updateProperty(id: string, data: Partial<Property>) {
    try {
      const response = await makeRequest('update', {
        source: 'airtable',
        table: 'Properties',
        id,
        data: {
          fields: {
            Name: data.name,
            Address: data.address,
            'CheckIn Time': data.checkInTime,
            'CheckOut Time': data.checkOutTime,
            'Max Guests': data.maxGuests,
            'WiFi Name': data.accessCodes?.wifi.name,
            'WiFi Password': data.accessCodes?.wifi.password,
            'Door Code': data.accessCodes?.door,
            'House Rules': data.houseRules,
            'Amenities': data.amenities
          }
        }
      });
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to update property');
      }
      return response.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update property';
      throw new Error(errorMessage);
    }
  },

  async deleteProperty(id: string) {
    try {
      const response = await makeRequest('delete', {
        source: 'airtable',
        table: 'Properties',
        id
      });
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete property');
      }
      return response.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete property';
      throw new Error(errorMessage);
    }
  }
};