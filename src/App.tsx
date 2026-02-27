import { useState } from 'react';
import { Rnd } from 'react-rnd'; 
import TopPanel from './components/TopPanel';
import Window from './components/Window';
import TerminalApp from './components/TerminalApp';
import FileExplorer from './components/FileExplorer';
import { Terminal, User, Folder as FolderIcon } from 'lucide-react';

export default function App() {
  const [windows, setWindows] = useState<{ id: string; title: string; content: React.ReactNode }[]>([]);
  const [focusedId, setFocusedId] = useState<string | null>(null);

  const [iconPositions, setIconPositions] = useState<{ [key: string]: { x: number, y: number } }>(() => {
    try {
      const saved = localStorage.getItem('archIconPositions');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Konumlar yüklenemedi.", e);
    }
    return {
      terminal: { x: 20, y: 20 },
      about: { x: 20, y: 120 },
      files: { x: 20, y: 220 }
    };
  });

  const updateIconPosition = (id: string, x: number, y: number) => {
    const newPositions = { ...iconPositions, [id]: { x, y } };
    setIconPositions(newPositions);
    localStorage.setItem('archIconPositions', JSON.stringify(newPositions));
  };

  const openTerminal = () => {
    const newId = `term-${Date.now()}`;
    setWindows(prev => [...prev, { id: newId, title: 'kem@arch: ~', content: <TerminalApp /> }]);
    setFocusedId(newId);
  };

  const openSingleWindow = (id: string, title: string, content: React.ReactNode) => {
    if (!windows.find(w => w.id === id)) {
      setWindows(prev => [...prev, { id, title, content }]);
    }
    setFocusedId(id);
  };

  const closeWindow = (id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    if (focusedId === id) setFocusedId(null);
  };

  const focusWindow = (id: string) => {
    setFocusedId(id);
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#11111b] text-white" 
         style={{ backgroundImage: 'url("https://wallpapers.com/images/hd/arch-linux-minimalist-blue-logo-l0ooh0b0sryrsmna.jpg")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      
      <TopPanel openTerminal={openTerminal} openSingleWindow={openSingleWindow} />
      
      <div className="flex-1 relative w-full h-full">
        
        {/* Terminal İkonu */}
        <Rnd
          default={{ x: iconPositions['terminal'].x, y: iconPositions['terminal'].y, width: 96, height: 96 }}
          enableResizing={false}
          bounds="parent"
          onDragStop={(_e, d) => updateIconPosition('terminal', d.x, d.y)}
          style={{ zIndex: 1 }}
        >
          <div className="flex flex-col items-center justify-center gap-1 w-full h-full cursor-pointer hover:bg-white/10 rounded transition-colors" onDoubleClick={openTerminal}>
            <Terminal size={40} className="text-[#89b4fa]" />
            <span className="text-xs text-center drop-shadow-md font-medium select-none">Terminal</span>
          </div>
        </Rnd>

        {/* Dosyalar İkonu */}
        <Rnd
          default={{ x: iconPositions['files'].x, y: iconPositions['files'].y, width: 96, height: 96 }}
          enableResizing={false}
          bounds="parent"
          onDragStop={(_e, d) => updateIconPosition('files', d.x, d.y)}
          style={{ zIndex: 1 }}
        >
          <div className="flex flex-col items-center justify-center gap-1 w-full h-full cursor-pointer hover:bg-white/10 rounded transition-colors" onDoubleClick={() => openSingleWindow('files', 'Dosya Yöneticisi', <FileExplorer openWindow={openSingleWindow} />)}>
            <FolderIcon size={40} className="text-[#89b4fa]" />
            <span className="text-xs text-center drop-shadow-md font-medium select-none">Dosyalar</span>
          </div>
        </Rnd>

        {/* Hakkımda İkonu */}
        <Rnd
          default={{ x: iconPositions['about'].x, y: iconPositions['about'].y, width: 96, height: 96 }}
          enableResizing={false}
          bounds="parent"
          onDragStop={(_e, d) => updateIconPosition('about', d.x, d.y)}
          style={{ zIndex: 1 }}
        >
          <div className="flex flex-col items-center justify-center gap-1 w-full h-full cursor-pointer hover:bg-white/10 rounded transition-colors" onDoubleClick={() => openSingleWindow('about', 'Hakkımda', <div className="p-4 text-gray-300">Kem. Öğrenci, geliştirici ve Android modlayıcısı.</div>)}>
            <User size={40} className="text-[#f9e2af]" />
            <span className="text-xs text-center drop-shadow-md font-medium select-none">Hakkımda</span>
          </div>
        </Rnd>

      </div>

      {windows.map(win => (
        <Window key={win.id} id={win.id} title={win.title} onClose={closeWindow} onFocus={() => focusWindow(win.id)} isFocused={focusedId === win.id}>
          {win.content}
        </Window>
      ))}
    </div>
  );
}