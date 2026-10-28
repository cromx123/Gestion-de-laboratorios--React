import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Computer } from '../types/lab';
import { RetroComputerIcon } from './RetroComputerIcon';
import { 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  ArrowLeft, 
  AlertCircle,
  Sparkles,
  HelpCircle,
  Inbox
} from 'lucide-react';

interface ReleasePCViewProps {
  computers: Computer[];
  currentStudent?: { name: string; email: string; studentCode?: string } | null;
  preselectedPCId?: number | null;
  onConfirmRelease: (computerId: number) => { success: boolean; durationMinutes?: number };
  onBackToLogin: () => void;
  onBackToComputers: () => void;
}

export const ReleasePCView: React.FC<ReleasePCViewProps> = ({
  computers,
  currentStudent,
  preselectedPCId,
  onConfirmRelease,
  onBackToLogin,
  onBackToComputers
}) => {
  const occupiedComputers = computers.filter((c) => c.status === 'occupied');

  // If student has an active PC or preselected PC
  const defaultSelectedId = preselectedPCId 
    ? preselectedPCId 
    : currentStudent 
      ? computers.find((c) => c.currentSession?.studentEmail.toLowerCase() === currentStudent.email.toLowerCase())?.id || occupiedComputers[0]?.id
      : occupiedComputers[0]?.id;

  const [selectedPCId, setSelectedPCId] = useState<number | undefined>(defaultSelectedId);
  const [releasedInfo, setReleasedInfo] = useState<{ pcName: string; duration: number } | null>(null);

  // Sync selectedPCId if current selection is no longer occupied
  React.useEffect(() => {
    if (selectedPCId) {
      const stillOccupied = occupiedComputers.some((c) => c.id === selectedPCId);
      if (!stillOccupied) {
        setSelectedPCId(occupiedComputers[0]?.id);
      }
    } else if (occupiedComputers.length > 0) {
      setSelectedPCId(occupiedComputers[0].id);
    }
  }, [computers, occupiedComputers, selectedPCId]);

  const selectedPC = computers.find((c) => c.id === selectedPCId && c.status === 'occupied');

  const handleRelease = () => {
    if (!selectedPCId || !selectedPC) return;

    const res = onConfirmRelease(selectedPCId);
    if (res.success) {
      try {
        confetti({
          particleCount: 50,
          spread: 50,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
      setReleasedInfo({
        pcName: selectedPC.name,
        duration: res.durationMinutes || 25
      });
    }
  };

  // If already released, show the success thank-you screen
  if (releasedInfo) {
    return (
      <div className="w-full max-w-lg mx-auto py-8 px-4 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center text-emerald-600 shadow-md">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-300 px-3 py-1 text-xs font-bold text-emerald-800 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Entrega Registrada con Éxito</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900">
          ¡{releasedInfo.pcName} ha sido liberado!
        </h2>

        <p className="text-base text-neutral-700 mt-2 font-medium">
          Gracias por entregar el equipo a tiempo y cuidar el laboratorio.
        </p>

        {/* Card deposit reminder box */}
        <div className="my-6 rounded-2xl border-2 border-neutral-900 bg-amber-50 p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-left flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-200 text-amber-900 shrink-0">
            <Inbox className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-neutral-900">
              Paso final: Deposita la tarjeta física
            </h4>
            <p className="text-xs text-neutral-700 mt-1">
              Por favor deposita la tarjeta de acceso en el buzón de devolución junto a la salida para que esté disponible para el siguiente alumno.
            </p>
          </div>
        </div>

        {/* Another operation section */}
        <div className="rounded-2xl border-2 border-neutral-900 bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-sm font-extrabold text-neutral-900 mb-3 flex items-center justify-center gap-2">
            <HelpCircle className="w-4 h-4 text-neutral-600" />
            <span>¿Deseas realizar otra operación?</span>
          </p>

          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={onBackToComputers}
              className="flex-1 py-2.5 px-4 rounded-xl border-2 border-neutral-900 bg-white hover:bg-neutral-100 font-extrabold text-neutral-900 text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:scale-95 transition-all cursor-pointer"
            >
              SÍ
            </button>
            <button
              type="button"
              onClick={onBackToLogin}
              className="flex-1 py-2.5 px-4 rounded-xl border-2 border-neutral-900 bg-emerald-600 hover:bg-emerald-500 font-extrabold text-white text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:scale-95 transition-all cursor-pointer"
            >
              NO (Salir)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If no computers are occupied in the lab
  if (occupiedComputers.length === 0) {
    return (
      <div className="w-full max-w-md mx-auto py-10 px-4 text-center">
        <div className="rounded-2xl border-2 border-neutral-900 bg-white p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-neutral-100 border border-neutral-300 flex items-center justify-center text-neutral-500">
            <RotateCcw className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-extrabold text-neutral-900">
            No hay computadores en uso
          </h2>
          <p className="text-xs text-neutral-600 mt-2">
            Todos los equipos del laboratorio están actualmente disponibles.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <button
              type="button"
              onClick={onBackToComputers}
              className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-sm shadow transition cursor-pointer"
            >
              Ver Computadoras Disponibles
            </button>
            <button
              type="button"
              onClick={onBackToLogin}
              className="text-xs text-neutral-500 hover:text-neutral-900 py-1 cursor-pointer"
            >
              Volver al Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto py-6 px-4">
      {/* Back button */}
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={onBackToComputers}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-700 hover:text-neutral-900 bg-white border border-neutral-300 rounded-lg px-3 py-1.5 shadow-sm transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al catálogo de PCs</span>
        </button>

        <span className="text-xs font-semibold text-neutral-500">
          Equipos ocupados: {occupiedComputers.length}
        </span>
      </div>

      {/* Main card */}
      <div className="rounded-2xl border-2 border-neutral-900 bg-white p-6 sm:p-7 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 border border-amber-300 px-3 py-1 text-xs font-bold text-amber-800 mb-2">
            <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
            <span>Devolución de Equipo</span>
          </div>
          <h2 className="text-2xl font-extrabold text-neutral-900">
            Soltar y Devolver Computador
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1">
            Selecciona tu computador asignado para finalizar la sesión y devolver la tarjeta.
          </p>
        </div>

        {/* Computer Selector */}
        <div className="space-y-3 mb-6">
          <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-700">
            Selecciona el Computador a liberar:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {occupiedComputers.map((pc) => {
              const isSelected = pc.id === selectedPCId;
              const isMine =
                currentStudent &&
                pc.currentSession?.studentEmail.toLowerCase() === currentStudent.email.toLowerCase();

              return (
                <button
                  key={pc.id}
                  type="button"
                  onClick={() => setSelectedPCId(pc.id)}
                  className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer relative ${
                    isSelected
                      ? 'border-neutral-900 bg-amber-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                      : 'border-neutral-200 bg-neutral-50 hover:bg-white hover:border-neutral-400'
                  }`}
                >
                  {isMine && (
                    <span className="absolute top-1.5 right-1.5 text-[9px] font-bold bg-emerald-600 text-white rounded px-1 py-0.2">
                      Tu PC
                    </span>
                  )}
                  <div className="text-sm font-extrabold text-neutral-900">{pc.name}</div>
                  <div className="text-[11px] text-neutral-600 truncate mt-0.5">
                    {pc.currentSession?.studentName.split(' ')[0]}
                  </div>
                  <div className="text-[10px] text-amber-800 font-mono mt-1">
                    {pc.currentSession?.cardCode}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected PC Details Box */}
        {selectedPC && selectedPC.currentSession && (
          <div className="rounded-xl border border-neutral-300 bg-neutral-50 p-4 mb-6 space-y-2.5">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
              <span className="text-xs font-bold text-neutral-500 uppercase">Detalles de Sesión</span>
              <span className="text-xs font-mono font-bold text-neutral-900 bg-neutral-200 px-2 py-0.5 rounded">
                {selectedPC.name}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-neutral-500 block">Alumno Registrado:</span>
                <span className="font-bold text-neutral-900">{selectedPC.currentSession.studentName}</span>
                <span className="text-[11px] text-neutral-500 block truncate">
                  {selectedPC.currentSession.studentEmail}
                </span>
              </div>
              <div>
                <span className="text-neutral-500 block">Tarjeta Asignada:</span>
                <span className="font-mono font-bold text-amber-900">
                  {selectedPC.currentSession.cardCode}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-200 text-xs flex items-center justify-between">
              <span className="text-neutral-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-neutral-400" /> Hora de inicio:
              </span>
              <span className="font-semibold text-neutral-800">
                {new Date(selectedPC.currentSession.startTime).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })} hrs
              </span>
            </div>
          </div>
        )}

        {/* Student Checklist Before Leaving */}
        <div className="rounded-xl border border-amber-300 bg-amber-50/70 p-3.5 text-xs text-amber-900 mb-6">
          <span className="font-bold block mb-1">Antes de retirarte del laboratorio:</span>
          <ul className="list-disc list-inside space-y-0.5 text-neutral-700">
            <li>Guarda todos tus trabajos personales en la nube o unidad USB.</li>
            <li>Cierra tus cuentas de correo y plataformas universitarias.</li>
            <li>Toma la tarjeta física y deposítala en el buzón al salir.</li>
          </ul>
        </div>

        {/* Action Button: Confirmar y Soltar PC */}
        <button
          type="button"
          onClick={handleRelease}
          disabled={!selectedPCId || !selectedPC}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-500 active:scale-[0.98] text-white font-extrabold py-3.5 px-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer disabled:opacity-50"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Confirmar y Soltar {selectedPC ? selectedPC.name : 'Computador'}</span>
        </button>
      </div>
    </div>
  );
};
