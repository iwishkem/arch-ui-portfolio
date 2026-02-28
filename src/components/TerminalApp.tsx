import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

interface TerminalAppProps {
  onExit?: () => void;
}

// --- ANIMATION COMPONENTS ---
function MatrixProcess() {
  const [lines, setLines] = useState<string[]>([]);
  useEffect(() => {
    const t = setInterval(() => {
      setLines(prev => {
        const newLine = Array.from({length: 40}, () => String.fromCharCode(0x30A0 + Math.random() * 96)).join(' ');
        return [...prev, newLine].slice(-20);
      });
    }, 80);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="font-mono text-[#a6e3a1] bg-black/90 p-4 flex-1 flex flex-col justify-end overflow-hidden h-full">
      {lines.map((l, i) => <div key={i} className="opacity-80">{l}</div>)}
      <div className="mt-2 text-green-900 text-[10px]">Matrix Active... Press Ctrl+C to stop</div>
    </div>
  );
}

function PeaclockProcess() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const t = setInterval(() => setTime(new Date().toLocaleTimeString('en-US')), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-[#89b4fa] font-mono h-full bg-[#1e1e2e]">
      <pre className="text-6xl font-black drop-shadow-[0_0_15px_rgba(137,180,250,0.5)] animate-pulse">{time}</pre>
      <div className="mt-8 text-gray-500 text-xs italic">Digital Clock Active... Press Ctrl+C to exit</div>
    </div>
  );
}

function JumpscareProcess() {
  return (
    <div className="flex flex-col items-center justify-center bg-red-600 w-full h-full animate-pulse overflow-hidden">
      <h1 className="text-black font-black text-7xl italic shadow-2xl">KERNEL PANIC!</h1>
      <p className="text-white font-bold mt-4 bg-black px-6 py-2 border-2 border-white">FATAL_ERROR: SYSTEM_COMPROMISED</p>
      <div className="mt-8 text-black/50 text-xs font-mono uppercase tracking-widest">Press Ctrl+C to force reboot</div>
    </div>
  );
}

// --- VIRTUAL FILE SYSTEM DATA ---
const fileSystem: Record<string, string[]> = {
  '~': ['projects', 'education', 'README.md'],
  '~/projects': ['XBash.sh', 'ytxtract.py', 'MusicController.dart'],
  '~/education': ['Literature_Notes.txt', 'Nursing_Practices.txt']
};

const fileContents: Record<string, string> = {
  '~/README.md': 'Kem: Student in Turkey. Specializing in Android modding (S21FE/LineageOS) and Flutter development.',
  '~/projects/XBash.sh': '#!/bin/bash\n# XBash: A ShareX-like image uploader written in bash.',
  '~/projects/ytxtract.py': 'import yt_dlp\n# ytxtract: YouTube video/audio downloader toolkit written in Python.',
  '~/projects/MusicController.dart': 'import "package:flutter/material.dart";\n// MusicController: Flutter project for managing media playback.',
  '~/education/Literature_Notes.txt': 'Notes on Literature courses in Turkey.',
  '~/education/Nursing_Practices.txt': 'Professional applications for Nursing Assistance courses.'
};

export default function TerminalApp({ onExit }: TerminalAppProps) {
  const [history, setHistory] = useState<React.ReactNode[]>([
    <div key="welcome" className="text-gray-400 mb-2 italic underline decoration-[#cba6f7]">Welcome to KemOS v3.0 (Arch-based)</div>,
    <div key="hint" className="mb-4 text-xs">Type <span className="text-[#cba6f7] font-bold">help</span> to view all available commands.</div>
  ]);
  const [input, setInput] = useState('');
  const [cwd, setCwd] = useState('~');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [cmdHistoryIndex, setCmdHistoryIndex] = useState(0);
  const [activeProcess, setActiveProcess] = useState<string | null>(null);
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [history]);

  useEffect(() => {
    setCmdHistoryIndex(cmdHistory.length);
  }, [cmdHistory]);

  useEffect(() => {
    const handleCtrlC = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'c' && activeProcess) {
        setActiveProcess(null);
        setHistory(prev => [...prev, <div className="text-[#f38ba8] mt-2">^C (Process Terminated)</div>]);
      }
    };
    window.addEventListener('keydown', handleCtrlC);
    return () => window.removeEventListener('keydown', handleCtrlC);
  }, [activeProcess]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const originalInput = input;
      if (originalInput.trim() === '') return;

      const parts = originalInput.trimStart().split(' ');
      const currentWord = parts[parts.length - 1];

      let potentialMatches: string[] = [];
      let isCompletingCommand = false;

      if (parts.length === 1) {
        const allCommands = ['help', 'whoami', 'socials', 'projects', 'ls', 'cd', 'pwd', 'cat', 'fastfetch', 'neofetch', 'history', 'date', 'clear', 'exit', 'reboot', 'matrix', 'peaclock', 'jumpscare', 'sudo', 'cowsay'];
        potentialMatches = allCommands.filter(c => c.startsWith(currentWord));
        isCompletingCommand = true;
      } else if (parts.length > 1 && ['cd', 'cat', 'ls'].includes(parts[0].toLowerCase())) {
        const itemsInCwd = fileSystem[cwd] || [];
        potentialMatches = itemsInCwd.filter(item => item.startsWith(currentWord));
      }

      if (potentialMatches.length === 1) {
        const completedWord = potentialMatches[0];
        let suffix = ' ';
        if (!isCompletingCommand) {
          const isDir = !!fileSystem[`${cwd}/${completedWord}`];
          if (isDir) suffix = '/';
        }
        const newParts = [...parts.slice(0, -1), completedWord];
        setInput(newParts.join(' ') + suffix);
      } else if (potentialMatches.length > 1) {
        let prefix = '';
        const firstMatch = potentialMatches[0];
        for (let i = 0; i < firstMatch.length; i++) {
          const char = firstMatch[i];
          if (potentialMatches.every(m => m[i] === char)) {
            prefix += char;
          } else {
            break;
          }
        }
        if (prefix.length > currentWord.length) {
          const newParts = [...parts.slice(0, -1), prefix];
          setInput(newParts.join(' '));
        } else {
          const prompt = <div><span className="text-[#a6e3a1]">kem@arch</span>:<span className="text-[#89b4fa] font-bold">{cwd}</span>$ {originalInput}</div>;
          const suggestions = <div className="flex flex-wrap gap-x-4 gap-y-1 ml-4">{potentialMatches.map(m => <span key={m}>{m}</span>)}</div>;
          setHistory(prev => [...prev, prompt, suggestions]);
        }
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistoryIndex > 0) {
        const newIndex = cmdHistoryIndex - 1;
        setCmdHistoryIndex(newIndex);
        setInput(cmdHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (cmdHistoryIndex < cmdHistory.length - 1) {
        const newIndex = cmdHistoryIndex + 1;
        setCmdHistoryIndex(newIndex);
        setInput(cmdHistory[newIndex]);
      } else {
        setCmdHistoryIndex(cmdHistory.length);
        setInput('');
      }
    }
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCmd = input.trim();
    if (!fullCmd) {
      setHistory(prev => [...prev, <div><span className="text-[#a6e3a1]">kem@arch</span>:<span className="text-[#89b4fa] font-bold">{cwd}</span>$</div>]);
      return;
    }

    if (fullCmd.trim() === 'rm -rf /') {
      const prompt = <div><span className="text-[#a6e3a1]">kem@arch</span>:<span className="text-[#89b4fa] font-bold">{cwd}</span>$ {fullCmd}</div>;
      const output = <div className="text-[#f38ba8] ml-4">Nice try! This is a web-based terminal, you can't hurt me here. :)</div>;
      setHistory(prev => [...prev, prompt, output]);
      setInput('');
      return;
    }
    setCmdHistory(prev => [...prev, fullCmd]);
    const args = fullCmd.split(' ');
    const cmd = args[0].toLowerCase();
    const prompt = <div><span className="text-[#a6e3a1]">kem@arch</span>:<span className="text-[#89b4fa] font-bold">{cwd}</span>$ {fullCmd}</div>;
    let output: React.ReactNode = null;

    switch (cmd) {
      case 'help':
        output = (
          <div className="ml-4 my-2 text-gray-400 text-xs">
            <div className="text-[#89b4fa] font-bold mb-1">KemOS Commands</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
              <span><b className="text-[#cba6f7] w-24 inline-block">help</b>: Show this help message.</span>
              <span><b className="text-[#cba6f7] w-24 inline-block">whoami</b>: Display user profile.</span>
              <span><b className="text-[#cba6f7] w-24 inline-block">socials</b>: List social media links.</span>
              <span><b className="text-[#cba6f7] w-24 inline-block">projects</b>: List my active projects.</span>
              <span><b className="text-[#cba6f7] w-24 inline-block">ls</b>: List directory contents.</span>
              <span><b className="text-[#cba6f7] w-24 inline-block">cd [dir]</b>: Change directory.</span>
              <span><b className="text-[#cba6f7] w-24 inline-block">pwd</b>: Print current directory path.</span>
              <span><b className="text-[#cba6f7] w-24 inline-block">cat [file]</b>: Display file content.</span>
              <span><b className="text-[#cba6f7] w-24 inline-block">fastfetch</b>: System overview (alias: neofetch).</span>
              <span><b className="text-[#cba6f7] w-24 inline-block">history</b>: View command history.</span>
              <span><b className="text-[#cba6f7] w-24 inline-block">date</b>: Show current date and time.</span>
              <span><b className="text-[#cba6f7] w-24 inline-block">clear</b>: Clear the terminal screen.</span>
              <span><b className="text-[#cba6f7] w-24 inline-block">exit</b>: Close this terminal window.</span>
              <span><b className="text-[#cba6f7] w-24 inline-block">reboot</b>: Reload the entire OS.</span>
            </div>
            <div className="text-[#89b4fa] font-bold mt-3 mb-1">Fun</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
              <span><b className="text-[#cba6f7] w-24 inline-block">matrix</b>: Run the matrix digital rain effect.</span>
              <span><b className="text-[#cba6f7] w-24 inline-block">peaclock</b>: Display a large, peaceful ASCII clock.</span>
            </div>
          </div>
        );
        break;
      case 'whoami':
        output = <div className="ml-4 text-gray-300">Kem. A student in Turkey specializing in Android modding and reverse engineering. Currently working with Flutter and Python.</div>;
        break;
      case 'socials':
        output = <div className="ml-4">Find me on: <a href="https://github.com/whoisYoges" target="_blank" className="text-[#89b4fa] underline">GitHub</a>, <a href="https://x.com/ysngms" target="_blank" className="text-[#89b4fa] underline">Twitter/X</a>.</div>;
        break;
      case 'projects':
        output = <div className="ml-4">Active Projects: <span className="text-[#a6e3a1]">XBash</span>, <span className="text-[#a6e3a1]">ytxtract</span>, and <span className="text-[#a6e3a1]">MusicController</span>.</div>;
        break;
      case 'ls':
        const items = fileSystem[cwd] || [];
        output = <div className="flex gap-6 ml-4 my-1">{items.map(item => <span key={item} className={item.includes('.') ? "text-[#cba6f7]" : "text-[#89b4fa] font-bold"}>{item}</span>)}</div>;
        break;
      case 'cd':
        const rawTarget = args[1];
        if (!rawTarget || rawTarget === '~' || rawTarget === '~/') {
          setCwd('~');
          break;
        }
        const target = rawTarget.replace(/\/$/, ''); // Remove trailing slash
        if (target === '..') {
          if (cwd !== '~') {
            const newCwd = cwd.substring(0, cwd.lastIndexOf('/'));
            setCwd(newCwd || '~');
          }
        } else if (fileSystem[cwd]?.includes(target) && fileSystem[`${cwd}/${target}`]) setCwd(`${cwd}/${target}`);
        else output = <div className="text-red-400 ml-4">bash: cd: {rawTarget}: No such directory found.</div>;
        break;
      case 'pwd':
        output = <div className="ml-4 italic text-gray-500">/home/kem/{cwd.replace('~/', '')}</div>;
        break;
      case 'cat':
        const file = args[1];
        const path = file?.startsWith('~/') ? file : `${cwd}/${file}`;
        if (fileContents[path]) output = <pre className="ml-4 my-2 text-gray-300 whitespace-pre-wrap font-mono text-xs border-l border-[#313244] pl-3">{fileContents[path]}</pre>;
        else output = <div className="text-red-400 ml-4">cat: {file || 'file'}: No such file in this directory.</div>;
        break;
      case 'fastfetch':
      case 'neofetch':
        output = (
          <div className="flex gap-6 ml-4 my-4 font-bold text-[10px] leading-tight">
            <pre className="text-[#89b4fa]">{`      /\\
     /  \\
    /    \\
   /      \\
  /   ,,   \\
 /   |  |   \\
/_-''    ''-_\\`}</pre>
            <div className="text-gray-300">
              <div className="text-[#89b4fa] mb-1">kem@arch_portfolio</div>
              <div className="text-gray-600">------------------</div>
              <div><span className="text-[#cba6f7]">OS</span>: Arch Linux x86_64</div>
              <div><span className="text-[#cba6f7]">Host</span>: iwishkem.com.tr</div>
              <div><span className="text-[#cba6f7]">Kernel</span>: 6.7.2-kem-os</div>
              <div><span className="text-[#cba6f7]">Shell</span>: zsh 5.9</div>
              <div><span className="text-[#cba6f7]">WM</span>: Custom React WM</div>
            </div>
          </div>
        );
        break;
      case 'matrix': setActiveProcess('matrix'); break;
      case 'peaclock': setActiveProcess('peaclock'); break;
      case 'jumpscare': setActiveProcess('jumpscare'); break;
      case 'sudo':
        output = <div className="text-[#f38ba8] ml-4">User is not in the sudoers file. This incident will be reported.</div>;
        break;
      case 'cowsay':
        const message = args.slice(1).join(' ') || 'Moo!';
        output = (
          <pre className="ml-4 my-2 text-gray-300 whitespace-pre font-mono text-xs">
            {`        < ${message} >
         \\   ^__^
          \\  (oo)\\_______
             (__)\\       )\\/\\
                 ||----w |
                 ||     ||`}
          </pre>
        );
        break;
      case 'date': output = <div className="ml-4">{new Date().toString()}</div>; break;
      case 'history': output = <div className="ml-4 text-gray-500 whitespace-pre">{cmdHistory.join('\n')}</div>; break;
      case 'exit': if (onExit) onExit(); return;
      case 'reboot': window.location.reload(); return;
      case 'clear': setHistory([]); setInput(''); return;
      default:
        output = <div className="text-red-400 ml-4">bash: {cmd}: command not found. Try 'help'.</div>;
    }

    setHistory(prev => [...prev, prompt, output]);
    setInput('');
  };

  const renderContent = () => {
    if (activeProcess === 'matrix') return <div className="h-full w-full bg-black"><MatrixProcess /></div>;
    if (activeProcess === 'peaclock') return <div className="h-full w-full"><PeaclockProcess /></div>;
    if (activeProcess === 'jumpscare') return <div className="h-full w-full"><JumpscareProcess /></div>;

    return (
      <div className="overflow-auto p-4 flex flex-col cursor-text font-mono text-sm h-full text-gray-300 scrollbar-thin scrollbar-thumb-[#313244]" onClick={() => inputRef.current?.focus()}>
        {history.map((h, i) => <div key={i}>{h}</div>)}
        <form onSubmit={handleCommand} className="flex items-center">
          <span className="text-[#a6e3a1]">kem@arch</span>:<span className="text-[#89b4fa] font-bold">{cwd}</span>$
          <input
            ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
            className="bg-transparent outline-none flex-1 ml-2 text-white caret-[#cba6f7]"
            autoFocus autoComplete="off" spellCheck="false"
          />
        </form>
        <div ref={bottomRef} className="h-2" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-[#11111b]">
      <div className="flex items-center justify-between px-3 py-1 bg-[#181825] text-gray-400 text-xs font-mono shrink-0 border-b border-[#313244]">
        <span className="font-bold">kem@arch: {cwd}</span>
        <button onClick={onExit} className="p-1 hover:bg-[#f38ba8] hover:text-[#11111b] rounded-md text-gray-500 transition-all" title="Close Terminal">
          <X size={12} />
        </button>
      </div>
      <div className="flex-1 relative overflow-hidden">{renderContent()}</div>
    </div>
  );
}