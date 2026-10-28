export type ComputerStatus = 'available' | 'occupied' | 'maintenance';

export interface StudentSession {
  studentName: string;
  studentEmail: string;
  studentCode: string;
  cardCode: string;
  startTime: string; // ISO string
}

export interface Computer {
  id: number;
  name: string; // e.g. "PC 1"
  status: ComputerStatus;
  specs: string;
  row: number;
  currentSession?: StudentSession;
}

export interface SessionHistoryItem {
  id: string;
  computerId: number;
  computerName: string;
  studentName: string;
  studentEmail: string;
  studentCode: string;
  cardCode: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
}

export interface StudentCredentials {
  email: string;
  password?: string;
  name?: string;
}

export interface RequestPCResult {
  success: boolean;
  message: string;
  computer?: Computer;
  cardCode?: string;
}

export interface ReleasePCResult {
  success: boolean;
  message: string;
  sessionRecord?: SessionHistoryItem;
  computer?: Computer;
}
