import React, { useState } from 'react';
import { LogIn, KeyRound, Mail, Sparkles, UserCheck, ArrowRight, RotateCcw } from 'lucide-react';

interface LoginViewProps {
  onLogin: (student: { name: string; email: string; studentCode?: string }) => void;
  onGoToRelease: () => void;
}

const PRESET_STUDENTS = [
  { name: 'Carlos Mendoza', email: 'carlos.mendoza@alumno.edu', code: 'EST-2024-889' },
  { name: 'Sofía Valenzuela', email: 'sofia.v@alumno.edu', code: 'EST-2024-512' },
  { name: 'Martín Soto', email: 'martin.soto@alumno.edu', code: 'EST-2023-304' },
];

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, onGoToRelease }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setError('Por favor ingresa tu correo institucional de alumno.');
      return;
    }

    if (!cleanEmail.includes('@')) {
      setError('Por favor ingresa un correo con formato válido (ej. alumno@universidad.edu).');
      return;
    }

    // Extract student name from email or preset match
    const matchedPreset = PRESET_STUDENTS.find(
      (s) => s.email.toLowerCase() === cleanEmail.toLowerCase()
    );

    const name = matchedPreset
      ? matchedPreset.name
      : cleanEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

    const studentCode = matchedPreset?.code || `EST-${Math.floor(1000 + Math.random() * 9000)}`;

    setError(null);
    onLogin({ name, email: cleanEmail, studentCode });
  };

  const handleSelectPreset = (preset: typeof PRESET_STUDENTS[0]) => {
    setEmail(preset.email);
    setPassword('••••••••');
    setError(null);
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center py-6 px-4">
      {/* Title as specified in wireframe */}
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wider text-neutral-900 uppercase">
          LOGIN
        </h1>
        <p className="text-sm text-neutral-600 mt-1">
          Acceso al Laboratorio de Computación
        </p>
      </div>

      {/* Main card box mirroring the wireframe box */}
      <div className="w-full rounded-2xl border-2 border-neutral-900 bg-white p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Correo del Alumno */}
          <div>
            <label
              htmlFor="student-email"
              className="block text-sm font-bold text-neutral-900 mb-1.5"
            >
              Correo del Alumno
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                <Mail className="w-5 h-5" />
              </div>
              <input
                id="student-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="ej. carlos.mendoza@alumno.edu"
                className="w-full rounded-xl border-2 border-neutral-800 bg-neutral-50/50 pl-10 pr-3.5 py-2.5 text-sm font-medium text-neutral-900 placeholder-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                autoComplete="email"
              />
            </div>
          </div>

          {/* Clave */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="student-password"
                className="block text-sm font-bold text-neutral-900"
              >
                Clave
              </label>
              <span className="text-xs text-neutral-400">(demo: cualquier clave)</span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                <KeyRound className="w-5 h-5" />
              </div>
              <input
                id="student-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border-2 border-neutral-800 bg-neutral-50/50 pl-10 pr-3.5 py-2.5 text-sm font-medium text-neutral-900 placeholder-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>

          {/* Error notice */}
          {error && (
            <div
              role="alert"
              className="rounded-lg bg-red-50 border border-red-300 p-3 text-xs font-semibold text-red-700"
            >
              {error}
            </div>
          )}

          {/* Ingresar Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 active:scale-[0.98] text-white font-bold py-3 px-4 shadow-[3px_3px_0px_0px_rgba(16,185,129,1)] transition-all cursor-pointer"
            >
              <span>Ingresar</span>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </button>
          </div>
        </form>

        {/* Quick presets for rapid testing */}
        <div className="mt-6 pt-5 border-t border-neutral-200">
          <div className="flex items-center justify-between text-xs font-semibold text-neutral-500 mb-2">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Alumnos Demo
            </span>
            <span className="text-[11px] text-neutral-400">Clic para rellenar</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_STUDENTS.map((preset) => (
              <button
                key={preset.email}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className="text-xs bg-neutral-100 hover:bg-emerald-100 hover:text-emerald-800 hover:border-emerald-300 border border-neutral-200 rounded-lg px-2.5 py-1 text-neutral-700 font-medium transition-colors cursor-pointer"
              >
                {preset.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Alternative flow: student wants to release/return a PC right away */}
      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={onGoToRelease}
          className="inline-flex items-center gap-2 text-xs font-bold text-neutral-700 hover:text-emerald-700 bg-white/80 hover:bg-white border border-neutral-300 rounded-full px-4 py-2 shadow-sm transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
          <span>¿Vienes a entregar tu equipo? <strong>Soltar / Devolver PC</strong></span>
        </button>
      </div>
    </div>
  );
};
