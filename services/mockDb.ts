
import { User, Submission, UserRole, PerformanceCategory, SubmissionStatus } from '../types';
import { MOCK_STUDENTS, MOCK_ADMINS, APP_CONFIG } from '../constants';

const API_URL = '/api';

export const initDb = async () => {
  try {
    const response = await fetch(`${API_URL}/users`);
    const users = await response.json();
    if (users.length === 0) {
      const allUsers = [...MOCK_ADMINS, ...MOCK_STUDENTS];
      for (const user of allUsers) {
        await fetch(`${API_URL}/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user)
        });
      }
    }
  } catch (error) {
    console.error('Failed to init DB:', error);
  }
};

export const getUsers = async (): Promise<User[]> => {
  const response = await fetch(`${API_URL}/users`);
  return response.json();
};

export const getSubmissions = async (): Promise<Submission[]> => {
  const response = await fetch(`${API_URL}/submissions`);
  return response.json();
};

export const incrementAccess = async (userId: string): Promise<boolean> => {
  const users = await getUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex === -1) return false;

  const today = new Date().toDateString();
  const user = users[userIndex];

  if (user.lastAccessDate !== today) {
    user.accessCount = 1;
    user.lastAccessDate = today;
  } else {
    if (user.accessCount >= APP_CONFIG.MAX_DAILY_ACCESS) return false;
    user.accessCount += 1;
  }

  await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  });
  localStorage.setItem('ai_system_current_user', JSON.stringify(user));
  return true;
};

export const addSubmission = async (submission: Submission): Promise<{ success: boolean, message?: string }> => {
  const current = await getSubmissions();
  const existingIndex = current.findIndex(s => s.userId === submission.userId && s.problemId === submission.problemId);
  
  let attempts = 1;
  if (existingIndex > -1) {
    attempts = (current[existingIndex].attempts || 0) + 1;
    if (attempts > 5) {
      return { success: false, message: 'Maximum attempts (5) reached for this program today.' };
    }
  }
  
  const subWithAttempts = { ...submission, attempts };
  await fetch(`${API_URL}/submissions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(subWithAttempts)
  });
  
  await updateUserCategory(submission.userId);
  return { success: true };
};

const updateUserCategory = async (userId: string) => {
  const users = await getUsers();
  const allSubs = await getSubmissions();
  const subs = allSubs.filter(s => s.userId === userId && s.status === SubmissionStatus.COMPLETED);
  const totalMarks = subs.reduce((sum, s) => sum + s.marks, 0);
  const percentage = (totalMarks / 50) * 100;
  
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex > -1) {
    if (percentage >= 80) users[userIndex].category = PerformanceCategory.EXCELLENT;
    else if (percentage >= 40) users[userIndex].category = PerformanceCategory.GOOD;
    else users[userIndex].category = PerformanceCategory.MODERATE;
    
    await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(users[userIndex])
    });
    
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      localStorage.setItem('ai_system_current_user', JSON.stringify(users[userIndex]));
    }
  }
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem('ai_system_current_user');
  return user ? JSON.parse(user) : null;
};

export const login = async (email: string): Promise<User | null> => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  
  if (response.ok) {
    const user = await response.json();
    localStorage.setItem('ai_system_current_user', JSON.stringify(user));
    return user;
  }
  return null;
};

export const updateUserProfile = async (userId: string, profileData: Partial<User>): Promise<User | null> => {
  const users = await getUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex === -1) return null;

  const updatedUser = { ...users[userIndex], ...profileData };
  await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedUser)
  });

  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === userId) {
    localStorage.setItem('ai_system_current_user', JSON.stringify(updatedUser));
  }
  return updatedUser;
};

export const logout = () => {
  localStorage.removeItem('ai_system_current_user');
};
