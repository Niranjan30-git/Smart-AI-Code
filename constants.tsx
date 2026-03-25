
import { Problem, User, UserRole, PerformanceCategory } from './types';

export const PROBLEMS: Problem[] = [
  {
    id: 'p1',
    moduleName: 'Foundational Logic',
    level: 'Basic',
    title: 'Reverse String Master',
    difficulty: 'Easy',
    description: 'Write a function that reverses a string. Input is "hello", output should be "olleh".',
    concept: 'String Manipulation & Iteration',
    testCases: [
      { input: 'hello', expectedOutput: 'olleh' },
      { input: 'world', expectedOutput: 'dlrow' }
    ]
  },
  {
    id: 'p2',
    moduleName: 'Data Structures 101',
    level: 'Core Proficiency',
    title: 'Array Index Finder (Two Sum)',
    difficulty: 'Medium',
    description: 'Given an array [2,7,11,15] and target 9, return [0,1].',
    concept: 'Hash Maps & Array Searching',
    testCases: [
      { input: '[2,7,11,15], 9', expectedOutput: '[0,1]' }
    ]
  },
  {
    id: 'p3',
    moduleName: 'Strategic Algorithm',
    level: 'Intermediate',
    title: 'Prime Sentinel',
    difficulty: 'Easy',
    description: 'Determine if a given number is prime. Output "Prime" or "Not Prime".',
    concept: 'Number Theory & Primality Testing',
    testCases: [
      { input: '7', expectedOutput: 'Prime' }
    ]
  },
  {
    id: 'p4',
    moduleName: 'Architecture Logic',
    level: 'Advanced',
    title: 'Substring Architect',
    difficulty: 'Hard',
    description: 'Find the length of the longest substring without repeating characters.',
    concept: 'Sliding Window Technique',
    testCases: [
      { input: 'abcabcbb', expectedOutput: '3' }
    ]
  },
  {
    id: 'p5',
    moduleName: 'Level Up Master',
    level: 'Expert Elite',
    title: 'Final Parentheses Validator',
    difficulty: 'Medium',
    description: 'Verify if a string of characters like "()[]{}" is syntactically valid.',
    concept: 'Stack Data Structure',
    testCases: [
      { input: '()[]{}', expectedOutput: 'Valid' }
    ]
  },
  {
    id: 'p6',
    moduleName: 'Dynamic Programming',
    level: 'Advanced',
    title: 'Fibonacci Sequence',
    difficulty: 'Easy',
    description: 'Calculate the nth Fibonacci number.',
    concept: 'Recursion & Memoization',
    testCases: [
      { input: '5', expectedOutput: '5' }
    ]
  },
  {
    id: 'p7',
    moduleName: 'Graph Theory',
    level: 'Expert',
    title: 'Shortest Path Finder',
    difficulty: 'Hard',
    description: 'Find the shortest path between two nodes in a graph.',
    concept: 'Dijkstra\'s Algorithm',
    testCases: [
      { input: 'Graph A, Node 1 to 5', expectedOutput: '10' }
    ]
  },
  {
    id: 'p8',
    moduleName: 'Bit Manipulation',
    level: 'Intermediate',
    title: 'Single Number',
    difficulty: 'Medium',
    description: 'Find the number that appears only once in an array where every other element appears twice.',
    concept: 'XOR Bitwise Operations',
    testCases: [
      { input: '[2,2,1]', expectedOutput: '1' }
    ]
  },
  {
    id: 'p9',
    moduleName: 'Sorting Algorithms',
    level: 'Basic',
    title: 'Merge Sort Implementation',
    difficulty: 'Medium',
    description: 'Implement the merge sort algorithm to sort an array.',
    concept: 'Divide and Conquer',
    testCases: [
      { input: '[3,1,4,1,5]', expectedOutput: '[1,1,3,4,5]' }
    ]
  },
  {
    id: 'p10',
    moduleName: 'Linked Lists',
    level: 'Core',
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    description: 'Reverse a singly linked list.',
    concept: 'Pointer Manipulation',
    testCases: [
      { input: '1->2->3', expectedOutput: '3->2->1' }
    ]
  }
];

