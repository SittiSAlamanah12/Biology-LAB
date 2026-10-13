export type GradeLevel = 'all' | '10' | '11' | '12';

export interface HotspotPart {
  id: string;
  name: string;
  latinName?: string;
  functionDesc: string;
  detail: string;
  clinicalNote?: string; // Penyakit atau kelainan terkait materi SMA
  position: [number, number, number]; // 3D coordinates in model
  color?: string;
}

export interface BioModelInfo {
  id: string;
  name: string;
  category: 'organ' | 'sel';
  grade: '10' | '11' | '12';
  curriculumTopic: string;
  summary: string;
  description: string;
  parts: HotspotPart[];
  facts: string[];
  keyMolecules?: string[];
  interactiveControls?: {
    hasPulseAnimation?: boolean;
    hasExplodeView?: boolean;
    hasBreathingAnimation?: boolean;
    hasSignalFlow?: boolean;
  };
}

export interface QuizQuestion {
  id: string;
  grade: '10' | '11' | '12';
  topic: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  difficulty: 'Mudah' | 'Sedang' | 'HOTS / Sulit';
  badge: string;
}

export interface GameScore {
  gameId: string;
  gameName: string;
  score: number;
  maxScore: number;
  completedAt: string;
  accuracy: number;
}
