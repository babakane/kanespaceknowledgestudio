import React, { useState, useEffect, useRef, useCallback } from "react";
import { AppState, ShowDialogue, ParticipantType, SpeechPart } from "./types";
import { generateShowScript } from "./services/geminiService";
import Character from "./components/Character";
import DialogueBox from "./components/DialogueBox";
import {
  Play,
  Send,
  RefreshCw,
  Radio,
  FileText,
  Info,
  ExternalLink,
  Activity,
} from "lucide-react";
import logo from './src/assets/logo.png';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    status: "IDLE",
    currentTopic: "",
    dialogue: null,
    currentStepIndex: -1,
  });

  const [inputTopic, setInputTopic] = useState("");
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  const getFlatSteps = useCallback(
    (dialogue: ShowDialogue | null): SpeechPart[] => {
      if (!dialogue) return [];
      return [dialogue.intro, ...dialogue.discussion, dialogue.synthesis];
    },
    [],
  );

  const currentStep = state.dialogue
    ? getFlatSteps(state.dialogue)[state.currentStepIndex]
    : null;

  const speak = useCallback(
    (text: string, speakerType: ParticipantType) => {
      if (!window.speechSynthesis) return;

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      let selectedVoice = voices[0];

      // Attempt to map specific voices for different participants
      if (speakerType === ParticipantType.PRESENTER) {
        selectedVoice =
          voices.find(
            (v) =>
              (v.name.includes("Male") || v.name.includes("Daniel")) &&
              v.lang.startsWith("en"),
          ) || voices[0];
      } else if (speakerType === ParticipantType.GUEST_A) {
        selectedVoice =
          voices.find(
            (v) => v.name.includes("Male") && v.lang.startsWith("en"),
          ) || voices[1];
      } else {
        selectedVoice =
          voices.find(
            (v) => v.name.includes("Female") && v.lang.startsWith("en"),
          ) || voices[2];
      }

      utterance.voice = selectedVoice;
      utterance.pitch = speakerType === ParticipantType.PRESENTER ? 0.9 : 1.0;
      utterance.rate = 0.9;

      utterance.onend = () => {
        setState((prev) => {
          const steps = getFlatSteps(prev.dialogue);
          if (prev.currentStepIndex < steps.length - 1) {
            return { ...prev, currentStepIndex: prev.currentStepIndex + 1 };
          } else {
            return { ...prev, status: "FINISHED" };
          }
        });
      };

      speechRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [getFlatSteps],
  );

  useEffect(() => {
    if (state.status === "PLAYING" && currentStep) {
      speak(currentStep.text, currentStep.speaker as ParticipantType);
    }
  }, [state.status, state.currentStepIndex, currentStep, speak]);

  const handleStartShow = async () => {
    if (!inputTopic.trim()) return;
    setState((prev) => ({
      ...prev,
      status: "GENERATING",
      currentTopic: inputTopic,
    }));
    try {
      const script = await generateShowScript(inputTopic);
      setState((prev) => ({
        ...prev,
        status: "READY",
        dialogue: script,
        currentStepIndex: 0,
      }));
    } catch (error) {
      console.error("Transmission error:", error);
      setState((prev) => ({ ...prev, status: "IDLE" }));
      alert("Transmission interrupted. Please reconnect.");
    }
  };

  const startPlayback = () => {
    setState((prev) => ({ ...prev, status: "PLAYING" }));
  };

  const reset = () => {
    window.speechSynthesis.cancel();
    setState({
      status: "IDLE",
      currentTopic: "",
      dialogue: null,
      currentStepIndex: -1,
    });
    setInputTopic("");
  };

  const progressPercentage = state.dialogue
    ? (state.currentStepIndex / (getFlatSteps(state.dialogue).length - 1)) * 100
    : 0;

  return (
    <div className="min-h-screen scanlines overflow-hidden studio-bg relative flex flex-col selection:bg-blue-500/30">
      {/* Kanespace Branding Navigation */}
      <header className="px-6 py-5 flex justify-between items-center z-50 bg-black/50 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-4">
          import logo from './assets/logo.png'; // Added import

          // ... inside the component
          <img
            src={logo}
            alt="Kanespace Logo"
            className="w-12 h-12 rounded-sm object-contain"
          />
          <div>
            <h1 className="font-orbitron text-xl font-bold tracking-[0.2em] text-white">
              KANESPACE
            </h1>
            <p className="text-[9px] text-blue-400 tracking-[0.4em] uppercase font-bold">
              Research Transmission Stage
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-4 text-[10px] font-orbitron text-gray-500 tracking-widest">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span>ORBITAL SYNC</span>
            </div>
            <span>V 4.0</span>
          </div>
          <button
            onClick={reset}
            className="group p-2 hover:bg-white/5 rounded-full transition-all"
          >
            <RefreshCw className="w-5 h-5 text-gray-400 group-hover:rotate-180 transition-transform duration-500" />
          </button>
        </div>
      </header>

      {/* Progress Line */}
      {state.status === "PLAYING" && (
        <div
          className="fixed top-0 left-0 h-1 bg-blue-500 z-[100] transition-all duration-1000"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      )}

      <main className="flex-grow relative flex flex-col items-center justify-center p-6">
        {state.status === "IDLE" && (
          <div className="max-w-4xl w-full space-y-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
            <div className="text-center space-y-6">
              <div className="inline-block px-4 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-orbitron tracking-widest mb-4">
                TRANSMISSION PORTAL OPEN
              </div>
              <h2 className="text-5xl md:text-7xl font-orbitron font-bold text-white leading-tight">
                SYNTHESIZING{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">
                  KNOWLEDGE
                </span>{" "}
                FOR HUMANITY.
              </h2>
              <p className="text-gray-400 text-xl font-light max-w-2xl mx-auto leading-relaxed">
                Enter a research topic or study domain to initiate an
                interdisciplinary dialogue focused on practical human benefit.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-3 rounded-2xl flex flex-col md:flex-row gap-3 shadow-2xl focus-within:border-blue-500/50 transition-colors">
              <div className="flex-grow flex items-center px-4">
                <Activity className="text-blue-500 w-5 h-5 mr-3" />
                <input
                  type="text"
                  value={inputTopic}
                  onChange={(e) => setInputTopic(e.target.value)}
                  placeholder="e.g., The impact of decentralized AI on global education..."
                  className="w-full bg-transparent py-4 text-white focus:outline-none placeholder:text-gray-600 text-lg"
                  onKeyDown={(e) => e.key === "Enter" && handleStartShow()}
                />
              </div>
              <button
                onClick={handleStartShow}
                disabled={!inputTopic}
                className="bg-white hover:bg-blue-50 text-black px-10 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                INITIATE STAGE <Send className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {[
                "Regenerative Agriculture Systems",
                "Neural Interfaces & Cognitive Privacy",
                "Micro-climate Resilience Tech",
              ].map((topic) => (
                <button
                  key={topic}
                  onClick={() => setInputTopic(topic)}
                  className="bg-white/5 hover:bg-white/10 border border-white/5 px-5 py-2 rounded-full text-[10px] font-orbitron text-gray-500 hover:text-white transition-all tracking-widest"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        )}

        {state.status === "GENERATING" && (
          <div className="flex flex-col items-center gap-8">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <div className="absolute inset-0 border-2 border-blue-500/20 rounded-full"></div>
              <div className="absolute inset-0 border-t-2 border-blue-500 rounded-full animate-spin"></div>
              <Activity className="text-blue-500 w-12 h-12 animate-pulse" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-orbitron font-bold tracking-widest">
                TRANSMISSION ENCRYPTION...
              </h3>
              <p className="text-gray-500 text-sm font-light">
                Retrieving real-world research data for interdisciplinary
                synthesis...
              </p>
            </div>
          </div>
        )}

        {(state.status === "READY" ||
          state.status === "PLAYING" ||
          state.status === "FINISHED") &&
          state.dialogue && (
            <div className="w-full max-w-7xl h-full flex flex-col justify-center gap-16 relative">
              {state.status === "READY" && (
                <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black/70 backdrop-blur-md rounded-3xl animate-in fade-in duration-500">
                  <button
                    onClick={startPlayback}
                    className="group relative bg-white text-black p-10 rounded-full shadow-[0_0_80px_rgba(59,130,246,0.3)] hover:scale-110 transition-all active:scale-95"
                  >
                    <Play className="w-14 h-14 fill-current ml-1" />
                    <div className="absolute -inset-4 border border-white/20 rounded-full animate-ping opacity-20"></div>
                  </button>
                  <div className="mt-8 text-center">
                    <p className="text-white font-orbitron tracking-[0.5em] text-sm font-bold">
                      START TRANSMISSION
                    </p>
                    <p className="text-blue-400/60 text-[10px] mt-2 font-mono uppercase">
                      Packet ready: {state.currentTopic}
                    </p>
                  </div>
                </div>
              )}

              {/* Stage Layout */}
              <div className="flex flex-wrap md:flex-nowrap items-end justify-center gap-8 md:gap-24 px-6 mb-24">
                <Character
                  type={ParticipantType.GUEST_A}
                  name={state.dialogue.discussion[0].name}
                  location={state.dialogue.discussion[0].location}
                  isActive={currentStep?.speaker === ParticipantType.GUEST_A}
                />
                <Character
                  type={ParticipantType.PRESENTER}
                  name={state.dialogue.intro.name}
                  location={state.dialogue.intro.location}
                  isActive={currentStep?.speaker === ParticipantType.PRESENTER}
                />
                <Character
                  type={ParticipantType.GUEST_B}
                  name={state.dialogue.discussion[1].name}
                  location={state.dialogue.discussion[1].location}
                  isActive={currentStep?.speaker === ParticipantType.GUEST_B}
                />
              </div>

              {currentStep && state.status === "PLAYING" && (
                <DialogueBox
                  text={currentStep.text}
                  speakerName={currentStep.name}
                />
              )}

              {/* Synthesis Research Report */}
              {state.status === "FINISHED" && (
                <div className="absolute inset-0 z-[110] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-3xl animate-in fade-in zoom-in-95 duration-700">
                  <div className="bg-black/60 border border-white/10 p-10 md:p-16 rounded-[2rem] max-w-5xl w-full shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col md:flex-row gap-12 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/10 blur-[60px] rounded-full"></div>

                    <div className="flex-grow space-y-10">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <FileText className="text-blue-400 w-6 h-6" />
                          <h2 className="text-3xl md:text-5xl font-orbitron font-bold text-white tracking-tight leading-none">
                            TRANSMISSION{" "}
                            <span className="text-blue-500">COMPLETE</span>
                          </h2>
                        </div>
                        <div className="h-1 w-24 bg-blue-600"></div>
                      </div>

                      <div className="space-y-6">
                        <h3 className="text-xs font-orbitron text-gray-500 tracking-[0.4em] uppercase font-bold">
                          Core Synthesis
                        </h3>
                        <p className="text-white/90 text-2xl font-light italic leading-relaxed border-l-4 border-blue-500/30 pl-8 py-2">
                          "{state.dialogue.synthesis.text}"
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-4 pt-4">
                        <button
                          onClick={reset}
                          className="bg-white text-black px-10 py-4 rounded-xl font-bold hover:bg-gray-200 transition-all flex items-center gap-2"
                        >
                          NEW RESEARCH <RefreshCw className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => window.print()}
                          className="bg-transparent border border-white/20 text-white px-10 py-4 rounded-xl font-bold hover:bg-white/5 transition-all"
                        >
                          ARCHIVE SUMMARY
                        </button>
                      </div>
                    </div>

                    <div className="w-full md:w-80 space-y-8 bg-white/5 p-8 rounded-2xl border border-white/5">
                      <div className="space-y-4">
                        <h4 className="text-[10px] font-orbitron font-bold text-blue-400 tracking-[0.3em] uppercase">
                          Grounding Sources
                        </h4>
                        <div className="space-y-4">
                          {state.dialogue.sources.map((src, idx) => (
                            <a
                              key={idx}
                              href={src.uri}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group block space-y-1 hover:opacity-70 transition-opacity"
                            >
                              <p className="text-xs text-white font-medium line-clamp-2 leading-snug group-hover:text-blue-300">
                                {src.title}
                              </p>
                              <div className="flex items-center gap-1 text-[9px] text-gray-500 font-mono">
                                <ExternalLink className="w-3 h-3" />
                                <span className="truncate max-w-[150px]">
                                  {new URL(src.uri).hostname}
                                </span>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>

                      <div className="pt-8 border-t border-white/10 space-y-4">
                        <h4 className="text-[10px] font-orbitron font-bold text-gray-500 tracking-[0.3em] uppercase">
                          Human Benefit Index
                        </h4>
                        <div className="flex items-center gap-4">
                          <div className="flex-grow bg-white/10 h-2 rounded-full overflow-hidden">
                            <div className="bg-blue-500 h-full w-[94%] shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                          </div>
                          <span className="text-white font-orbitron text-xs">
                            9.4
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
      </main>

      <footer className="px-6 py-6 flex flex-col md:flex-row justify-between items-center text-[9px] text-gray-600 font-orbitron uppercase tracking-[0.3em] border-t border-white/5 bg-black/60 backdrop-blur-lg">
        <div className="flex items-center gap-4">
          <span>KANESPACE &copy; 2025</span>
          <span className="w-1 h-1 bg-gray-800 rounded-full"></span>
          <span>Interdisciplinary Research Transmission</span>
        </div>
        <div className="flex gap-8 mt-4 md:mt-0">
          <a href="#" className="hover:text-blue-500 transition-colors">
            Manifesto
          </a>
          <a href="#" className="hover:text-blue-500 transition-colors">
            Studies
          </a>
          <a href="#" className="hover:text-blue-500 transition-colors">
            Laboratory
          </a>
        </div>
      </footer>
    </div>
  );
};

export default App;
