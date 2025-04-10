import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Calendar, MessageSquare, History } from 'lucide-react';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { HistoryView } from './components/HistoryView';
import { useStore } from './store/useStore';
import { Message, DailyEntry } from './types';
import { v4 as uuidv4 } from 'uuid';

// サンプルデータを型付きで定義
const sampleEntries: DailyEntry[] = [
  {
    id: uuidv4(),
    userId: 'user123',
    date: new Date().toISOString(),
    morningAnswers: null,
    eveningAnswers: null,
    messages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function App() {
  const [showHistory, setShowHistory] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { currentEntry, entries, setCurrentEntry, addEntry, updateEntry } = useStore();

  useEffect(() => {
    if (entries.length === 0) {
      sampleEntries.forEach(entry => addEntry(entry));
    }
    if (!currentEntry && entries.length > 0) {
      setCurrentEntry(entries[0]);
    }
  }, [currentEntry, entries.length, addEntry, setCurrentEntry]);

  const handleSendMessage = async (content: string) => {
    if (!currentEntry) return;

    const userMessage: Message = {
      id: uuidv4(),
      content,
      role: 'user',
      timestamp: new Date().toISOString(),
    };

    const updatedEntry = {
      ...currentEntry,
      messages: [...currentEntry.messages, userMessage],
    };
    updateEntry(updatedEntry);

    setIsLoading(true);
    
    // Simulate assistant response after delay
    setTimeout(() => {
      const assistantMessage: Message = {
        id: uuidv4(),
        content: 'ご質問ありがとうございます。どのようにお手伝いできますか？',
        role: 'assistant',
        timestamp: new Date().toISOString(),
      };

      const entryWithAssistantResponse = {
        ...updatedEntry,
        messages: [...updatedEntry.messages, assistantMessage],
      };
      updateEntry(entryWithAssistantResponse);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen">
      <header className="glass-effect">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                Dairy Coaching AI Agent
              </h1>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  showHistory
                    ? 'ai-gradient-bg text-white'
                    : 'glass-effect text-blue-400 hover:text-purple-400'
                }`}
              >
                {showHistory ? (
                  <MessageSquare className="w-5 h-5" />
                ) : (
                  <History className="w-5 h-5" />
                )}
              </button>
            </div>
            <div className="flex items-center space-x-4 text-blue-300">
              <Calendar className="w-6 h-6" />
              <span>{format(new Date(), 'yyyy年MM月dd日')}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {showHistory ? (
          <HistoryView entries={entries} />
        ) : (
          <div className="gradient-border glass-effect min-h-[600px] flex flex-col">
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              {currentEntry?.messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isLoading && (
                <div className="flex justify-center items-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                </div>
              )}
            </div>
            <div className="relative z-10">
              <ChatInput onSend={handleSendMessage} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;