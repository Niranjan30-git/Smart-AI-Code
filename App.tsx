
import React, { useState, useEffect, useMemo } from 'react';
import { User, UserRole, Problem, Submission, SubmissionStatus, DailyStats, PerformanceCategory, Badge } from './types';
import { login, logout, getCurrentUser, initDb, getSubmissions, addSubmission, getUsers, incrementAccess, register } from './services/mockDb';
import { PROBLEMS, APP_CONFIG, MOTIVATIONAL_QUOTES, TEACHER_MOTIVATIONAL_QUOTES } from './constants';
import { Navbar } from './components/Navbar';
import { Button } from './components/Button';
import { CountdownTimer } from './components/CountdownTimer';
import { CodeEditor } from './components/CodeEditor';
import { Playground } from './components/Playground';
import { Profile } from './components/Profile';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';

// --- CONSTANTS ---

const BADGES: Badge[] = [
  { id: 'b1', name: 'First Step', description: 'Complete your first coding challenge', icon: '🌱', criteria: '1 completion', isUnlocked: false },
  { id: 'b2', name: 'Code Warrior', description: 'Complete 5 coding challenges', icon: '⚔️', criteria: '5 completions', isUnlocked: false },
  { id: 'b3', name: 'Logic Master', description: 'Maintain an Excellent category', icon: '🧠', criteria: 'Category: Excellent', isUnlocked: false },
  { id: 'b4', name: 'Consistent Coder', description: 'Complete tasks 3 days in a row', icon: '🔥', criteria: '3 day streak', isUnlocked: false },
  { id: 'b5', name: 'Speed Demon', description: 'Solve a problem in record time', icon: '⚡', criteria: 'Fast submission', isUnlocked: false },
  { id: 'b6', name: 'Architecture Ace', description: 'Solve a Hard difficulty problem', icon: '🏰', criteria: '1 Hard completion', isUnlocked: false },
];

// --- COMPONENTS ---

const ProgressRing: React.FC<{ value: number, size?: number, stroke?: number }> = ({ value, size = 120, stroke = 10 }) => {
    const radius = (size / 2) - (stroke * 2);
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (value / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center">
            <svg width={size} height={size} className="transform -rotate-90">
                <circle
                    className="text-slate-100"
                    strokeWidth={stroke}
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                <circle
                    className="text-indigo-600 transition-all duration-1000 ease-out"
                    strokeWidth={stroke}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-slate-800">{value}%</span>
            </div>
        </div>
    );
};

