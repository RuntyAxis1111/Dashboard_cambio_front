interface BubbleProps {
  role: "user" | "bot";
  text: string;
  link?: string;
}

export default function ChatBubble({ role, text, link }: BubbleProps) {
  const isBot = role === "bot";
  
  return (
    <div className={`flex ${isBot ? "items-start" : "items-end justify-end"} gap-3 mb-4`}>
      {isBot && (
        <div className="flex-shrink-0">
          <img
            src="/assets/pinguinohybe.png"
            alt="pinguino Hybe"
            className="w-16 h-16 object-contain animate-[pulse_4s_ease-in-out_infinite]"
          />
        </div>
      )}

      <div className="relative">
        {/* Pico triangular para mensajes del bot */}
        {isBot && (
          <div 
            className="absolute left-0 top-4 w-0 h-0 -translate-x-2"
            style={{
              borderTop: '8px solid transparent',
              borderBottom: '8px solid transparent', 
              borderRight: '8px solid rgb(245, 245, 245)', // bg-neutral-100
            }}
          />
        )}
        
        <div
          className={`max-w-[60%] rounded-xl px-4 py-2 text-sm whitespace-pre-wrap
            ${isBot
              ? "bg-neutral-100 text-black border border-neutral-200"
              : "bg-black text-white ml-auto"}`}
        >
          {text}
          {link && (
            <div className="mt-2">
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Ver reporte
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}