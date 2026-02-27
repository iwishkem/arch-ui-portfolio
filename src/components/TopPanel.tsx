import { useState, useRef, useEffect } from 'react';
import { Wifi, Battery, Terminal, User, FolderGit2, Power } from 'lucide-react';

// App.tsx'ten gelecek olan pencere açma komutlarını tanımlıyoruz
interface TopPanelProps {
  openTerminal: () => void;
  openSingleWindow: (id: string, title: string, content: React.ReactNode) => void;
}

export default function TopPanel({ openTerminal, openSingleWindow }: TopPanelProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const time = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

  // Menü açıkken dışarı bir yere tıklanırsa menüyü otomatik kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  // Butona tıklanınca önce eylemi yap, sonra menüyü kapat
  const handleMenuAction = (action: () => void) => {
    action();
    setIsMenuOpen(false);
  };

  return (
    <div className="relative z-[100]">
      {/* Üst Bar */}
      <div className="h-8 w-full flex items-center justify-between px-4 text-sm font-medium text-gray-200" 
           style={{ backgroundColor: 'rgba(24, 24, 37, 0.7)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center gap-4">
          <span 
            className="text-[#89b4fa] font-bold cursor-pointer hover:text-white transition-colors select-none flex items-center gap-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="w-4 h-4 rounded-full bg-[#89b4fa] flex items-center justify-center text-[#11111b] text-[10px] font-black">A</div>
            Arch Portfolio
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Wifi size={16} />
          <Battery size={16} />
          <span>{time}</span>
        </div>
      </div>

      {/* Başlat / Arch Menüsü */}
      {isMenuOpen && (
        <div 
          ref={menuRef}
          className="absolute top-8 left-2 w-64 bg-[#181825]/95 backdrop-blur-md border border-[#313244] rounded-b-lg shadow-2xl py-2 flex flex-col text-sm text-gray-200"
        >
          {/* Menü Öğeleri */}
          <div 
            className="flex items-center gap-3 px-4 py-2 hover:bg-[#313244] cursor-pointer transition-colors"
            onClick={() => handleMenuAction(openTerminal)}
          >
            <Terminal size={16} className="text-[#89b4fa]" />
            <span>Yeni Terminal</span>
          </div>

          <div 
            className="flex items-center gap-3 px-4 py-2 hover:bg-[#313244] cursor-pointer transition-colors"
            onClick={() => handleMenuAction(() => openSingleWindow('about', 'Hakkımda', <div className="p-4">Kem. Öğrenci, geliştirici ve Android modlayıcısı.</div>))}
          >
            <User size={16} className="text-[#f9e2af]" />
            <span>Hakkımda</span>
          </div>

          <div 
            className="flex items-center gap-3 px-4 py-2 hover:bg-[#313244] cursor-pointer transition-colors"
            onClick={() => handleMenuAction(() => openSingleWindow('projects', 'Projelerim', 
              <div className="p-4 flex flex-col gap-4">
                <div><strong className="text-[#a6e3a1]">XBash:</strong> ShareX benzeri bash tabanlı resim yükleyici.</div>
                <div><strong className="text-[#a6e3a1]">ytxtract:</strong> Python tabanlı YouTube medya indirme aracı.</div>
              </div>
            ))}
          >
            <FolderGit2 size={16} className="text-[#a6e3a1]" />
            <span>Projelerim</span>
          </div>
          
          <div className="h-px bg-[#313244] my-2 mx-2" /> {/* Ayırıcı Çizgi */}
          
          <div 
            className="flex items-center gap-3 px-4 py-2 hover:bg-red-500/20 hover:text-red-400 cursor-pointer transition-colors"
            onClick={() => alert("Sistem kapatılıyor... (Tabii ki şaka!)")}
          >
            <Power size={16} />
            <span>Kapat</span>
          </div>
        </div>
      )}
    </div>
  );
}