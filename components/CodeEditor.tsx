
import React, { useState } from 'react';
import { Problem, SubmissionStatus } from '../types';
import { Button } from './Button';

interface CodeEditorProps {
  problem: Problem;
  onClose: () => void;
  onSubmit: (status: SubmissionStatus, code: string, marks: number) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ problem, onClose, onSubmit }) => {
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [testResult, setTestResult] = useState<{success: boolean, message: string} | null>(null);

  const getLanguageHeader = () => {
    const config: Record<string, { label: string, color: string, bg: string }> = {
      python: { label: 'Python 3.12 Engine', color: 'text-blue-600', bg: 'bg-blue-50' },
      java: { label: 'Java 21 Runtime', color: 'text-orange-600', bg: 'bg-orange-50' },
      cpp: { label: 'C++ G++ Compiler', color: 'text-indigo-600', bg: 'bg-indigo-50' }
    };
    return config[language] || config.python;
  };

  const header = getLanguageHeader();

  const handleSimulateSubmit = () => {
    setIsEvaluating(true);
    setTestResult(null);

    setTimeout(() => {
      const isCorrect = code.length > 10; 
      if (isCorrect) {
        setTestResult({ success: true, message: 'All test cases passed! (3/3)' });
        setTimeout(() => {
          onSubmit(SubmissionStatus.COMPLETED, code, 10);
        }, 1200);
      } else {
        setTestResult({ success: false, message: 'Failed at Test Case 1: Check your logic.' });
        setIsEvaluating(false);
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4 sm:p-8">
      <div className="bg-white rounded-[2.5rem] w-full max-w-6xl h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-bold text-xl">
               {problem.title.charAt(0)}
             </div>
             <div>
               <h2 className="text-xl font-bold text-slate-900">{problem.title}</h2>
               <div className="flex items-center gap-2">
                 <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md">ID: {problem.id}</span>
                 <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                    problem.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-600' :
                    problem.difficulty === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                 }`}>Difficulty: {problem.difficulty}</span>
               </div>
             </div>
          </div>
          <button onClick={onClose} className="bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 p-3 rounded-full transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Left: Problem Details */}
          <div className="w-80 p-8 border-r border-slate-100 overflow-y-auto bg-slate-50/30">
            <div className="mb-8">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Goal</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">{problem.description}</p>
            </div>
            
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Sample Data</h3>
            <div className="space-y-4">
              {problem.testCases.map((tc, idx) => (
                <div key={idx} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-xs font-mono group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase">Input</span>
                    <span className="text-slate-900">{tc.input}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-50 pt-2">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase">Output</span>
                    <span className="text-emerald-600 font-bold">{tc.expectedOutput}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: White Editor Area */}
          <div className="flex-1 flex flex-col bg-white">
            {/* Language Selection & Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-slate-50">
              <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border border-slate-100 ${header.bg}`}>
                <div className={`w-2 h-2 rounded-full animate-pulse bg-current ${header.color}`}></div>
                <span className={`text-xs font-bold uppercase tracking-wide ${header.color}`}>{header.label}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-slate-400 font-medium">Select Language:</span>
                <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-white border border-slate-200 text-slate-700 text-sm px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                >
                  <option value="python">Python 3</option>
                  <option value="java">Java 21</option>
                  <option value="cpp">C++ 17</option>
                </select>
              </div>
            </div>
            
            <div className="flex-1 relative">
               <textarea
                className="absolute inset-0 w-full h-full bg-white text-slate-800 font-mono p-8 resize-none outline-none text-base border-none leading-relaxed placeholder:text-slate-300"
                placeholder="// Start coding your solution here..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>

            {/* Evaluation Console */}
            {testResult && (
              <div className={`mx-6 mb-4 p-5 rounded-2xl border ${testResult.success ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
                <div className="flex items-center gap-3">
                   <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${testResult.success ? 'bg-emerald-200' : 'bg-red-200'}`}>
                     {testResult.success ? '✓' : '✗'}
                   </div>
                   <p className="text-sm font-bold">{testResult.message}</p>
                </div>
              </div>
            )}

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <p className="text-xs text-slate-400 font-medium italic">Autosave is enabled. Submit when you are ready.</p>
              <div className="flex items-center gap-3">
                <Button variant="ghost" onClick={onClose} className="text-slate-500 font-bold">
                  Exit
                </Button>
                <Button 
                  onClick={handleSimulateSubmit} 
                  disabled={isEvaluating || !code.trim()}
                  className="min-w-[160px] shadow-lg shadow-indigo-100"
                >
                  {isEvaluating ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Validating...
                    </span>
                  ) : 'Verify & Submit'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
