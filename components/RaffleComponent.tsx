
import React, { useState, useEffect, useRef } from 'react';
import { Gift, RotateCw, Trophy, AlertCircle, Repeat, UserMinus, Sparkles, Type as TypeIcon, ChevronUp, ChevronDown } from 'lucide-react';
import { Participant } from '../types';
import { shuffleArray } from '../utils';
import { generateWinnerCongratulation } from '../geminiService';

interface RaffleComponentProps {
  participants: Participant[];
}

const RaffleComponent: React.FC<RaffleComponentProps> = ({ participants }) => {
  const [allowRepeat, setAllowRepeat] = useState(false);
  const [remainingPool, setRemainingPool] = useState<Participant[]>(participants);
  const [isRolling, setIsRolling] = useState(false);
  const [currentRollingName, setCurrentRollingName] = useState<string | null>(null);
  const [winner, setWinner] = useState<Participant | null>(null);
  const [history, setHistory] = useState<Participant[]>([]);
  const [aiMessage, setAiMessage] = useState<string>('');
  
  // Customization States
  const [isAiMode, setIsAiMode] = useState(false);
  const [congratsText, setCongratsText] = useState<string>('恭喜 {name}！你是今天的幸运锦鲤！');
  const [showSettings, setShowSettings] = useState(true);
  
  const rollingInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setRemainingPool(participants);
  }, [participants]);

  const startDraw = async () => {
    if (remainingPool.length === 0) return;
    
    setIsRolling(true);
    setWinner(null);
    setAiMessage('');
    
    let counter = 0;
    const maxIterations = 30;
    const interval = 80;

    rollingInterval.current = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * remainingPool.length);
      setCurrentRollingName(remainingPool[randomIndex].name);
      counter++;

      if (counter >= maxIterations) {
        if (rollingInterval.current) clearInterval(rollingInterval.current);
        finishDraw();
      }
    }, interval);
  };

  const finishDraw = async () => {
    const shuffled: Participant[] = shuffleArray(remainingPool);
    const chosen = shuffled[0];
    
    if (!chosen) {
      setIsRolling(false);
      return;
    }
    
    setWinner(chosen);
    setHistory(prev => [chosen, ...prev]);
    setIsRolling(false);
    
    if (!allowRepeat) {
      setRemainingPool(prev => prev.filter(p => p.id !== chosen.id));
    }

    if (isAiMode) {
      const msg = await generateWinnerCongratulation(chosen.name, congratsText);
      setAiMessage(msg);
    } else {
      const msg = congratsText.replace(/{name}/g, chosen.name);
      setAiMessage(msg);
    }
  };

  const resetRaffle = () => {
    setRemainingPool(participants);
    setHistory([]);
    setWinner(null);
    setAiMessage('');
  };

  if (participants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <AlertCircle className="w-16 h-16 mb-4 opacity-20" />
        <p className="text-lg">请先在“名单”页面添加参与者</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden relative">
        
        {/* Toggle Settings Button - Replaced Icon with Text */}
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className={`absolute top-6 right-6 px-4 py-2 rounded-xl text-xs font-bold transition-all z-20 flex items-center gap-2 shadow-sm ${showSettings ? 'bg-indigo-600 text-white shadow-indigo-100' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
        >
          台词设定
          {showSettings ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        {/* Raffle Area */}
        <div className="p-8 md:p-12 text-center bg-indigo-50/50">
          <div className="mb-8">
            <h2 className="text-3xl font-black text-slate-800 flex items-center justify-center gap-3">
              <Gift className="text-indigo-600 w-10 h-10" />
              幸运大抽奖
            </h2>
            <p className="text-slate-500 mt-2">祝大家好运！</p>
          </div>

          <div className="relative h-64 flex flex-col items-center justify-center">
            {isRolling ? (
              <div className="animate-bounce">
                <span className="text-6xl md:text-8xl font-black text-indigo-600 transition-all duration-75">
                  {currentRollingName}
                </span>
              </div>
            ) : winner ? (
              <div className="flex flex-col items-center animate-in zoom-in duration-300">
                <Trophy className="w-16 h-16 text-yellow-500 mb-4 animate-bounce" />
                <span className="text-6xl md:text-8xl font-black text-indigo-700">
                  {winner.name}
                </span>
                <p className="mt-6 text-xl font-medium text-slate-600 bg-white px-8 py-4 rounded-2xl shadow-md border border-indigo-100 max-w-2xl leading-relaxed">
                  {aiMessage || '中奖啦！🎉'}
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center text-slate-300">
                <Gift className="w-32 h-32 opacity-10 mb-4" />
                <p className="text-xl italic">准备好开始了吗？</p>
              </div>
            )}
          </div>

          {/* Configuration Controls (Toggleable) */}
          <div className={`mt-12 flex flex-col space-y-4 transition-all duration-300 overflow-hidden ${showSettings ? 'max-h-96 opacity-100 scale-100' : 'max-h-0 opacity-0 scale-95 pointer-events-none'}`}>
            <div className="flex flex-col md:flex-row items-center justify-center gap-3">
              {/* Vibe/Template Toggle */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-2xl shadow-sm border border-slate-200">
                <button
                  onClick={() => setIsAiMode(false)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${!isAiMode ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <TypeIcon className="w-3.5 h-3.5" />
                  固定模板
                </button>
                <button
                  onClick={() => setIsAiMode(true)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${isAiMode ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  AI 智能模式
                </button>
              </div>

              {/* Input Field */}
              <div className="flex items-center gap-2 bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex-grow max-w-md w-full">
                <input 
                  type="text" 
                  value={congratsText}
                  onChange={(e) => setCongratsText(e.target.value)}
                  placeholder={isAiMode ? "输入生成风格 (如: 夸张、幽默)" : "输入模板 (使用 {name} 代替姓名)"}
                  className="bg-transparent border-none outline-none text-sm font-medium text-slate-700 w-full px-2"
                />
              </div>
            </div>
            
            <div className="h-px bg-slate-200 w-full max-w-lg mx-auto opacity-50"></div>
          </div>

          {/* Main Action Buttons */}
          <div className={`${showSettings ? 'mt-4' : 'mt-12'} flex flex-col md:flex-row items-center justify-center gap-6 transition-all duration-300`}>
            <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
              <button
                onClick={() => setAllowRepeat(!allowRepeat)}
                disabled={isRolling}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  allowRepeat 
                    ? 'bg-amber-100 text-amber-700' 
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {allowRepeat ? <Repeat className="w-4 h-4" /> : <UserMinus className="w-4 h-4" />}
                {allowRepeat ? '允许重复' : '不重复'}
              </button>
            </div>

            <button
              onClick={startDraw}
              disabled={isRolling || remainingPool.length === 0}
              className="px-12 py-5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white text-2xl font-black rounded-3xl shadow-lg shadow-indigo-200 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3"
            >
              {isRolling ? (
                <>
                  <RotateCw className="w-8 h-8 animate-spin" />
                  抽奖中...
                </>
              ) : (
                '立即开奖'
              )}
            </button>

            <button
              onClick={resetRaffle}
              disabled={isRolling}
              className="p-4 text-slate-400 hover:text-indigo-600 transition-colors"
              title="重置抽奖"
            >
              <RotateCw className="w-6 h-6" />
            </button>
          </div>
          
          <p className="mt-6 text-sm text-slate-400">
            剩余池: <span className="font-bold text-slate-600">{remainingPool.length}</span> 人
          </p>
        </div>

        {/* History Area */}
        {history.length > 0 && (
          <div className="p-8 border-t border-slate-100 bg-white">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              中奖记录
            </h3>
            <div className="flex flex-wrap gap-3">
              {history.map((h, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl animate-in slide-in-from-left-2 duration-300">
                  <span className="text-xs font-bold text-indigo-400">#{history.length - idx}</span>
                  <span className="font-semibold text-slate-700">{h.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RaffleComponent;
