
import React from 'react';

interface ColorPickerProps {
  onSelect: (color: string) => void;
  onClose: () => void;
  style: React.CSSProperties;
}

// A curated list of common and vibrant web colors
const COLORS = [
  '#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#cccccc', '#d9d9d9', '#efefef', '#f3f3f3', '#ffffff',
  '#980000', '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#4a86e8', '#0000ff', '#9900ff', '#ff00ff',
  '#e6b8af', '#f4cccc', '#fce5cd', '#fff2cc', '#d9ead3', '#d0e0e3', '#c9daf8', '#cfe2f3', '#d9d2e9', '#ead1dc',
  '#dd7e6b', '#ea9999', '#f9cb9c', '#ffe599', '#b6d7a8', '#a2c4c9', '#a4c2f4', '#9fc5e8', '#b4a7d6', '#d5a6bd',
  '#cc4125', '#e06666', '#f6b26b', '#ffd966', '#93c47d', '#76a5af', '#6d9eeb', '#6fa8dc', '#8e7cc3', '#c27ba0',
  '#a61c00', '#cc0000', '#e69138', '#f1c232', '#6aa84f', '#45818e', '#3c78d8', '#3d85c6', '#674ea7', '#a64d79',
  '#85200c', '#990000', '#b45f06', '#bf9000', '#38761d', '#134f5c', '#1155cc', '#0b5394', '#351c75', '#741b47',
  '#5b0f00', '#660000', '#783f04', '#7f6000', '#274e13', '#0c343d', '#073763', '#20124d', '#4c1130'
];

export const ColorPicker: React.FC<ColorPickerProps> = ({ onSelect, onClose, style }) => {
  return (
    <div 
      className="bg-base-300 border border-base-100 shadow-2xl rounded-lg p-3 w-64 animate-in fade-in zoom-in duration-100"
      style={style}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-bold text-base-content uppercase tracking-wider">Pick Color</span>
        <button onClick={onClose} type="button" className="text-base-content-secondary hover:text-base-content">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
          </svg>
        </button>
      </div>
      
      {/* Color Grid */}
      <div className="grid grid-cols-10 gap-1 mb-3">
        {COLORS.map(color => (
          <button
            key={color}
            type="button"
            className="w-5 h-5 rounded-sm border border-base-100 hover:scale-125 hover:z-10 transition-transform focus:outline-none focus:ring-2 focus:ring-white shadow-sm"
            style={{ backgroundColor: color }}
            onClick={(e) => {
                e.stopPropagation();
                onSelect(color);
            }}
            title={color}
          />
        ))}
      </div>

      {/* Custom Color Input */}
      <div className="flex items-center gap-3 border-t border-base-100 pt-2">
        <div className="relative w-8 h-8 rounded-full overflow-hidden border border-base-100 ring-1 ring-base-content/10">
            <input 
                type="color" 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] p-0 border-0 cursor-pointer"
                onChange={(e) => onSelect(e.target.value)}
            />
        </div>
        <span className="text-xs text-base-content-secondary">Use System Picker</span>
      </div>
    </div>
  );
};
