import { useState } from 'react';
import { Rnd } from 'react-rnd'; 
import TopPanel from './components/TopPanel';
import type { ThemeType } from './components/TopPanel'; 
import Window from './components/Window';
import TerminalApp from './components/TerminalApp';
import FileExplorer from './components/FileExplorer';
import CalculatorApp from './components/CalculatorApp';
import { Terminal, User, Folder as FolderIcon, RefreshCw, Monitor, Settings, Calculator } from 'lucide-react';

const THEMES: Record<string, ThemeType & { bg: string }> = {
  classic: {
    id: 'classic',
    bg: 'https://raw.githubusercontent.com/whoisYoges/lwalpapers/PicturesOnly/wallpapers/b-511.jpg',
    panelClass: 'bg-[#1e1e2e]/90 border-[#313244]',
    moduleClass: 'bg-[#313244]/80 hover:bg-[#45475a]',
    btnClass: 'bg-[#89b4fa] text-[#11111b] hover:bg-[#b4befe]',
    icon1: 'text-[#89b4fa]', icon2: 'text-[#f9e2af]', icon3: 'text-[#cba6f7]',
    textHover: 'hover:bg-[#89b4fa] hover:text-[#11111b]',
    clockClass: 'bg-[#89b4fa] text-[#11111b]'
  },
  matrix: {
    id: 'matrix',
    bg: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070',
    panelClass: 'bg-black/90 border-[#00ff41]/40',
    moduleClass: 'bg-[#003300]/80 hover:bg-[#005500]',
    btnClass: 'bg-[#00ff41] text-black hover:bg-[#00ff41]/80',
    icon1: 'text-[#00ff41]', icon2: 'text-[#00ff41]', icon3: 'text-[#00ff41]',
    textHover: 'hover:bg-[#00ff41] hover:text-black',
    clockClass: 'bg-[#00ff41] text-black'
  },
  neon: {
    id: 'neon',
    bg: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000',
    panelClass: 'bg-[#0d0221]/90 border-[#ff007f]/50',
    moduleClass: 'bg-[#2a0a3a]/80 hover:bg-[#3d0f54]',
    btnClass: 'bg-[#00f0ff] text-black hover:bg-[#00f0ff]/80',
    icon1: 'text-[#00f0ff]', icon2: 'text-[#ff007f]', icon3: 'text-[#fcee0a]',
    textHover: 'hover:bg-[#ff007f] hover:text-white',
    clockClass: 'bg-[#ff007f] text-white'
  }
};

