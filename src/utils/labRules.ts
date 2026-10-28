import { Computer, SessionHistoryItem, StudentSession, RequestPCResult, ReleasePCResult } from '../types/lab';

export const INITIAL_COMPUTERS: Computer[] = [
  { id: 1, name: 'PC 1', status: 'available', specs: 'Core i7, 16GB, Pantalla 24", Windows 11', row: 1 },
  { 
    id: 2, 
    name: 'PC 2', 
    status: 'occupied', 
    specs: 'Core i7, 16GB, Pantalla 24", Windows 11', 
    row: 1,
    currentSession: {
      studentName: 'Ana Sofía Silva',
      studentEmail: 'ana.silva@alumno.edu',
      studentCode: 'EST-2024-041',
      cardCode: 'TRJ-PC02-8419',
      startTime: new Date(Date.now() - 35 * 60 * 1000).toISOString()
    }
  },
  { id: 3, name: 'PC 3', status: 'available', specs: 'Core i7, 16GB, Pantalla 24", Windows 11', row: 1 },
  { id: 4, name: 'PC 4', status: 'available', specs: 'Core i5, 16GB, Pantalla 24", Linux Ubuntu', row: 1 },
  { 
    id: 5, 
    name: 'PC 5', 
    status: 'occupied', 
    specs: 'Core i7, 32GB, RTX 4060, Windows 11', 
    row: 1,
    currentSession: {
      studentName: 'Mateo Riquelme',
      studentEmail: 'mateo.r@alumno.edu',
      studentCode: 'EST-2023-118',
      cardCode: 'TRJ-PC05-1923',
      startTime: new Date(Date.now() - 15 * 60 * 1000).toISOString()
    }
  },
  { id: 6, name: 'PC 6', status: 'available', specs: 'Core i5, 16GB, Pantalla 24", Windows 11', row: 2 },
  { id: 7, name: 'PC 7', status: 'available', specs: 'Core i5, 16GB, Pantalla 24", Windows 11', row: 2 },
  { id: 8, name: 'PC 8', status: 'available', specs: 'Core i7, 16GB, Pantalla 24", Windows 11', row: 2 },
  { id: 9, name: 'PC 9', status: 'available', specs: 'Core i5, 16GB, Pantalla 24", Windows 11', row: 2 },
  { id: 10, name: 'PC 10', status: 'available', specs: 'Core i7, 32GB, RTX 4060, Windows 11', row: 2 },
];

export function generateCardCode(pcId: number): string {
  const pad = pcId.toString().padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `TRJ-PC${pad}-${rand}`;
}

export function getStudentActivePC(computers: Computer[], email: string): Computer | undefined {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail) return undefined;
  return computers.find(
    (pc) => pc.status === 'occupied' && pc.currentSession?.studentEmail.toLowerCase() === cleanEmail
  );
}

export function requestComputerLogic(
  computers: Computer[],
  computerId: number,
  student: { name: string; email: string; studentCode?: string }
): { updatedComputers: Computer[]; result: RequestPCResult } {
  const cleanEmail = student.email.trim().toLowerCase();
  
  if (!cleanEmail) {
    return {
      updatedComputers: computers,
      result: { success: false, message: 'Debe ingresar un correo institucional válido.' }
    };
  }

  // Check if student already has a PC assigned
  const existingPC = getStudentActivePC(computers, cleanEmail);
  if (existingPC) {
    return {
      updatedComputers: computers,
      result: {
        success: false,
        message: `Ya tienes asignado el computador ${existingPC.name}. Debes liberarlo antes de solicitar otro.`
      }
    };
  }

  const targetPC = computers.find((pc) => pc.id === computerId);
  if (!targetPC) {
    return {
      updatedComputers: computers,
      result: { success: false, message: `El computador ID ${computerId} no existe.` }
    };
  }

  if (targetPC.status !== 'available') {
    return {
      updatedComputers: computers,
      result: { 
        success: false, 
        message: `El computador ${targetPC.name} no está disponible actualmente.` 
      }
    };
  }

  const cardCode = generateCardCode(computerId);
  const now = new Date().toISOString();

  const newSession: StudentSession = {
    studentName: student.name.trim() || cleanEmail.split('@')[0],
    studentEmail: cleanEmail,
    studentCode: student.studentCode || `EST-${Math.floor(1000 + Math.random() * 9000)}`,
    cardCode,
    startTime: now
  };

  const updatedTargetPC: Computer = {
    ...targetPC,
    status: 'occupied',
    currentSession: newSession
  };

  const updatedComputers = computers.map((pc) => (pc.id === computerId ? updatedTargetPC : pc));

  return {
    updatedComputers,
    result: {
      success: true,
      message: `Computador ${targetPC.name} asignado con éxito.`,
      computer: updatedTargetPC,
      cardCode
    }
  };
}

export function releaseComputerLogic(
  computers: Computer[],
  computerId: number,
  endTimeIso?: string
): { updatedComputers: Computer[]; result: ReleasePCResult } {
  const targetPC = computers.find((pc) => pc.id === computerId);
  if (!targetPC) {
    return {
      updatedComputers: computers,
      result: { success: false, message: `El computador ID ${computerId} no existe.` }
    };
  }

  if (targetPC.status !== 'occupied' || !targetPC.currentSession) {
    return {
      updatedComputers: computers,
      result: { success: false, message: `El computador ${targetPC.name} no se encuentra en uso.` }
    };
  }

  const session = targetPC.currentSession;
  const end = endTimeIso ? new Date(endTimeIso) : new Date();
  const start = new Date(session.startTime);
  const diffMs = Math.max(0, end.getTime() - start.getTime());
  const durationMinutes = Math.max(1, Math.round(diffMs / (60 * 1000)));

  const sessionRecord: SessionHistoryItem = {
    id: `sess-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    computerId: targetPC.id,
    computerName: targetPC.name,
    studentName: session.studentName,
    studentEmail: session.studentEmail,
    studentCode: session.studentCode,
    cardCode: session.cardCode,
    startTime: session.startTime,
    endTime: end.toISOString(),
    durationMinutes
  };

  const updatedTargetPC: Computer = {
    ...targetPC,
    status: 'available',
    currentSession: undefined
  };

  const updatedComputers = computers.map((pc) => (pc.id === computerId ? updatedTargetPC : pc));

  return {
    updatedComputers,
    result: {
      success: true,
      message: `El computador ${targetPC.name} ha sido liberado exitosamente.`,
      sessionRecord,
      computer: updatedTargetPC
    }
  };
}

export function calculateMinutesElapsed(startTimeIso: string): number {
  const start = new Date(startTimeIso).getTime();
  const now = Date.now();
  return Math.max(0, Math.floor((now - start) / (60 * 1000)));
}

export function formatTimeHoursMinutes(dateIso: string): string {
  try {
    const d = new Date(dateIso);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '--:--';
  }
}

export function getLabStats(computers: Computer[]) {
  const total = computers.length;
  const available = computers.filter((c) => c.status === 'available').length;
  const occupied = computers.filter((c) => c.status === 'occupied').length;
  const maintenance = computers.filter((c) => c.status === 'maintenance').length;
  return { total, available, occupied, maintenance };
}