export const MOTIVATIONAL_QUOTES = [
  // Resilience & Persistence
  "Don't stop when you're tired. Stop when you're done. Your future self will thank you.",
  "Every great developer you know got there by solving problems they were unqualified to solve until they actually did it.",
  "Persistence is the shortcut to mastery. Keep coding, keep failing, keep growing.",
  "It's not a bug; it's a learning opportunity in disguise.",
  "The only way to go from 'Hello World' to 'Hero' is through daily consistent practice.",
  
  // Discipline & Habit
  "Success is the sum of small efforts, repeated day in and day out. 5 tasks today, 1825 tasks a year.",
  "Discipline is choosing between what you want now and what you want most.",
  "Code every day. Even if it's just one line, keep the momentum alive.",
  "Motivation gets you started. Habit is what keeps you going.",
  
  // Mindset & Growth
  "First, solve the problem. Then, write the code. Architecture happens in the mind first.",
  "The only person you should try to be better than is the person you were yesterday.",
  "Growth begins at the end of your comfort zone. Today's Hard task is tomorrow's Easy one.",
  "In coding, the level up happens in the mind before it happens on the screen.",
  "Expertise is not about knowing everything, but knowing how to find the solution.",
  
  // Impact & Vision
  "The best way to predict the future is to invent it. Your code has the power to change the world.",
  "Code is like poetry; it should be short, concise, and beautiful.",
  "Your code is your legacy. Write it with care, logic, and passion.",
  "Software is a great combination between artistry and engineering.",
  
  // Logic & Engineering
  "Computers are fast, accurate, and stupid. Humans are slow, inaccurate, and brilliant. Together, they are unstoppable.",
  "Programming isn't about what you know; it's about what you can figure out.",
  "Clean code always looks like it was written by someone who cares.",
  "Programming is the closest thing we have to magic. You are the wizard.",
  "To iterate is human, to recurse, divine."
];

export const TEACHER_MOTIVATIONAL_QUOTES = [
  "The art of teaching is the art of assisting discovery.",
  "A teacher affects eternity; he can never tell where his influence stops.",
  "Teaching is the greatest act of optimism.",
  "The best teachers are those who show you where to look but don't tell you what to see.",
  "Education is not the filling of a pail, but the lighting of a fire.",
  "To teach is to learn twice.",
  "A good teacher is like a candle—it consumes itself to light the way for others.",
  "The beautiful thing about learning is that no one can take it away from you.",
  "Teachers can change lives with just the right mix of chalk and challenges.",
  "Success in the classroom is not just about what you teach, but how you inspire."
];

export const MOCK_ADMINS: User[] = [
  { 
    id: 'a1', 
    name: 'System Admin', 
    email: 'admin@gmail.com', 
    role: UserRole.ADMIN, 
    category: PerformanceCategory.EXCELLENT,
    accessCount: 0,
    lastAccessDate: new Date().toDateString(),
    department: 'Computer Science',
    college: 'Codeflix Institute of Technology',
    batch: '2024',
    gender: 'Male',
    linkedin: 'https://linkedin.com/in/admin'
  }
];

export const MOCK_STUDENTS: User[] = Array.from({ length: 120 }, (_, i) => ({
  id: `s${i + 1}`,
  name: `Student ${i + 1}`,
  email: `student${i + 1}@gmail.com`,
  role: UserRole.USER,
  category: i % 3 === 0 ? PerformanceCategory.EXCELLENT : (i % 2 === 0 ? PerformanceCategory.GOOD : PerformanceCategory.MODERATE),
  accessCount: 0,
  lastAccessDate: new Date().toDateString(),
  rollNumber: `CS2024${(i + 1).toString().padStart(3, '0')}`,
  department: 'Computer Science',
  batch: '2024',
  college: 'Codeflix Institute of Technology',
  gender: i % 2 === 0 ? 'Male' : 'Female',
  linkedin: `https://linkedin.com/in/student${i + 1}`
}));

export const APP_CONFIG = {
  DAILY_TASK_COUNT: 5,
  MARKS_PER_TASK: 10,
  TOTAL_DAILY_MARKS: 50,
  DEADLINE_HOURS: 24,
  MAX_DAILY_ACCESS: 5
};
