import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import Properties from '../pages/desktop/Properties';
import Conversations from '../pages/Conversations';
import Settings from '../pages/Settings';
import MobileChat from '../pages/MobileChat';
import ChatSandbox from '../pages/ChatSandbox';

const DesktopLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Properties />} />
          <Route path="/conversations" element={<Conversations />} />
          <Route path="/conversations/:propertyId" element={<Conversations />} />
          <Route path="/chat/:conversationId" element={<MobileChat />} />
          <Route path="/sandbox" element={<ChatSandbox />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
};

export default DesktopLayout;