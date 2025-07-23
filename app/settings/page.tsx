import React from 'react';

export default function SettingsPage() {
  return (
    <div className="p-6 min-h-screen bg-gray-50 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white">
      <h1 className="text-3xl font-bold mb-4">Settings</h1>
      <p className="text-lg">This is where you can manage your account settings.</p>
      {/* Additional settings components can be added here */}
    </div>
  );
}