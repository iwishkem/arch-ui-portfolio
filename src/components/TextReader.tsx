interface TextReaderProps {
  content: string;
  isCode?: boolean;
}

export default function TextReader({ content, isCode = false }: TextReaderProps) {
  return (
    <div className="h-full w-full bg-[#1e1e2e] text-gray-300 font-mono p-4 overflow-auto whitespace-pre-wrap select-text text-sm">
      {/* Eğer kod dosyasıysa satır numaraları gibi bir his vermesi için sol tarafı biraz boşluklu yapıyoruz */}
      <div className={isCode ? "text-[#a6e3a1]" : "text-[#cba6f7]"}>
        {content}
      </div>
    </div>
  );
}