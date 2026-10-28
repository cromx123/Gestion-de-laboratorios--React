import React from 'react';

interface RetroComputerIconProps {
  status: 'available' | 'occupied' | 'maintenance';
  pcNumber: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const RetroComputerIcon: React.FC<RetroComputerIconProps> = ({
  status,
  pcNumber,
  className = '',
  size = 'md'
}) => {
  const isAvailable = status === 'available';
  const isOccupied = status === 'occupied';

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24 sm:w-28 sm:h-28',
    lg: 'w-36 h-36'
  }[size];

  return (
    <div className={`relative flex flex-col items-center select-none ${sizeClasses} ${className}`}>
      {/* SVG Retro CRT Monitor, Chassis, Keyboard, and Mouse modeled after the beige retro PC in the wireframe */}
      <svg
        viewBox="0 0 120 105"
        className="w-full h-full drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Shadow base */}
        <ellipse cx="60" cy="100" rx="48" ry="4" fill="#000000" fillOpacity="0.12" />

        {/* --- CRT MONITOR BEZEL --- */}
        {/* Outer bezel */}
        <rect
          x="22"
          y="6"
          width="76"
          height="58"
          rx="9"
          fill="#dcd3b8"
          stroke="#b5aa8b"
          strokeWidth="2.5"
        />
        {/* Bezel inner chamfer */}
        <rect
          x="26"
          y="10"
          width="68"
          height="48"
          rx="6"
          fill="#c8be9f"
        />

        {/* CRT Screen Glass */}
        <rect
          x="30"
          y="14"
          width="60"
          height="40"
          rx="4"
          fill={isAvailable ? '#1a2e26' : '#2b1a1c'}
          stroke="#3d372c"
          strokeWidth="1.5"
        />

        {/* Screen Content Reflection & Graphics */}
        {isAvailable ? (
          <>
            {/* Soft green phosphor terminal glow */}
            <rect x="33" y="17" width="54" height="34" rx="2" fill="#10b981" fillOpacity="0.12" />
            {/* Terminal prompt lines */}
            <rect x="35" y="21" width="16" height="3" rx="1" fill="#34d399" />
            <rect x="35" y="27" width="28" height="2" rx="1" fill="#10b981" fillOpacity="0.7" />
            <rect x="35" y="32" width="22" height="2" rx="1" fill="#10b981" fillOpacity="0.7" />
            
            {/* Centered ready text / icon */}
            <circle cx="60" cy="34" r="5" fill="#10b981" fillOpacity="0.25" />
            <path
              d="M58 34L59.5 35.5L62.5 32.5"
              stroke="#10b981"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Screen shine overlay */}
            <path
              d="M32 16L56 16L32 38Z"
              fill="#ffffff"
              fillOpacity="0.08"
            />
          </>
        ) : (
          <>
            {/* Amber / Red occupied screen */}
            <rect x="33" y="17" width="54" height="34" rx="2" fill="#ef4444" fillOpacity="0.12" />
            {/* Lock / user busy graphic */}
            <rect x="42" y="24" width="36" height="18" rx="2" fill="#7f1d1d" fillOpacity="0.4" />
            <circle cx="60" cy="30" r="3" fill="#f87171" />
            <path
              d="M55 38C55 35 57 34 60 34C63 34 65 35 65 38"
              stroke="#f87171"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </>
        )}

        {/* Monitor lower control strip */}
        <rect x="22" y="56" width="76" height="8" fill="#d0c6a8" />
        {/* Power LED Indicator */}
        <circle
          cx="30"
          cy="60"
          r="1.8"
          fill={isAvailable ? '#10b981' : '#f59e0b'}
          className={isAvailable ? 'animate-pulse' : ''}
        />
        {/* Monitor knobs */}
        <circle cx="84" cy="60" r="1.5" fill="#9e947a" />
        <circle cx="89" cy="60" r="1.5" fill="#9e947a" />

        {/* --- MONITOR STAND / NECK --- */}
        <rect x="52" y="64" width="16" height="7" fill="#b8ad8f" stroke="#9e947a" strokeWidth="1" />
        <path
          d="M44 71H76L80 75H40L44 71Z"
          fill="#c8be9f"
          stroke="#9e947a"
          strokeWidth="1"
        />

        {/* --- KEYBOARD --- */}
        {/* Keyboard base (slanted isometric feel) */}
        <path
          d="M26 80L32 77H88L94 80L92 92H28L26 80Z"
          fill="#dcd3b8"
          stroke="#b5aa8b"
          strokeWidth="1.5"
        />
        {/* Key rows texture */}
        <rect x="34" y="79" width="52" height="3" rx="0.5" fill="#aea487" fillOpacity="0.8" />
        <rect x="33" y="83" width="54" height="3" rx="0.5" fill="#aea487" fillOpacity="0.8" />
        <rect x="32" y="87" width="56" height="3" rx="0.5" fill="#aea487" fillOpacity="0.8" />
        {/* Spacebar */}
        <rect x="46" y="88" width="28" height="2.5" rx="0.5" fill="#f1ece1" />

        {/* --- MOUSE --- */}
        <rect
          x="97"
          y="81"
          width="8"
          height="12"
          rx="3.5"
          fill="#dcd3b8"
          stroke="#b5aa8b"
          strokeWidth="1"
        />
        {/* Mouse button line */}
        <line x1="97" y1="85" x2="105" y2="85" stroke="#9e947a" strokeWidth="0.8" />
        <line x1="101" y1="81" x2="101" y2="85" stroke="#9e947a" strokeWidth="0.8" />
      </svg>
    </div>
  );
};
