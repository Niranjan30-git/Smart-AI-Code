import express from "express";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Mock Database in memory for demo
  let users: any[] = [
    { 
      id: 'a1', 
      name: 'System Admin', 
      email: 'admin@gmail.com', 
      role: 'ADMIN', 
      category: 'Excellent',
      accessCount: 0,
      lastAccessDate: new Date().toDateString(),
      department: 'Computer Science',
      college: 'Codeflix Institute of Technology',
      batch: '2024',
      gender: 'Male',
      linkedin: 'https://linkedin.com/in/admin'
    },
    ...Array.from({ length: 120 }, (_, i) => ({
      id: `s${i + 1}`,
      name: `Student ${i + 1}`,
      email: `student${i + 1}@gmail.com`,
      role: 'USER',
      category: i % 3 === 0 ? 'Excellent' : (i % 2 === 0 ? 'Good' : 'Moderate'),
      accessCount: 0,
      lastAccessDate: new Date().toDateString(),
      rollNumber: `CS2024${(i + 1).toString().padStart(3, '0')}`,
      department: 'Computer Science',
      batch: '2024',
      college: 'Codeflix Institute of Technology',
      gender: i % 2 === 0 ? 'Male' : 'Female',
      linkedin: `https://linkedin.com/in/student${i + 1}`
    }))
  ];
  let submissions: any[] = [];

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Codeflix Backend is running!" });
  });

  app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    // Simple mock login
    const user = users.find(u => u.email === email);
    if (user) {
      res.json(user);
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  app.post("/api/register", (req, res) => {
    const { email, name, role } = req.body;
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ error: "Email already registered" });
    }
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      role: role || 'USER',
      category: 'Moderate',
      accessCount: 0,
      lastAccessDate: new Date().toDateString(),
      department: 'Computer Science',
      college: 'Codeflix Institute of Technology',
      batch: '2024',
      gender: 'Other',
      linkedin: ''
    };
    users.push(newUser);
    res.json(newUser);
  });

  app.get("/api/users", (req, res) => {
    res.json(users);
  });

  app.post("/api/users", (req, res) => {
    const user = req.body;
    const index = users.findIndex(u => u.id === user.id);
    if (index > -1) {
      users[index] = { ...users[index], ...user };
    } else {
      users.push(user);
    }
    res.json(user);
  });

  app.get("/api/submissions", (req, res) => {
    res.json(submissions);
  });

  app.post("/api/submissions", (req, res) => {
    const submission = req.body;
    const index = submissions.findIndex(s => s.userId === submission.userId && s.problemId === submission.problemId);
    if (index > -1) {
      submissions[index] = { ...submissions[index], ...submission };
    } else {
      submissions.push(submission);
    }
    res.json(submission);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
