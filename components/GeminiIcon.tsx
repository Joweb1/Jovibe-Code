import React from 'react';

const GeminiIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 90 90"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="SVGID_2" gradientUnits="userSpaceOnUse" x1="60.0525" y1="33.3396" x2="34.8444" y2="52.867">
          <stop offset="0%" stopColor="#9168c0" />
          <stop offset="34.3%" stopColor="#5684d1" />
          <stop offset="67.2%" stopColor="#1ba1e3" />
        </linearGradient>
      </defs>
      <path
        d="M 90 45.09 C 65.838 46.573 46.573 65.838 45.09 90 h -0.18 C 43.43 65.837 24.163 46.57 0 45.09 v -0.18 C 24.163 43.43 43.43 24.163 44.91 0 h 0.18 C 46.573 24.162 65.838 43.427 90 44.91 V 45.09 z"
        fill="url(#SVGID_2)"
      />
    </svg>
  );
};

export default GeminiIcon;
