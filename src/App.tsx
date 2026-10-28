import React, { useState, useEffect } from 'react';
import { Computer, SessionHistoryItem } from './types/lab';
import { 
  INITIAL_COMPUTERS, 
  requestComputerLogic, 
  releaseComputerLogic, 
  getLabStats, 
  getStudentActivePC 
} from './utils/labRules';
import { LoginView } from './components/LoginView';
import { ComputersListView } from './components/ComputersListView';
import { ConfirmationView } from './components/ConfirmationView';
import { ReleasePCView } from './components/ReleasePCView';
import { WireframeView } from './components/WireframeView';
import { LabHistoryModal } from './components/LabHistoryModal';
import { 
  Monitor, 
  RotateCcw, 
  History, 
  Columns3, 
  Sparkles, 
  LayoutDashboard,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

const STORAGE_KEY_PCS = 'lab_computers_state_v1';
const STORAGE_KEY_HIST = 'lab_computers_history_v1';

export default function App() {
  // Load computers from localStorage or fallback to default
  const [computers, setComputers] = useState<Computer[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PCS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_COMPUTERS;
  });

  const [history, setHistory] = useState<SessionHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HIST);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  // Current active logged in student
  const [currentStudent, setCurrentStudent] = useState<{
    name: string;
    email: string;
    studentCode?: string;
  } | null>(null);

  // Screen state: 'login' | 'computers' | 'confirmation' | 'release'
  const [currentScreen, setCurrentScreen] = useState<'login' | 'computers' | 'confirmation' | 'release'>('login');

  // Mode: 'kiosk' (interactive step flow) vs 'wireframe' (panoramic 3-screens mockup)
  const [viewMode, setViewMode] = useState<'kiosk' | 'wireframe'>('kiosk');

  // Last assigned computer for the confirmation screen
  const [lastAssigned, setLastAssigned] = useState<{
    computer: Computer;
    cardCode: string;
  } | null>(null);

  // Selected PC for release view
  const [preselectedReleasePCId, setPreselectedReleasePCId] = useState<number | null>(null);

  // History modal toggle
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // Banner notification toast
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Persist computers to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PCS, JSON.stringify(computers));
    } catch {
      // ignore
    }
  }, [computers]);

  // Persist history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HIST, JSON.stringify(history));
    } catch {
      // ignore
    }
  }, [history]);

  // Notification auto-dismiss
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Handle student login
  const handleLogin = (student: { name: string; email: string; studentCode?: string }) => {
    setCurrentStudent(student);
    setNotification({
      type: 'success',
      message: `¡Bienvenido(a), ${student.name}! Puedes elegir tu computador.`
    });
    setCurrentScreen('computers');
  };

  // Handle student computer selection
  const handleSelectComputer = (computer: Computer) => {
    if (!currentStudent) {
      setCurrentScreen('login');
      return;
    }

    const { updatedComputers, result } = requestComputerLogic(computers, computer.id, currentStudent);

    if (result.success && result.computer && result.cardCode) {
      setComputers(updatedComputers);
      setLastAssigned({
        computer: result.computer,
        cardCode: result.cardCode
      });
      setCurrentScreen('confirmation');
      setNotification({
        type: 'success',
        message: result.message
      });
    } else {
      setNotification({
        type: 'error',
        message: result.message
      });
    }
  };

  // Handle release of computer
  const handleConfirmRelease = (computerId: number) => {
    const { updatedComputers, result } = releaseComputerLogic(computers, computerId);

    if (result.success && result.sessionRecord) {
      setComputers(updatedComputers);
      setHistory((prev) => [result.sessionRecord!, ...prev]);
      setNotification({
        type: 'success',
        message: result.message
      });
      return { success: true, durationMinutes: result.sessionRecord.durationMinutes };
    } else {
      setNotification({
        type: 'error',
        message: result.message
      });
      return { success: false };
    }
  };

  // Reset entire lab to initial demo state
  const handleResetLab = () => {
    setComputers(INITIAL_COMPUTERS);
    setHistory([]);
    setCurrentStudent(null);
    setLastAssigned(null);
    setCurrentScreen('login');
    setNotification({
      type: 'info',
      message: 'Laboratorio restablecido con 8 computadores disponibles y 2 ocupados de prueba.'
    });
  };

  const stats = getLabStats(computers);

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-neutral-900 flex flex-col font-sans selection:bg-emerald-200">
      {/* Top Application Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b-2 border-neutral-900 px-4 py-2.5">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Logo & Lab Title */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-neutral-900 flex items-center justify-center text-white shadow-[2px_2px_0px_0px_rgba(16,185,129,1)]">
              <Monitor className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-neutral-900 leading-tight">
                Laboratorio de Computación
              </h1>
              <p className="text-[11px] text-neutral-500 font-medium">
                Kiosco de Solicitud y Control de Equipos
              </p>
            </div>
          </div>

          {/* Quick status counter & View Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Lab Stats Badge */}
            <div className="hidden md:flex items-center gap-2 bg-neutral-100 border border-neutral-300 rounded-lg px-2.5 py-1 text-xs font-semibold">
              <span className="flex items-center gap-1 text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                {stats.available} Libres
              </span>
              <span className="text-neutral-400">|</span>
              <span className="flex items-center gap-1 text-amber-700">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                {stats.occupied} En Uso
              </span>
            </div>

            {/* View Mode Toggle: Interactive Kiosk vs 3-Screens Wireframe */}
            <div className="flex items-center bg-neutral-100 border border-neutral-300 rounded-lg p-0.5 text-xs font-bold">
              <button
                type="button"
                onClick={() => setViewMode('kiosk')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  viewMode === 'kiosk'
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Modo Kiosco</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('wireframe')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  viewMode === 'wireframe'
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <Columns3 className="w-3.5 h-3.5" />
                <span>Vista Wireframe (3 Pantallas)</span>
              </button>
            </div>

            {/* Release PC Shortcut Button */}
            <button
              type="button"
              onClick={() => {
                setViewMode('kiosk');
                setCurrentScreen('release');
              }}
              className="inline-flex items-center gap-1 text-xs font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-lg px-2.5 py-1.5 transition cursor-pointer"
              title="Devolver o soltar computador"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
              <span className="hidden sm:inline">Soltar PC</span>
            </button>

            {/* History Button */}
            <button
              type="button"
              onClick={() => setIsHistoryModalOpen(true)}
              className="p-1.5 rounded-lg border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-700 transition cursor-pointer"
              title="Historial de uso"
              aria-label="Ver historial"
            >
              <History className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Floating Notification Toast */}
      {notification && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <div
            className={`px-4 py-2 rounded-xl border-2 text-xs font-extrabold shadow-lg flex items-center gap-2 ${
              notification.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-500'
                : notification.type === 'error'
                ? 'bg-red-50 text-red-900 border-red-500'
                : 'bg-amber-50 text-amber-900 border-amber-500'
            }`}
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-2 sm:p-4">
        {viewMode === 'wireframe' ? (
          /* Wireframe 3-Screens Panoramic View (Directly representing user attachment) */
          <WireframeView
            computers={computers}
            onSelectPC={(pc) => {
              if (pc.status === 'available') {
                if (!currentStudent) {
                  setCurrentStudent({
                    name: 'Carlos Mendoza',
                    email: 'carlos.mendoza@alumno.edu',
                    studentCode: 'EST-2024-889'
                  });
                }
                const assignedStudent = currentStudent || {
                  name: 'Carlos Mendoza',
                  email: 'carlos.mendoza@alumno.edu',
                  studentCode: 'EST-2024-889'
                };
                const { updatedComputers, result } = requestComputerLogic(computers, pc.id, assignedStudent);
                if (result.success && result.computer && result.cardCode) {
                  setComputers(updatedComputers);
                  setLastAssigned({
                    computer: result.computer,
                    cardCode: result.cardCode
                  });
                  setViewMode('kiosk');
                  setCurrentScreen('confirmation');
                }
              } else {
                setPreselectedReleasePCId(pc.id);
                setViewMode('kiosk');
                setCurrentScreen('release');
              }
            }}
            onGoToKiosk={(targetScreen) => {
              setViewMode('kiosk');
              if (targetScreen === 'computers' && !currentStudent) {
                setCurrentStudent({
                  name: 'Carlos Mendoza',
                  email: 'carlos.mendoza@alumno.edu',
                  studentCode: 'EST-2024-889'
                });
              }
              setCurrentScreen(targetScreen);
            }}
          />
        ) : (
          /* Interactive Kiosk Frame */
          <div className="w-full">
            {/* Screen Breadcrumb / Step Indicator */}
            <div className="max-w-md mx-auto mb-4 flex items-center justify-center gap-2 text-[11px] font-bold text-neutral-500">
              <span
                onClick={() => setCurrentScreen('login')}
                className={`cursor-pointer px-2 py-0.5 rounded ${
                  currentScreen === 'login' ? 'bg-neutral-900 text-white' : 'hover:text-neutral-900'
                }`}
              >
                1. Login
              </span>
              <span>→</span>
              <span
                onClick={() => {
                  if (currentStudent) setCurrentScreen('computers');
                }}
                className={`cursor-pointer px-2 py-0.5 rounded ${
                  currentScreen === 'computers' ? 'bg-neutral-900 text-white' : 'hover:text-neutral-900'
                } ${!currentStudent ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                2. Computadoras
              </span>
              <span>→</span>
              <span
                className={`px-2 py-0.5 rounded ${
                  currentScreen === 'confirmation' ? 'bg-neutral-900 text-white' : 'text-neutral-400'
                }`}
              >
                3. Tarjeta / Gracias
              </span>
              <span>|</span>
              <span
                onClick={() => setCurrentScreen('release')}
                className={`cursor-pointer px-2 py-0.5 rounded ${
                  currentScreen === 'release' ? 'bg-amber-700 text-white' : 'text-amber-800 hover:text-amber-950'
                }`}
              >
                4. Soltar PC
              </span>
            </div>

            {/* Current Active Screen */}
            {currentScreen === 'login' && (
              <LoginView
                onLogin={handleLogin}
                onGoToRelease={() => setCurrentScreen('release')}
              />
            )}

            {currentScreen === 'computers' && (
              <ComputersListView
                computers={computers}
                student={
                  currentStudent || {
                    name: 'Carlos Mendoza',
                    email: 'carlos.mendoza@alumno.edu',
                    studentCode: 'EST-2024-889'
                  }
                }
                onSelectComputer={handleSelectComputer}
                onReleaseComputer={(id) => {
                  setPreselectedReleasePCId(id);
                  setCurrentScreen('release');
                }}
                onLogout={() => {
                  setCurrentStudent(null);
                  setCurrentScreen('login');
                }}
              />
            )}

            {currentScreen === 'confirmation' && lastAssigned && (
              <ConfirmationView
                computer={lastAssigned.computer}
                cardCode={lastAssigned.cardCode}
                student={
                  currentStudent || {
                    name: 'Carlos Mendoza',
                    email: 'carlos.mendoza@alumno.edu'
                  }
                }
                onAnotherOperation={() => setCurrentScreen('computers')}
                onFinishAndLogout={() => {
                  setCurrentStudent(null);
                  setCurrentScreen('login');
                  setNotification({
                    type: 'info',
                    message: 'Sesión finalizada. La pantalla está lista para el siguiente alumno.'
                  });
                }}
                onGoToRelease={() => {
                  setPreselectedReleasePCId(lastAssigned.computer.id);
                  setCurrentScreen('release');
                }}
              />
            )}

            {currentScreen === 'release' && (
              <ReleasePCView
                computers={computers}
                currentStudent={currentStudent}
                preselectedPCId={preselectedReleasePCId}
                onConfirmRelease={handleConfirmRelease}
                onBackToLogin={() => setCurrentScreen('login')}
                onBackToComputers={() => {
                  if (!currentStudent) {
                    setCurrentStudent({
                      name: 'Carlos Mendoza',
                      email: 'carlos.mendoza@alumno.edu',
                      studentCode: 'EST-2024-889'
                    });
                  }
                  setCurrentScreen('computers');
                }}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer info bar */}
      <footer className="mt-auto border-t border-neutral-300/80 bg-white/70 py-3 px-4 text-center text-xs text-neutral-500">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <span>Sistema de Kiosco para Laboratorio de Informática v2.4</span>
          <div className="flex items-center gap-3">
            <button
              onClick={handleResetLab}
              className="text-neutral-500 hover:text-red-600 transition cursor-pointer underline text-[11px]"
            >
              Reiniciar demo a valores iniciales
            </button>
            <span>•</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Equipos Verificados
            </span>
          </div>
        </div>
      </footer>

      {/* Lab History & Session Logs Modal */}
      <LabHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        history={history}
        onResetLab={handleResetLab}
      />
    </div>
  );
}
