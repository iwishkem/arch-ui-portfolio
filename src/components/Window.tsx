import React from 'react';
import { Rnd } from 'react-rnd';
import { X, Minus, Square } from 'lucide-react';

interface WindowProps {
  id: string;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onFocus: () => void;
  isFocused: boolean;
  defaultSize?: { width: number; height: number };
}

export default function Window({ title, children, onClose, onFocus, isFocused, defaultSize }: WindowProps) {
  return (
    <Rnd
      default={{
        x: 100,
        y: 60,
        width: defaultSize?.width || 600,
        height: defaultSize?.height || 400,
      }}
      minWidth={300}
      minHeight={200}
      bounds="parent"
      onDragStart={onFocus}
      className={`absolute flex flex-col bg-[#1e1e2e]/95 backdrop-blur-xl border rounded-xl overflow-hidden shadow-2xl ${
        isFocused ? 'z-50 border-[#89b4fa]' : 'z-10 border-[#313244] opacity-90'
      }`}
    >
      <div className={`flex items-center justify-between px-3 py-2 select-none shrink-0 ${isFocused ? 'bg-[#313244]' : 'bg-[#181825]'}`} onMouseDown={onFocus}>
        <span className="text-[10px] font-bold font-mono text-gray-300 truncate mr-4">{title}</span>
        <div className="flex items-center gap-1.5 shrink-0">
          <button onClick={onClose} className="p-1 hover:bg-[#f38ba8] hover:text-[#11111b] rounded-md text-gray-500 transition-all"><X size={14} /></button>
        </div>
      </div>
      <div className="flex-1 w-full h-full overflow-hidden relative bg-[#11111b]/30">
        {children}
      </div>
    </Rnd>
  );
}