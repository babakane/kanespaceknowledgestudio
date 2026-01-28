
import React from 'react';

interface DialogueBoxProps {
  text: string;
  speakerName: string;
}

const DialogueBox: React.FC<DialogueBoxProps> = ({ text, speakerName }) => {
  return (
    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl z-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-slate-950/60 backdrop-blur-2xl border-l-4 border-blue-500 p-8 rounded-r-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] relative group">
        {/* Decorative elements */}
        <div className="absolute top-4 right-6 flex gap-1">
          <div className="w-1 h-1 bg-blue-500/50 rounded-full"></div>
          <div className="w-1 h-1 bg-blue-500/50 rounded-full"></div>
          <div className="w-1 h-1 bg-blue-500/50 rounded-full"></div>
        </div>
        
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="h-[2px] w-8 bg-blue-500/50"></div>
            <span className="text-blue-400 font-orbitron text-xs uppercase tracking-[0.3em] font-bold">
              SIGNAL: {speakerName}
            </span>
          </div>
          <p className="text-xl md:text-2xl text-white/90 font-light leading-snug tracking-tight">
            {text}
          </p>
        </div>
        
        {/* Bottom Corner Accent */}
        <div className="absolute bottom-0 right-0 w-12 h-12 overflow-hidden pointer-events-none">
           <div className="absolute bottom-[-10px] right-[-10px] w-20 h-20 border-r-2 border-b-2 border-blue-500/20 rounded-br-2xl"></div>
        </div>
      </div>
    </div>
  );
};

export default DialogueBox;
