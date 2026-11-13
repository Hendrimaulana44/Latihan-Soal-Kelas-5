export type UserRole = 'Admin' | 'Guru' | 'Siswa' | 'Guest';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  email?: string;
  nisn?: string;
  grade?: number;
  classGroup?: string;
  nip?: string;
  avatar: string;
  title?: string;
}

export type CognitiveLevel = 'LOTS' | 'MOTS' | 'HOTS';

export type QuestionType = 'pg_biasa' | 'pg_kompleks' | 'benar_salah' | 'isian';

export interface QuestionOption {
  key: string;
  text: string;
}

export interface MatrixRow {
  text: string;
  correctBool: boolean;
}

export interface Question {
  id: string;
  number: number;
  stimulusId?: string;
  type: QuestionType;
  stem: string;
  cognitiveLevel: CognitiveLevel;
  points: number;
  aiConfidence: number;
  options?: QuestionOption[];
  correctAnswer?: string | string[]; // "C" or ["A", "C"]
  matrixRows?: MatrixRow[];
  explanation: string;
  source: 'AI' | 'manual';
}

export interface Stimulus {
  id: string;
  title: string;
  context: string;
  storyText: string;
  imageUrl?: string;
  tableData?: {
    headers: string[];
    rows: string[][];
  };
}

export interface ExamPackage {
  id: string;
  title: string;
  subject: 'Matematika' | 'Bahasa Indonesia';
  grade: number;
  assessmentType: string;
  status: 'final' | 'draft' | 'active';
  createdAt: string;
  authorName: string;
  authorNip: string;
  authorRole: string;
  durationMinutes: number;
  targetPassRate: number;
  curriculum: string;
  stimuli: Stimulus[];
  questions: Question[];
  summary: string;
  formatDescription?: string;
  stats?: {
    totalQuestions: number;
    verifiedCount: number;
    studentAttempts: number;
    avgScore: number;
  };
}

export interface Student {
  id: string;
  nisn: string;
  name: string;
  grade: number;
  classGroup: string;
  guardianTeacher: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  nip: string;
  role: 'Admin' | 'Guru';
  assignedClasses: string[];
  avatar: string;
}

export interface ExamResult {
  id: string;
  examId: string;
  examTitle: string;
  studentId?: string;
  studentName: string;
  studentNisn?: string;
  studentClass: string;
  answers: Record<number, any>; // question number -> answer
  flaggedQuestions: number[];
  finalScore: number;
  correctCount: number;
  incorrectCount: number;
  blankCount: number;
  completionTimeMinutes: number;
  date: string;
  predicate: string;
  competencyBreakdown: {
    domain: string;
    percentage: number;
    note: string;
  }[];
  teacherNote: string;
}

export interface AppSettings {
  schoolName: string;
  academicYear: string;
  address: string;
  principalName: string;
  principalNip: string;
  primaryColor: string;
}
