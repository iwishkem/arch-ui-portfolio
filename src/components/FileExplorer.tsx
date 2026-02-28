import { useState } from 'react';
import { Folder, FileText, FileCode, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import CodeEditor from './CodeEditor';

interface FileExplorerProps {
  openWindow: (id: string, title: string, content: React.ReactNode) => void;
}

const fileSystem = {
  'root': [
    { name: 'projects', type: 'folder' },
    { name: 'education', type: 'folder' },
    { name: 'README.md', type: 'file', content: '# Welcome!\n\nI am Kem. A developer and student specializing in Android modding and Flutter.' }
  ],
  'projects': [
    { name: 'ytxtract.py', type: 'file', content: 'import yt_dlp\n# YouTube media downloader toolkit...' },
    { name: 'XBash.sh', type: 'file', content: '#!/bin/bash\n# ShareX-like image uploader...' },
    { name: 'MusicController.dart', type: 'file', content: 'import "package:flutter/material.dart";\n// Flutter music controller project...' }
  ],
  'education': [
    { name: 'Literature_Notes.txt', type: 'file', content: 'Notes on Literature and Linguistics...' },
    { name: 'Nursing_Practices.txt', type: 'file', content: 'Professional applications in Nursing Assistance.' }
  ]
};

export default function FileExplorer({ openWindow }: FileExplorerProps) {
  const [currentPath, setCurrentPath] = useState<'root' | 'projects' | 'education'>('root');

  const handleDoubleClick = (item: any) => {
    if (item.type === 'folder') setCurrentPath(item.name as any);
    else {
      const isCode = item.name.match(/\.(py|sh|dart)$/);
      openWindow(`file-${item.name}`, item.name, <CodeEditor filename={item.name} content={item.content || ''} />);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#11111b] text-gray-300 select-none">
      <div className="flex items-center justify-between p-3 bg-[#1e1e2e] border-b border-[#313244]">
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentPath('root')} className="p-1.5 hover:bg-[#313244] rounded-lg"><ChevronLeft size={18} /></button>
          <div className="ml-2 px-3 py-1.5 bg-[#11111b] border border-[#313244] rounded-lg text-sm font-mono flex items-center gap-2">
            <span className="text-[#89b4fa]">~</span><span className="text-gray-500">/</span><span className="text-[#a6e3a1]">{currentPath}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#11111b] border border-[#313244] rounded-lg text-sm text-gray-500">
          <Search size={14} /><span>Search...</span>
        </div>
      </div>
      <div className="flex-1 p-4 overflow-auto grid grid-cols-4 sm:grid-cols-6 gap-4">
        {fileSystem[currentPath].map((item, idx) => (
          <div key={idx} className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-[#313244]/50 cursor-pointer transition-colors group h-fit w-full max-w-[100px]" onDoubleClick={() => handleDoubleClick(item)}>
            {item.type === 'folder' ? <Folder size={48} className="text-[#89b4fa] fill-current opacity-80" /> : <FileText size={48} className="text-[#cba6f7]" />}
            <span className="text-xs font-medium truncate w-full text-center">{item.name}</span>
          </div>
        ))}
      </div>
      <div className="h-7 bg-[#1e1e2e] border-t border-[#313244] flex items-center px-4 text-xs text-gray-500 font-mono">
        {fileSystem[currentPath].length} items found.
      </div>
    </div>
  );
}