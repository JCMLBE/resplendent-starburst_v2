
import React, { useState } from 'react';
import { SendIcon } from './icons';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-800/50 backdrop-blur-sm border-t border-gray-700">
      <div className="relative">
        <input
          type="text"
          className="w-full bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-full py-3 pl-5 pr-14 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          placeholder={isLoading ? 'Aan het denken...' : 'Stel een vraag...'}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white rounded-full p-2.5 transition duration-200"
          aria-label="Verstuur bericht"
        >
          <SendIcon />
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
