import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Code2, Play, RotateCcw, Lightbulb, CheckCircle2, Terminal,
  Layers, Braces, Sparkles, FileCode, Check, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader, Panel, SimNote } from "@/components/vv/primitives";
import { useDemo } from "@/lib/demo-store";

export const Route = createFileRoute("/_shell/codeverse")({
  head: () => ({
    meta: [
      { title: "CodeVerse · Block Coding & Python Bridge · VidyaVerse" },
      { name: "description", content: "Computational thinking, visual block coding and transition to Python/Arduino C++." },
    ],
  }),
  component: CodeVersePage,
});

function CodeVersePage() {
  const d = useDemo();

  // Selected puzzle block stack
  const [blocks, setBlocks] = useState<string[]>([
    "repeat 3 times do",
    "  move_forward()",
    "turn_right()",
    "move_forward()",
  ]);

  const [activeTab, setActiveTab] = useState<"blocks" | "python" | "arduino">("blocks");
  const [isRunning, setIsRunning] = useState(false);
  const [outputLog, setOutputLog] = useState<string[]>([
    "System ready. Program loaded with 4 instruction nodes.",
  ]);
  const [isTestPassed, setIsTestPassed] = useState(false);

  // Available block library
  const availableBlocks = [
    { text: "move_forward()", category: "Motion", color: "#38D9F5" },
    { text: "turn_left()", category: "Motion", color: "#38D9F5" },
    { text: "turn_right()", category: "Motion", color: "#38D9F5" },
    { text: "repeat 3 times do", category: "Loops", color: "#FFC857" },
    { text: "if obstacle_ahead() then", category: "Logic", color: "#18C7A5" },
    { text: "set speed = 10", category: "Variables", color: "#818cf8" },
  ];

  const handleAddBlock = (blockText: string) => {
    if (blocks.length < 8) {
      setBlocks([...blocks, blockText]);
      setOutputLog((prev) => [...prev, `Added node: ${blockText}`]);
    }
  };

  const handleRemoveBlock = (index: number) => {
    setBlocks(blocks.filter((_, i) => i !== index));
  };

  const handleRunProgram = async () => {
    setIsRunning(true);
    setIsTestPassed(false);
    setOutputLog(["[SIMULATOR] Initializing virtual rover runtime..."]);

    await new Promise((r) => setTimeout(r, 600));
    setOutputLog((prev) => [...prev, "[RUN] Executing loop: repeat 3 times { move_forward() }"]);

    await new Promise((r) => setTimeout(r, 600));
    setOutputLog((prev) => [...prev, "[RUN] Grid position updated: (3, 0)"]);

    await new Promise((r) => setTimeout(r, 600));
    setOutputLog((prev) => [...prev, "[RUN] Rover heading changed 90° clockwise."]);
    setOutputLog((prev) => [...prev, "[RUN] Final step executed. Target solar station reached!"]);

    setIsRunning(false);
    setIsTestPassed(true);
    d.unlock("coder");
    d.addXp(40, "Completed CodeVerse Loop Sequence Mission");
  };

  // Convert blocks to Python syntax
  const pythonCode = `# VidyaVerse Auto-Generated Python Code
from vidyaverse_robot import Rover

bot = Rover(speed=10)

${blocks
  .map((b) => {
    if (b.startsWith("repeat")) {
      const match = b.match(/\d+/);
      const count = match ? match[0] : "3";
      return `for step in range(${count}):`;
    }
    if (b.startsWith("  ")) return `    bot.${b.trim()}`;
    if (b.startsWith("if")) return "if bot.detect_obstacle():";
    if (b.startsWith("set")) return "speed = 10";
    return `bot.${b}`;
  })
  .join("\n")}

print("Mission destination successfully reached.")
`;

  // Convert blocks to Arduino C++ syntax
  const arduinoCode = `// VidyaVerse Generated Arduino C++ Sketch
#include <Servo.h>

void setup() {
  Serial.begin(9600);
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  // Executing sequenced instructions
${blocks
  .map((b) => {
    if (b.startsWith("repeat")) return "  for (int i = 0; i < 3; i++) {";
    if (b.startsWith("  ")) return "    motorForward(100);";
    if (b === "turn_right()") return "  motorTurnRight(90);";
    if (b === "turn_left()") return "  motorTurnLeft(90);";
    if (b.startsWith("if")) return "  if (digitalRead(SENSOR_PIN) == HIGH) {";
    return `  // ${b}`;
  })
  .join("\n")}
  
  digitalWrite(LED_BUILTIN, HIGH);
  delay(1000);
}
`;

  return (
    <div className="space-y-6">
      <PageHeader
        title="CodeVerse: Computational Thinking & Code Studio"
        description="Build logic sequences with visual blocks, then inspect real-world Python and Arduino C++ translations side-by-side."
        eyebrow={<Badge variant="outline" className="border-[#38D9F5]/50 text-[#38D9F5]">Algorithm Workshop</Badge>}
        actions={
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setBlocks(["repeat 3 times do", "  move_forward()", "turn_right()"]);
                setIsTestPassed(false);
              }}
              className="border-[#2B3452] text-xs"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1" /> Reset Blocks
            </Button>
            <Button
              size="sm"
              onClick={handleRunProgram}
              disabled={isRunning}
              className="bg-[#38D9F5] text-[#0B1020] hover:bg-[#38D9F5]/90 font-bold text-xs shadow-[0_0_15px_rgba(56,217,245,0.3)]"
            >
              <Play className="h-3.5 w-3.5 mr-1 fill-current" />
              {isRunning ? "Simulating..." : "Run Test Code (+40 XP)"}
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left: Block Workspace */}
        <div className="lg:col-span-7 rounded-2xl border border-[#2B3452] bg-[#141A30] p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#2B3452]/60 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-[#38D9F5]" />
                <span className="font-bold text-sm text-[#F4F6FF]">Visual Block Canvas</span>
              </div>
              <Badge variant="outline" className="text-[10px] border-[#FFC857]/40 text-[#FFC857]">
                Mission 1: The Triple Leap Loop
              </Badge>
            </div>

            {/* Block Palette / Toolbox */}
            <div className="mb-4">
              <span className="text-xs font-semibold text-[#A8B0CC] block mb-2">Available Logic Blocks (Click to Append):</span>
              <div className="flex flex-wrap gap-2">
                {availableBlocks.map((b) => (
                  <button
                    key={b.text}
                    onClick={() => handleAddBlock(b.text)}
                    className="rounded-lg px-2.5 py-1 text-xs font-mono font-medium border bg-[#171936] text-[#F4F6FF] hover:border-[#38D9F5] transition-all flex items-center gap-1.5"
                    style={{ borderColor: `${b.color}40` }}
                  >
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: b.color }} />
                    {b.text}
                  </button>
                ))}
              </div>
            </div>

            {/* Program Stack Area */}
            <div className="rounded-xl border border-[#2B3452] bg-[#0B1020] p-4 min-h-[220px]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A8B0CC] block mb-3">
                Current Block Logic Stack ({blocks.length}/8 Nodes)
              </span>

              <div className="space-y-2">
                {blocks.map((block, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs font-mono border transition-all ${
                      block.startsWith("  ")
                        ? "ml-6 bg-[#38D9F5]/10 border-[#38D9F5]/40 text-[#38D9F5]"
                        : block.startsWith("repeat")
                        ? "bg-[#FFC857]/10 border-[#FFC857]/40 text-[#FFC857]"
                        : "bg-[#171936] border-[#2B3452] text-[#F4F6FF]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] opacity-60">{idx + 1}.</span>
                      <span>{block}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveBlock(idx)}
                      className="text-[#f43f5e] hover:underline text-[10px]"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Test results indicator */}
          <div className="mt-4">
            {isTestPassed && (
              <div className="rounded-xl bg-[#18C7A5]/15 border border-[#18C7A5] p-3 text-xs text-[#18C7A5] font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                All test criteria passed! Loop optimization verified. +40 XP awarded.
              </div>
            )}
          </div>
        </div>

        {/* Right: Code Bridge (Python & Arduino C++) & Terminal Log */}
        <div className="lg:col-span-5 space-y-6">
          <Tabs defaultValue="python" className="w-full">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#A8B0CC]">Text Code Projection:</span>
              <TabsList className="bg-[#171936] border border-[#2B3452] h-8 p-0.5">
                <TabsTrigger value="python" className="text-[11px] data-[state=active]:bg-[#38D9F5] data-[state=active]:text-[#0B1020]">
                  Python
                </TabsTrigger>
                <TabsTrigger value="arduino" className="text-[11px] data-[state=active]:bg-[#18C7A5] data-[state=active]:text-[#0B1020]">
                  Arduino C++
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="python" className="m-0">
              <div className="rounded-xl border border-[#2B3452] bg-[#0B1020] p-4 text-xs font-mono text-[#F4F6FF] overflow-x-auto min-h-[220px]">
                <pre>{pythonCode}</pre>
              </div>
            </TabsContent>

            <TabsContent value="arduino" className="m-0">
              <div className="rounded-xl border border-[#2B3452] bg-[#0B1020] p-4 text-xs font-mono text-[#F4F6FF] overflow-x-auto min-h-[220px]">
                <pre>{arduinoCode}</pre>
              </div>
            </TabsContent>
          </Tabs>

          {/* Terminal Output */}
          <Panel title={<span className="inline-flex items-center gap-2 text-xs"><Terminal className="h-4 w-4 text-[#38D9F5]" /> Rover Execution Console</span>}>
            <div className="rounded-lg bg-[#0B1020] border border-[#2B3452] p-3 font-mono text-[11px] text-[#A8B0CC] space-y-1 max-h-40 overflow-y-auto">
              {outputLog.map((log, i) => (
                <div key={i} className={log.includes("target") ? "text-[#18C7A5]" : log.includes("Error") ? "text-[#f43f5e]" : ""}>
                  {log}
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
