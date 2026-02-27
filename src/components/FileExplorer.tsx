import { useState } from 'react';
import { Folder, FileCode, FileText, ChevronLeft, Home, FileJson } from 'lucide-react';
import TextReader from './TextReader';

type FileType = 'folder' | 'code' | 'text' | 'pdf';

interface FileItem {
  name: string;
  type: FileType;
  target?: string; 
  content?: string; // Dosya içeriği eklendi
}

// App.tsx'ten pencere açma fonksiyonunu prop olarak alıyoruz
interface FileExplorerProps {
  openWindow: (id: string, title: string, content: React.ReactNode) => void;
}

export default function FileExplorer({ openWindow }: FileExplorerProps) {
  const [currentPath, setCurrentPath] = useState<string>('home');
  const [history, setHistory] = useState<string[]>(['home']);

  // Gerçekçi dosya içeriklerimiz
  const fileSystem: Record<string, FileItem[]> = {
    home: [
      { name: 'Projects', type: 'folder', target: 'projects' },
      { name: 'School', type: 'folder', target: 'school' },
      { name: 'README.md', type: 'text', content: "# Hoş Geldin!\n\nBurası benim kişisel portfolyom.\nLinux, Python, Android modlama ve Flutter ile ilgileniyorum.\nDosyalar arasında gezinebilirsin." }
    ],
    projects: [
      { name: 'XBash.sh', type: 'code', content: "#!/bin/bash\n# XBash - ShareX like image uploader\n\necho 'Uploading image...'\ncurl -F 'file=@$1' https://upload.server.com/api\necho 'Done!'" },
      { name: 'ytxtract.py', type: 'code', content: "import yt_dlp\n\n# ytxtract - YouTube video/audio downloader toolkit\n# Note: Currently rewriting this module for better API handling.\n\ndef download_audio(url):\n    print(f'Downloading audio from {url}')\n    # TODO: Add fallback servers" },
      { name: 'MusicController', type: 'folder', target: 'music_controller' }
    ],
    music_controller: [
      { name: 'main.dart', type: 'code', content: "import 'package:flutter/material.dart';\n\nvoid main() {\n  runApp(const MusicControllerApp());\n}\n\n// Basic media controls layout built with Flutter" },
      { name: 'pubspec.yaml', type: 'text', content: "name: music_controller\ndescription: A new Flutter project.\n\nenvironment:\n  sdk: '>=3.0.0 <4.0.0'\n\ndependencies:\n  flutter:\n    sdk: flutter" }
    ],
    school: [
      { name: 'Literature_Notes.txt', type: 'text', content: "Edebiyat Notları:\n\n- Tanzimat Edebiyatı dönemi özellikleri\n- Şinasi ve Namık Kemal eserleri incelenecek.\n(Sınav haftası tekrar etmeyi unutma!)" },
      { name: 'Nursing_Practices.txt', type: 'text', content: "Hemşirelik Yardımcılığı Mesleki Uygulamalar:\n\n- Hasta yaşamsal bulgularının (Ateş, Nabız, Tansiyon) takibi.\n- Hastane hijyen ve güvenlik standartları.\n- Pratik sınavı için notlar..." }
    ]
  };

  const handleDoubleClick = (file: FileItem) => {
    if (file.type === 'folder' && file.target) {
      setCurrentPath(file.target);
      setHistory(prev => [...prev, file.target!]);
    } else if (file.content) {
      // SİHİRLİ KISIM: Eğer dosyanın içeriği varsa, yeni bir pencere (TextReader) aç!
      const isCode = file.type === 'code';
      openWindow(
        `file-${file.name}`, // Benzersiz ID
        file.name, // Pencere başlığı dosya adı olacak
        <TextReader content={file.content} isCode={isCode} />
      );
    }
  };

  const goBack = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop();
      const prevFolder = newHistory[newHistory.length - 1];
      setHistory(newHistory);
      setCurrentPath(prevFolder);
    }
  };

  const currentFiles = fileSystem[currentPath] || [];

  return (
    <div className="flex flex-col h-full bg-[#1e1e2e] text-gray-300 w-full select-none">
      <div className="flex items-center gap-2 p-2 bg-[#181825] border-b border-[#313244]">
        <button 
          onClick={goBack} 
          disabled={history.length === 1}
          className={`p-1.5 rounded transition-colors ${history.length === 1 ? 'text-gray-600' : 'hover:bg-[#313244] text-gray-300'}`}
        >
          <ChevronLeft size={18} />
        </button>
        <button 
          onClick={() => { setCurrentPath('home'); setHistory(['home']); }}
          className="p-1.5 hover:bg-[#313244] rounded transition-colors"
        >
          <Home size={18} />
        </button>
        
        <div className="flex-1 ml-2 bg-[#11111b] px-3 py-1.5 rounded text-xs font-mono text-gray-400 border border-[#313244]">
          /home/kem/{currentPath === 'home' ? '' : currentPath.replace('_', '/')}
        </div>
      </div>

      <div className="flex-1 p-4 overflow-auto">
        <div className="grid grid-cols-4 md:grid-cols-5 gap-4">
          {currentFiles.map((file, idx) => (
            <div 
              key={idx}
              onDoubleClick={() => handleDoubleClick(file)}
              className="flex flex-col items-center gap-2 p-3 hover:bg-white/5 rounded cursor-pointer transition-colors group"
            >
              {file.type === 'folder' && <Folder size={48} className="text-[#89b4fa] group-hover:scale-110 transition-transform" />}
              {file.type === 'code' && <FileCode size={48} className="text-[#a6e3a1] group-hover:scale-110 transition-transform" />}
              {file.type === 'text' && <FileText size={48} className="text-[#cba6f7] group-hover:scale-110 transition-transform" />}
              {file.type === 'pdf' && <FileJson size={48} className="text-[#f38ba8] group-hover:scale-110 transition-transform" />}
              
              <span className="text-xs text-center truncate w-full group-hover:text-white transition-colors">
                {file.name}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-[#181825] border-t border-[#313244] px-3 py-1 text-[10px] text-gray-500">
        {currentFiles.length} items
      </div>
    </div>
  );
}