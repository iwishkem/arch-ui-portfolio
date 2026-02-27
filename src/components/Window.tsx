import { useRef } from 'react';
import { Rnd } from 'react-rnd';
import { X, Minus, Square } from 'lucide-react';

interface WindowProps {
  id: string;
  title: string;
  onClose: (id: string) => void;
  onFocus: () => void;
  isFocused: boolean;
  children: React.ReactNode;
}

export default function Window({ id, title, onClose, onFocus, isFocused, children }: WindowProps) {
  const windowRef = useRef<HTMLDivElement>(null);
  
  const randomX = Math.floor(Math.random() * 100) + 50;
  const randomY = Math.floor(Math.random() * 50) + 50;

  // SİHİRLİ DOKUNUŞ BURADA: Pencereyle etkileşime geçildiğinde çalışacak
  const handleInteraction = () => {
    onFocus(); // 1. Pencereyi görsel olarak öne al (z-index)
    
    // 2. Çok ufak bir gecikmeyle pencerenin içindeki input'u bul ve odakla
    setTimeout(() => {
      const input = windowRef.current?.querySelector('input');
      if (input) input.focus();
    }, 10);
  };

  return (
    <Rnd
      default={{ x: randomX, y: randomY, width: 600, height: 400 }}
      minWidth={300} minHeight={200} bounds="parent"
      dragHandleClassName="window-header" 
      style={{ zIndex: isFocused ? 50 : 10 }}
      onDragStart={handleInteraction} // Sürüklemeye başlandığında da odakla
    >
      <div 
        ref={windowRef}
        onMouseDownCapture={handleInteraction} // Pencerenin HERHANGİ bir yerine tıklandığında odakla
        className={`flex flex-col h-full bg-[#1e1e2e] text-white rounded-lg shadow-2xl overflow-hidden border transition-colors duration-200 ${isFocused ? 'border-[#89b4fa]' : 'border-[#313244]'}`}
      >
        <div className={`window-header flex items-center justify-between px-4 py-2 cursor-move select-none transition-colors duration-200 ${isFocused ? 'bg-[#1e1e2e]' : 'bg-[#181825]'}`}>
          <span className="text-sm font-bold text-[#cba6f7]">{title}</span>
          <div className="flex gap-2">
            <button className="p-1 hover:bg-[#313244] rounded text-gray-400 hover:text-white transition-colors"><Minus size={14} /></button>
            <button className="p-1 hover:bg-[#313244] rounded text-gray-400 hover:text-white transition-colors"><Square size={14} /></button>
            <button onClick={() => onClose(id)} className="p-1 hover:bg-red-500 rounded text-gray-400 hover:text-white transition-colors"><X size={14} /></button>
          </div>
        </div>
        
        <div className="flex-1 bg-[#1e1e2e] overflow-hidden font-mono text-sm relative flex flex-col">
          {!isFocused && <div className="absolute inset-0 z-50 cursor-default" />}
          {children}
        </div>
      </div>
    </Rnd>
  );
}