import React, { useState, useCallback, useEffect } from 'react';
import type { ChatMessage } from './types';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';
import { ResetIcon } from './components/icons';

const App: React.FC = () => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Dit effect initialiseert de chat bij de eerste keer laden.
  useEffect(() => {
    setChatHistory([
      { role: 'model', content: 'Hallo! Waarmee kan ik je helpen? Wat zou je willen weten over Orbinite?' }
    ]);
    setIsInitialized(true);
  }, []);

  const handleSendMessage = useCallback(async (message: string) => {
    if (isLoading || !isInitialized) return;

    const userMessage: ChatMessage = { role: 'user', content: message };
    const newChatHistory = [...chatHistory, userMessage];
    setChatHistory(newChatHistory);
    setIsLoading(true);
    setError(null);

    try {
      // Stuur de hele chatgeschiedenis naar onze veilige backend-functie
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ history: newChatHistory }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const modelResponse: ChatMessage = { role: 'model', content: data.text };
      setChatHistory(prev => [...prev, modelResponse]);

    } catch (e: any) {
      console.error("Fout bij het communiceren met de backend:", e);
      const errorMessage = `Sorry, er is iets misgegaan: ${e.message}`;
      setError(errorMessage);
      setChatHistory(prev => [...prev, { role: 'model', content: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  }, [chatHistory, isLoading, isInitialized]);

  const resetChat = () => {
    setChatHistory([
      { role: 'model', content: 'Hallo! Waarmee kan ik je helpen? Wat zou je willen weten over Orbinite?' }
    ]);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 font-sans" style={{ background: 'transparent' }}>
      <div className="w-full h-[95vh] max-w-4xl flex flex-col bg-white backdrop-blur-xl rounded-2xl border border-[#00e0d4] overflow-hidden">
        <header className="flex items-center justify-between p-4 bg-white border-b border-[#00e0d4]">
          <h1 className="text-xl font-bold text-[#00e0d4]">ORBINITE® AI</h1>
          <button
            onClick={resetChat}
            className="flex items-center gap-2 text-sm text-[#00e0d4] hover:text-[#00c9be] bg-[#00e0d4]/10 hover:bg-[#00e0d4]/20 px-3 py-1.5 rounded-lg transition-colors border border-[#00e0d4]"
            title="Start een nieuwe chat"
          >
            <ResetIcon />
            Reset
          </button>
        </header>
        {error && <div className="p-4 bg-red-500/50 text-white text-center">{error}</div>}
        <ChatWindow messages={chatHistory} isLoading={isLoading} />
        <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading || !isInitialized} />
      </div>
    </div>
  );
};

export default App;
