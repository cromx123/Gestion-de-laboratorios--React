import React from 'react';
import { Computer } from '../types/lab';
import { RetroComputerIcon } from './RetroComputerIcon';
import { Mail, KeyRound, ArrowRight, QrCode } from 'lucide-react';

interface WireframeViewProps {
  computers: Computer[];
  onSelectPC: (pc: Computer) => void;
  onGoToKiosk: (screen: 'login' | 'computers' | 'confirmation' | 'release') => void;
}

export const WireframeView: React.FC<WireframeViewProps> = ({
  computers,
  onSelectPC,
  onGoToKiosk
}) => {
  return (
    <div className="w-full overflow-x-auto py-8 px-4">
      <div className="text-center mb-6">
        <span className="inline-block bg-neutral-900 text-white text-xs font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
          Diseño Basado en tu Wireframe
        </span>
        <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900">
          Vista Panorámica del Flujo Completo (3 Pantallas)
        </h2>
        <p className="text-xs sm:text-sm text-neutral-600 max-w-xl mx-auto mt-1">
          Representación exacta de las tres pantallas dibujadas en el boceto de diseño con componentes interactivos reales.
        </p>
      </div>

      {/* Dotted grid canvas matching the image attachment background */}
      <div 
        className="min-w-[1100px] max-w-7xl mx-auto p-8 rounded-3xl border-2 border-neutral-300 bg-neutral-50 shadow-inner flex items-stretch justify-center gap-6"
        style={{
          backgroundImage: 'radial-gradient(#94a3b8 1.2px, transparent 1.2px)',
          backgroundSize: '24px 24px'
        }}
      >
        {/* ================= SCREEN 1: LOGIN ================= */}
        <div className="w-[330px] shrink-0 rounded-3xl border-[3.5px] border-neutral-900 bg-white p-6 shadow-2xl flex flex-col justify-between min-h-[580px] relative">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-neutral-200 rounded-full" />
          
          <div className="text-center mt-8">
            <h3 className="text-xl font-bold tracking-widest text-neutral-900 uppercase">
              LOGIN
            </h3>
          </div>

          {/* Central box as in wireframe */}
          <div className="my-auto rounded-xl border-2 border-neutral-900 bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Correo del Alumno
                </label>
                <div className="w-full border-b border-neutral-800 pb-1 text-xs text-neutral-500 font-mono">
                  carlos.mendoza@alumno.edu
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Clave
                </label>
                <div className="w-full border-b border-neutral-800 pb-1 text-xs text-neutral-500 font-mono tracking-widest">
                  ••••••••
                </div>
              </div>

              <div className="text-right pt-2">
                <button
                  type="button"
                  onClick={() => onGoToKiosk('computers')}
                  className="text-xs font-bold text-neutral-900 hover:text-emerald-700 cursor-pointer"
                >
                  ingresar →
                </button>
              </div>
            </div>
          </div>

          <div className="text-center mb-2">
            <button
              onClick={() => onGoToKiosk('login')}
              className="text-[11px] font-bold text-neutral-600 hover:text-neutral-900 underline cursor-pointer"
            >
              Abrir Pantalla 1
            </button>
          </div>
        </div>

        {/* ================= SCREEN 2: COMPUTADORAS DISPONIBLES ================= */}
        <div className="w-[440px] shrink-0 rounded-3xl border-[3.5px] border-neutral-900 bg-white p-5 shadow-2xl flex flex-col justify-between min-h-[580px] relative">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-neutral-200 rounded-full" />

          <div className="text-center mt-6 mb-3">
            <h3 className="text-base sm:text-lg font-bold text-neutral-900 tracking-wide">
              Computadoras Disponibles
            </h3>
            <p className="text-[11px] text-neutral-500">
              {computers.filter((c) => c.status === 'available').length} de 10 libres
            </p>
          </div>

          {/* PC 1 to PC 10 Grid matching drawing (2 rows of 5) */}
          <div className="my-auto space-y-4">
            {/* Row 1: PC 1 - PC 5 */}
            <div className="grid grid-cols-5 gap-2 text-center">
              {computers.slice(0, 5).map((pc) => (
                <div
                  key={pc.id}
                  onClick={() => onSelectPC(pc)}
                  className={`flex flex-col items-center p-1 rounded-xl transition-all cursor-pointer ${
                    pc.status === 'available'
                      ? 'hover:bg-emerald-50 hover:scale-105'
                      : 'opacity-70'
                  }`}
                >
                  <RetroComputerIcon
                    status={pc.status}
                    pcNumber={pc.id}
                    size="sm"
                  />
                  <span className="text-[11px] font-bold text-neutral-900 mt-1">
                    {pc.name}
                  </span>
                  <span className={`text-[8px] font-bold px-1 rounded ${
                    pc.status === 'available' ? 'text-emerald-700 bg-emerald-100' : 'text-amber-800 bg-amber-100'
                  }`}>
                    {pc.status === 'available' ? 'Libre' : 'Ocup.'}
                  </span>
                </div>
              ))}
            </div>

            {/* Row 2: PC 6 - PC 10 */}
            <div className="grid grid-cols-5 gap-2 text-center">
              {computers.slice(5, 10).map((pc) => (
                <div
                  key={pc.id}
                  onClick={() => onSelectPC(pc)}
                  className={`flex flex-col items-center p-1 rounded-xl transition-all cursor-pointer ${
                    pc.status === 'available'
                      ? 'hover:bg-emerald-50 hover:scale-105'
                      : 'opacity-70'
                  }`}
                >
                  <RetroComputerIcon
                    status={pc.status}
                    pcNumber={pc.id}
                    size="sm"
                  />
                  <span className="text-[11px] font-bold text-neutral-900 mt-1">
                    {pc.name}
                  </span>
                  <span className={`text-[8px] font-bold px-1 rounded ${
                    pc.status === 'available' ? 'text-emerald-700 bg-emerald-100' : 'text-amber-800 bg-amber-100'
                  }`}>
                    {pc.status === 'available' ? 'Libre' : 'Ocup.'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mb-2">
            <button
              onClick={() => onGoToKiosk('computers')}
              className="text-[11px] font-bold text-neutral-600 hover:text-neutral-900 underline cursor-pointer"
            >
              Abrir Pantalla 2
            </button>
          </div>
        </div>

        {/* ================= SCREEN 3: CONFIRMACIÓN Y TARJETA ================= */}
        <div className="w-[330px] shrink-0 rounded-3xl border-[3.5px] border-neutral-900 bg-white p-6 shadow-2xl flex flex-col justify-between min-h-[580px] relative text-center">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-neutral-200 rounded-full" />

          <div className="mt-8 space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 leading-snug">
              Se ha registrado el uso del computador PC 1
            </h3>

            <p className="text-xs text-neutral-600">
              Porfavor toma la tarjeta del PC correspondiente
            </p>

            {/* Mini ticket badge */}
            <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-left shadow-sm">
              <div className="flex items-center justify-between text-[10px] font-mono font-bold text-amber-900 mb-1">
                <span>TARJETA PC 1</span>
                <span>TRJ-PC01-4412</span>
              </div>
              <div className="text-xs font-bold text-neutral-900">Carlos Mendoza</div>
              <div className="text-[10px] text-neutral-500">Mantenla contigo en tu mesa</div>
            </div>
          </div>

          <div className="my-auto py-4">
            <p className="text-xs font-bold text-neutral-900 mb-4">
              ¿Deseas realizar otra operación?
            </p>

            <div className="flex items-center justify-center gap-6 text-sm font-bold text-neutral-900">
              <button
                onClick={() => onGoToKiosk('computers')}
                className="hover:text-emerald-600 hover:underline cursor-pointer"
              >
                SI
              </button>
              <button
                onClick={() => onGoToKiosk('login')}
                className="hover:text-emerald-600 hover:underline cursor-pointer"
              >
                NO
              </button>
            </div>
          </div>

          <div className="text-center mb-2">
            <button
              onClick={() => onGoToKiosk('release')}
              className="text-[11px] font-bold text-amber-700 hover:text-amber-900 underline cursor-pointer"
            >
              Ver Pantalla 4: Soltar PC
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
