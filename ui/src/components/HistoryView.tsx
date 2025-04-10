import React, { useEffect, useState } from 'react';
import { format, parseISO, startOfDay } from 'date-fns';
import { MessageCircle, ChevronRight, Loader2 } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Supabaseクライアントの初期化
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface CoachingRecord {
  id: number;
  date: string;
  type: 'goal' | 'reflection';  // typeの型を明示的に定義
  question: string;
  answer: string;
  created_at: string;
  updated_at: string;
}

interface DailySummary {
  date: string;
  morningGoals: CoachingRecord[];    // 朝の目標設定（type: goal）
  eveningReflections: CoachingRecord[];  // 夜の振り返り（type: reflection）
  totalRecords: number;
}

export const HistoryView: React.FC = () => {
  const [summaries, setSummaries] = useState<DailySummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const { data, error } = await supabase
          .from('coaching_records')
          .select('*')
          .order('date', { ascending: false });

        if (error) throw error;

        // 日付ごとにレコードをグループ化
        const groupedRecords = data.reduce<Record<string, CoachingRecord[]>>((acc, record) => {
          const dateKey = startOfDay(parseISO(record.date)).toISOString();
          if (!acc[dateKey]) {
            acc[dateKey] = [];
          }
          acc[dateKey].push(record);
          return acc;
        }, {});

        // サマリーを作成
        const dailySummaries = Object.entries(groupedRecords).map(([date, records]): DailySummary => ({
          date,
          morningGoals: records.filter(record => record.type === 'goal'),
          eveningReflections: records.filter(record => record.type === 'reflection'),
          totalRecords: records.length
        }));

        setSummaries(dailySummaries);
      } catch (err) {
        setError(err instanceof Error ? err.message : '履歴の取得に失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntries();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-400 text-center py-8 glass-effect rounded-lg p-4">
        <p>エラーが発生しました</p>
        <p className="text-sm mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {summaries.map((summary) => (
        <div key={summary.date} className="relative p-[1px] rounded-lg bg-gradient-to-r from-blue-400 to-purple-500">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-30 blur-xl"></div>
          <div className="relative glass-effect rounded-lg overflow-hidden">
            <div className="border-b border-gray-800 px-6 py-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-blue-300">
                  {format(parseISO(summary.date), 'yyyy年MM月dd日')}
                </h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-purple-300">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm">{summary.totalRecords}件の記録</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className={`rounded-lg p-3 ${
                  summary.morningGoals.length > 0
                    ? 'bg-blue-500/10 text-blue-300' 
                    : 'bg-gray-800/50 text-gray-400'
                }`}>
                  <h4 className="text-sm font-medium mb-1">朝の目標設定</h4>
                  <p className="text-xs">
                    {summary.morningGoals.length > 0 
                      ? `${summary.morningGoals.length}件の記録` 
                      : '記録なし'}
                  </p>
                </div>
                <div className={`rounded-lg p-3 ${
                  summary.eveningReflections.length > 0
                    ? 'bg-purple-500/10 text-purple-300' 
                    : 'bg-gray-800/50 text-gray-400'
                }`}>
                  <h4 className="text-sm font-medium mb-1">夜の振り返り</h4>
                  <p className="text-xs">
                    {summary.eveningReflections.length > 0 
                      ? `${summary.eveningReflections.length}件の記録` 
                      : '記録なし'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-3 border-t border-gray-800">
              <button 
                className="w-full flex items-center justify-center space-x-2 text-blue-400 hover:text-purple-400 transition-colors"
                onClick={() => {/* TODO: 詳細表示の実装 */}}
              >
                <span className="text-sm font-medium">詳細を見る</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}