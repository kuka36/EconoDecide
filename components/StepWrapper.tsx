
import React from 'react';

interface StepWrapperProps {
  title: string;
  subtitle: string;
  principle: string;
  children: React.ReactNode;
  onNext: () => void;
  onPrev?: () => void;
  isLast?: boolean;
}

const StepWrapper: React.FC<StepWrapperProps> = ({ title, subtitle, principle, children, onNext, onPrev, isLast }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 transition-all duration-300">
      <div className="bg-indigo-600 p-6 text-white">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-200">经济学原理应用</span>
          <span className="px-2 py-1 bg-indigo-500 rounded text-[10px] font-semibold">{principle}</span>
        </div>
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-indigo-100 mt-1 opacity-90">{subtitle}</p>
      </div>
      
      <div className="p-8">
        {children}
      </div>

      <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
        {onPrev ? (
          <button 
            onClick={onPrev}
            className="px-6 py-2.5 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
          >
            ← 返回上一步
          </button>
        ) : <div />}
        
        <button 
          onClick={onNext}
          className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transform active:scale-95 transition-all"
        >
          {isLast ? "生成分析报告 →" : "下一步 →"}
        </button>
      </div>
    </div>
  );
};

export default StepWrapper;
