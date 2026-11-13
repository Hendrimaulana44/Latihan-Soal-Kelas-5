import { ExamPackage, Teacher, Student, ExamResult, AppSettings, UserProfile } from '../types';
import {
  INITIAL_SETTINGS,
  INITIAL_TEACHERS,
  INITIAL_STUDENTS,
  INITIAL_EXAM_PACKAGES,
  INITIAL_EXAM_RESULTS,
} from '../data/initialData';

const KEYS = {
  SETTINGS: 'tka_guru_settings_v1',
  TEACHERS: 'tka_guru_teachers_v1',
  STUDENTS: 'tka_guru_students_v1',
  EXAMS: 'tka_guru_exams_v1',
  RESULTS: 'tka_guru_results_v1',
  ACTIVE_USER: 'tka_guru_active_user_v1',
};

export const storage = {
  getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(KEYS.SETTINGS);
      return data ? JSON.parse(data) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  },

  saveSettings(settings: AppSettings): void {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  },

  getTeachers(): Teacher[] {
    try {
      const data = localStorage.getItem(KEYS.TEACHERS);
      return data ? JSON.parse(data) : INITIAL_TEACHERS;
    } catch {
      return INITIAL_TEACHERS;
    }
  },

  saveTeacher(teacher: Teacher): void {
    const list = this.getTeachers();
    const index = list.findIndex((t) => t.id === teacher.id);
    if (index >= 0) {
      list[index] = teacher;
    } else {
      list.push(teacher);
    }
    localStorage.setItem(KEYS.TEACHERS, JSON.stringify(list));
  },

  deleteTeacher(id: string): void {
    const list = this.getTeachers().filter((t) => t.id !== id);
    localStorage.setItem(KEYS.TEACHERS, JSON.stringify(list));
  },

  getStudents(): Student[] {
    try {
      const data = localStorage.getItem(KEYS.STUDENTS);
      return data ? JSON.parse(data) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  },

  saveStudent(student: Student): void {
    const list = this.getStudents();
    const index = list.findIndex((s) => s.id === student.id);
    if (index >= 0) {
      list[index] = student;
    } else {
      list.push(student);
    }
    localStorage.setItem(KEYS.STUDENTS, JSON.stringify(list));
  },

  deleteStudent(id: string): void {
    const list = this.getStudents().filter((s) => s.id !== id);
    localStorage.setItem(KEYS.STUDENTS, JSON.stringify(list));
  },

  getExams(): ExamPackage[] {
    try {
      const data = localStorage.getItem(KEYS.EXAMS);
      return data ? JSON.parse(data) : INITIAL_EXAM_PACKAGES;
    } catch {
      return INITIAL_EXAM_PACKAGES;
    }
  },

  getExamById(id: string): ExamPackage | undefined {
    return this.getExams().find((e) => e.id === id);
  },

  saveExam(pkg: ExamPackage): void {
    const list = this.getExams();
    const index = list.findIndex((e) => e.id === pkg.id);
    if (index >= 0) {
      list[index] = pkg;
    } else {
      list.unshift(pkg);
    }
    localStorage.setItem(KEYS.EXAMS, JSON.stringify(list));
  },

  deleteExam(id: string): void {
    const list = this.getExams().filter((e) => e.id !== id);
    localStorage.setItem(KEYS.EXAMS, JSON.stringify(list));
  },

  getExamResults(): ExamResult[] {
    try {
      const data = localStorage.getItem(KEYS.RESULTS);
      return data ? JSON.parse(data) : INITIAL_EXAM_RESULTS;
    } catch {
      return INITIAL_EXAM_RESULTS;
    }
  },

  saveExamResult(result: ExamResult): void {
    const list = this.getExamResults();
    list.unshift(result);
    localStorage.setItem(KEYS.RESULTS, JSON.stringify(list));
  },

  getActiveUser(): UserProfile {
    try {
      const data = localStorage.getItem(KEYS.ACTIVE_USER);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return {
      id: 'guru-1',
      name: 'Ibu Ratna Dewi, S.Pd.',
      role: 'Admin',
      email: 'ratnadewi@purwasari.sch.id',
      nip: '19850417 201101 2 009',
      grade: 4,
      title: 'Guru Kelas 4 & Admin',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzyVQJeO6ZkBBzV2ML-muatiR5uR0oov686uXgv6DKPFwCfC-vUr5Xxt_UD484szRrr7a4tXSAsqEqbM8O4OCHzR99jucAgYdYvth_uT0ssdQuZ07R2vA39MqQDIp33fx110cUbxr2BHjbubx-BD-sKAUTWJVwHsffMtJxDq8YYEK5yZrhCUJK6_0hxgMA2f3MGu20l4A30vFS0v5IWBSs9bJsQ7LvvgucFUcLN4c',
    };
  },

  setActiveUser(user: UserProfile): void {
    localStorage.setItem(KEYS.ACTIVE_USER, JSON.stringify(user));
  },

  resetDefaults(): void {
    localStorage.clear();
  },
};
