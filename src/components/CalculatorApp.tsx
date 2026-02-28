import { useState } from 'react';
import { Delete } from 'lucide-react';

export default function CalculatorApp() {
  const [display, setDisplay] = useState('');
  const [history, setHistory] = useState('');

  const calculate = () => {
    if (!display) return;
    try {
      // Using a safe Function constructor for the calculation logic
      const result = new Function('return ' + display.replace(/×/g, '*').replace(/÷/g, '/').replace(/\^/g, '**'))();
      if (result === undefined || result === null || result === Infinity || Number.isNaN(result)) {
        setDisplay('Error');
        return;
      }
      setHistory(display + ' =');
      setDisplay(String(Number(result.toFixed(6))));
    } catch { setDisplay('Error'); }
  };

  // Optimized button styles for smaller windows
  const btnNum = "bg-[#313244] hover:bg-[#45475a] text-white text-lg font-bold rounded-xl flex items-center justify-center transition-all active:scale-95 shadow-sm h-full w-full";
  const btnOp = "bg-[#1e1e2e] hover:bg-[#313244] text-[#89b4fa] text-lg font-black rounded-xl flex items-center justify-center transition-all border border-[#313244] h-full w-full";

  return (
    <div className="flex flex-col h-full w-full bg-[#11111b] p-3 gap-3 overflow-hidden select-none">
      {/* Display Area - Fixed height relative to window */}
      <div className="flex flex-col items-end justify-end bg-[#1e1e2e] rounded-2xl p-3 h-20 border border-[#313244] shadow-inner shrink-0 overflow-hidden">
        <span className="text-gray-500 text-[10px] font-mono truncate w-full text-right">{history}</span>
        <span className="text-white text-3xl font-black tracking-tighter truncate w-full text-right">
          {display || '0'}
        </span>
      </div>

      {/* Button Grid - Forced to fit exactly in remaining space */}
      <div className="flex-1 grid grid-cols-4 grid-rows-5 gap-2 min-h-0">
        <button className="bg-[#f38ba8] text-black text-xs font-black rounded-xl h-full w-full" onClick={() => {setDisplay(''); setHistory('');}}>AC</button>
        <button className={btnOp} onClick={() => setDisplay(prev => prev.slice(0, -1))}><Delete size={18} /></button>
        <button className={btnOp} onClick={() => setDisplay(prev => prev + '^')}>^</button>
        <button className={btnOp} onClick={() => setDisplay(prev => prev + '÷')}>÷</button>
        
        {['7','8','9','×','4','5','6','-','1','2','3','+'].map(k => (
          <button key={k} className={k.match(/[0-9]/) ? btnNum : btnOp} onClick={() => setDisplay(prev => prev + k)}>{k}</button>
        ))}
        
        <button className={btnNum} onClick={() => setDisplay(prev => prev + '0')}>0</button>
        <button className={btnNum} onClick={() => setDisplay(prev => prev + '.')}>.</button>
        <button className="bg-[#a6e3a1] text-black text-xl font-black rounded-xl col-span-2 shadow-lg h-full w-full" onClick={calculate}>=</button>
      </div>
    </div>
  );
}