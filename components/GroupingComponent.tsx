
import React, { useState } from 'react';
import { 
  LayoutGrid, 
  RefreshCcw, 
  User, 
  Settings2,
  ChevronRight,
  ChevronLeft,
  Download
} from 'lucide-react';
import { Participant, Group } from '../types';
import { shuffleArray, downloadGroupsAsCSV } from '../utils';

interface GroupingComponentProps {
  participants: Participant[];
}

const GroupingComponent: React.FC<GroupingComponentProps> = ({ participants }) => {
  const [groupSize, setGroupSize] = useState<number>(4);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [theme, setTheme] = useState("创意小组");

  const handleGroup = async () => {
    if (participants.length === 0) return;
    setIsGenerating(true);

    // Artificial delay for better UX/feedback
    setTimeout(() => {
      try {
        const shuffled: Participant[] = shuffleArray(participants);
        const numGroups = Math.ceil(shuffled.length / groupSize);
        
        const newGroups: Group[] = [];
        for (let i = 0; i < numGroups; i++) {
          newGroups.push({
            id: `group-${i}-${Date.now()}`,
            // Requirement: Only use [Theme] + [Group Number]
            name: `${theme} 第 ${i + 1} 组`,
            members: shuffled.slice(i * groupSize, (i + 1) * groupSize)
          });
        }
        
        setGroups(newGroups);
      } catch (err) {
        console.error(err);
      } finally {
        setIsGenerating(false);
      }
    }, 500);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col md:flex-row items-center gap-8 w-full md:w-auto">
          <div className="space-y-3 w-full md:w-auto">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-indigo-500" />
              每组人数
            </label>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setGroupSize(Math.max(2, groupSize - 1))}
                className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 text-slate-600 transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="w-12 text-center text-xl font-black text-indigo-600">{groupSize}</div>
              <button 
                onClick={() => setGroupSize(Math.min(20, groupSize + 1))}
                className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 text-slate-600 transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="space-y-3 w-full md:w-auto">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-indigo-500" />
              分组命名主体
            </label>
            <div className="relative group">
              <input 
                type="text"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="例如：市场部、雄鹰队..."
                className="w-full md:w-64 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-slate-700"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <button
            onClick={handleGroup}
            disabled={isGenerating || participants.length === 0}
            className="flex-grow md:flex-grow-0 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 flex items-center justify-center gap-3 transition-all transform hover:-translate-y-1 active:translate-y-0"
          >
            {isGenerating ? (
              <>
                <RefreshCcw className="w-5 h-5 animate-spin" />
                生成中...
              </>
            ) : (
              <>
                <LayoutGrid className="w-5 h-5" />
                开始分组
              </>
            )}
          </button>
          
          {groups.length > 0 && (
            <button
              onClick={() => downloadGroupsAsCSV(groups)}
              className="px-4 py-4 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-2xl flex items-center justify-center gap-2 transition-all"
              title="下载 CSV"
            >
              <Download className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {groups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group, idx) => (
            <div 
              key={group.id} 
              className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow group animate-in zoom-in duration-300"
            >
              <div className="bg-indigo-50/50 p-5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-600 text-white text-xs font-black p-2 rounded-lg w-8 h-8 flex items-center justify-center">
                    {idx + 1}
                  </div>
                  <h3 className="font-bold text-slate-800 text-lg line-clamp-1">{group.name}</h3>
                </div>
                <span className="text-xs font-bold text-slate-400 bg-white px-2 py-1 rounded-full border border-slate-100 flex-shrink-0">
                  {group.members.length} 人
                </span>
              </div>
              <div className="p-5 space-y-3">
                {group.members.map((m) => (
                  <div key={m.id} className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 border border-transparent group-hover:bg-indigo-50/20 group-hover:border-indigo-100 transition-all">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-indigo-400 border border-slate-200">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="text-slate-700 font-medium">{m.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 bg-slate-100/50 rounded-3xl border-2 border-dashed border-slate-200">
          <LayoutGrid className="w-16 h-16 text-slate-300 mb-4 opacity-30" />
          <p className="text-slate-400 font-medium text-center px-4">输入每组人数和命名主体，点击“开始分组”生成结果</p>
        </div>
      )}
    </div>
  );
};

export default GroupingComponent;
