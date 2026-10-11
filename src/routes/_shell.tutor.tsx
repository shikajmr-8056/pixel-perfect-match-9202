import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import {
  Bot, Send, Sparkles, Lightbulb, HelpCircle, CheckCircle2,
  RefreshCw, BookOpen, Layers, ArrowRight, ShieldCheck, Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader, Panel, SimNote } from "@/components/vv/primitives";
import { useDemo } from "@/lib/demo-store";
import { misconceptions, lessons } from "@/data/demo";

export const Route = createFileRoute("/_shell/tutor")({
  validateSearch: (search: Record<string, unknown>): { q?: string | undefined } => ({
    q: typeof search["q"] === "string" ? search["q"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "AI Tutor · Concept Detective · VidyaVerse" },
      { name: "description", content: "Curriculum diagnostic AI assistant that detects root misconceptions with friendly analogies." },
    ],
  }),
  component: TutorPage,
});

interface ChatMessage {
  id: string;
  sender: "user" | "tutor";
  text: string;
  analogy?: string;
  hint?: string;
  practice?: { text: string; options: string[]; correct: number; explanation: string };
  misconceptionId?: string;
  relatedLessonId?: string;
}

function TutorPage() {
  const d = useDemo();
  const search = useSearch({ from: "/_shell/tutor" });

  const [inputMsg, setInputMsg] = useState(search["q"] || "");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-welcome",
      sender: "tutor",
      text: "Namaste Ananya! I am your Concept Detective. Instead of giving direct answers, I help uncover *why* things work. Ask any question about fractions, electric currents, or plant biology!",
      hint: "Try asking: 'Why can't we add 1/2 + 1/3 as 2/5?'",
    },
  ]);

  const [showAnalogyFor, setShowAnalogyFor] = useState<string | null>(null);
  const [selectedPracticeOpt, setSelectedPracticeOpt] = useState<{ msgId: string; optIdx: number } | null>(null);

  const handleSendMessage = (customText?: string) => {
    const textToSend = customText || inputMsg.trim();
    if (!textToSend) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: textToSend,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMsg("");

    // Simulate Concept Detective diagnostic reply
    setTimeout(() => {
      let reply: ChatMessage;

      if (textToSend.toLowerCase().includes("fraction") || textToSend.includes("1/2 + 1/3")) {
        reply = {
          id: `tutor-${Date.now()}`,
          sender: "tutor",
          text: "Aha! You've encountered the classic 'Numerator Adding Misconception'. When you add fractions, you cannot just add 1+1 on top and 2+3 on the bottom to get 2/5.",
          analogy: "Think of chapatis: 1/2 of a chapati is a giant half-circle. 1/3 is a smaller triangle slice. If you put them together, you have MORE than a half! But 2/5 is smaller than a half! They are different-sized pieces, so you must cut them both into same-sized 6th pieces first (3/6 + 2/6 = 5/6).",
          hint: "The denominator is the cut size. You cannot count different size slices together without a common denominator.",
          practice: {
            text: "Now test your understanding: What is 1/4 + 1/2?",
            options: ["2/6", "3/4", "2/4", "1/6"],
            correct: 1,
            explanation: "1/2 converts to 2/4. Then 1/4 + 2/4 = 3/4!",
          },
          relatedLessonId: "fractions-intro",
          misconceptionId: "add-fractions",
        };
      } else if (textToSend.toLowerCase().includes("switch") || textToSend.toLowerCase().includes("bulb") || textToSend.toLowerCase().includes("circuit")) {
        reply = {
          id: `tutor-${Date.now()}`,
          sender: "tutor",
          text: "Great question! Many learners think the switch 'generates' electricity. That is a very common misconception.",
          analogy: "Think of an irrigation canal gate in a village field. The gate doesn't make water; the reservoir makes water! The gate simply opens or closes the flow path. When the switch is closed, current from the battery can finally circulate.",
          hint: "The chemical energy is stored strictly inside the battery cell, not the switch.",
          practice: {
            text: "What is the primary source of current in a torch?",
            options: ["The metallic switch", "The bulb glass", "The chemical cell", "The copper spring"],
            correct: 2,
            explanation: "The chemical cell supplies electrical potential energy.",
          },
          relatedLessonId: "electric-circuits",
          misconceptionId: "open-switch",
        };
      } else {
        reply = {
          id: `tutor-${Date.now()}`,
          sender: "tutor",
          text: `I examined your inquiry regarding "${textToSend}". In science and mathematics, breaking this into observable components gives us the key!`,
          analogy: "Whenever a concept seems abstract, imagine physical building blocks you can weigh or count.",
          hint: "Always check what is being conserved (energy, matter, or part-of-whole).",
          practice: {
            text: "Quick verification: Which decimal is larger, 0.7 or 0.65?",
            options: ["0.65 (has more digits)", "0.7 (7 tenths > 6 tenths)", "They are equal"],
            correct: 1,
            explanation: "0.7 equals 70 hundredths, while 0.65 is only 65 hundredths.",
          },
        };
      }

      setMessages((prev) => [...prev, reply]);
      d.unlock("detective");
      d.addXp(15, "Consulted Concept Detective AI");
    }, 700);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Tutor: Concept Detective"
        description="Diagnoses learning bottlenecks, explains misconceptions using relatable Indian village analogies, and provides targeted follow-ups."
        eyebrow={<Badge variant="outline" className="border-[#38D9F5]/50 text-[#38D9F5]">Cognitive Diagnostician</Badge>}
      />

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left: Chat Flow */}
        <div className="lg:col-span-8 rounded-2xl border border-[#2B3452] bg-[#141A30] p-6 shadow-xl flex flex-col justify-between min-h-[580px]">
          {/* Chat Messages Log */}
          <div className="space-y-4 overflow-y-auto max-h-[460px] pr-2">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.sender === "tutor" && (
                  <div className="h-8 w-8 rounded-xl bg-[#38D9F5]/20 border border-[#38D9F5]/40 flex items-center justify-center shrink-0 text-[#38D9F5]">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`max-w-xl rounded-2xl p-4 text-xs space-y-2.5 ${
                    m.sender === "user"
                      ? "bg-[#38D9F5] text-[#0B1020] font-medium rounded-tr-none"
                      : "bg-[#171936] text-[#F4F6FF] border border-[#2B3452] rounded-tl-none"
                  }`}
                >
                  <p className="leading-relaxed">{m.text}</p>

                  {/* Analogy accordion / reveal */}
                  {m.analogy && (
                    <div className="rounded-xl border border-[#FFC857]/40 bg-[#FFC857]/10 p-3 text-[#FFC857]">
                      <span className="font-bold flex items-center gap-1.5 text-[11px] mb-1">
                        <Sparkles className="h-3.5 w-3.5" /> Real-World Analogy:
                      </span>
                      <p className="text-[11px] text-[#F4F6FF] leading-relaxed">{m.analogy}</p>
                    </div>
                  )}

                  {/* Hints */}
                  {m.hint && (
                    <div className="flex items-center gap-1.5 text-[11px] text-[#18C7A5]">
                      <Lightbulb className="h-3.5 w-3.5 shrink-0" />
                      <span>{m.hint}</span>
                    </div>
                  )}

                  {/* Interactive follow-up practice quiz card */}
                  {m.practice && (
                    <div className="mt-3 rounded-xl border border-[#38D9F5]/40 bg-[#0B1020] p-3 text-xs space-y-2">
                      <span className="font-bold uppercase text-[10px] text-[#38D9F5]">Follow-up Practice:</span>
                      <p className="font-semibold text-[#F4F6FF]">{m.practice.text}</p>

                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {m.practice.options.map((opt, oIdx) => {
                          const isSelected = selectedPracticeOpt?.msgId === m.id && selectedPracticeOpt?.optIdx === oIdx;
                          const isCorrect = oIdx === m.practice?.correct;

                          return (
                            <button
                              key={oIdx}
                              onClick={() => {
                                setSelectedPracticeOpt({ msgId: m.id, optIdx: oIdx });
                                if (isCorrect) d.addXp(20, "Solved Detective practice question");
                              }}
                              className={`rounded-lg p-2 text-xs text-left border transition-all ${
                                isSelected
                                  ? isCorrect
                                    ? "bg-[#18C7A5]/20 border-[#18C7A5] text-[#18C7A5] font-bold"
                                    : "bg-[#f43f5e]/20 border-[#f43f5e] text-[#f43f5e]"
                                  : "bg-[#171D33] border-[#2B3452] text-[#A8B0CC] hover:border-[#38D9F5]"
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {selectedPracticeOpt?.msgId === m.id && (
                        <p className="mt-2 text-[11px] text-[#18C7A5] font-semibold border-t border-[#2B3452] pt-2">
                          {m.practice.explanation}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Suggestions & Input Field */}
          <div className="mt-4 pt-3 border-t border-[#2B3452]/60">
            <div className="flex flex-wrap gap-2 mb-3">
              {[
                "Why can't we add 1/2 + 1/3 as 2/5?",
                "Does a switch generate electricity?",
                "Which is bigger: 0.7 or 0.65?",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSendMessage(suggestion)}
                  className="rounded-full bg-[#171D33] border border-[#2B3452] px-3 py-1 text-[11px] text-[#A8B0CC] hover:text-[#38D9F5] hover:border-[#38D9F5] transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder="Ask about fractions, electric circuits, grammar or algorithms..."
                className="flex-1 rounded-xl border border-[#2B3452] bg-[#0B1020] px-4 py-2.5 text-xs text-[#F4F6FF] placeholder:text-[#A8B0CC]/50 focus:outline-none focus:border-[#38D9F5]"
              />
              <Button type="submit" className="bg-[#38D9F5] text-[#0B1020] hover:bg-[#38D9F5]/90 font-bold px-4 h-10 text-xs">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* Right: Misconceptions Catalog Panel */}
        <div className="lg:col-span-4 space-y-6">
          <Panel title="Known Misconception Diagnostics">
            <p className="text-xs text-[#A8B0CC] mb-3">
              Identified student misconception patterns recorded across rural pilot schools:
            </p>

            <div className="space-y-3">
              {misconceptions.map((misc) => (
                <div
                  key={misc.id}
                  onClick={() => handleSendMessage(misc.question)}
                  className="rounded-xl border border-[#2B3452] bg-[#141A30] p-3 text-xs space-y-1.5 cursor-pointer hover:border-[#38D9F5] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#FFC857]">{misc.misconception}</span>
                    <Badge variant="outline" className="text-[9px] border-[#2B3452]">Curriculum Ch</Badge>
                  </div>
                  <p className="text-[#F4F6FF] text-[11px]">"{misc.question}"</p>
                  <p className="text-[#A8B0CC] text-[10px]">
                    <strong className="text-[#f43f5e]">Common Pitfall:</strong> {misc.studentAnswer}
                  </p>
                </div>
              ))}
            </div>
          </Panel>

          <SimNote>
            Responses are pre-engineered pedagogical diagnoses with proven analogies for the demonstration build.
          </SimNote>
        </div>
      </div>
    </div>
  );
}
