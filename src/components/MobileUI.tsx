import { useState, useEffect } from 'react';
import { Terminal, User, Folder as FolderIcon, Settings, Battery, BatteryCharging, Wifi, Bluetooth, Flashlight, Send, Moon, Plane, Sun } from 'lucide-react';
import TerminalApp from './TerminalApp';
import FileExplorer from './FileExplorer';
import type { ThemeType } from './TopPanel';
import { useBattery } from '@uidotdev/usehooks';
// Import other app components and their content...

function QSToggle({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${active ? 'bg-[#89b4fa] text-black' : 'bg-black/20'}`}>
        {icon}
      </div>
      <span className="text-xs font-bold">{label}</span>
    </div>
  );
}

function QuickSettingsPanel({ isOpen, onClose, theme }: { isOpen: boolean, onClose: () => void, theme: ThemeType }) {
  const [brightness, setBrightness] = useState(80);

  return (
    <div 
      className={`absolute inset-0 z-20 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
    >
      <div 
        className={`absolute top-0 left-3 right-3 bg-[#24273a]/80 backdrop-blur-xl rounded-b-3xl shadow-2xl transition-transform duration-300 ease-out ${isOpen ? 'translate-y-0' : '-translate-y-full'}`}
        onClick={e => e.stopPropagation()}
        style={{ paddingTop: `calc(1.75rem + env(safe-area-inset-top))` }}
      >
        <div className="p-4 pt-2">
          <div className="grid grid-cols-4 gap-x-2 gap-y-4 text-white">
            <QSToggle icon={<Wifi size={20} />} label="Wi-Fi" active />
            <QSToggle icon={<Bluetooth size={20} />} label="Bluetooth" />
            <QSToggle icon={<Flashlight size={20} />} label="Flashlight" />
            <QSToggle icon={<Send size={20} className="-rotate-45 -translate-y-px" />} label="Nearby" />
            <QSToggle icon={<Moon size={20} />} label="DND" />
            <QSToggle icon={<Plane size={20} />} label="Airplane" />
            <QSToggle icon={<BatteryCharging size={20} />} label="Battery" />
            <QSToggle icon={<Settings size={20} />} label="Settings" />
          </div>
          <div className="flex items-center gap-3 mt-6">
            <Sun size={16} className="text-gray-400" />
            <input type="range" min="10" max="100" value={brightness} onChange={e => setBrightness(Number(e.target.value))} className="w-full h-1 bg-black/30 rounded-lg appearance-none cursor-pointer" style={{ accentColor: theme.icon1.match(/#\w+/)?.[0] || '#89b4fa' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBar({ onToggleQuickSettings }: { onToggleQuickSettings: () => void }) {
  const [timeStr, setTimeStr] = useState("");
  const { level, charging } = useBattery();

  useEffect(() => {
    const updateTime = () => setTimeStr(new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }));
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStartY(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartY === null) return;
    const deltaY = e.targetTouches[0].clientY - touchStartY;
    if (deltaY > 40) { // Swipe down threshold
      onToggleQuickSettings();
      setTouchStartY(null);
    }
  };

  const handleTouchEnd = () => {
    setTouchStartY(null);
  };

  return (
    <div 
      className="absolute top-0 left-0 right-0 px-3 flex items-center justify-between text-white text-xs font-mono font-bold bg-black/20 backdrop-blur-sm z-30"
      style={{
        height: 'calc(1.75rem + env(safe-area-inset-top))',
        paddingTop: 'env(safe-area-inset-top)',
      }} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd} onClick={onToggleQuickSettings}>
      <span className="w-1/3">{timeStr}</span>
      <div className="w-1/3"></div>
      <div className="flex items-center gap-3">
        {level && <div className={`flex items-center gap-1.5 ${charging ? 'text-green-400' : ''}`}>{charging ? <BatteryCharging size={16} /> : <Battery size={16} />}<span>{Math.round(level * 100)}%</span></div>}
        <Wifi size={16} />
      </div>
    </div>
  );
}

interface HomeSliderProps {
  onHomeClick: () => void;
}

function HomeSlider({ onHomeClick }: HomeSliderProps) {
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [isInteracting, setIsInteracting] = useState(false);

  const triggerHome = () => {
    if (navigator.vibrate) navigator.vibrate(50); // Vibrate on successful action
    onHomeClick();
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStartY(e.targetTouches[0].clientY);
    setIsInteracting(true);
    if (navigator.vibrate) navigator.vibrate(10); // Vibrate lightly on touch start
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartY === null) return;
    const deltaY = touchStartY - e.targetTouches[0].clientY;
    if (deltaY > 40) { // Swipe up threshold
      triggerHome();
      setTouchStartY(null);
      setIsInteracting(false);
    }
  };

  const handleTouchEnd = () => {
    setTouchStartY(null);
    setIsInteracting(false);
  };

  return (
    <div 
      className="h-8 flex-shrink-0 flex items-center justify-center" 
      onClick={triggerHome} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}
    >
      <div className={`w-32 h-1.5 bg-white/40 rounded-full transition-all duration-200 ease-out hover:bg-white/80 active:scale-95 cursor-pointer ${isInteracting ? 'scale-y-125 bg-white/60' : ''}`} />
    </div>
  );
}

