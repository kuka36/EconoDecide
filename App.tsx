
import React, { useState, useCallback } from 'react';
import { DecisionState, Option, Principle, AIAdvice } from './types';
import StepWrapper from './components/StepWrapper';
import { analyzeDecision } from './services/geminiService';

const initialDecision: DecisionState = {
  title: "",
  description: "",
  options: [{ id: '1', label: '', benefits: [''], costs: [''] }],
  opportunityCost: "",
  marginalAnalysis: {
    action: "",
    currentLevel: 0,
    marginalBenefit: "",
    marginalCost: ""
  },
  incentives: [""]
};

const App: React.FC = () => {
  const [step, setStep] = useState(0);
  const [decision, setDecision] = useState<DecisionState>(initialDecision);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<AIAdvice | null>(null);

  const handleNext = async () => {
    if (step === 4) {
      setLoading(true);
      try {
        const result = await analyzeDecision(decision);
        setReport(result);
        setStep(5);
      } catch (err) {
        alert("分析生成失败，请检查网络或 API Key。");
      } finally {
        setLoading(false);
      }
    } else {
      setStep(prev => prev + 1);
    }
  };

  const handlePrev = () => setStep(prev => prev - 1);

  const updateOption = (index: number, field: keyof Option, value: any) => {
    const newOptions = [...decision.options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setDecision({ ...decision, options: newOptions });
  };

  const addOption = () => {
    setDecision({
      ...decision,
      options: [...decision.options, { id: Date.now().toString(), label: '', benefits: [''], costs: [''] }]
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-6"></div>
        <h2 className="text-xl font-bold text-slate-800">正在应用经济学模型进行深度分析...</h2>
        <p className="text-slate-500 mt-2">理性思维需要一点时间，请稍候</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
          Econo<span className="text-indigo-600">Decide</span>
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          基于曼昆《经济学原理》的理性决策辅助系统
        </p>
      </div>

      {/* Progress Bar */}
      {step <= 4 && (
        <div className="max-w-4xl mx-auto mb-10">
          <div className="relative h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-indigo-600 transition-all duration-500"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span>定义场景</span>
            <span>权衡取舍</span>
            <span>机会成本</span>
            <span>边际分析</span>
            <span>激励因素</span>
          </div>
        </div>
      )}

      {/* Steps */}
      {step === 0 && (
        <StepWrapper 
          title="你想解决什么问题？" 
          subtitle="首先，让我们明确你的决策背景。没有免费的午餐，任何决定都有代价。"
          principle={Principle.TRADE_OFFS}
          onNext={handleNext}
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">决策主题</label>
              <input 
                type="text" 
                placeholder="例如：我是否应该辞职去读 MBA？"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                value={decision.title}
                onChange={e => setDecision({...decision, title: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">详细描述 (背景信息)</label>
              <textarea 
                rows={4}
                placeholder="提供一些背景，帮助模型理解你的现状、偏好和目标..."
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                value={decision.description}
                onChange={e => setDecision({...decision, description: e.target.value})}
              />
            </div>
          </div>
        </StepWrapper>
      )}

      {step === 1 && (
        <StepWrapper 
          title="人们面临权衡取舍" 
          subtitle="为了得到一件喜爱的东西，通常不得不放弃另一件。请列出你的候选方案。"
          principle={Principle.TRADE_OFFS}
          onPrev={handlePrev}
          onNext={handleNext}
        >
          <div className="space-y-8">
            {decision.options.map((opt, idx) => (
              <div key={opt.id} className="p-5 bg-indigo-50 rounded-xl border border-indigo-100">
                <div className="mb-4">
                  <label className="text-xs font-bold text-indigo-600 uppercase">方案 {idx + 1}</label>
                  <input 
                    type="text"
                    placeholder="方案名称"
                    className="w-full mt-1 px-3 py-2 bg-white border border-indigo-200 rounded-md outline-none"
                    value={opt.label}
                    onChange={e => updateOption(idx, 'label', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-500">潜在收益 (Benefits)</label>
                    <textarea 
                      className="w-full mt-1 p-2 text-sm bg-white border border-indigo-100 rounded"
                      placeholder="每行一个收益..."
                      value={opt.benefits.join('\n')}
                      onChange={e => updateOption(idx, 'benefits', e.target.value.split('\n'))}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500">潜在代价 (Costs)</label>
                    <textarea 
                      className="w-full mt-1 p-2 text-sm bg-white border border-indigo-100 rounded"
                      placeholder="每行一个代价..."
                      value={opt.costs.join('\n')}
                      onChange={e => updateOption(idx, 'costs', e.target.value.split('\n'))}
                    />
                  </div>
                </div>
              </div>
            ))}
            <button 
              onClick={addOption}
              className="w-full py-3 border-2 border-dashed border-indigo-200 rounded-xl text-indigo-500 font-semibold hover:bg-indigo-50 transition-colors"
            >
              + 添加候选方案
            </button>
          </div>
        </StepWrapper>
      )}

      {step === 2 && (
        <StepWrapper 
          title="何为机会成本？" 
          subtitle="决策不仅要看可见的成本，更要考虑为了得到 A 而必须放弃的 B 的价值。"
          principle={Principle.OPPORTUNITY_COST}
          onPrev={handlePrev}
          onNext={handleNext}
        >
          <div className="space-y-6">
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg text-amber-800 text-sm">
              <p className="font-bold mb-1">提示：</p>
              如果你选择目前最倾向的方案，你必须牺牲掉的最具吸引力的替代品是什么？它的价值（时间、金钱、情绪等）如何衡量？
            </div>
            <textarea 
              rows={6}
              placeholder="例如：如果我去读书，我将放弃两年的薪水（约 50 万）以及在当前公司的晋升机会..."
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={decision.opportunityCost}
              onChange={e => setDecision({...decision, opportunityCost: e.target.value})}
            />
          </div>
        </StepWrapper>
      )}

      {step === 3 && (
        <StepWrapper 
          title="理性人考虑边际量" 
          subtitle="生活中的决策很少是‘全或无’。试着分析‘再多做一点’的价值。"
          principle={Principle.MARGINAL_THINKING}
          onPrev={handlePrev}
          onNext={handleNext}
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">分析的具体动作</label>
              <input 
                type="text" 
                placeholder="例如：每天多投入 1 小时学习"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                value={decision.marginalAnalysis.action}
                onChange={e => setDecision({
                  ...decision, 
                  marginalAnalysis: {...decision.marginalAnalysis, action: e.target.value}
                })}
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-green-700 mb-2">边际收益 (MB)</label>
                <textarea 
                  rows={3}
                  placeholder="这个额外动作带来的增量好处..."
                  className="w-full px-4 py-2 border border-green-200 rounded-lg focus:ring-green-500"
                  value={decision.marginalAnalysis.marginalBenefit}
                  onChange={e => setDecision({
                    ...decision, 
                    marginalAnalysis: {...decision.marginalAnalysis, marginalBenefit: e.target.value}
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-red-700 mb-2">边际成本 (MC)</label>
                <textarea 
                  rows={3}
                  placeholder="这个额外动作产生的增量代价..."
                  className="w-full px-4 py-2 border border-red-200 rounded-lg focus:ring-red-500"
                  value={decision.marginalAnalysis.marginalCost}
                  onChange={e => setDecision({
                    ...decision, 
                    marginalAnalysis: {...decision.marginalAnalysis, marginalCost: e.target.value}
                  })}
                />
              </div>
            </div>
          </div>
        </StepWrapper>
      )}

      {step === 4 && (
        <StepWrapper 
          title="人们对激励做出反应" 
          subtitle="哪些外部因素（奖金、税收、舆论）或内在动力（成就感、恐惧）在影响你？"
          principle={Principle.INCENTIVES}
          onPrev={handlePrev}
          onNext={handleNext}
          isLast
        >
          <div className="space-y-4">
            {decision.incentives.map((inc, idx) => (
              <input 
                key={idx}
                type="text"
                placeholder={`激励因素 ${idx + 1} (例如：父母的期望、当前的低利率...)`}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg"
                value={inc}
                onChange={e => {
                  const newInc = [...decision.incentives];
                  newInc[idx] = e.target.value;
                  setDecision({...decision, incentives: newInc});
                }}
              />
            ))}
            <button 
              onClick={() => setDecision({...decision, incentives: [...decision.incentives, '']})}
              className="text-sm font-semibold text-indigo-600 hover:underline"
            >
              + 添加更多影响因素
            </button>
          </div>
        </StepWrapper>
      )}

      {/* Analysis Report */}
      {step === 5 && report && (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-700 p-10 text-white text-center">
              <div className="inline-block px-4 py-1 bg-white/20 rounded-full text-sm font-bold backdrop-blur-md mb-4 uppercase tracking-tighter">
                Rationality Score
              </div>
              <div className="text-7xl font-black mb-2">{report.score}</div>
              <h2 className="text-2xl font-bold opacity-90">{decision.title}</h2>
              <p className="mt-4 text-indigo-100 max-w-2xl mx-auto italic">
                “理性的人通过比较边际收益与边际成本来做出决策。” —— N. 曼昆
              </p>
            </div>

            <div className="p-10 space-y-10">
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">决策逻辑总结</h3>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl text-slate-700 leading-relaxed border border-slate-100">
                  {report.summary}
                </div>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-rose-100 rounded-lg text-rose-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">经济学批判 (盲点分析)</h3>
                </div>
                <div className="bg-rose-50 p-6 rounded-2xl text-slate-700 leading-relaxed border border-rose-100">
                  {report.critique}
                </div>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">最终行动建议</h3>
                </div>
                <div className="bg-emerald-50 p-6 rounded-2xl text-slate-800 font-medium leading-relaxed border border-emerald-100">
                  {report.recommendation}
                </div>
              </section>
            </div>

            <div className="px-10 py-8 bg-slate-50 border-t border-slate-100 flex justify-center">
              <button 
                onClick={() => {
                  setStep(0);
                  setDecision(initialDecision);
                  setReport(null);
                }}
                className="px-10 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl transform active:scale-95"
              >
                重置并开始新决策
              </button>
            </div>
          </div>
          
          <p className="text-center text-slate-400 text-sm pb-12">
            注：本工具仅作为辅助思考工具，不构成任何投资或人生建议。
          </p>
        </div>
      )}
    </div>
  );
};

export default App;
