import React, { useState } from 'react';
import { Copy, Check, ArrowLeft, Share2 } from 'lucide-react';
import { generateCode, storeText } from '../utils/storage';

interface CreateCodeProps {
  onBack: () => void;
}

const CreateCode: React.FC<CreateCodeProps> = ({ onBack }) => {
  const [text, setText] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateCode = () => {
    if (!text.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate processing time for better UX
    setTimeout(() => {
      const code = generateCode();
      storeText(code, text.trim());
      setGeneratedCode(code);
      setIsGenerating(false);
    }, 1000);
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleReset = () => {
    setText('');
    setGeneratedCode('');
    setCopied(false);
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
        <h1 className="text-3xl font-bold text-gray-800">Share Text</h1>
        <div className="w-16"></div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 md:p-8 shadow-lg">
        {!generatedCode ? (
          <div className="space-y-6">
            <div>
              <label htmlFor="text-content" className="block text-sm font-medium text-gray-700 mb-2">
                Enter your text content
              </label>
              <textarea
                id="text-content"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type or paste your text here..."
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
                maxLength={5000}
              />
              <div className="flex justify-between mt-2 text-sm text-gray-500">
                <span>Content will expire in 30 minutes</span>
                <span>{text.length}/5000</span>
              </div>
            </div>

            <button
              onClick={handleGenerateCode}
              disabled={!text.trim() || isGenerating}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 flex items-center justify-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating Code...</span>
                </>
              ) : (
                <>
                  <Share2 className="w-5 h-5" />
                  <span>Generate Code</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-green-500 rounded-full">
              <Check className="w-10 h-10 text-white" />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Code Generated!</h2>
              <p className="text-gray-600 mb-4">Share this code with others to let them access your text:</p>
              
              <div className="bg-gray-50 rounded-xl p-6 mb-4">
                <div className="text-4xl md:text-5xl font-mono font-bold text-gray-800 tracking-wider mb-2">
                  {generatedCode}
                </div>
                <p className="text-sm text-gray-500">4-digit access code</p>
              </div>

              <button
                onClick={handleCopyCode}
                className="inline-flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-xl transition-all duration-200"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-green-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>

            <div className="text-sm text-gray-500 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              ⏰ This code will expire in 30 minutes
            </div>

            <button
              onClick={handleReset}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-xl transition-all duration-200"
            >
              Create Another Code
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateCode;