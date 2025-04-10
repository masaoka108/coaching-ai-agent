import React, { useState, KeyboardEvent } from 'react';
import { Send } from 'lucide-react';

interface Props {
  onSend: (message: string) => void;
}

export const ChatInput: React.FC<Props> = ({ onSend }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex gap-2 p-4 border-t border-gray-600 bg-slate-900">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="メッセージを入力..."
        className="w-full flex-1 resize-none rounded-lg bg-slate-800 text-white p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-600 placeholder-slate-400"
        rows={1}
        style={{ minHeight: '44px' }}
        autoComplete="off"
        spellCheck="false"
      />
      <button
        onClick={handleSend}
        disabled={!message.trim()}
        className="px-4 py-2 ai-gradient-bg text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center"
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
  );
}