export default function App() {
  const [activeWorkspace, setActiveWorkspace] = useState<number>(1);
  const [windows, setWindows] = useState<{ id: string; title: string; content: React.ReactNode; workspaceId: number }[]>([]);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [currentThemeId, setCurrentThemeId] = useState<string>(() => localStorage.getItem('archThemeId') || 'classic');
  const [customBg, setCustomBg] = useState<string>(() => localStorage.getItem('archCustomBg') || '');

  const activeTheme = THEMES[currentThemeId] || THEMES['classic'];
  const displayBg = customBg || activeTheme.bg;

  const defaultPositions: Record<string, {x: number, y: number}> = { 
    terminal: { x: 20, y: 20 }, about: { x: 20, y: 124 }, files: { x: 20, y: 228 }, settings: { x: 20, y: 332 }, calculator: { x: 124, y: 20 }
  };

  const [iconPositions, setIconPositions] = useState<Record<string, { x: number, y: number }>>(() => {
    const saved = localStorage.getItem('archIconPositions');
    return saved ? { ...defaultPositions, ...JSON.parse(saved) } : defaultPositions;
  });

  const [resets, setResets] = useState<Record<string, number>>({ terminal: 0, files: 0, about: 0, settings: 0, calculator: 0 });

  const closeWindow = (id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    if (focusedId === id) setFocusedId(null);
  };

  const handleIconDrop = (id: string, x: number, y: number) => {
    if (Math.abs(x - iconPositions[id].x) < 5 && Math.abs(y - iconPositions[id].y) < 5) return;
    const GRID = 104;
    const snappedX = Math.round((x - 20) / GRID) * GRID + 20;
    const snappedY = Math.round((y - 20) / GRID) * GRID + 20;
    const newPos = { ...iconPositions, [id]: { x: Math.max(0, snappedX), y: Math.max(0, snappedY) } };
    setIconPositions(newPos);
    localStorage.setItem('archIconPositions', JSON.stringify(newPos));
    setResets(prev => ({ ...prev, [id]: prev[id] + 1 }));
  };

  const openWindow = (id: string, title: string, content: React.ReactNode) => {
    const existing = windows.find(w => w.id === id);
    if (existing) { setActiveWorkspace(existing.workspaceId); setFocusedId(id); }
    else { setWindows(prev => [...prev, { id, title, content, workspaceId: activeWorkspace }]); setFocusedId(id); }
  };

  const TweakToolContent = (
    <div className="p-6 text-gray-300 flex flex-col gap-6 w-full h-full bg-[#11111b]/95 overflow-auto">
      <h2 className={`text-xl font-black flex items-center gap-2 border-b border-[#313244] pb-2 ${activeTheme.icon1}`}><Settings size={20} /> Tweak Tool</h2>
      <div className="flex flex-col gap-3">
        <label className="text-[10px] font-bold uppercase text-gray-500 tracking-widest">Color Schemes</label>
        <div className="grid grid-cols-2 gap-3">
          {Object.keys(THEMES).map(tId => (
            <button key={tId} className={`p-3 rounded-lg text-xs font-bold border-2 transition-all ${currentThemeId === tId ? `border-${activeTheme.icon1.split('[')[1]?.split(']')[0] || 'blue-400'} text-white` : 'border-transparent bg-[#1e1e2e]'}`} 
            onClick={() => { setCurrentThemeId(tId); setCustomBg(''); localStorage.setItem('archThemeId', tId); }}>{tId.toUpperCase()}</button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-bold uppercase text-gray-500 tracking-widest">Custom Wallpaper (URL)</label>
        <div className="flex gap-2">
          <input type="text" id="bg-input" className="flex-1 bg-[#1e1e2e] border border-[#313244] rounded-lg p-2.5 text-sm outline-none focus:border-[#89b4fa]" placeholder="Paste link..." defaultValue={customBg} />
          <button className={`px-4 py-2 rounded-lg font-bold ${activeTheme.btnClass}`} onClick={() => { const val = (document.getElementById('bg-input') as HTMLInputElement).value; if(val) { setCustomBg(val); localStorage.setItem('archCustomBg', val); }}}>Apply</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col transition-all duration-700 font-sans" style={{ backgroundImage: `url("${displayBg}")`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <TopPanel activeWorkspace={activeWorkspace} setActiveWorkspace={setActiveWorkspace} theme={activeTheme} openTerminal={() => openWindow('term', 'kem@arch: ~', <TerminalApp onExit={() => closeWindow('term')} />)} openSingleWindow={openWindow} />
      
      <div className="flex-1 relative" onContextMenu={(e) => e.preventDefault()}>
        {Object.keys(defaultPositions).map((id) => (
          <Rnd key={`${id}-${resets[id]}`} default={{ x: iconPositions[id].x, y: iconPositions[id].y, width: 96, height: 96 }} enableResizing={false} bounds="parent" onDragStop={(_e, d) => handleIconDrop(id, d.x, d.y)}>
            <div className="flex flex-col items-center justify-center gap-1 w-full h-full cursor-pointer hover:bg-white/10 rounded-xl transition-colors group" onDoubleClick={() => {
              if(id === 'terminal') openWindow('term', 'kem@arch: ~', <TerminalApp onExit={() => closeWindow('term')} />);
              if(id === 'settings') openWindow('settings', 'Tweak Tool', TweakToolContent);
              if(id === 'calculator') openWindow('calculator', 'Scientific Calculator', <div className="origin-top-left scale-90 w-[111.11%] h-[111.11%]"><CalculatorApp /></div>);
              if(id === 'files') openWindow('files', 'File Explorer', <FileExplorer openWindow={openWindow} />);
              if(id === 'about') openWindow('about', 'About Me', <div className="p-6 text-gray-300 font-mono text-xs leading-relaxed overflow-auto h-full">
                <p className="text-[#a6e3a1] mb-2 font-bold underline"># Profile: Kem</p>
                <p>- Student in Turkey</p>
                <p>- Android Modding (S21FE / LineageOS)</p>
                <p>- Developer: Flutter, Python, Reverse Engineering</p>
              </div>);
            }}>
              <div className="group-active:scale-90 transition-transform">
                {id === 'terminal' && <Terminal size={42} className={activeTheme.icon1} />}
                {id === 'files' && <FolderIcon size={42} className={activeTheme.icon1} />}
                {id === 'settings' && <Settings size={42} className={activeTheme.icon3} />}
                {id === 'calculator' && <Calculator size={42} className={activeTheme.icon2} />}
                {id === 'about' && <User size={42} className={activeTheme.icon2} />}
              </div>
              <span className="text-[10px] font-bold capitalize drop-shadow-md text-white/90 tracking-wide">{id}</span>
            </div>
          </Rnd>
        ))}

        {windows.filter(win => win.workspaceId === activeWorkspace).map(win => (
          <Window key={win.id} id={win.id} title={win.title} isFocused={focusedId === win.id} onClose={() => closeWindow(win.id)} onFocus={() => setFocusedId(win.id)}
          defaultSize={win.id === 'calculator' ? { width: 360, height: 500 } : { width: 600, height: 400 }}>
            {win.id === 'settings' ? TweakToolContent : win.content}
          </Window>
        ))}
      </div>
    </div>
  );
}