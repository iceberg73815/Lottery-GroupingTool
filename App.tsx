
import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Gift, 
  Plus, 
  LayoutGrid, 
  UserPlus,
  Upload,
  Trash2,
  CopyCheck,
  Zap,
  Check,
  X
} from 'lucide-react';
import { Participant, AppView } from './types';
import { parseTextList, parseCSV, getMockData } from './utils';
import RaffleComponent from './components/RaffleComponent';
import GroupingComponent from './components/GroupingComponent';

const App: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [view, setView] = useState<AppView>('input');
  const [inputText, setInputText] = useState('');
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);

  // Detect duplicates for visualization
  const duplicateNames = useMemo(() => {
    const counts: Record<string, number> = {};
    participants.forEach(p => {
      counts[p.name] = (counts[p.name] || 0) + 1;
    });
    return new Set(Object.keys(counts).filter(name => counts[name] > 1));
  }, [participants]);

  const handleAddParticipants = (namesSource?: string[]) => {
    const names = namesSource || parseTextList(inputText);
    const newParticipants: Participant[] = names.map(name => ({
      id: `${Math.random().toString(36).substr(2, 9)}-${Date.now()}`,
      name,
    }));
    setParticipants(prev => [...prev, ...newParticipants]);
    if (!namesSource) setInputText('');
    setIsConfirmingClear(false);
  };

  const loadMockData = () => {
    // Add some deliberate duplicates to mock data to show functionality
    const mock = getMockData();
    const mockWithDups = [...mock, mock[0]]; // Add one duplicate
    handleAddParticipants(mockWithDups);
  };

  const removeDuplicates = () => {
    const seen = new Set();
    const unique = participants.filter(p => {
      if (seen.has(p.name)) return false;
      seen.add(p.name);
      return true;
    });
    setParticipants(unique);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const names = parseCSV(text);
      handleAddParticipants(names);
    };
    reader.readAsText(file);
    e.target.value = ''; 
  };

  const confirmClearAll = () => {
    setParticipants([]);
    setIsConfirmingClear(false);
  };

  const removeParticipant = (id: string) => {
    setParticipants(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Users className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">抽奖和分组工具</h1>
          </div>
          <nav className="flex space-x-1 p-1 bg-slate-100 rounded-xl">
            {[
              { id: 'input', label: '名单', icon: UserPlus },
              { id: 'raffle', label: '抽奖', icon: Gift },
              { id: 'grouping', label: '分组', icon: LayoutGrid },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id as AppView)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  view === item.id 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-grow max-w-6xl mx-auto w-full px-4 py-8">
        {view === 'input' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2 text-slate-800">
                      <UserPlus className="w-5 h-5 text-indigo-600" />
                      添加名单
                    </h2>
                    <button 
                      onClick={loadMockData}
                      className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-all flex items-center gap-1"
                    >
                      <Zap className="w-3 h-3" />
                      载入示例名单
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-slate-700">批量粘贴 (一行一个名字)</label>
                      <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="张三&#10;李四&#10;王五..."
                        className="w-full h-48 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none font-mono text-sm"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAddParticipants()}
                        disabled={!inputText.trim()}
                        className="flex-grow bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-medium py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
                      >
                        <Plus className="w-5 h-5" />
                        加入列表
                      </button>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-slate-200"></span>
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-slate-400 font-medium">或</span>
                      </div>
                    </div>

                    <div>
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-2xl hover:border-indigo-400 hover:bg-indigo-50 transition-all cursor-pointer group">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 text-slate-400 group-hover:text-indigo-500 mb-2" />
                          <p className="text-sm text-slate-600">
                            <span className="font-semibold">点击上传 CSV</span>
                          </p>
                        </div>
                        <input type="file" className="hidden" accept=".csv,.txt" onChange={handleFileUpload} />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[600px]">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2 text-slate-800">
                    <Users className="w-5 h-5 text-indigo-600" />
                    当前名单 ({participants.length})
                  </h2>
                  <div className="flex gap-2 items-center">
                    {duplicateNames.size > 0 && !isConfirmingClear && (
                      <button 
                        onClick={removeDuplicates}
                        className="text-amber-600 hover:text-amber-700 p-1 bg-amber-50 hover:bg-amber-100 rounded-lg transition-all flex items-center gap-1 px-2 text-xs font-bold"
                        title="一键清除重复项"
                      >
                        <CopyCheck className="w-4 h-4" />
                        清除重复
                      </button>
                    )}
                    
                    {participants.length > 0 && (
                      <div className="flex items-center">
                        {isConfirmingClear ? (
                          <div className="flex items-center gap-1 animate-in slide-in-from-right-2 duration-200">
                            <button 
                              onClick={confirmClearAll}
                              className="text-white bg-red-500 hover:bg-red-600 px-2 py-1 rounded text-xs font-bold flex items-center gap-1"
                            >
                              <Check className="w-3 h-3" />
                              确定清空?
                            </button>
                            <button 
                              onClick={() => setIsConfirmingClear(false)}
                              className="text-slate-500 bg-slate-100 hover:bg-slate-200 p-1 rounded"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => setIsConfirmingClear(true)}
                            className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-lg transition-all"
                            title="清空所有"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex-grow overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                  {participants.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm italic">
                      <Users className="w-12 h-12 mb-2 opacity-10" />
                      暂时还没有人哦
                    </div>
                  ) : (
                    participants.map((p) => {
                      const isDup = duplicateNames.has(p.name);
                      return (
                        <div key={p.id} className={`group flex items-center justify-between p-3 rounded-xl border transition-all ${isDup ? 'bg-red-50/50 border-red-200' : 'bg-slate-50 border-transparent hover:border-slate-200 hover:bg-white'}`}>
                          <div className="flex items-center gap-3 overflow-hidden">
                            <span className="font-medium text-slate-700 truncate">{p.name}</span>
                            {isDup && (
                              <span className="flex-shrink-0 text-[10px] font-black uppercase bg-red-100 text-red-600 px-1.5 py-0.5 rounded leading-none">
                                重复
                              </span>
                            )}
                          </div>
                          <button 
                            onClick={() => removeParticipant(p.id)}
                            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>

                {participants.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setView('raffle')}
                      className="flex items-center justify-center gap-2 bg-indigo-50 text-indigo-600 font-semibold py-2.5 rounded-xl hover:bg-indigo-100 transition-all"
                    >
                      <Gift className="w-4 h-4" />
                      前往抽奖
                    </button>
                    <button
                      onClick={() => setView('grouping')}
                      className="flex items-center justify-center gap-2 bg-indigo-50 text-indigo-600 font-semibold py-2.5 rounded-xl hover:bg-indigo-100 transition-all"
                    >
                      <LayoutGrid className="w-4 h-4" />
                      前往分组
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {view === 'raffle' && <RaffleComponent participants={participants} />}
        {view === 'grouping' && <GroupingComponent participants={participants} />}
      </main>

      <footer className="bg-white border-t border-slate-200 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} 抽奖和分组工具 - Professional Event Management Tool
        </div>
      </footer>
    </div>
  );
};

export default App;