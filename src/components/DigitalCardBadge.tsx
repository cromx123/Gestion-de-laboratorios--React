import React from 'react';
import { CreditCard, QrCode, Monitor, CheckCircle2, ShieldCheck } from 'lucide-react';

interface DigitalCardBadgeProps {
  pcName: string;
  cardCode: string;
  studentName: string;
  studentEmail: string;
  startTime: string;
}

export const DigitalCardBadge: React.FC<DigitalCardBadgeProps> = ({
  pcName,
  cardCode,
  studentName,
  studentEmail,
  startTime
}) => {
  const formattedTime = new Date(startTime).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="relative mx-auto w-full max-w-sm rounded-2xl border-2 border-amber-300/80 bg-gradient-to-br from-amber-50 via-white to-amber-100/90 p-5 shadow-xl text-neutral-800 font-sans overflow-hidden">
      {/* Decorative background watermark */}
      <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-amber-200/30 rounded-full blur-xl pointer-events-none" />
      <div className="absolute right-4 top-4 opacity-10">
        <Monitor className="w-24 h-24 text-amber-900" />
      </div>

      {/* Card Header */}
      <div className="flex items-center justify-between border-b border-amber-200 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow">
            PC
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-800">
              Tarjeta de Acceso al Laboratorio
            </h4>
            <p className="text-sm font-bold text-neutral-900">Estación {pcName}</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 border border-emerald-300">
          <CheckCircle2 className="w-3.5 h-3.5" /> Activa
        </span>
      </div>

      {/* Card Body */}
      <div className="mt-4 space-y-2.5 text-left">
        <div>
          <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-500 block">
            Alumno Asignado
          </span>
          <p className="text-base font-bold text-neutral-900 truncate">{studentName}</p>
          <p className="text-xs text-neutral-600 truncate">{studentEmail}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-amber-200/70 text-xs">
          <div>
            <span className="text-[10px] font-medium uppercase text-neutral-500 block">
              Hora Inicio
            </span>
            <span className="font-semibold text-neutral-800">{formattedTime} hrs</span>
          </div>
          <div>
            <span className="text-[10px] font-medium uppercase text-neutral-500 block">
              Código Físico
            </span>
            <span className="font-mono font-bold text-amber-900 bg-amber-200/60 px-1.5 py-0.5 rounded text-[11px]">
              {cardCode}
            </span>
          </div>
        </div>
      </div>

      {/* Card Footer Barcode & Instruction */}
      <div className="mt-4 pt-3 border-t-2 border-dashed border-amber-300/90 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-amber-900 font-mono text-xs">
          <QrCode className="w-6 h-6 text-neutral-700" />
          <span className="tracking-widest font-bold">{cardCode}</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-amber-800 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Tarjeta Oficial</span>
        </div>
      </div>
    </div>
  );
};
