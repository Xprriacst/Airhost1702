import React from 'react';
import { Bell, Shield, User, Key } from 'lucide-react';

const Settings = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y">
        <div className="p-4 hover:bg-gray-50 cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Profile Settings</h3>
              <p className="text-sm text-gray-500">Update your personal information and preferences</p>
            </div>
          </div>
        </div>

        <div className="p-4 hover:bg-gray-50 cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Bell className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Notifications</h3>
              <p className="text-sm text-gray-500">Configure your notification preferences</p>
            </div>
          </div>
        </div>

        <div className="p-4 hover:bg-gray-50 cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Security</h3>
              <p className="text-sm text-gray-500">Manage your security settings and devices</p>
            </div>
          </div>
        </div>

        <div className="p-4 hover:bg-gray-50 cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Key className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">API Keys</h3>
              <p className="text-sm text-gray-500">Manage API keys for integrations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;