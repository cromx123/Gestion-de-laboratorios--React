import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  INITIAL_COMPUTERS, 
  requestComputerLogic, 
  releaseComputerLogic, 
  getLabStats, 
  getStudentActivePC,
  generateCardCode 
} from './labRules';
import { Computer } from '../types/lab';

test('generateCardCode generates valid format TRJ-PCXX-XXXX', () => {
  const code = generateCardCode(3);
  assert.match(code, /^TRJ-PC03-\d{4}$/);
});

test('requestComputerLogic assigns an available PC to a student', () => {
  const mockComputers: Computer[] = [
    { id: 1, name: 'PC 1', status: 'available', specs: 'test', row: 1 },
    { id: 2, name: 'PC 2', status: 'available', specs: 'test', row: 1 },
  ];

  const { updatedComputers, result } = requestComputerLogic(mockComputers, 1, {
    name: 'Juan Pérez',
    email: 'juan@alumno.edu',
    studentCode: 'EST-101'
  });

  assert.equal(result.success, true);
  assert.equal(result.computer?.status, 'occupied');
  assert.equal(result.computer?.currentSession?.studentEmail, 'juan@alumno.edu');
  assert.ok(result.cardCode?.startsWith('TRJ-PC01-'));

  const pc1 = updatedComputers.find((c) => c.id === 1);
  assert.equal(pc1?.status, 'occupied');
  assert.equal(pc1?.currentSession?.studentName, 'Juan Pérez');
});

test('requestComputerLogic rejects assigning an already occupied PC', () => {
  const mockComputers: Computer[] = [
    { 
      id: 1, 
      name: 'PC 1', 
      status: 'occupied', 
      specs: 'test', 
      row: 1,
      currentSession: {
        studentName: 'Otro Alumno',
        studentEmail: 'otro@alumno.edu',
        studentCode: 'EST-999',
        cardCode: 'TRJ-PC01-1111',
        startTime: new Date().toISOString()
      }
    }
  ];

  const { updatedComputers, result } = requestComputerLogic(mockComputers, 1, {
    name: 'Juan Pérez',
    email: 'juan@alumno.edu'
  });

  assert.equal(result.success, false);
  assert.match(result.message, /no está disponible/);
  assert.equal(updatedComputers[0].currentSession?.studentEmail, 'otro@alumno.edu');
});

test('requestComputerLogic prevents one student from holding multiple PCs simultaneously', () => {
  const mockComputers: Computer[] = [
    { 
      id: 1, 
      name: 'PC 1', 
      status: 'occupied', 
      specs: 'test', 
      row: 1,
      currentSession: {
        studentName: 'Juan Pérez',
        studentEmail: 'juan@alumno.edu',
        studentCode: 'EST-101',
        cardCode: 'TRJ-PC01-1111',
        startTime: new Date().toISOString()
      }
    },
    { id: 2, name: 'PC 2', status: 'available', specs: 'test', row: 1 },
  ];

  const { result } = requestComputerLogic(mockComputers, 2, {
    name: 'Juan Pérez',
    email: 'juan@alumno.edu'
  });

  assert.equal(result.success, false);
  assert.match(result.message, /Ya tienes asignado el computador PC 1/);
});

test('releaseComputerLogic frees occupied PC and calculates session record', () => {
  const startTime = new Date(Date.now() - 45 * 60 * 1000).toISOString();
  const mockComputers: Computer[] = [
    { 
      id: 3, 
      name: 'PC 3', 
      status: 'occupied', 
      specs: 'test', 
      row: 1,
      currentSession: {
        studentName: 'Carlos M.',
        studentEmail: 'carlos@alumno.edu',
        studentCode: 'EST-555',
        cardCode: 'TRJ-PC03-5555',
        startTime
      }
    }
  ];

  const { updatedComputers, result } = releaseComputerLogic(mockComputers, 3);
  assert.equal(result.success, true);
  assert.equal(result.computer?.status, 'available');
  assert.equal(result.computer?.currentSession, undefined);

  assert.ok(result.sessionRecord);
  assert.equal(result.sessionRecord?.computerName, 'PC 3');
  assert.equal(result.sessionRecord?.studentEmail, 'carlos@alumno.edu');
  assert.ok(result.sessionRecord?.durationMinutes >= 40);

  const pc3 = updatedComputers.find((c) => c.id === 3);
  assert.equal(pc3?.status, 'available');
  assert.equal(pc3?.currentSession, undefined);
});

test('getLabStats calculates correct counts', () => {
  const stats = getLabStats(INITIAL_COMPUTERS);
  assert.equal(stats.total, 10);
  assert.equal(stats.occupied, 2);
  assert.equal(stats.available, 8);
  assert.equal(stats.maintenance, 0);
});

test('getStudentActivePC finds active computer by email case-insensitively', () => {
  const pc = getStudentActivePC(INITIAL_COMPUTERS, 'ANA.SILVA@ALUMNO.EDU');
  assert.ok(pc);
  assert.equal(pc?.id, 2);
});