// --- LOGIN VIEW ---
const LoginView: React.FC<{ onLogin: (email: string) => void }> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.USER);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      let user;
      if (isRegistering) {
        user = await register(email, name, role);
      } else {
        user = await login(email);
      }

      if (user) {
        if (user.role === UserRole.USER) {
          const canAccess = await incrementAccess(user.id);
          if (!canAccess) {
             setError(`Daily limit reached (${APP_CONFIG.MAX_DAILY_ACCESS}/3 logins). Please return tomorrow.`);
             setIsSubmitting(false);
             return;
          }
        }
        onLogin(email);
      } else {
        setError(isRegistering ? 'Registration failed. Email might already exist.' : 'Account not found. Please use a registered @gmail.com account.');
        setIsSubmitting(false);
      }
    } catch (err) {
      setError('Connection failed. Please check your internet or try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col md:flex-row relative overflow-hidden selection:bg-indigo-500/30 selection:text-white">
      {/* Visual Side - Hidden on small screens */}
      <div className="hidden md:flex md:w-1/2 bg-[#0f0f0f] relative items-center justify-center p-12 overflow-hidden border-r border-white/5">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#4f46e5_0%,transparent_50%)] blur-[100px]"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,#9333ea_0%,transparent_50%)] blur-[100px]"></div>
        </div>
        
        <div className="relative z-10 max-w-lg">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-8 shadow-2xl shadow-indigo-500/20">
            <span className="text-white font-black text-3xl">C</span>
          </div>
          <h2 className="text-6xl font-bold text-white tracking-tighter leading-[0.9] mb-6">
            ELEVATE <br />
            <span className="text-indigo-500">YOUR CODE</span> <br />
            EVERY DAY.
          </h2>
          <p className="text-slate-400 text-lg font-medium max-w-md leading-relaxed">
            Join the elite circle of engineers mastering logic, algorithms, and architecture through daily deliberate practice.
          </p>
          
          <div className="mt-12 flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0f0f0f] bg-slate-800 flex items-center justify-center overflow-hidden">
                  <img src={`https://picsum.photos/seed/user${i}/40/40`} alt="User" referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>
            <p className="text-slate-500 text-sm font-semibold">
              <span className="text-white">1,200+</span> engineers active today
            </p>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full pointer-events-none"></div>
      </div>

      {/* Form Side */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 bg-[#0a0a0a]">
        <div className="w-full max-w-md animate-fade-in-scale">
          <div className="md:hidden text-center mb-12">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-indigo-500/20">
              <span className="text-white font-black text-3xl">C</span>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Codeflix</h1>
          </div>

          <div className="mb-10">
            <h3 className="text-2xl font-bold text-white mb-2">{isRegistering ? 'Create Account' : 'Welcome back'}</h3>
            <p className="text-slate-500 font-medium">{isRegistering ? 'Join the elite coding community.' : 'Enter your credentials to access your workspace.'}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegistering && (
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] px-1">Full Name</label>
                <input 
                  type="text" 
                  required 
                  className="w-full px-5 py-4 rounded-xl bg-[#151515] border border-white/5 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all font-medium" 
                  placeholder="John Doe" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                />
              </div>
            )}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] px-1">Professional Email</label>
              <input 
                type="email" 
                required 
                className="w-full px-5 py-4 rounded-xl bg-[#151515] border border-white/5 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all font-medium" 
                placeholder="name@gmail.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
            {isRegistering && (
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] px-1">Account Type</label>
                <select 
                  className="w-full px-5 py-4 rounded-xl bg-[#151515] border border-white/5 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all font-medium"
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                >
                  <option value={UserRole.USER}>Student</option>
                  <option value={UserRole.ADMIN}>Administrator</option>
                </select>
              </div>
            )}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] px-1">Secure Key</label>
              <input 
                type="password" 
                required 
                className="w-full px-5 py-4 rounded-xl bg-[#151515] border border-white/5 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all font-medium" 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>
            {error && <div className="bg-red-500/10 text-red-400 text-xs font-bold p-4 rounded-xl border border-red-500/20 animate-slide-in-right">{error}</div>}
            <Button type="submit" fullWidth size="lg" className="py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-base font-bold transition-all active:scale-[0.98]" disabled={isSubmitting}>
              {isSubmitting ? (isRegistering ? 'Registering...' : 'Authenticating...') : (isRegistering ? 'Create Account' : 'Enter Workspace')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-indigo-500 text-sm font-bold hover:text-indigo-400 transition-colors"
            >
              {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
            </button>
          </div>

          <div className="mt-10 pt-10 border-t border-white/5">
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] mb-4 text-center">Quick Access Profiles</p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => {setEmail('admin@gmail.com'); setPassword('password');}} className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#151515] hover:bg-[#1a1a1a] border border-white/5 transition-all group">
                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                <span className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors">Admin</span>
              </button>
              <button onClick={() => {setEmail('student1@gmail.com'); setPassword('password');}} className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#151515] hover:bg-[#1a1a1a] border border-white/5 transition-all group">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors">Student</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- USER DASHBOARD ---
const UserDashboard: React.FC<{ user: User }> = ({ user: initialUser }) => {
  const [user, setUser] = useState(initialUser);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [activeProblem, setActiveProblem] = useState<Problem | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'challenges' | 'analysis' | 'achievements' | 'playground' | 'profile'>('overview');
  const [encouragement, setEncouragement] = useState<{show: boolean, msg: string, emoji: string}>({show: false, msg: '', emoji: ''});
  const [emailNotif, setEmailNotif] = useState<{show: boolean}>({show: false});
  const [quote] = useState(() => MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);

  useEffect(() => {
    const fetchData = async () => {
      const allSubmissions = await getSubmissions();
      setSubmissions(allSubmissions.filter(s => s.userId === user.id));
    };
    fetchData();
  }, [user.id]);

  const dailyProblems = useMemo(() => {
    // Simple rotation logic based on date
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const startIndex = (dayOfYear * APP_CONFIG.DAILY_TASK_COUNT) % PROBLEMS.length;
    const selected = [];
    for (let i = 0; i < APP_CONFIG.DAILY_TASK_COUNT; i++) {
      selected.push(PROBLEMS[(startIndex + i) % PROBLEMS.length]);
    }
    return selected;
  }, []);

  const stats: DailyStats = useMemo(() => {
      const completed = submissions.filter(s => 
        s.status === SubmissionStatus.COMPLETED && 
        dailyProblems.some(p => p.id === s.problemId)
      ).length;
      return {
        totalTasks: APP_CONFIG.DAILY_TASK_COUNT,
        completedTasks: completed,
        remainingTasks: APP_CONFIG.DAILY_TASK_COUNT - completed,
        marks: submissions.filter(s => dailyProblems.some(p => p.id === s.problemId)).reduce((sum, s) => sum + s.marks, 0),
        productivity: (completed / APP_CONFIG.DAILY_TASK_COUNT) * 100
      };
  }, [submissions, dailyProblems]);

  const unlockedBadges = useMemo(() => {
    return BADGES.map(badge => {
      let isUnlocked = false;
      const completedCount = submissions.filter(s => s.status === SubmissionStatus.COMPLETED).length;
      
      if (badge.id === 'b1' && completedCount >= 1) isUnlocked = true;
      if (badge.id === 'b2' && completedCount >= 5) isUnlocked = true;
      if (badge.id === 'b3' && user.category === PerformanceCategory.EXCELLENT) isUnlocked = true;
      if (badge.id === 'b4' && completedCount >= 3) isUnlocked = true; 
      if (badge.id === 'b6') {
        const hardSolved = submissions.some(s => {
          const p = PROBLEMS.find(prob => prob.id === s.problemId);
          return p?.difficulty === 'Hard' && s.status === SubmissionStatus.COMPLETED;
        });
        if (hardSolved) isUnlocked = true;
      }
      
      return { ...badge, isUnlocked };
    });
  }, [submissions, user.category]);

  const chartData = useMemo(() => {
    return [
      { name: 'Mon', score: Math.floor(stats.marks * 0.4) },
      { name: 'Tue', score: Math.floor(stats.marks * 0.6) },
      { name: 'Wed', score: Math.floor(stats.marks * 0.5) },
      { name: 'Thu', score: Math.floor(stats.marks * 0.8) },
      { name: 'Fri', score: stats.marks },
    ];
  }, [stats.marks]);

  const difficultyData = useMemo(() => {
    const completed = submissions.filter(s => s.status === SubmissionStatus.COMPLETED);
    const counts = { Easy: 0, Medium: 0, Hard: 0 };
    completed.forEach(s => {
      const p = PROBLEMS.find(prob => prob.id === s.problemId);
      if (p) counts[p.difficulty]++;
    });
    return [
      { name: 'Easy', value: counts.Easy, color: '#10b981' },
      { name: 'Medium', value: counts.Medium, color: '#f59e0b' },
      { name: 'Hard', value: counts.Hard, color: '#ef4444' },
    ].filter(d => d.value > 0);
  }, [submissions]);

  const handleSolveSubmit = async (status: SubmissionStatus, code: string, marks: number) => {
    if (!activeProblem) return;
    const newSub: Submission = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      problemId: activeProblem.id,
      language: 'python',
      status,
      marks,
      code,
      timestamp: new Date().toISOString(),
      attempts: 0 // Will be set by mockDb
    };
    
    const result = await addSubmission(newSub);
    
    if (!result.success) {
      alert(result.message);
      return;
    }

    setSubmissions(prev => {
        const existingIndex = prev.findIndex(s => s.problemId === activeProblem.id);
        const currentSub = prev.find(s => s.problemId === activeProblem.id);
        const updatedSub = { ...newSub, attempts: (currentSub?.attempts || 0) + 1 };
        
        if (existingIndex > -1) {
            const updated = [...prev];
            updated[existingIndex] = updatedSub;
            return updated;
        }
        return [...prev, updatedSub];
    });
    setActiveProblem(null);

    if (status === SubmissionStatus.COMPLETED) {
      const nextCompletedCount = stats.completedTasks + 1;
      const msgs = ["Level Up!", "Brilliant Mind!", "Code Warrior!", "Logic Master!", "Ultimate Achiever!"];
      const emojis = ["🚀", "🔥", "⚔️", "🧠", "👑"];

      setEncouragement({ 
          show: true, 
          msg: msgs[nextCompletedCount - 1] || "Amazing!", 
          emoji: emojis[nextCompletedCount - 1] || "🌟" 
      });
      setEmailNotif({ show: true });
      
      setTimeout(() => setEncouragement(prev => ({ ...prev, show: false })), 3500);
      setTimeout(() => setEmailNotif({ show: false }), 5000);
    }
  };

  const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return "Rise & Code,";
      if (hour < 18) return "Keep Grinding,";
      return "Final Push,";
  };

  if (activeProblem) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <Button variant="ghost" onClick={() => setActiveProblem(null)} className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Back to Challenges
          </Button>
          <div className="text-right">
            <h2 className="text-2xl font-black text-slate-900">{activeProblem.title}</h2>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">{activeProblem.moduleName} • {activeProblem.difficulty}</p>
          </div>
        </div>
        <CodeEditor problem={activeProblem} onSubmit={handleSolveSubmit} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-10 animate-fade-in-scale">
      
      {/* Overlays */}
      {encouragement.show && (
        <div className="fixed inset-0 flex items-center justify-center z-[300] bg-slate-900/40 backdrop-blur-md transition-all">
          <div className="glass p-12 rounded-[4rem] text-center shadow-2xl border border-white/40 animate-bounce-in flex flex-col items-center max-w-sm w-full mx-4 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-2 shimmer opacity-30"></div>
            <div className="w-24 h-24 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-[2.5rem] flex items-center justify-center text-6xl mb-6 shadow-xl shadow-indigo-200">
              {encouragement.emoji}
            </div>
            <h3 className="text-4xl font-black text-slate-900 mb-2 tracking-tight uppercase leading-tight">{encouragement.msg}</h3>
            <p className="text-indigo-600 font-bold text-lg mb-6">Task {stats.completedTasks + 1} Cleared!</p>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
               <div 
                 className="bg-indigo-600 h-full transition-all duration-1000 ease-out" 
                 style={{ width: `${((stats.completedTasks + 1) / 5) * 100}%` }}
               ></div>
            </div>
          </div>
        </div>
      )}

      {emailNotif.show && (
        <div className="fixed top-24 right-6 z-[400] animate-slide-in-right">
          <div className="glass border-l-4 border-emerald-500 shadow-2xl rounded-[2rem] p-5 flex items-center gap-4 max-w-sm border border-white/60">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0 shadow-inner">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20,4H4C2.9,4,2,4.9,2,6v12c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V6C22,4.9,21.1,4,20,4z M20,8l-8,5L4,8V6l8,5l8-5V8z"/>
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-1">Email Synced</p>
              <p className="text-xs text-slate-500 font-medium">Activity report dispatched to {user.email}</p>
            </div>
            <button onClick={() => setEmailNotif({show: false})} className="text-slate-300 hover:text-slate-500 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2.5" strokeLinecap="round"/></svg>
            </button>
          </div>
        </div>
      )}

      {/* Hero Header Section */}
      <section className="relative overflow-hidden rounded-[3.5rem] bg-slate-900 text-white p-10 lg:p-14 shadow-2xl shadow-indigo-100 border border-slate-800">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[100px] -mr-40 -mt-40"></div>
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[80px] -ml-40 -mb-40"></div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-8 space-y-6">
                <div className="space-y-2">
                    <span className="inline-block px-4 py-1.5 bg-indigo-500/20 text-indigo-300 rounded-full font-bold text-xs uppercase tracking-[0.2em] border border-indigo-500/30">
                        {user.category} Member
                    </span>
                    <h2 className="text-5xl lg:text-7xl font-black tracking-tighter leading-none">
                        {getGreeting()}<br/>
                        <span className="text-indigo-400">{user.name.split(' ')[0]}</span>
                    </h2>
                </div>
                <div className="max-w-xl">
                    <p className="text-slate-400 text-lg leading-relaxed font-medium italic">
                        "{quote}"
                    </p>
                </div>
                
                {/* Tab Switcher */}
                <div className="flex flex-wrap gap-2 mt-8">
                  {[
                    { id: 'overview', label: 'Overview', icon: '📊' },
                    { id: 'challenges', label: 'Challenges', icon: '💻' },
                    { id: 'playground', label: 'Playground', icon: '🎮' },
                    { id: 'analysis', label: 'Analysis', icon: '📈' },
                    { id: 'achievements', label: 'Badges', icon: '🏆' },
                    { id: 'profile', label: 'Profile', icon: '👤' },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 ${
                        activeTab === tab.id 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                        : 'bg-white/5 text-slate-400 hover:bg-white/10'
                      }`}
                    >
                      <span>{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </div>
            </div>
            <div className="lg:col-span-4 flex justify-center lg:justify-end">
                <div className="glass-dark p-8 rounded-[3rem] shadow-2xl flex flex-col items-center group hover:scale-105 transition-transform duration-500">
                    <ProgressRing value={stats.productivity} size={160} stroke={12} />
                    <div className="mt-6 text-center">
                        <p className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-1">Daily Mastery</p>
                        <p className="text-lg font-bold">{stats.completedTasks} / 5 Modules</p>
                    </div>
                </div>
            </div>
          </div>
      </section>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-10 animate-fade-in-scale">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Completed', value: stats.completedTasks, suffix: 'Tasks', color: 'text-emerald-500', icon: '✨' },
              { label: 'Remaining', value: stats.remainingTasks, suffix: 'Tasks', color: 'text-amber-500', icon: '⏳' },
              { label: 'Total Score', value: stats.marks, suffix: 'pts', color: 'text-indigo-500', icon: '⚡' },
              { label: 'Daily Streak', value: 4, suffix: 'Days', color: 'text-orange-500', icon: '🔥' },
            ].map((item, idx) => (
              <div key={idx} className="glass p-8 rounded-[2.5rem] border border-white/60 shadow-sm flex items-center justify-between group hover:shadow-xl transition-all duration-500">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{item.label}</p>
                  <div className="flex items-baseline gap-1">
                      <h4 className={`text-3xl font-black ${item.color}`}>{item.value}</h4>
                      <span className="text-xs font-bold text-slate-400">{item.suffix}</span>
                  </div>
                </div>
                <div className="text-3xl grayscale group-hover:grayscale-0 transition-all transform group-hover:scale-125 duration-300">
                  {item.icon}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 glass p-10 rounded-[3rem] border border-white/60">
              <h3 className="text-2xl font-black mb-8">Performance Trend</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600, fill: '#94a3b8'}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600, fill: '#94a3b8'}} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorScore)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="glass p-10 rounded-[3rem] border border-white/60 flex flex-col items-center justify-center">
              <h3 className="text-2xl font-black mb-8 text-center">Skill Distribution</h3>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={difficultyData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {difficultyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex gap-4 mt-4">
                {difficultyData.map((d, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></div>
                    <span className="text-xs font-bold text-slate-500">{d.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'challenges' && (
        <div className="space-y-8 animate-fade-in-scale">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
            <div className="space-y-1">
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">Daily Learning Path</h3>
              <p className="text-slate-500 font-medium">Progressive algorithms designed for your skill level.</p>
            </div>
            <CountdownTimer />
          </div>

          <div className="grid grid-cols-1 gap-6">
              {dailyProblems.map((problem, index) => {
              const sub = submissions.find(s => s.problemId === problem.id);
              const isCompleted = sub?.status === SubmissionStatus.COMPLETED;
              
              return (
                  <div 
                      key={problem.id} 
                      className={`group relative overflow-hidden rounded-[3rem] border transition-all duration-500 ${
                          isCompleted 
                          ? 'bg-emerald-50/20 border-emerald-100 hover:shadow-emerald-100/50' 
                          : 'bg-white border-slate-100 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-100/30'
                      }`}
                  >
                      <div className="p-10 flex flex-col lg:flex-row items-center gap-10">
                          <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center font-black text-3xl shrink-0 shadow-lg ${
                              isCompleted ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors'
                          }`}>
                              {index + 1}
                          </div>
                          <div className="flex-1 text-center lg:text-left space-y-3">
                              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-3">
                                  <span className="text-[11px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">{problem.moduleName}</span>
                                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">{problem.level}</span>
                                  <span className="text-[11px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">{problem.concept}</span>
                                  <span className="text-[11px] font-black text-red-400 uppercase tracking-widest bg-red-50/50 px-3 py-1 rounded-full flex items-center gap-1">
                                      <div className="w-1 h-1 rounded-full bg-red-400 animate-pulse"></div>
                                      Ends in 24h
                                  </span>
                              </div>
                              <h4 className="text-3xl font-black text-slate-900 tracking-tight">{problem.title}</h4>
                              <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-2xl">{problem.description}</p>
                              <div className="flex items-center gap-4 mt-2">
                                <span className={`text-[10px] font-bold uppercase tracking-widest ${5 - (sub?.attempts || 0) <= 1 ? 'text-red-500' : 'text-slate-400'}`}>
                                  Attempts Remaining: {5 - (sub?.attempts || 0)} / 5
                                </span>
                              </div>
                          </div>
                          <div className="shrink-0 w-full lg:w-auto">
                              {isCompleted ? (
                              <div className="flex flex-col items-center animate-fade-in-scale">
                                  <div className="flex items-center justify-center gap-3 text-emerald-600 font-black px-10 py-4 bg-emerald-100/40 rounded-3xl border border-emerald-200/50">
                                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                                      LEVEL CLEARED
                                  </div>
                                  <span className="mt-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mastered at {new Date(sub.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                              </div>
                              ) : (
                              <Button 
                                  size="lg" 
                                  className="w-full lg:w-auto px-16 py-5 rounded-[2rem] font-black shadow-xl shadow-indigo-100 transform active:scale-95 transition-all text-lg" 
                                  onClick={() => setActiveProblem(problem)}
                              >
                                  {sub ? 'Resume Module' : 'Initiate Module'}
                              </Button>
                              )}
                          </div>
                      </div>
                      {isCompleted && (
                          <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden pointer-events-none">
                              <div className="absolute top-0 right-0 w-full h-full bg-emerald-500 rotate-45 translate-x-12 -translate-y-12"></div>
                          </div>
                      )}
                  </div>
              );
              })}
          </div>
        </div>
      )}

      {activeTab === 'analysis' && (
        <div className="space-y-10 animate-fade-in-scale">
          <div className="space-y-1">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">Work Analysis</h3>
            <p className="text-slate-500 font-medium">Deep dive into your coding patterns and progress.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass p-10 rounded-[3rem] border border-white/60">
              <h3 className="text-xl font-black mb-6">Weekly Progress</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600, fill: '#94a3b8'}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600, fill: '#94a3b8'}} />
                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                    <Bar dataKey="score" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="glass p-10 rounded-[3rem] border border-white/60">
              <h3 className="text-xl font-black mb-6">Completion Velocity</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600, fill: '#94a3b8'}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600, fill: '#94a3b8'}} />
                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                    <Line type="stepAfter" dataKey="score" stroke="#a855f7" strokeWidth={4} dot={{ r: 6, fill: '#a855f7', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="glass p-10 rounded-[3rem] border border-white/60">
            <h3 className="text-xl font-black mb-8">Detailed Breakdown</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Challenge</th>
                    <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Difficulty</th>
                    <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Score</th>
                    <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {PROBLEMS.map(p => {
                    const sub = submissions.find(s => s.problemId === p.id);
                    return (
                      <tr key={p.id} className="group hover:bg-slate-50 transition-colors">
                        <td className="py-4 font-bold text-slate-900">{p.title}</td>
                        <td className="py-4">
                          <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${
                            p.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-600' : 
                            p.difficulty === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                          }`}>{p.difficulty}</span>
                        </td>
                        <td className="py-4">
                          <span className={`text-xs font-bold ${sub?.status === SubmissionStatus.COMPLETED ? 'text-emerald-500' : 'text-slate-400'}`}>
                            {sub?.status || 'Not Started'}
                          </span>
                        </td>
                        <td className="py-4 font-mono font-bold text-slate-700">{sub?.marks || 0}/10</td>
                        <td className="py-4 text-xs text-slate-400 font-medium">
                          {sub ? new Date(sub.timestamp).toLocaleDateString() : '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'achievements' && (
        <div className="space-y-10 animate-fade-in-scale">
          <div className="space-y-1">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">Achievements & Badges</h3>
            <p className="text-slate-500 font-medium">Unlock unique badges as you master your engineering skills.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {unlockedBadges.map(badge => (
              <div 
                key={badge.id} 
                className={`relative overflow-hidden p-8 rounded-[3rem] border transition-all duration-500 ${
                  badge.isUnlocked 
                  ? 'bg-white border-indigo-100 shadow-xl shadow-indigo-100/20' 
                  : 'bg-slate-50 border-slate-100 opacity-60 grayscale'
                }`}
              >
                {!badge.isUnlocked && (
                  <div className="absolute top-6 right-6">
                    <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                )}
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl mb-6 ${
                  badge.isUnlocked ? 'bg-indigo-50 shadow-inner' : 'bg-slate-200'
                }`}>
                  {badge.icon}
                </div>
                <h4 className={`text-xl font-black mb-2 ${badge.isUnlocked ? 'text-slate-900' : 'text-slate-400'}`}>{badge.name}</h4>
                <p className="text-sm text-slate-500 font-medium mb-6">{badge.description}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">
                    {badge.criteria}
                  </span>
                  {badge.isUnlocked && (
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                      Unlocked
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'playground' && <Playground />}
      {activeTab === 'profile' && <Profile user={user} onUpdate={setUser} />}

    </div>
  );
};

// --- ADMIN DASHBOARD ---
const AdminDashboard: React.FC<{ user: User }> = ({ user: initialUser }) => {
  const [user, setUser] = useState(initialUser);
  const [students, setStudents] = useState<User[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'profile'>('dashboard');
  const [quote] = useState(() => TEACHER_MOTIVATIONAL_QUOTES[Math.floor(Math.random() * TEACHER_MOTIVATIONAL_QUOTES.length)]);

  useEffect(() => {
    const fetchData = async () => {
      const allUsers = await getUsers();
      setStudents(allUsers.filter(u => u.role === UserRole.USER));
      const allSubmissions = await getSubmissions();
      setSubmissions(allSubmissions);
    };
    fetchData();
  }, []);

  const getStats = (studentId: string) => {
    const sSubs = submissions.filter(s => s.userId === studentId && s.status === SubmissionStatus.COMPLETED);
    return { 
        completed: sSubs.length, 
        marks: sSubs.reduce((sum, s) => sum + s.marks, 0),
        lastSub: sSubs.length > 0 ? sSubs[sSubs.length-1].timestamp : null
    };
  };

  const cats = [
    { type: PerformanceCategory.EXCELLENT, title: 'Elite Vanguard', color: 'text-purple-600', bg: 'from-purple-50 to-indigo-50/30', badge: 'bg-purple-100 text-purple-700', icon: '🏆', range: '80% - 100%' },
    { type: PerformanceCategory.GOOD, title: 'Growth Core', color: 'text-emerald-600', bg: 'from-emerald-50 to-teal-50/30', badge: 'bg-emerald-100 text-emerald-700', icon: '⭐', range: '40% - 79%' },
    { type: PerformanceCategory.MODERATE, title: 'Priority Intervention', color: 'text-red-600', bg: 'from-red-50 to-rose-50/30', badge: 'bg-red-100 text-red-700', icon: '⚠️', range: '< 40%' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-12 animate-fade-in-scale">
      
      {/* Admin Tab Switcher */}
      <div className="flex gap-4">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`px-8 py-3 rounded-2xl font-bold text-sm transition-all ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'}`}
        >
          Dashboard Overview
        </button>
        <button 
          onClick={() => setActiveTab('profile')}
          className={`px-8 py-3 rounded-2xl font-bold text-sm transition-all ${activeTab === 'profile' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'}`}
        >
          My Admin Profile
        </button>
      </div>

      {activeTab === 'dashboard' && (
        <>
          {/* Admin Header Overview */}
          <section className="space-y-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                <div>
                    <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-none mb-3">Oversight Command</h2>
                    <p className="text-slate-500 font-medium text-lg">Centralized intelligence for all 120 student engineering tracks.</p>
                    <div className="mt-4 p-4 bg-indigo-50/50 border-l-4 border-indigo-500 rounded-r-2xl max-w-2xl">
                        <p className="text-indigo-700 font-bold italic text-sm">"{quote}"</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-4 w-full lg:w-auto">
                    <div className="glass flex-1 lg:flex-initial px-8 py-4 rounded-[2rem] border border-white/60 shadow-sm">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Fleet Avg Mastery</p>
                        <p className="text-2xl font-black text-indigo-600">68%</p>
                    </div>
                    <div className="glass flex-1 lg:flex-initial px-8 py-4 rounded-[2rem] border border-white/60 shadow-sm">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Real-time Sessions</p>
                        <p className="text-2xl font-black text-emerald-600">84 / 120</p>
                    </div>
                    <Button className="rounded-full px-8 bg-slate-900 hover:bg-black font-bold h-fit self-end">Generate Analytics Report</Button>
                </div>
            </div>
          </section>

          {/* Performance Categories Sections */}
          <div className="space-y-16">
            {cats.map((cat) => {
              const sInCat = students.filter(s => s.category === cat.type);
              return (
                <div key={cat.type} className="group">
                   <div className={`rounded-[3.5rem] bg-gradient-to-r ${cat.bg} border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500`}>
                      
                      {/* Category Header */}
                      <div className="px-10 py-8 border-b border-white/40 flex flex-col md:flex-row items-center justify-between gap-6">
                         <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-white rounded-3xl shadow-lg flex items-center justify-center text-3xl transform group-hover:rotate-6 transition-transform">
                                {cat.icon}
                            </div>
                            <div>
                               <div className="flex items-center gap-3">
                                    <h3 className={`text-3xl font-black tracking-tight ${cat.color}`}>{cat.title}</h3>
                                    <span className={`px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-widest ${cat.badge}`}>{cat.range}</span>
                               </div>
                               <p className="text-slate-500 font-bold text-sm tracking-tight mt-1">
                                   Tracking {sInCat.length} specialized engineers
                               </p>
                            </div>
                         </div>
                         <div className="flex gap-3">
                             <div className="bg-white/60 backdrop-blur px-5 py-2 rounded-2xl border border-white/80 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                 Category Density: {Math.round((sInCat.length / 120) * 100)}%
                             </div>
                         </div>
                      </div>

                      {/* Enhanced Data Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                           <thead>
                              <tr className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                                 <th className="px-12 py-6">Student Identity</th>
                                 <th className="px-10 py-6 text-center">Mastery Progress</th>
                                 <th className="px-10 py-6 text-center">Points (Daily)</th>
                                 <th className="px-10 py-6 text-center">Session Health</th>
                                 <th className="px-12 py-6 text-right">Actions</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-100/50">
                              {sInCat.length === 0 ? (
                                  <tr><td colSpan={5} className="p-20 text-center text-slate-300 font-bold italic tracking-wide">No active students in this classification tier currently.</td></tr>
                              ) : sInCat.map(student => {
                                const s = getStats(student.id);
                                return (
                                  <tr key={student.id} className="hover:bg-white/40 transition-all group/row">
                                     <td className="px-12 py-7">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-400 text-xs">
                                                {student.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <div className="font-black text-slate-900 group-hover/row:text-indigo-600 transition-colors">{student.name}</div>
                                                <div className="text-[10px] text-slate-400 font-bold tracking-tight">{student.email}</div>
                                            </div>
                                        </div>
                                     </td>
                                     <td className="px-10 py-7 text-center">
                                        <div className="inline-flex flex-col items-center gap-2">
                                           <div className="flex gap-1.5">
                                               {[1,2,3,4,5].map(i => (
                                                   <div 
                                                       key={i} 
                                                       className={`w-4 h-2 rounded-full transition-all duration-500 ${
                                                           i <= s.completed ? 'bg-indigo-500' : 'bg-slate-200'
                                                       }`}
                                                   ></div>
                                               ))}
                                           </div>
                                           <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{s.completed} / 5 Modules Clear</span>
                                        </div>
                                     </td>
                                     <td className="px-10 py-7 text-center">
                                        <div className="inline-flex items-center justify-center min-w-[50px] h-12 glass rounded-2xl border border-white shadow-inner">
                                           <span className="font-black text-slate-800 text-lg">{s.marks}</span>
                                        </div>
                                     </td>
                                     <td className="px-10 py-7 text-center">
                                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl font-black text-[10px] uppercase tracking-wider border transition-all ${
                                            student.accessCount >= 3 
                                            ? 'bg-red-50 text-red-600 border-red-100' 
                                            : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                        }`}>
                                           <div className={`w-2 h-2 rounded-full ${student.accessCount >= 3 ? 'bg-red-600' : 'bg-emerald-600 animate-pulse'}`}></div>
                                           {student.accessCount} / 3 Logins
                                        </span>
                                     </td>
                                     <td className="px-12 py-7 text-right">
                                        <button className="bg-white/80 border border-slate-100 px-5 py-2.5 rounded-2xl text-slate-600 font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                                           Full Profile
                                        </button>
                                     </td>
                                  </tr>
                                );
                              })}
                           </tbody>
                        </table>
                      </div>
                   </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {activeTab === 'profile' && <Profile user={user} onUpdate={setUser} />}
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      await initDb();
      const currentUser = getCurrentUser();
      if (currentUser) setUser(currentUser);
      setLoading(false);
    };
    init();
  }, []);

  const handleLogin = async () => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  };
  const handleLogout = () => { logout(); setUser(null); };

  if (loading) return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white space-y-6">
        <div className="w-16 h-16 bg-indigo-600 rounded-[1.5rem] animate-bounce shadow-2xl shadow-indigo-200"></div>
        <p className="font-black text-slate-400 uppercase tracking-[0.3em] text-[10px] animate-pulse">Initializing Neural Core</p>
      </div>
  );

  if (!user) return <LoginView onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24">
      <Navbar user={user} onLogout={handleLogout} />
      <main>
        {user.role === UserRole.ADMIN ? <AdminDashboard user={user} /> : <UserDashboard user={user} />}
      </main>
    </div>
  );
}
