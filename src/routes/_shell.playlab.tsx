import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Gamepad2, Play, RotateCcw, Award, CheckCircle2, QrCode, Sparkles,
  ArrowRight, Shield, BookOpen, Compass, ChevronRight, HelpCircle, Dices
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader, Panel, SimNote } from "@/components/vv/primitives";
import { useDemo } from "@/lib/demo-store";
import { playlabGames } from "@/data/demo";

export const Route = createFileRoute("/_shell/playlab")({
  head: () => ({
    meta: [
      { title: "PlayLab · Educational Games · VidyaVerse" },
      { name: "description", content: "Curriculum-based digital and physical board games for classrooms with low connectivity." },
    ],
  }),
  component: PlayLabPage,
});

// CodeBot Maze State
type Direction = "UP" | "RIGHT" | "DOWN" | "LEFT";
type Command = "FORWARD" | "TURN_LEFT" | "TURN_RIGHT";

const MAZE_GRID = [
  [0, 0, 0, 0],
  [1, 1, 0, 1],
  [0, 0, 0, 0],
  [0, 1, 1, 2], // 2 is goal, 1 is obstacle
];

function PlayLabPage() {
  const d = useDemo();

  // CodeBot Game State
  const [botPos, setBotPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [botDir, setBotDir] = useState<Direction>("RIGHT");
  const [commandQueue, setCommandQueue] = useState<Command[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [mazeMessage, setMazeMessage] = useState<string>("Program CodeBot to reach the Cosmic Portal (bottom-right)!");
  const [hasWonMaze, setHasWonMaze] = useState(false);

  // Math Ludo State
  const [diceRoll, setDiceRoll] = useState<number>(3);
  const [tokenPosition, setTokenPosition] = useState<number>(1);
  const [ludoQuestion, setLudoQuestion] = useState<{ text: string; options: string[]; correct: number; explanation: string } | null>(null);
  const [selectedLudoOption, setSelectedLudoOption] = useState<number | null>(null);
  const [ludoResult, setLudoResult] = useState<string | null>(null);

  // Add commands to CodeBot
  const addCommand = (cmd: Command) => {
    if (commandQueue.length < 8 && !isRunning && !hasWonMaze) {
      setCommandQueue([...commandQueue, cmd]);
    }
  };

  const resetMaze = () => {
    setBotPos({ x: 0, y: 0 });
    setBotDir("RIGHT");
    setCommandQueue([]);
    setIsRunning(false);
    setHasWonMaze(false);
    setMazeMessage("Commands cleared. Build your path!");
  };

  const runCodeBot = async () => {
    if (commandQueue.length === 0 || isRunning) return;
    setIsRunning(true);
    setMazeMessage("CodeBot is executing sequence...");

    let curX = botPos.x;
    let curY = botPos.y;
    let curDir = botDir;

    for (let i = 0; i < commandQueue.length; i++) {
      const cmd = commandQueue[i];
      await new Promise((r) => setTimeout(r, 600));

      if (cmd === "TURN_LEFT") {
        const dirs: Direction[] = ["UP", "LEFT", "DOWN", "RIGHT"];
        const nextIdx = (dirs.indexOf(curDir) + 1) % 4;
        curDir = dirs[nextIdx] ?? "RIGHT";
        setBotDir(curDir);
      } else if (cmd === "TURN_RIGHT") {
        const dirs: Direction[] = ["UP", "RIGHT", "DOWN", "LEFT"];
        const nextIdx = (dirs.indexOf(curDir) + 1) % 4;
        curDir = dirs[nextIdx] ?? "RIGHT";
        setBotDir(curDir);
      } else if (cmd === "FORWARD") {
        let nextX = curX;
        let nextY = curY;
        if (curDir === "UP") nextY -= 1;
        if (curDir === "RIGHT") nextX += 1;
        if (curDir === "DOWN") nextY += 1;
        if (curDir === "LEFT") nextX -= 1;

        // Check walls & boundaries
        if (nextX < 0 || nextX > 3 || nextY < 0 || nextY > 3) {
          setMazeMessage("Collision! CodeBot hit the grid boundary!");
          setIsRunning(false);
          return;
        }
        const nextRow = MAZE_GRID[nextY];
        if (nextRow && nextRow[nextX] === 1) {
          setMazeMessage("Obstacle hit! An asteroid blocked the path.");
          setIsRunning(false);
          return;
        }

        curX = nextX;
        curY = nextY;
        setBotPos({ x: curX, y: curY });

        // Goal reached?
        const checkRow = MAZE_GRID[curY];
        if (checkRow && checkRow[curX] === 2) {
          setHasWonMaze(true);
          setMazeMessage("Cosmic Portal Reached! Challenge Solved! +50 XP");
          setIsRunning(false);
          d.addXp(50, "Solved CodeBot Maze in PlayLab");
          d.unlock("maze-solver");
          return;
        }
      }
    }

    const finalRow = MAZE_GRID[curY];
    if (!finalRow || finalRow[curX] !== 2) {
      setMazeMessage("Sequence finished, but portal wasn't reached. Add more moves or adjust turns!");
    }
    setIsRunning(false);
  };

  // Math Ludo Roll Action
  const rollDice = () => {
    const rolled = Math.floor(Math.random() * 6) + 1;
    setDiceRoll(rolled);
    setSelectedLudoOption(null);
    setLudoResult(null);

    // Question for step
    const questions = [
      { text: "What is 1/3 of 18 chapatis?", options: ["5", "6", "9", "3"], correct: 1, explanation: "18 ÷ 3 = 6." },
      { text: "Which fraction is bigger: 3/4 or 2/4?", options: ["2/4", "3/4", "Equal", "None"], correct: 1, explanation: "Same denominator, 3 > 2." },
      { text: "Solve: 4 × 1/2", options: ["2", "4", "1", "8"], correct: 0, explanation: "4 × 1/2 = 4/2 = 2." },
      { text: "What is 0.5 expressed as a simple fraction?", options: ["1/5", "1/2", "5/100", "2/5"], correct: 1, explanation: "0.5 = 5/10 = 1/2." },
    ];
    setLudoQuestion(questions[Math.floor(Math.random() * questions.length)] || null);
  };

  const handleLudoAnswer = (optIdx: number) => {
    setSelectedLudoOption(optIdx);
    if (!ludoQuestion) return;
    if (optIdx === ludoQuestion.correct) {
      setLudoResult("Correct! Token moves forward by " + diceRoll + " spaces!");
      setTokenPosition((prev) => Math.min(24, prev + diceRoll));
      d.addXp(15, "Math Ludo correct challenge card");
    } else {
      setLudoResult("Incorrect: " + ludoQuestion.explanation + " Token stays in place this turn.");
    }
  };

  const allGames = [
    {
      id: "codebot-maze",
      name: "CodeBot Maze",
      subject: "Computing & Logic",
      tag: "Playable Digital",
      playable: true,
      difficulty: "Beginner",
      duration: "10 mins",
      desc: "Program instructions to guide a robotic rover past asteroid obstacles to the cosmic portal.",
      objectives: ["Sequential thinking", "Debugging logic", "Spatial orientation"],
      rules: "Queue forward steps and rotations. Avoid obstacles.",
    },
    {
      id: "math-ludo",
      name: "Math Ludo",
      subject: "Mathematics",
      tag: "Playable Digital + Physical",
      playable: true,
      difficulty: "All Classes",
      duration: "15 mins",
      desc: "Curriculum board game where advancing your token requires answering mental math challenge cards.",
      objectives: ["Fraction operations", "Mental arithmetic", "Multiplication"],
      rules: "Roll dice, answer the curriculum challenge card. Correct answers advance your token.",
    },
    {
      id: "fraction-builders",
      name: "Fraction Builders",
      subject: "Mathematics",
      tag: "Physical Board",
      playable: false,
      difficulty: "Intermediate",
      duration: "20 mins",
      desc: "Assemble physical wooden tiles to balance whole circles and compare equivalent fractions.",
      objectives: ["Equivalent fractions", "Common denominators", "Visual geometry"],
      rules: "Combine fractional arcs to form solid rings without overlapping.",
    },
    {
      id: "newtons-race",
      name: "Newton’s Race",
      subject: "Science",
      tag: "STEM Physical Kit",
      playable: false,
      difficulty: "Intermediate",
      duration: "25 mins",
      desc: "Low-cost ramp and matchbox car experiment exploring friction, ramp angle, and kinetic momentum.",
      objectives: ["Newton's laws", "Friction estimation", "Scientific measurement"],
      rules: "Adjust ramp height and weight loads, record distances on chart.",
    },
    {
      id: "circuit-masters",
      name: "Circuit Masters",
      subject: "Science & Electronics",
      tag: "Card Game",
      playable: false,
      difficulty: "Beginner",
      duration: "15 mins",
      desc: "Collect and match cell, switch, conductor, and load cards to close working electrical loops.",
      objectives: ["Circuit loop verification", "Conductors vs Insulators", "Switch logic"],
      rules: "Draw components to create closed loops before your classroom opponents.",
    },
    {
      id: "ecoquest",
      name: "EcoQuest",
      subject: "Environmental Science",
      tag: "Outdoor + QR Worksheets",
      playable: false,
      difficulty: "Elementary",
      duration: "30 mins",
      desc: "Campus biodiversity investigation using printed field guides to catalog local plants and soil types.",
      objectives: ["Habitat classification", "Botanical observation", "Data recording"],
      rules: "Locate native flora on school grounds, scan QR cards for historical facts.",
    },
    {
      id: "bharat-explorer",
      name: "Bharat Explorer",
      subject: "Social Science",
      tag: "Physical Map Board",
      playable: false,
      difficulty: "All Classes",
      duration: "20 mins",
      desc: "Interactive geography expedition exploring India's rivers, plateau landforms, and cultural history.",
      objectives: ["States & Capitals", "River origins", "Climate zones"],
      rules: "Answer geographic clues to unlock state expedition badges across the map.",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="PlayLab: Educational Gaming Universe"
        description="Curriculum-aligned digital puzzles and physical classroom board games engineered to thrive with zero connectivity."
        eyebrow={<Badge variant="outline" className="border-[#FFC857]/50 text-[#FFC857]">Gamified Learning</Badge>}
      />

      <Tabs defaultValue="codebot" className="space-y-6">
        <TabsList className="bg-[#171936] border border-[#2B3452] p-1">
          <TabsTrigger value="codebot" className="data-[state=active]:bg-[#38D9F5] data-[state=active]:text-[#0B1020] text-xs font-semibold">
            🕹️ Playable: CodeBot Maze
          </TabsTrigger>
          <TabsTrigger value="ludo" className="data-[state=active]:bg-[#FFC857] data-[state=active]:text-[#0B1020] text-xs font-semibold">
            🎲 Playable: Math Ludo
          </TabsTrigger>
          <TabsTrigger value="catalog" className="data-[state=active]:bg-[#18C7A5] data-[state=active]:text-[#0B1020] text-xs font-semibold">
            📦 Physical & Card Game Kits (7)
          </TabsTrigger>
        </TabsList>

        {/* 1. CODEBOT MAZE PLAYABLE TAB */}
        <TabsContent value="codebot" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Grid & Simulation Canvas */}
            <div className="lg:col-span-7 rounded-2xl border border-[#2B3452] bg-[#141A30] p-6 shadow-xl flex flex-col items-center">
              <div className="flex items-center justify-between w-full mb-4 border-b border-[#2B3452]/60 pb-3">
                <div>
                  <h3 className="font-bold text-base text-[#F4F6FF]">CodeBot Simulation Grid (4×4)</h3>
                  <p className="text-xs text-[#A8B0CC]">Guide CodeBot to the glowing portal at (3,3)</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-[#38D9F5]/10 text-[#38D9F5] border-[#38D9F5]/30 text-xs">
                    Facing: {botDir}
                  </Badge>
                  <Button size="sm" variant="outline" onClick={resetMaze} className="border-[#2B3452] text-xs h-7">
                    <RotateCcw className="h-3 w-3 mr-1" /> Reset
                  </Button>
                </div>
              </div>

              {/* Grid visual */}
              <div className="grid grid-cols-4 gap-2.5 bg-[#0B1020] p-4 rounded-xl border border-[#2B3452] my-2">
                {MAZE_GRID.map((row, rIdx) =>
                  row.map((cell, cIdx) => {
                    const isBot = botPos.x === cIdx && botPos.y === rIdx;
                    const isObstacle = cell === 1;
                    const isGoal = cell === 2;

                    return (
                      <div
                        key={`${rIdx}-${cIdx}`}
                        className={`relative h-16 w-16 sm:h-20 sm:w-20 rounded-lg flex items-center justify-center font-bold text-xs transition-all ${
                          isBot
                            ? "bg-[#38D9F5]/25 border-2 border-[#38D9F5] shadow-[0_0_15px_rgba(56,217,245,0.4)]"
                            : isObstacle
                            ? "bg-[#2B3452]/80 border border-[#f43f5e]/40 text-[#f43f5e]"
                            : isGoal
                            ? "bg-[#FFC857]/20 border-2 border-[#FFC857] shadow-[0_0_15px_rgba(255,200,87,0.4)] text-[#FFC857]"
                            : "bg-[#171D33] border border-[#2B3452]/40 text-[#A8B0CC]"
                        }`}
                      >
                        {isBot ? (
                          <div className="flex flex-col items-center">
                            <span className="text-xl">🤖</span>
                            <span className="text-[10px] text-[#38D9F5] font-mono">
                              {botDir === "UP" ? "▲" : botDir === "RIGHT" ? "▶" : botDir === "DOWN" ? "▼" : "◀"}
                            </span>
                          </div>
                        ) : isObstacle ? (
                          <span className="text-sm">🪨 Ast</span>
                        ) : isGoal ? (
                          <div className="flex flex-col items-center animate-pulse">
                            <span className="text-lg">🌀</span>
                            <span className="text-[9px] uppercase font-bold text-[#FFC857]">Portal</span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-muted-foreground/30 font-mono">
                            {cIdx},{rIdx}
                          </span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Status announcement */}
              <div
                className={`mt-4 w-full rounded-xl p-3 text-center text-xs font-semibold border ${
                  hasWonMaze
                    ? "bg-[#18C7A5]/15 border-[#18C7A5] text-[#18C7A5]"
                    : isRunning
                    ? "bg-[#38D9F5]/10 border-[#38D9F5]/40 text-[#38D9F5]"
                    : "bg-[#171936] border-[#2B3452] text-[#F4F6FF]"
                }`}
              >
                {mazeMessage}
              </div>
            </div>

            {/* Instruction Command Block Programmer */}
            <div className="lg:col-span-5 rounded-2xl border border-[#2B3452] bg-[#171D33] p-6 shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-base text-[#F4F6FF] mb-1">Command Sequence Blocks</h3>
                <p className="text-xs text-[#A8B0CC] mb-4">
                  Construct your sequence (Max 8 blocks). Click to add blocks:
                </p>

                {/* Available Blocks */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addCommand("FORWARD")}
                    disabled={commandQueue.length >= 8 || isRunning || hasWonMaze}
                    className="border-[#38D9F5]/40 bg-[#141A30] text-[#38D9F5] hover:bg-[#38D9F5]/10 text-xs font-semibold h-10"
                  >
                    Step Forward
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addCommand("TURN_LEFT")}
                    disabled={commandQueue.length >= 8 || isRunning || hasWonMaze}
                    className="border-[#18C7A5]/40 bg-[#141A30] text-[#18C7A5] hover:bg-[#18C7A5]/10 text-xs font-semibold h-10"
                  >
                    Turn Left ↺
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addCommand("TURN_RIGHT")}
                    disabled={commandQueue.length >= 8 || isRunning || hasWonMaze}
                    className="border-[#FFC857]/40 bg-[#141A30] text-[#FFC857] hover:bg-[#FFC857]/10 text-xs font-semibold h-10"
                  >
                    Turn Right ↻
                  </Button>
                </div>

                {/* Current Program Stack */}
                <div className="rounded-xl border border-[#2B3452] bg-[#0B1020] p-3 min-h-[140px]">
                  <p className="text-[11px] font-bold uppercase text-[#A8B0CC] mb-2 flex items-center justify-between">
                    <span>Program Stack ({commandQueue.length}/8 blocks)</span>
                    {commandQueue.length > 0 && (
                      <button
                        onClick={() => setCommandQueue([])}
                        className="text-[#f43f5e] hover:underline text-[10px]"
                      >
                        Clear All
                      </button>
                    )}
                  </p>

                  {commandQueue.length === 0 ? (
                    <div className="flex h-20 items-center justify-center text-xs text-[#A8B0CC]/60 italic">
                      No blocks queued yet. Tap the buttons above!
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {commandQueue.map((cmd, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 rounded bg-[#171936] px-2.5 py-1 text-xs font-mono text-[#F4F6FF] border border-[#2B3452]"
                        >
                          <span className="text-[10px] text-[#38D9F5]">{idx + 1}.</span> {cmd}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Execution Actions */}
              <div className="mt-5 space-y-2">
                <Button
                  onClick={runCodeBot}
                  disabled={commandQueue.length === 0 || isRunning || hasWonMaze}
                  className="w-full bg-[#38D9F5] text-[#0B1020] hover:bg-[#38D9F5]/90 font-bold h-11 shadow-[0_0_15px_rgba(56,217,245,0.3)]"
                >
                  <Play className="h-4 w-4 mr-2 fill-current" />
                  {isRunning ? "Running Algorithm..." : "Execute Program Code"}
                </Button>
                <p className="text-[11px] text-center text-[#A8B0CC]">
                  Builds computational thinking and algorithms without typing syntax.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* 2. MATH LUDO PLAYABLE TAB */}
        <TabsContent value="ludo" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Ludo Track */}
            <div className="lg:col-span-7 rounded-2xl border border-[#2B3452] bg-[#141A30] p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4 border-b border-[#2B3452]/60 pb-3">
                <div>
                  <h3 className="font-bold text-base text-[#F4F6FF]">Math Ludo: Track Board (1 to 24)</h3>
                  <p className="text-xs text-[#A8B0CC]">Solve curriculum card to advance toward the Star Base!</p>
                </div>
                <Badge className="bg-[#FFC857]/10 text-[#FFC857] border-[#FFC857]/30">
                  Token at Step {tokenPosition}/24
                </Badge>
              </div>

              {/* Track visual */}
              <div className="grid grid-cols-6 gap-2 my-4">
                {Array.from({ length: 24 }).map((_, i) => {
                  const step = i + 1;
                  const isTokenHere = tokenPosition === step;
                  const isGoal = step === 24;

                  return (
                    <div
                      key={step}
                      className={`h-12 rounded-lg border flex flex-col items-center justify-center font-mono text-xs transition-all ${
                        isTokenHere
                          ? "bg-[#FFC857] text-[#0B1020] font-black border-[#FFC857] shadow-[0_0_12px_rgba(255,200,87,0.5)] scale-105"
                          : isGoal
                          ? "bg-[#18C7A5]/20 border-[#18C7A5] text-[#18C7A5] font-bold"
                          : "bg-[#171D33] border-[#2B3452] text-[#A8B0CC]"
                      }`}
                    >
                      <span>{step}</span>
                      {isTokenHere && <span className="text-[9px] uppercase">Ravi</span>}
                      {isGoal && !isTokenHere && <span className="text-[8px]">Goal 🌟</span>}
                    </div>
                  );
                })}
              </div>

              {/* Physical companion info */}
              <div className="rounded-xl border border-dashed border-[#2B3452] bg-[#171936] p-3 text-xs text-[#A8B0CC] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <QrCode className="h-5 w-5 text-[#38D9F5]" />
                  <span>Physical Board Companion: Printable dice & physical wood tokens included for offline school kits.</span>
                </div>
                <Badge variant="outline" className="border-[#18C7A5]/50 text-[#18C7A5] text-[10px]">100% Zero-Screen Capable</Badge>
              </div>
            </div>

            {/* Dice & Challenge Card */}
            <div className="lg:col-span-5 rounded-2xl border border-[#2B3452] bg-[#171D33] p-6 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-base text-[#F4F6FF]">Turn Action</h3>
                  <Button
                    onClick={rollDice}
                    className="bg-[#FFC857] text-[#0B1020] hover:bg-[#FFC857]/90 font-bold text-xs h-9"
                  >
                    <Dices className="h-4 w-4 mr-1.5" /> Roll Dice
                  </Button>
                </div>

                <div className="rounded-xl border border-[#2B3452] bg-[#0B1020] p-4 text-center mb-4">
                  <span className="text-xs text-[#A8B0CC] uppercase tracking-wider">Current Dice Roll</span>
                  <div className="font-display text-4xl font-black text-[#FFC857] my-1">{diceRoll}</div>
                  <span className="text-xs text-[#A8B0CC]">Answer correctly to move +{diceRoll} spaces!</span>
                </div>

                {ludoQuestion ? (
                  <div className="rounded-xl border border-[#38D9F5]/40 bg-[#141A30] p-4 space-y-3">
                    <span className="text-[11px] font-bold uppercase text-[#38D9F5]">Math Challenge Card</span>
                    <p className="font-semibold text-xs text-[#F4F6FF]">{ludoQuestion.text}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {ludoQuestion.options.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          onClick={() => handleLudoAnswer(oIdx)}
                          className={`rounded-lg p-2 text-xs font-semibold text-center border transition-all ${
                            selectedLudoOption === oIdx
                              ? oIdx === ludoQuestion.correct
                                ? "bg-[#18C7A5]/25 border-[#18C7A5] text-[#18C7A5]"
                                : "bg-[#f43f5e]/25 border-[#f43f5e] text-[#f43f5e]"
                              : "bg-[#171936] border-[#2B3452] text-[#F4F6FF] hover:border-[#38D9F5]"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-[#2B3452] bg-[#141A30] p-6 text-center text-xs text-[#A8B0CC]">
                    Click "Roll Dice" to trigger the challenge card!
                  </div>
                )}

                {ludoResult && (
                  <div className="mt-3 rounded-lg bg-[#171936] p-2.5 text-xs text-[#F4F6FF] border border-[#2B3452]">
                    {ludoResult}
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* 3. FULL GAME DISCOVERY CATALOG */}
        <TabsContent value="catalog" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {allGames.map((game) => (
              <div
                key={game.id}
                className="rounded-2xl border border-[#2B3452] bg-[#171D33] p-5 flex flex-col justify-between hover:border-[#38D9F5]/50 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="border-[#38D9F5]/40 text-[#38D9F5] text-[10px]">
                      {game.subject}
                    </Badge>
                    <span className="text-[11px] text-[#A8B0CC] font-mono">{game.duration}</span>
                  </div>

                  <h3 className="text-base font-bold text-[#F4F6FF] mt-1">{game.name}</h3>
                  <p className="mt-1.5 text-xs text-[#A8B0CC] leading-relaxed">{game.desc}</p>

                  <div className="mt-4 space-y-1.5 border-t border-[#2B3452]/50 pt-3">
                    <span className="text-[10px] font-bold uppercase text-[#FFC857]">Learning Objectives:</span>
                    <ul className="text-[11px] text-[#A8B0CC] list-disc list-inside space-y-0.5">
                      {game.objectives.map((obj, i) => (
                        <li key={i}>{obj}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[#2B3452]/50 flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#18C7A5]">{game.tag}</span>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" className="border-[#2B3452] text-xs h-8">
                        View Rules & Kit Guide
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#171936] border-[#2B3452] text-[#F4F6FF]">
                      <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-[#38D9F5] flex items-center gap-2">
                          <BookOpen className="h-5 w-5" /> {game.name} · Classroom Guide
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-3 text-xs text-[#A8B0CC] mt-2">
                        <div>
                          <strong className="text-[#F4F6FF] block mb-1">Game Rules:</strong>
                          <p>{game.rules}</p>
                        </div>
                        <div>
                          <strong className="text-[#F4F6FF] block mb-1">Low-Resource Materials:</strong>
                          <p>Printed chart-paper board, standard counters/seeds, laminated challenge cards. Works without phones or power.</p>
                        </div>
                        <div>
                          <strong className="text-[#F4F6FF] block mb-1">QR Companion Code:</strong>
                          <div className="p-3 bg-[#0B1020] rounded-lg border border-[#2B3452] font-mono text-[11px] text-[#38D9F5]">
                            VIDYA-PLAY-CODE-{game.id.toUpperCase()}-2026
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
