
import React, { useState } from 'react';
import { Button } from './Button';

export const Playground: React.FC = () => {
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const languages = [
    { id: 'python', name: 'Python', icon: '🐍', default: 'print("Hello, Codeflix!")' },
    { id: 'java', name: 'Java', icon: '☕', default: 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, Codeflix!");\n  }\n}' },
    { id: 'cpp', name: 'C++', icon: '⚙️', default: '#include <iostream>\nusing namespace std;\n\nint main() {\n  cout << "Hello, Codeflix!" << endl;\n  return 0;\n}' },
    { id: 'c', name: 'C', icon: '💎', default: '#include <stdio.h>\n\nint main() {\n  printf("Hello, Codeflix!\\n");\n  return 0;\n}' },
    { id: 'sql', name: 'SQL', icon: '📊', default: 'SELECT * FROM users WHERE role = "student";' }
  ];

  const handleRun = () => {
    setIsRunning(true);
    setOutput(null);
    
    // Simulate execution
    setTimeout(() => {
      setIsRunning(false);
      if (language === 'sql') {
        setOutput('Query executed successfully.\nRows returned: 120\nExecution time: 45ms');
      } else {
        setOutput(`[Execution Output]\nHello, Codeflix!\n\nProgram finished with exit code 0.`);
      }
    }, 1000);
  };

  const handleLanguageChange = (langId: string) => {
    setLanguage(langId);
    const lang = languages.find(l => l.id === langId);
    if (lang) setCode(lang.default);
  };

  return (
    <div className="space-y-8 animate-fade-in-scale">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Coding Playground</h2>
          <p className="text-slate-500 font-medium">Experiment with different languages and practice your logic.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
          {languages.map(lang => (
            <button
              key={lang.id}
              onClick={() => handleLanguageChange(lang.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                language === lang.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <span>{lang.icon}</span>
              <span className="hidden sm:inline">{lang.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px]">
        {/* Editor Area */}
        <div className="lg:col-span-2 flex flex-col bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden">
          <div className="px-8 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
              <span className="ml-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Main.{language === 'cpp' ? 'cpp' : language === 'java' ? 'java' : language}</span>
            </div>
            <Button 
              size="sm" 
              onClick={handleRun} 
              disabled={isRunning || !code.trim()}
              className="px-6 rounded-xl shadow-md shadow-indigo-100"
            >
              {isRunning ? 'Running...' : 'Run Code'}
            </Button>
          </div>
          <div className="flex-1 relative">
            <textarea
              className="absolute inset-0 w-full h-full p-8 font-mono text-base bg-white text-slate-800 resize-none outline-none leading-relaxed"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Write your code here..."
            />
          </div>
        </div>

        {/* Output Area */}
        <div className="flex flex-col bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden">
          <div className="px-8 py-4 border-b border-white/5 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Output Console</span>
            <button onClick={() => setOutput(null)} className="text-slate-500 hover:text-white text-xs font-bold transition-colors">Clear</button>
          </div>
          <div className="flex-1 p-8 font-mono text-sm overflow-y-auto">
            {isRunning ? (
              <div className="flex items-center gap-3 text-indigo-400 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                <span>Executing program...</span>
              </div>
            ) : output ? (
              <pre className="text-emerald-400 whitespace-pre-wrap leading-relaxed">{output}</pre>
            ) : (
              <p className="text-slate-600 italic">No output yet. Run your code to see results.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
