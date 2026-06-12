import React from 'react';

export default function CircularProgress({
  percentage = 0,
  color = '#3b82f6',
  trailColor = '#e2e8f0',
  label = '',
  sublabel = '',
  size = 'w-24 h-24 sm:w-40 sm:h-40'
}) {
  const radius = 45;
  const strokeWidth = 9;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const safePercentage = Math.max(0, Math.min(100, percentage));
  const strokeDashoffset = circumference - (safePercentage / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center select-none">
      <div className={`relative ${size} flex items-center justify-center bg-transparent rounded-full hover:scale-105 transition-transform duration-300`}>
        <svg
          height="100%"
          width="100%"
          viewBox="0 0 100 100"
        >
          <circle
            stroke={trailColor}
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={50}
            cy={50}
            className="opacity-20"
          />
          <circle
            stroke={color}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={50}
            cy={50}
            transform="rotate(-90 50 50)"
            className="transition-all duration-700 ease-out"
          />
          <text
            x="50"
            y="43"
            textAnchor="middle"
            dominantBaseline="central"
            fill="#334155"
            fontSize="12.5"
            className="font-extrabold tracking-tight"
            style={{ fontFamily: 'inherit' }}
          >
            {label}
          </text>
          <text
            x="50"
            y="61"
            textAnchor="middle"
            dominantBaseline="central"
            fill={color}
            fontSize="13"
            className="font-black"
            style={{ fontFamily: 'inherit' }}
          >
            {sublabel}
          </text>
        </svg>
      </div>
    </div>
  );
}