
import React, { useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { BotIcon, UserIcon } from './icons';

interface MessageBubbleProps {
  message: ChatMessage;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
    const isUser = message.role === 'user';
    const bubbleClasses = isUser
        ? 'bg-highlight text-white self-end'
        : 'bg-gray-700 text-gray-200 self-start';
    
    const containerClasses = isUser
        ? 'flex justify-end items-start gap-3'
        : 'flex justify-start items-start gap-3';

    const content = message.content.split('\n').map((line, index) => (
        <React.Fragment key={index}>
            {line}
            <br />
        </React.Fragment>
    ));

    return (
        <div className={containerClasses}>
            {!isUser && <BotIcon />}
            <div className={`max-w-xl lg:max-w-2xl px-4 py-3 rounded-2xl ${bubbleClasses} shadow-md`}>
                <p className="text-sm md:text-base whitespace-pre-wrap">{content}</p>
            </div>
            {isUser && <UserIcon />}
        </div>
    );
};


interface ChatWindowProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div ref={scrollRef} className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6">
      {messages.map((msg, index) => (
        <MessageBubble key={index} message={msg} />
      ))}
      {isLoading && (
        <div className="flex justify-start items-start gap-3">
          <BotIcon />
          <div className="bg-gray-700 text-gray-200 self-start max-w-sm px-4 py-3 rounded-2xl flex items-center">
            <div className="animate-pulse flex space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
