import { FileCode, Play, Terminal } from 'lucide-react';

export default function CodeEditor({ filename, content }: { filename: string, content: string }) {
  const lines = content.split('\n');
  return (
    <div className="flex flex-col h-full w-full bg-[#1e1e2e] text-sm font-mono overflow-hidden">
      <div className="flex items-center bg-[#11111b] border-b border-[#313244] h-10">
        <div className="flex items-center gap-2 bg-[#1e1e2e] text-[#cba6f7] px-4 h-full border-t-2 border-[#cba6f7]"><FileCode size={16} /><span>{filename}</span></div>
        <div className="ml-auto mr-4 flex items-center gap-2 text-[#a6e3a1] cursor-pointer hover:opacity-80"><Play size={14} /> <span className="text-xs font-bold">Run Code</span></div>
      </div>
      <div className="flex flex-1 overflow-auto">
        <div className="flex flex-col text-right px-4 py-4 bg-[#1e1e2e] border-r border-[#313244] text-[#6c7086] min-w-[3rem]">
          {lines.map((_, i) => <span key={i} className="leading-6">{i + 1}</span>)}
        </div>
        <div className="flex-1 p-4 whitespace-pre text-gray-300 leading-6">{content}</div>
      </div>
      <div className="h-6 bg-[#89b4fa] text-[#11111b] flex items-center justify-between px-4 text-[10px] font-black uppercase">
        <span>NORMAL - {filename}</span>
        <span>Ln {lines.length}, Col 1 - UTF-8</span>
      </div>
    </div>
  );
}