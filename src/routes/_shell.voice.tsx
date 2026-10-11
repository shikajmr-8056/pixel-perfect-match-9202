import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Mic, MicOff, Volume2, Sparkles, Languages, Radio, CheckCircle2,
  Headphones, Play, RotateCcw, Clock, ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader, Panel, SimNote } from "@/components/vv/primitives";
import { useDemo, type Lang } from "@/lib/demo-store";

export const Route = createFileRoute("/_shell/voice")({
  head: () => ({
    meta: [
      { title: "VidyaVerse Voice · Multilingual Audio Assistant" },
      { name: "description", content: "Voice-driven learning companion for low-literacy and regional language students." },
    ],
  }),
  component: VoiceAssistantPage,
});

interface VoiceLog {
  id: string;
  query: string;
  language: string;
  response: string;
  offline: boolean;
  timestamp: string;
}

function VoiceAssistantPage() {
  const d = useDemo();
  const [isListening, setIsListening] = useState(false);
  const [selectedVoiceLang, setSelectedVoiceLang] = useState<Lang>("en");
  const [transcription, setTranscription] = useState<string>("Tap the microphone button to speak your educational query...");
  const [assistantSpokenReply, setAssistantSpokenReply] = useState<string | null>(null);

  const [voiceHistory, setVoiceHistory] = useState<VoiceLog[]>([
    {
      id: "v-1",
      query: "Can you explain photosynthesis in Kannada?",
      language: "Kannada (ಕನ್ನಡ)",
      response: "ಸಸ್ಯಗಳು ಸೂರ್ಯನ ಬೆಳಕು, ನೀರು ಮತ್ತು ಇಂಗಾಲದ ಡೈಆಕ್ಸೈಡ್ ಬಳಸಿ ಕ್ಲೋರೊಫಿಲ್ ಮೂಲಕ ಆಹಾರ ತಯಾರಿಸುತ್ತವೆ.",
      offline: true,
      timestamp: "10 mins ago",
    },
    {
      id: "v-2",
      query: "Give me an example of a circuit insulator.",
      language: "English",
      response: "Plastic, rubber, and dry wood do not allow electrons to pass through easily, making them insulators.",
      offline: true,
      timestamp: "1 hour ago",
    },
  ]);

  const handleSimulateVoice = (samplePrompt?: string) => {
    setIsListening(true);
    setAssistantSpokenReply(null);
    setTranscription("Listening... (Analyzing acoustic pitch & dialect)");

    const chosenQuery = samplePrompt || "Explain how electric current heats a fuse wire in Hindi.";

    setTimeout(() => {
      setTranscription(`"${chosenQuery}"`);
      setIsListening(false);

      let reply = "जब तार से उच्च विद्युत धारा बहती है, तो प्रतिरोध के कारण तार गर्म होकर पिघल जाता है और परिपथ सुरक्षित रहता है।";
      if (selectedVoiceLang === "en") {
        reply = "When current flows through a thin conductor, electrical energy transforms into thermal energy, safely melting the fuse.";
      } else if (selectedVoiceLang === "kn") {
        reply = "ಹೆಚ್ಚಿನ ವಿದ್ಯುತ್ ಹರಿದಾಗ ಫ್ಯೂಸ್ ತಂತಿ ಬಿಸಿಯಾಗಿ ಕರಗುತ್ತದೆ ಮತ್ತು ಉಪಕರಣಗಳನ್ನು ರಕ್ಷಿಸುತ್ತದೆ.";
      }

      setAssistantSpokenReply(reply);
      setVoiceHistory((prev) => [
        {
          id: `v-${Date.now()}`,
          query: chosenQuery,
          language: selectedVoiceLang === "hi" ? "हिन्दी" : selectedVoiceLang === "kn" ? "ಕನ್ನಡ" : "English",
          response: reply,
          offline: true,
          timestamp: "Just now",
        },
        ...prev,
      ]);

      d.addXp(15, "Completed multilingual voice lesson query");
    }, 1600);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="VidyaVerse Voice: Audio Assistant"
        description="Designed for first-generation school learners. Tap to ask questions in Kannada, Hindi or English with local offline voice models."
        eyebrow={<Badge variant="outline" className="border-[#38D9F5]/50 text-[#38D9F5]">Multilingual Voice Engine</Badge>}
      />

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left: Interactive Microphone Canvas */}
        <div className="lg:col-span-7 rounded-2xl border border-[#2B3452] bg-[#141A30] p-6 shadow-xl flex flex-col items-center justify-between min-h-[500px]">
          {/* Top Bar with Language Selector */}
          <div className="w-full flex items-center justify-between border-b border-[#2B3452]/60 pb-3">
            <div className="flex items-center gap-2">
              <Headphones className="h-5 w-5 text-[#38D9F5]" />
              <span className="font-bold text-sm text-[#F4F6FF]">Voice Interaction Hub</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[#A8B0CC]">Input Language:</span>
              <div className="flex rounded-lg border border-[#2B3452] bg-[#0B1020] p-0.5">
                {[
                  { code: "en", label: "EN" },
                  { code: "hi", label: "हिन्दी" },
                  { code: "kn", label: "ಕನ್ನಡ" },
                ].map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setSelectedVoiceLang(l.code as Lang)}
                    className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                      selectedVoiceLang === l.code
                        ? "bg-[#38D9F5] text-[#0B1020]"
                        : "text-[#A8B0CC] hover:text-[#F4F6FF]"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Glowing Microphone Visual with Waveform simulation */}
          <div className="my-8 flex flex-col items-center">
            <button
              onClick={() => handleSimulateVoice()}
              disabled={isListening}
              className={`relative flex h-28 w-28 items-center justify-center rounded-full transition-all duration-500 shadow-2xl ${
                isListening
                  ? "bg-[#38D9F5] text-[#0B1020] scale-110 shadow-[0_0_35px_rgba(56,217,245,0.6)] animate-pulse"
                  : "bg-[#171936] text-[#38D9F5] border-2 border-[#38D9F5]/50 hover:scale-105 hover:border-[#38D9F5] shadow-[0_0_20px_rgba(56,217,245,0.2)]"
              }`}
            >
              <Mic className="h-12 w-12" />
              {isListening && (
                <span className="absolute inset-0 rounded-full border-4 border-[#38D9F5] animate-ping opacity-30" />
              )}
            </button>

            <span className="mt-4 text-xs font-semibold text-[#A8B0CC]">
              {isListening ? "Listening... Speak clearly into your mic" : "Click to Speak Your Question"}
            </span>

            {/* Audio Waveform Bar Simulation */}
            <div className="mt-4 flex items-center gap-1.5 h-8">
              {Array.from({ length: 16 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all duration-300 ${
                    isListening
                      ? "bg-[#38D9F5] animate-pulse"
                      : "bg-[#2B3452]"
                  }`}
                  style={{
                    height: isListening ? `${Math.floor(Math.random() * 24) + 8}px` : "6px",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Recognized text & Spoken Output */}
          <div className="w-full space-y-3">
            <div className="rounded-xl border border-[#2B3452] bg-[#0B1020] p-4 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#38D9F5] block mb-1">
                Recognized Voice Query
              </span>
              <p className="text-xs font-medium text-[#F4F6FF] italic">{transcription}</p>
            </div>

            {assistantSpokenReply && (
              <div className="rounded-xl border border-[#18C7A5]/40 bg-[#18C7A5]/10 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#18C7A5] flex items-center gap-1.5">
                    <Volume2 className="h-4 w-4" /> Spoken Educational Response
                  </span>
                  <Badge variant="outline" className="border-[#18C7A5]/40 text-[#18C7A5] text-[10px]">
                    Audio Read Aloud
                  </Badge>
                </div>
                <p className="text-xs text-[#F4F6FF] leading-relaxed">{assistantSpokenReply}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Suggested Prompts & Offline Engine Info */}
        <div className="lg:col-span-5 space-y-6">
          <Panel title="Voice Command Suggestions">
            <p className="text-xs text-[#A8B0CC] mb-3">
              Tap any regional prompt to test the voice pipeline:
            </p>

            <div className="space-y-2.5">
              {[
                { lang: "Hindi", text: "प्रकाश संश्लेषण क्या होता है? समझाइए।" },
                { lang: "Kannada", text: "ವಿದ್ಯುತ್ ಸರ್ಕ್ಯೂಟ್‌ನಲ್ಲಿ ಸ್ವಿಚ್‌ನ ಕೆಲಸವೇನು?" },
                { lang: "English", text: "Why do we flip and multiply when dividing fractions?" },
                { lang: "Hindi", text: "डेक्कन का पठार किस तरफ ढलान रखता है?" },
              ].map((cmd, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSimulateVoice(cmd.text)}
                  className="w-full rounded-xl border border-[#2B3452] bg-[#141A30] p-3 text-left hover:border-[#38D9F5] hover:bg-[#1e2544] transition-all flex items-center justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#38D9F5] block">{cmd.lang} Prompt</span>
                    <p className="text-xs text-[#F4F6FF] mt-0.5 font-medium">"{cmd.text}"</p>
                  </div>
                  <Play className="h-4 w-4 text-[#A8B0CC] shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </Panel>

          {/* Recent Voice Activity */}
          <Panel title="Recent Voice Inquiries">
            <div className="space-y-2.5 text-xs">
              {voiceHistory.map((v) => (
                <div key={v.id} className="rounded-lg bg-[#0B1020] border border-[#2B3452] p-2.5">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-semibold text-[#38D9F5]">{v.language}</span>
                    <span className="text-[#A8B0CC]">{v.timestamp}</span>
                  </div>
                  <p className="text-[#F4F6FF] font-medium text-[11px]">Q: {v.query}</p>
                  <p className="text-[#18C7A5] text-[11px] mt-1 line-clamp-2">A: {v.response}</p>
                </div>
              ))}
            </div>
          </Panel>

          <SimNote>
            Speech recognition and speech synthesis are simulated for this hackathon preview. Production builds incorporate quantized on-device whisper models on the school server.
          </SimNote>
        </div>
      </div>
    </div>
  );
}
