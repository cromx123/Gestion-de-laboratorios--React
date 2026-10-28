import React, { useState } from 'react';
import { Computer } from '../types/lab';
import { RetroComputerIcon } from './RetroComputerIcon';
import { 
  CheckCircle, 
  Clock, 
  User, 
  Info, 
  ArrowLeft, 
  LogOut, 
  Filter, 
  Cpu,
  RotateCcw
} from 'lucide-react';

interface ComputersListViewProps {
  computers: Computer[];
  student: { name: string; email: string; studentCode?: string };
  onSelectComputer: (computer: Computer) => void;
  onReleaseComputer: (computerId: number) => void;
  onLogout: () => void;
}

export const ComputersListView: React.FC<ComputersListViewProps> = ({
  computers,
  student,
  onSelectComputer,
  onReleaseComputer,
  onLogout
}) => {
  const [filter, setFilter] = useState<'all' | 'available' | 'occupied'>('all');
  const [hoveredPC, setHoveredPC] = useState<Computer | null>(null);

  const availableCount = computers.filter((c) => c.status === 'available').length;
  const occupiedCount = computers.filter((c) => c.status === 'occupied').length;

  const filteredComputers = computers.filter((pc) => {
    if (filter === 'available') return pc.status === 'available';
    if (filter === 'occupied') return pc.status === 'occupied';
    return true;
  });

  // Check if current logged in student already has an assigned PC
  const currentStudentPC = computers.find(
    (c) => c.status === 'occupied' && c.currentSession?.studentEmail.toLowerCase() === student.email.toLowerCase()
  );

  return (
    <div className="w-full max-w-5xl mx-auto py-4 px-3 sm:px-6">
      {/* Student Top Bar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 bg-white/90 backdrop-blur-sm border-2 border-neutral-900 rounded-xl p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-400 flex items-center justify-center text-emerald-800 font-bold">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-neutral-900">{student.name}</span>
              <span className="text-[10px] font-mono bg-neutral-100 border border-neutral-300 rounded px-1.5 py-0.5 text-neutral-600">
                {student.studentCode || 'Alumno'}
              </span>
            </div>
            <p className="text-xs text-neutral-500">{student.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentStudentPC && (
            <button
              onClick={() => onReleaseComputer(currentStudentPC.id)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-400 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
              <span>Soltar mi {currentStudentPC.name}</span>
            </button>
          )}

          <button
            onClick={onLogout}
            className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-700 hover:text-red-600 bg-neutral-100 hover:bg-red-50 border border-neutral-300 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            aria-label="Cerrar sesión"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cambiar Alumno</span>
          </button>
        </div>
      </div>

      {/* Title directly matching the wireframe */}
      <div className="text-center my-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-wide">
          Computadoras Disponibles
        </h2>
        <p className="text-xs sm:text-sm text-neutral-600 mt-1">
          Selecciona una computadora libre para registrar su uso
        </p>

        {/* Filter controls */}
        <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-xs font-bold rounded-lg border-2 transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-neutral-900 text-white border-neutral-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                : 'bg-white text-neutral-700 border-neutral-300 hover:border-neutral-900'
            }`}
          >
            Todas ({computers.length})
          </button>
          <button
            onClick={() => setFilter('available')}
            className={`px-3 py-1 text-xs font-bold rounded-lg border-2 transition-all cursor-pointer ${
              filter === 'available'
                ? 'bg-emerald-600 text-white border-emerald-700 shadow-[2px_2px_0px_0px_rgba(5,150,105,1)]'
                : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
            }`}
          >
            ✓ Disponibles ({availableCount})
          </button>
          <button
            onClick={() => setFilter('occupied')}
            className={`px-3 py-1 text-xs font-bold rounded-lg border-2 transition-all cursor-pointer ${
              filter === 'occupied'
                ? 'bg-amber-600 text-white border-amber-700 shadow-[2px_2px_0px_0px_rgba(217,119,6,1)]'
                : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
            }`}
          >
            ● En Uso ({occupiedCount})
          </button>
        </div>
      </div>

      {/* Notice if current student already has a PC */}
      {currentStudentPC && (
        <div className="mb-4 rounded-xl border-2 border-amber-400 bg-amber-50 p-3 text-xs sm:text-sm text-amber-900 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-amber-600 shrink-0" />
            <span>
              Actualmente tienes asignado el <strong>{currentStudentPC.name}</strong>. Para tomar otro, primero debes soltar el actual.
            </span>
          </div>
          <button
            onClick={() => onReleaseComputer(currentStudentPC.id)}
            className="ml-3 shrink-0 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1 text-xs shadow transition cursor-pointer"
          >
            Soltar PC
          </button>
        </div>
      )}

      {/* Grid matching the wireframe: 5 columns on desktop, responsive for tablets/mobile */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 my-4">
        {filteredComputers.map((computer) => {
          const isAvailable = computer.status === 'available';
          const isCurrentStudentPC =
            computer.currentSession?.studentEmail.toLowerCase() === student.email.toLowerCase();

          return (
            <div
              key={computer.id}
              onMouseEnter={() => setHoveredPC(computer)}
              onMouseLeave={() => setHoveredPC(null)}
              className={`group relative flex flex-col items-center justify-between rounded-2xl border-2 p-3 transition-all duration-200 text-center ${
                isAvailable
                  ? 'border-neutral-900 bg-white hover:border-emerald-600 hover:bg-emerald-50/40 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(16,185,129,1)] hover:-translate-y-0.5 cursor-pointer'
                  : isCurrentStudentPC
                  ? 'border-amber-500 bg-amber-50/70 shadow-[3px_3px_0px_0px_rgba(245,158,11,1)]'
                  : 'border-neutral-300 bg-neutral-100/80 opacity-90'
              }`}
              onClick={() => {
                if (isAvailable) {
                  onSelectComputer(computer);
                } else if (isCurrentStudentPC) {
                  onReleaseComputer(computer.id);
                }
              }}
              role="button"
              tabIndex={isAvailable || isCurrentStudentPC ? 0 : -1}
              aria-label={`${computer.name} - ${isAvailable ? 'Disponible' : 'Ocupado'}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  if (isAvailable) onSelectComputer(computer);
                  else if (isCurrentStudentPC) onReleaseComputer(computer.id);
                }
              }}
            >
              {/* Status pill badge on top */}
              <div className="w-full flex items-center justify-between mb-1">
                <span className="font-mono text-[11px] font-bold text-neutral-700 bg-neutral-200/70 px-1.5 py-0.5 rounded">
                  #{computer.id.toString().padStart(2, '0')}
                </span>
                {isAvailable ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 rounded-full px-2 py-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    Disponible
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100 border border-amber-300 rounded-full px-2 py-0.5">
                    Ocupado
                  </span>
                )}
              </div>

              {/* Retro Computer Illustration as drawn in mockup */}
              <div className="my-2">
                <RetroComputerIcon
                  status={computer.status}
                  pcNumber={computer.id}
                  size="md"
                />
              </div>

              {/* PC Label exactly as in wireframe: "PC 1", "PC 2", ... */}
              <div className="w-full mt-1">
                <h3 className="text-base font-extrabold text-neutral-900 group-hover:text-emerald-700 transition-colors">
                  {computer.name}
                </h3>

                {isAvailable ? (
                  <div className="mt-2 w-full">
                    <span className="block w-full py-1.5 px-2 rounded-lg bg-emerald-600 group-hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-all">
                      Tomar PC
                    </span>
                  </div>
                ) : isCurrentStudentPC ? (
                  <div className="mt-2 w-full">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onReleaseComputer(computer.id);
                      }}
                      className="w-full py-1 px-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold shadow-sm transition-all cursor-pointer"
                    >
                      Soltar mi PC
                    </button>
                  </div>
                ) : (
                  <div className="mt-1 text-[11px] text-neutral-500 truncate">
                    <span>En uso: {computer.currentSession?.studentName.split(' ')[0]}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Specs / Info footer preview */}
      <div className="mt-6 p-3 rounded-xl border border-neutral-300 bg-white/70 text-xs text-neutral-600 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-emerald-600" />
          <span>Equipos equipados con Intel Core i5/i7, 16GB RAM y software de desarrollo y ofimática.</span>
        </div>
        <span className="font-semibold text-neutral-700">Normas del laboratorio: Uso máximo 120 min.</span>
      </div>
    </div>
  );
};
