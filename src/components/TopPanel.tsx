import { useState, useEffect, useRef } from 'react';
import { Wifi, Battery, BatteryCharging, Volume2, Volume1, VolumeX, Cpu, Terminal, Zap } from 'lucide-react';
import { useBattery } from '@uidotdev/usehooks';

export type ThemeType = { id: string; panelClass: string; moduleClass: string; btnClass: string; icon1: string; icon2: string; icon3: string; textHover: string; clockClass: string; };

interface TopPanelProps {
  openTerminal: () => void;
  openSingleWindow: (id: string, title: string, content: React.ReactNode) => void;
  activeWorkspace: number;
  setActiveWorkspace: (ws: number) => void;
  theme: ThemeType;
  volume: number;
  setVolume: (vol: number) => void;
}

export default function TopPanel({ openTerminal, activeWorkspace, setActiveWorkspace, theme, volume, setVolume }: TopPanelProps) {
  const [timeStr, setTimeStr] = useState("");
  const [cpuUsage, setCpuUsage] = useState(3);
  const [wifiSpeed, setWifiSpeed] = useState(130);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const volumeRef = useRef<HTMLDivElement>(null);

  const { level, charging } = useBattery();

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(prev => Math.max(5, Math.min(95, prev + Math.floor(Math.random() * 7) - 3)));
      setWifiSpeed(prev => Math.max(20, Math.min(350, prev + Math.floor(Math.random() * 41) - 20)));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
        if (volumeRef.current && !volumeRef.current.contains(event.target as Node)) {
            setShowVolumeSlider(false);
        }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [volumeRef]);

  useEffect(() => {
    const updateTime = () => setTimeStr(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    updateTime(); const timer = setInterval(updateTime, 1000); return () => clearInterval(timer);
  }, []);

  const VolumeIcon = volume === 0 ? VolumeX : volume < 50 ? Volume1 : Volume2;
  
  return (
    <div className={`flex items-center justify-between px-3 py-2 m-3 backdrop-blur-md border rounded-2xl shadow-xl text-xs font-mono font-bold select-none z-[60] transition-all ${theme.panelClass}`}>
      <div className="flex items-center gap-3">
        <div className={`flex items-center justify-center w-8 h-8 rounded-xl cursor-pointer transition-all ${theme.btnClass}`} onClick={openTerminal} title="Open Terminal"><Terminal size={18} /></div>
        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${theme.moduleClass}`}>
          {[1, 2, 3, 4].map((ws) => {
            const wsColors = [theme.icon1, theme.icon2, theme.icon3, theme.icon2];
            const color = wsColors[ws - 1].match(/#\w+/)?.[0] || '#89b4fa';
            return (
              <span
                key={ws}
                onClick={() => setActiveWorkspace(ws)}
                title={`Workspace ${ws}`}
                className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all ${
                  activeWorkspace === ws ? 'scale-125 shadow-lg' : 'opacity-40 hover:opacity-100'
                }`}
                style={{ backgroundColor: color }}
              ></span>
            );
          })}
        </div>
      </div>
      <div className={`hidden md:flex items-center px-5 py-2 rounded-xl ${theme.moduleClass} ${theme.icon3}`}>~ / workspace_{activeWorkspace}</div>
      <div className="flex items-center gap-2">
        <div className={`hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl ${theme.moduleClass} ${theme.icon1}`}><Cpu size={14} /><span>{cpuUsage}%</span></div>
        <div className="relative" ref={volumeRef}>
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer ${theme.moduleClass} ${theme.icon1}`} onClick={() => setShowVolumeSlider(s => !s)}>
            <VolumeIcon size={14} />
            <span>{volume}%</span>
          </div>
          {showVolumeSlider && (
            <div className={`absolute top-11 right-0 p-4 rounded-xl border flex items-center justify-center ${theme.panelClass} border-[#313244]`}>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-24 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                style={{ accentColor: theme.icon1.match(/#\w+/)?.[0] || '#89b4fa' }}
              />
            </div>
          )}
        </div>
        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${theme.moduleClass} ${theme.icon1}`}><Wifi size={14} /><span>{wifiSpeed} Mb/s</span></div>
        {level && (
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer ${theme.moduleClass} ${charging ? 'text-green-400' : theme.icon2}`}>
          {charging ? <BatteryCharging size={14} /> : <Battery size={14} />}
          <span>{level*100}%</span>
        </div>
        )}
        <div className={`flex items-center px-4 py-2 rounded-xl font-black ${theme.clockClass} shadow-lg`}>{timeStr}</div>
      </div>
    </div>
  );
}