
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

export enum PerformanceCategory {
  EXCELLENT = 'Excellent',
  GOOD = 'Good',
  MODERATE = 'Moderate'
}

export enum SubmissionStatus {
  COMPLETED = 'Completed',
  FAILED = 'Failed',
  PENDING = 'Pending'
}

export interface TestCase {
  input: string;
  expectedOutput: string;
}

export interface Problem {
  id: string;
  title: string;
  moduleName: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  level: string;
  description: string;
  concept: string;
  testCases: TestCase[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  category: PerformanceCategory;
  accessCount: number;
  lastAccessDate: string;
  rollNumber?: string;
  department?: string;
  batch?: string;
  college?: string;
  gender?: string;
  linkedin?: string;
}

export interface Submission {
  id: string;
  userId: string;
  problemId: string;
  language: string;
  status: SubmissionStatus;
  marks: number;
  code: string;
  timestamp: string;
  attempts: number;
}

export interface DailyStats {
  totalTasks: number;
  completedTasks: number;
  remainingTasks: number;
  marks: number;
  productivity: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria: string;
  isUnlocked: boolean;
}
