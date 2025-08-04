import React, { useState } from 'react';
import { Search, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { getText } from '../utils/storage';

interface AccessCodeProps {
  onBack: () => void;
}

const AccessCode: React.FC<AccessCodeProps> = ({ onBack }) => {
  const [code, setCode] = useState('');
  const [retrievedText, setRetrievedText] = useState('');
  const [error, setError] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Za-z0-9]/g, '').slice(0, 4);
    setCode(value);
    setError('');
  };

  const handleAccessText = () => {
    if (code.length !== 4) {
      setError('Please enter a 4-digit code');
      return;
    }

    setIsSearching(true);
    setError('');

    // Simulate search time for better UX
    setTimeout(() => {
      const text = getText(code);
      if (text) {
        setRetrievedText(text);
      } else {
        setError('Code not found or has expired');
      }
      setIsSearching(false);
    }, 800);
  };

  const handleReset = () => {
    setCode('');
    setRetrievedText('');
    setError('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && code.length === 4) {
      handleAccessText();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Access Text</h1>
        <div className="w-16"></div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 md:p-8 shadow-lg">
        {!retrievedText ? (
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full mb-4">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Enter Access Code</h2>
              <p className="text-gray-600">Enter the 4-digit code to view the shared content</p>
            </div>

            <div className="max-w-md mx-auto">
              <label htmlFor="access-code" className="block text-sm font-medium text-gray-700 mb-2">
                4-digit code
              </label>
              <input
                id="access-code"
                type="text"
                value={code}
                onChange={handleCodeChange}
                onKeyPress={handleKeyPress}
                placeholder="e.g., A9B2"
                className="w-full px-4 py-4 text-center text-2xl font-mono tracking-wider border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                maxLength={4}
              />
              
              {error && (
                <div className="flex items-center space-x-2 mt-3 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <button
              onClick={handleAccessText}
              disabled={code.length !== 4 || isSearching}
              className="w-full max-w-md mx-auto block bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 flex items-center justify-center space-x-2"
            >
              {isSearching ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>Access Text</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Content Found!</h2>
              <p className="text-gray-600">Code: <span className="font-mono font-semibold">{code}</span></p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Shared Content:</h3>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <pre className="whitespace-pre-wrap text-gray-800 text-sm leading-relaxed">
                  {retrievedText}
                </pre>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-xl transition-all duration-200"
            >
              Access Another Code
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccessCode;