import { useState, useRef, useEffect } from 'react';

// --- PEACLOCK ASCII SAAT BİLEŞENİ ---
const ASCII_DIGITS: Record<string, string[]> = {
  '0': ["███", "█ █", "█ █", "█ █", "███"],
  '1': [" ██", "  █", "  █", "  █", "███"],
  '2': ["███", "  █", "███", "█  ", "███"],
  '3': ["███", "  █", "███", "  █", "███"],
  '4': ["█ █", "█ █", "███", "  █", "  █"],
  '5': ["███", "█  ", "███", "  █", "███"],
  '6': ["███", "█  ", "███", "█ █", "███"],
  '7': ["███", "  █", "  █", "  █", "  █"],
  '8': ["███", "█ █", "███", "█ █", "███"],
  '9': ["███", "█ █", "███", "  █", "███"],
  ':': ["   ", " █ ", "   ", " █ ", "   "],
};

function PeaclockProcess() {
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!timeStr) return null;

  const lines = ["", "", "", "", ""];
  for (const char of timeStr) {
    const digitArt = ASCII_DIGITS[char] || ASCII_DIGITS[':'];
    for (let i = 0; i < 5; i++) {
      lines[i] += digitArt[i] + "  ";
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-[#89b4fa] font-mono leading-none tracking-widest mt-10">
      {lines.map((line, idx) => (
        <pre key={idx} className="drop-shadow-[0_0_8px_rgba(137,180,250,0.5)]">{line}</pre>
      ))}
      <div className="mt-8 text-gray-500 text-xs animate-pulse">Press Ctrl+C to exit</div>
    </div>
  );
}

// --- PIPES.SH ANİMASYON BİLEŞENİ (GELİŞMİŞ SÜRÜM) ---
function PipesProcess() {
  const rows = 20;
  const cols = 60;
  
  const [grid, setGrid] = useState<{char: string, color: string}[][]>(() =>
    Array.from({ length: rows }, () => 
      Array.from({ length: cols }, () => ({ char: ' ', color: '' }))
    )
  );
  
  const gridRef = useRef(
    Array.from({ length: rows }, () => Array.from({ length: cols }, () => ({ char: ' ', color: '' })))
  );

  useEffect(() => {
    const colors = ['text-green-400', 'text-blue-400', 'text-red-400', 'text-yellow-400', 'text-[#cba6f7]', 'text-cyan-400'];
    
    const pipes = Array.from({ length: 5 }, () => ({
      x: Math.floor(Math.random() * cols),
      y: Math.floor(Math.random() * rows),
      dir: Math.floor(Math.random() * 4),
      color: colors[Math.floor(Math.random() * colors.length)]
    }));

    const interval = setInterval(() => {
      const newGrid = [...gridRef.current.map(row => [...row])];

      pipes.forEach(pipe => {
        let newDir = pipe.dir;
        
        if (Math.random() < 0.2) {
          const possibleTurns = [(pipe.dir + 1) % 4, (pipe.dir + 3) % 4];
          newDir = possibleTurns[Math.floor(Math.random() * possibleTurns.length)];
        }

        let char = '';
        if (pipe.dir === newDir) {
          char = (pipe.dir === 0 || pipe.dir === 2) ? '┃' : '━';
        } else {
          if (pipe.dir === 0 && newDir === 1) char = '┏';
          else if (pipe.dir === 0 && newDir === 3) char = '┓';
          else if (pipe.dir === 2 && newDir === 1) char = '┗';
          else if (pipe.dir === 2 && newDir === 3) char = '┛';
          else if (pipe.dir === 1 && newDir === 0) char = '┛';
          else if (pipe.dir === 1 && newDir === 2) char = '┓';
          else if (pipe.dir === 3 && newDir === 0) char = '┗';
          else if (pipe.dir === 3 && newDir === 2) char = '┏';
        }

        newGrid[pipe.y][pipe.x] = { char, color: pipe.color };

        pipe.dir = newDir;
        if (pipe.dir === 0) pipe.y--;
        else if (pipe.dir === 1) pipe.x++;
        else if (pipe.dir === 2) pipe.y++;
        else if (pipe.dir === 3) pipe.x--;

        pipe.x = (pipe.x + cols) % cols;
        pipe.y = (pipe.y + rows) % rows;
      });

      gridRef.current = newGrid;
      setGrid(newGrid);
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="font-mono leading-none select-none p-4 whitespace-pre overflow-hidden flex-1 text-sm">
      {grid.map((row, rIdx) => (
        <div key={rIdx} className="h-[14px]">
          {row.map((cell, cIdx) => (
            <span key={cIdx} className={cell.color}>{cell.char}</span>
          ))}
        </div>
      ))}
      <div className="mt-6 text-gray-500 text-xs animate-pulse">Press Ctrl+C to exit</div>
    </div>
  );
}

// --- ANA TERMİNAL BİLEŞENİ ---
export default function TerminalApp() {
  const [history, setHistory] = useState<React.ReactNode[]>([
    <div key="init" className="text-gray-400 mb-2">
      Welcome to Arch UI Portfolio. Type <span className="text-[#cba6f7]">help</span> to see available commands.
    </div>
  ]);
  
  const [input, setInput] = useState('');
  const [activeProcess, setActiveProcess] = useState<'peaclock' | 'pipes' | null>(null);
  
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!activeProcess) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, activeProcess]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'c') {
        if (activeProcess) {
          setActiveProcess(null);
          setHistory(prev => [...prev, <div key={prev.length} className="text-white">^C</div>]);
        } else {
          setHistory(prev => [...prev, <div key={prev.length}><span className="text-[#a6e3a1]">kem@arch</span><span className="text-white">:$</span> {input}<span className="text-white">^C</span></div>]);
          setInput('');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeProcess, input]);

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim();
    
    if (trimmedCmd) {
      setCmdHistory(prev => [...prev, trimmedCmd]);
    }
    setHistoryIndex(-1);

    if (!trimmedCmd) {
      setHistory(prev => [...prev, <div key={prev.length}><span className="text-[#a6e3a1]">kem@arch</span><span className="text-white">:$</span></div>]);
      return;
    }

    const promptLine = <div key={history.length}><span className="text-[#a6e3a1]">kem@arch</span><span className="text-white">:$</span> {trimmedCmd}</div>;
    const lowerCmd = trimmedCmd.toLowerCase();

    // Özel komutlar (Tam ekran animasyonlar)
    if (lowerCmd === 'peaclock') {
      setHistory(prev => [...prev, promptLine]);
      setActiveProcess('peaclock');
      setInput('');
      return;
    }
    if (lowerCmd === 'pipes.sh') {
      setHistory(prev => [...prev, promptLine]);
      setActiveProcess('pipes');
      setInput('');
      return;
    }

    let output: React.ReactNode;

    // --- EASTER EGGS (Şakalı Komutlar) ---
    if (lowerCmd.startsWith('sudo')) {
      output = <div className="text-red-400 ml-4 my-2">kem is not in the sudoers file. This incident will be reported.</div>;
    } else if (lowerCmd.includes('rm -rf /')) {
      output = <div className="text-red-500 font-bold ml-4 my-2 animate-pulse">[KERNEL PANIC] Permission denied! Nice try, ama kendi portfolyomu silmeme izin veremem :)</div>;
    } else {
      
      // Neofetch yazılırsa fastfetch'e yönlendiriyoruz
      const switchCmd = lowerCmd === 'neofetch' ? 'fastfetch' : lowerCmd;

      // --- NORMAL KOMUTLAR ---
      switch (switchCmd) {
        case 'help':
          output = (
            <div className="text-gray-300 ml-4 my-2">
              Available commands:<br/>
              <span className="text-[#89b4fa]">whoami</span>    - About me<br/>
              <span className="text-[#89b4fa]">projects</span>  - List my open source projects<br/>
              <span className="text-[#89b4fa]">fastfetch</span> - Display system information<br/>
              <span className="text-[#89b4fa]">pipes.sh</span>  - Animated terminal pipes<br/>
              <span className="text-[#89b4fa]">peaclock</span>  - ASCII digital clock<br/>
              <span className="text-[#89b4fa]">clear</span>     - Clear the terminal screen
            </div>
          );
          break;
        case 'whoami':
          output = <div className="text-gray-300 ml-4 my-2">Hello! I'm Kem. A student, developer, and Android modifier.</div>;
          break;
        case 'projects':
          output = (
            <div className="text-gray-300 ml-4 my-2">
              <span className="text-[#a6e3a1] font-bold">XBash</span> - Bash image uploader<br/>
              <span className="text-[#a6e3a1] font-bold">ytxtract</span> - Python media downloader toolkit
            </div>
          );
          break;
        case 'fastfetch':
          output = (
            <div className="flex gap-6 my-4 text-sm font-mono">
              <pre className="text-[#89b4fa] font-bold leading-tight select-none">
{`       /\\
      /  \\
     /    \\
    /      \\
   /   ,,   \\
  /   |  |   \\
 /_-''    ''-_\\`}
              </pre>
              <div className="flex flex-col text-gray-300">
                <div><span className="text-[#89b4fa] font-bold">kem</span>@<span className="text-[#89b4fa] font-bold">arch</span></div>
                <div className="text-gray-500">-------------------</div>
                <div><span className="text-[#cba6f7] font-bold">OS</span>: Arch Linux x86_64</div>
                <div><span className="text-[#cba6f7] font-bold">Host</span>: Custom Portfolio Web</div>
                <div><span className="text-[#cba6f7] font-bold">Shell</span>: zsh 5.9</div>
                <div><span className="text-[#cba6f7] font-bold">WM</span>: React-RND</div>
              </div>
            </div>
          );
          break;
        case 'clear':
          setHistory([]);
          setInput('');
          return;
        default:
          output = <div className="text-red-400 ml-4 my-2">Command not found: {trimmedCmd}</div>;
      }
    }

    setHistory([...history, promptLine, <div key={history.length + 1}>{output}</div>]);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length > 0) {
        const newIndex = historyIndex === -1 ? cmdHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(cmdHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= cmdHistory.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIndex);
          setInput(cmdHistory[newIndex]);
        }
      }
    }
  };

  if (activeProcess === 'peaclock') return <div className="h-full w-full bg-[#1e1e2e] flex"><PeaclockProcess /></div>;
  if (activeProcess === 'pipes') return <div className="h-full w-full bg-[#1e1e2e] overflow-hidden flex"><PipesProcess /></div>;

  return (
    <div 
      className="flex-1 overflow-auto p-4 flex flex-col cursor-text w-full h-full" 
      onClick={() => inputRef.current?.focus()}
    >
      {history.map((item, index) => <div key={index}>{item}</div>)}
      <div className="flex items-center mt-1">
        <span className="text-[#a6e3a1]">kem@arch</span><span className="text-white mr-2">:$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none text-white font-inherit"
          autoFocus autoComplete="off" spellCheck="false"
        />
      </div>
      <div ref={bottomRef} />
    </div>
  );
}