import React from 'react';
import { SessionHistoryItem } from '../types/lab';
import { History, X, Clock, CheckCircle2, RotateCcw, Monitor } from 'lucide-react';

interface LabHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: SessionHistoryItem[];
  onResetLab: () => void;
}

export const LabHistoryModal: React.FC<LabHistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onResetLab
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-2xl rounded-2xl border-2 border-neutral-900 bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-neutral-100 text-neutral-800">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-neutral-900">
                Historial de Devoluciones y Sesiones
              </h3>
              <p className="text-xs text-neutral-500">
                Registro de computadoras utilizadas y devueltas en la jornada
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto py-4 space-y-2.5">
          {history.length === 0 ? (
            <div className="text-center py-12 text-neutral-400">
              <History className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-semibold">No hay registros de devoluciones aún</p>
              <p className="text-xs text-neutral-500 mt-1">
                Cuando un estudiante devuelva un PC, quedará registrado aquí.
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-neutral-200 bg-neutral-50 p-3 flex flex-wrap items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    {item.computerName}
                  </div>
                  <div>
                    <span className="font-bold text-neutral-900 block">{item.studentName}</span>
                    <span className="text-neutral-500 text-[11px] font-mono">{item.cardCode}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase block">Duración</span>
                    <span className="font-bold text-neutral-800">{item.durationMinutes} min</span>
                  </div>
                  <div className="hidden sm:block">
                    <span className="text-[10px] text-neutral-400 uppercase block">Hora Entrega</span>
                    <span className="text-neutral-700">
                      {new Date(item.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    <CheckCircle2 className="w-3 h-3" /> Devuelto
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-200 pt-3 flex items-center justify-between">
          <button
            onClick={() => {
              if (window.confirm('¿Deseas restablecer todos los computadores al estado inicial?')) {
                onResetLab();
                onClose();
              }
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 px-2.5 py-1.5 rounded-lg border border-red-200 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer Laboratorio</span>
          </button>

          <button
            onClick={onClose}
            className="py-1.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs shadow transition cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