interface AppDefinition {
  id: string;
  title: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

interface MobileUIProps {
  theme: ThemeType & { bg: string };
  openWindow: (id: string, title: string, content: React.ReactNode) => void;
  TweakToolContent: React.ReactNode;
  AboutMeContent: React.ReactNode;
}

export default function MobileUI({ theme, openWindow, TweakToolContent, AboutMeContent }: MobileUIProps) {
  const [activeApp, setActiveApp] = useState<AppDefinition | null>(null);
  const [isQuickSettingsOpen, setIsQuickSettingsOpen] = useState(false);

  const toggleQuickSettings = () => {
    if (navigator.vibrate) navigator.vibrate(20);
    setIsQuickSettingsOpen(prev => !prev);
  };

  // Define your apps
  const appDefinitions = [
    { id: 'terminal', title: 'Terminal', icon: <Terminal size={32} />, content: <TerminalApp onExit={() => setActiveApp(null)} /> },
    { id: 'files', title: 'Files', icon: <FolderIcon size={32} />, content: <FileExplorer openWindow={(id, title, content) => setActiveApp({ id, title, content })} /> },
    { id: 'about', title: 'About Me', icon: <User size={32} />, content: AboutMeContent },
    { id: 'settings', title: 'Settings', icon: <Settings size={32} />, content: TweakToolContent },
  ];

  const handleOpenApp = (app: AppDefinition) => {
    setActiveApp(app);
  };

  // If an app is open, render it full-screen
  if (activeApp) {
    return (
      <div className="absolute inset-0 flex flex-col bg-[#11111b]">
        <StatusBar onToggleQuickSettings={toggleQuickSettings} />
        <QuickSettingsPanel isOpen={isQuickSettingsOpen} onClose={toggleQuickSettings} theme={theme} />
        {/* Simple header for the app */}
        <div 
          className={`flex items-center justify-center p-3 bg-[#181825] border-b border-[#313244] ${theme.icon1}`}
          style={{ marginTop: 'calc(1.75rem + env(safe-area-inset-top))' }}>
          <h2 className="font-bold text-sm">{activeApp.title}</h2>
        </div>
        <div className="flex-1 overflow-auto">
          {activeApp.content}
        </div>
        <div style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
          <HomeSlider onHomeClick={() => setActiveApp(null)} />
        </div>
      </div>
    );
  }

  // Otherwise, show the App Drawer (Home Screen)
  return (
    <div className="absolute inset-0 bg-cover bg-center flex flex-col" style={{ backgroundImage: `url("${theme.bg}")`}}>
      <StatusBar onToggleQuickSettings={toggleQuickSettings} />
      <QuickSettingsPanel isOpen={isQuickSettingsOpen} onClose={toggleQuickSettings} theme={theme} />
      <div className={`flex-1 flex flex-col transition-transform duration-300 ${isQuickSettingsOpen ? 'scale-95 opacity-50 rounded-3xl overflow-hidden' : ''}`} style={{ paddingTop: 'calc(1.75rem + env(safe-area-inset-top))' }}>
        {/* Fake Search Bar */}
        <div className="px-6 pt-4 pb-2">
          <div className="bg-black/25 backdrop-blur-md rounded-full h-12 flex items-center px-5 text-gray-300/80 text-base">
            Search...
          </div>
        </div>
        {/* App Grid */}
        <div className="flex-1 overflow-y-auto px-4">
          <div className="grid grid-cols-4 content-start gap-y-8 py-4">
            {appDefinitions.map(app => (
              <div key={app.id} onClick={() => handleOpenApp(app)} className="flex flex-col items-center justify-center gap-2 text-white text-xs font-bold">
                <div className={`p-3 rounded-full bg-black/30 backdrop-blur-sm ${theme.icon1}`}>
                  {app.icon}
                </div>
                <span>{app.title}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Dock */}
        <div className="px-4" style={{ paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom))' }}>
          <div className="bg-black/25 backdrop-blur-md rounded-3xl">
            <HomeSlider onHomeClick={() => {}} />
          </div>
        </div>
      </div>
    </div>
  );
}
