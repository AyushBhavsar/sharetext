import React, { useState } from 'react';
import { Share2, Key } from 'lucide-react';
import CreateCode from './components/CreateCode';
import AccessCode from './components/AccessCode';

type View = 'home' | 'create' | 'access';

function App() {
  const [currentView, setCurrentView] = useState<View>('home');

  const renderView = () => {
    switch (currentView) {
      case 'create':
        return <CreateCode onBack={() => setCurrentView('home')} />;
      case 'access':
        return <AccessCode onBack={() => setCurrentView('home')} />;
      default:
        return (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TextShare
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Share text content instantly with temporary 4-digit codes. Simple, secure, and ephemeral.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <button
                onClick={() => setCurrentView('create')}
                className="group bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-white/90"
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-300">
                    <Share2 className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-800">Share Text</h2>
                  <p className="text-gray-600 text-center">
                    Create a temporary code for your text content
                  </p>
                </div>
              </button>

              <button
                onClick={() => setCurrentView('access')}
                className="group bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-white/90"
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center group-hover:from-purple-600 group-hover:to-purple-700 transition-all duration-300">
                    <Key className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-800">Access Text</h2>
                  <p className="text-gray-600 text-center">
                    Enter a 4-digit code to view shared content
                  </p>
                </div>
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-4xl mx-auto">
          {renderView()}
        </div>
      </div>
    </div>
  );
}

export default App;