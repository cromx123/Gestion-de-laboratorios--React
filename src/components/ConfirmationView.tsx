import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Computer } from '../types/lab';
import { DigitalCardBadge } from './DigitalCardBadge';
import { RetroComputerIcon } from './RetroComputerIcon';
import { 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  DoorOpen, 
  Clock, 
  HelpCircle,
  ShieldAlert
} from 'lucide-react';

interface ConfirmationViewProps {
  computer: Computer;
  cardCode: string;
  student: { name: string; email: string; studentCode?: string };
  onAnotherOperation: () => void;
  onFinishAndLogout: () => void;
  onGoToRelease: () => void;
}

export const ConfirmationView: React.FC<ConfirmationViewProps> = ({
  computer,
  cardCode,
  student,
  onAnotherOperation,
  onFinishAndLogout,
  onGoToRelease
}) => {
  const [countdown, setCountdown] = useState<number>(30);

  // Trigger celebration confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onFinishAndLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onFinishAndLogout]);

  return (
    <div className="w-full max-w-2xl mx-auto py-6 px-4 text-center">
      {/* Top success badge */}
      <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 border border-emerald-300 px-4 py-1.5 text-xs font-extrabold text-emerald-800 shadow-sm mb-4">
        <Sparkles className="w-4 h-4 text-emerald-600" />
        <span>¡Gracias por tomarlo!</span>
      </div>

      {/* Main Title matching wireframe: "Se ha registrado el uso del computador X" */}
      <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
        Se ha registrado el uso del computador {computer.name}
      </h2>

      {/* Instruction matching wireframe: "Porfavor toma la tarjeta del PC correspondiente" */}
      <p className="text-base sm:text-lg font-medium text-neutral-700 mt-2">
        Por favor toma la tarjeta del PC correspondiente
      </p>

      {/* Interactive visual representation of the physical card badge */}
      <div className="my-6">
        <DigitalCardBadge
          pcName={computer.name}
          cardCode={cardCode}
          studentName={student.name}
          studentEmail={student.email}
          startTime={new Date().toISOString()}
        />
      </div>

      {/* Physical pickup instruction card */}
      <div className="mx-auto max-w-sm rounded-xl border border-amber-300 bg-amber-50/80 p-3 text-xs text-amber-900 text-left flex items-start gap-2.5 mb-6">
        <div className="p-1 rounded-md bg-amber-200 text-amber-900 shrink-0 mt-0.5">
          <ShieldAlert className="w-4 h-4" />
        </div>
        <div>
          <strong className="font-bold block">Recordatorio de Seguridad</strong>
          Retira la tarjeta de acrílico con código <strong>{cardCode}</strong> del casillero #{computer.id} y mantenla visible en tu escritorio mientras usas el equipo.
        </div>
      </div>

      {/* Section matching wireframe: "Deseas realizar otra operación? SI / NO" */}
      <div className="rounded-2xl border-2 border-neutral-900 bg-white p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] max-w-md mx-auto">
        <p className="text-base sm:text-lg font-extrabold text-neutral-900 mb-4 flex items-center justify-center gap-2">
          <HelpCircle className="w-5 h-5 text-neutral-600" />
          <span>¿Deseas realizar otra operación?</span>
        </p>

        <div className="flex items-center justify-center gap-4">
          {/* SÍ button */}
          <button
            type="button"
            onClick={onAnotherOperation}
            className="flex-1 py-3 px-6 rounded-xl border-2 border-neutral-900 bg-white hover:bg-neutral-100 font-extrabold text-neutral-900 text-base shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:scale-95 transition-all cursor-pointer"
          >
            SÍ
          </button>

          {/* NO button */}
          <button
            type="button"
            onClick={onFinishAndLogout}
            className="flex-1 py-3 px-6 rounded-xl border-2 border-neutral-900 bg-emerald-600 hover:bg-emerald-500 font-extrabold text-white text-base shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:scale-95 transition-all cursor-pointer"
          >
            NO
          </button>
        </div>

        {/* Automatic logout timer */}
        <p className="text-[11px] text-neutral-400 mt-4">
          La pantalla volverá al inicio automáticamente en <strong>{countdown}s</strong>
        </p>
      </div>

      {/* Direct link to Release screen */}
      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={onGoToRelease}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 underline underline-offset-4 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
          <span>¿Ya terminaste de trabajar? Haz clic aquí para soltar el PC ahora</span>
        </button>
      </div>
    </div>
  );
};
