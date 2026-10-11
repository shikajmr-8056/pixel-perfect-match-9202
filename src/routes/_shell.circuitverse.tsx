import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  CircuitBoard, Zap, Power, RotateCcw, Lightbulb, Battery, Cpu,
  ShieldAlert, Sparkles, CheckCircle2, Sliders, Info, Download, Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader, Panel, SimNote } from "@/components/vv/primitives";
import { useDemo } from "@/lib/demo-store";

export const Route = createFileRoute("/_shell/circuitverse")({
  head: () => ({
    meta: [
      { title: "CircuitVerse · Virtual Electronics Lab · VidyaVerse" },
      { name: "description", content: "Interactive virtual breadboard, components, Ohm's law simulation and Arduino preview." },
    ],
  }),
  component: CircuitVersePage,
});

function CircuitVersePage() {
  const d = useDemo();

  // Circuit simulator reactive states
  const [isSwitchClosed, setIsSwitchClosed] = useState(false);
  const [voltage, setVoltage] = useState(9); // 9V battery
  const [resistance, setResistance] = useState(330); // 330 Ohms
  const [ledColor, setLedColor] = useState<"cyan" | "amber" | "green">("cyan");
  const [activeExperiment, setActiveExperiment] = useState<string>("exp-1");

  // Calculated Ohm's Law metrics
  // I = (V - V_led) / R, where forward voltage drop of LED ~ 2V
  const isCircuitActive = isSwitchClosed && voltage > 2;
  const current_mA = isCircuitActive ? Math.round(((voltage - 2.0) / resistance) * 1000) : 0;
  const isBurnedOut = current_mA > 35; // LEDs burn out around 35mA
  const ledGlowOpacity = isBurnedOut ? 0 : Math.min(1, Math.max(0.15, current_mA / 22));

  const handleToggleSwitch = () => {
    const next = !isSwitchClosed;
    setIsSwitchClosed(next);
    if (next) {
      d.unlock("circuit-closed");
      d.addXp(20, "Closed a live circuit in CircuitVerse");
    }
  };

  const handleReset = () => {
    setIsSwitchClosed(false);
    setVoltage(9);
    setResistance(330);
  };

  const handleSaveProject = () => {
    d.addProject({
      title: "Interactive Circuit Simulation",
      category: "Electronics",
      status: "completed",
      xpEarned: 100,
      description: `Breadboard tested with ${voltage}V supply and ${resistance}Ω resistor. Current draw recorded: ${current_mA}mA.`,
      skills: ["Ohm's Law", "Breadboard layout", "Current regulation"],
    });
  };

  const experiments = [
    {
      id: "exp-1",
      title: "1. The Single-Loop Torch",
      difficulty: "Beginner",
      desc: "Connect a 9V cell, 330Ω protective resistor, and single LED with an on-off switch.",
      objective: "Understand closed loops vs open breaks.",
    },
    {
      id: "exp-2",
      title: "2. Ohm's Law Current Regulation",
      difficulty: "Intermediate",
      desc: "Vary resistance from 100Ω to 1000Ω to observe current change and LED illumination.",
      objective: "Formulate I = V / R relation.",
    },
    {
      id: "exp-3",
      title: "3. Arduino Uno Blink Pin 13",
      difficulty: "Advanced",
      desc: "Digital logic HIGH (5V) and LOW (0V) simulated pulses controlling an actuator.",
      objective: "Digital outputs & microcontroller basics.",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="CircuitVerse: Virtual Electronics Lab"
        description="Low-resource breadboard workstation with real-time Ohm's Law physics, component libraries, and safe burn-out warnings."
        eyebrow={<Badge variant="outline" className="border-[#18C7A5]/50 text-[#18C7A5]">Hardware Lab Simulator</Badge>}
        actions={
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleReset} className="border-[#2B3452] text-xs">
              <RotateCcw className="h-3.5 w-3.5 mr-1" /> Reset
            </Button>
            <Button size="sm" onClick={handleSaveProject} className="bg-[#18C7A5] text-[#0B1020] hover:bg-[#18C7A5]/90 font-bold text-xs">
              <Save className="h-3.5 w-3.5 mr-1" /> Save to Portfolio (+100 XP)
            </Button>
          </div>
        }
      />

      {/* Main Workspace Layout */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left: Interactive Breadboard Canvas */}
        <div className="lg:col-span-8 rounded-2xl border border-[#2B3452] bg-[#141A30] p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#2B3452]/60 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <CircuitBoard className="h-5 w-5 text-[#18C7A5]" />
                <span className="font-bold text-sm text-[#F4F6FF]">Virtual Breadboard Surface</span>
                <Badge variant="outline" className="text-[10px] border-[#38D9F5]/40 text-[#38D9F5]">
                  {isCircuitActive ? (isBurnedOut ? "⚠️ Burnout Alert" : "⚡ Closed Circuit Active") : "⚪ Open Circuit (Zero Current)"}
                </Badge>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#A8B0CC]">Switch:</span>
                <span className={isSwitchClosed ? "text-[#18C7A5] font-bold" : "text-[#FFC857] font-semibold"}>
                  {isSwitchClosed ? "CLOSED (ON)" : "OPEN (OFF)"}
                </span>
              </div>
            </div>

            {/* Visual Circuit Schematic / Breadboard Layout */}
            <div className="relative rounded-xl border border-[#2B3452] bg-[#0B1020] p-8 min-h-[300px] flex flex-col items-center justify-center overflow-hidden">
              {/* Background dot grid breadboard holes */}
              <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />

              {/* Circuit loop wire path */}
              <div className="relative z-10 w-full max-w-md border-2 border-dashed rounded-2xl p-6 transition-colors duration-500 border-[#2B3452]" style={{ borderColor: isCircuitActive && !isBurnedOut ? "#18C7A5" : "#2B3452" }}>
                <div className="flex items-center justify-between">
                  {/* 1. Power Supply (Battery) */}
                  <div className="flex flex-col items-center p-3 rounded-xl bg-[#171936] border border-[#2B3452]">
                    <Battery className="h-8 w-8 text-[#FFC857]" />
                    <span className="text-[11px] font-bold text-[#F4F6FF] mt-1">{voltage}V Battery</span>
                    <span className="text-[10px] text-[#A8B0CC]">DC Source</span>
                  </div>

                  {/* Wire line */}
                  <div className={`flex-1 h-1 mx-2 transition-all ${isCircuitActive ? "bg-[#18C7A5] shadow-[0_0_8px_#18C7A5]" : "bg-[#2B3452]"}`} />

                  {/* 2. Interactive Toggle Switch */}
                  <div className="flex flex-col items-center p-3 rounded-xl bg-[#171936] border border-[#2B3452]">
                    <Button
                      size="sm"
                      onClick={handleToggleSwitch}
                      className={isSwitchClosed
                        ? "bg-[#18C7A5] text-[#0B1020] hover:bg-[#18C7A5]/90 font-bold h-8 text-xs"
                        : "bg-[#2B3452] text-[#F4F6FF] hover:bg-[#2B3452]/90 h-8 text-xs"
                      }
                    >
                      <Power className="h-3.5 w-3.5 mr-1" />
                      {isSwitchClosed ? "Switch ON" : "Switch OFF"}
                    </Button>
                    <span className="text-[10px] text-[#A8B0CC] mt-1">Single-Pole Switch</span>
                  </div>

                  {/* Wire line */}
                  <div className={`flex-1 h-1 mx-2 transition-all ${isCircuitActive ? "bg-[#18C7A5] shadow-[0_0_8px_#18C7A5]" : "bg-[#2B3452]"}`} />

                  {/* 3. Protective Resistor */}
                  <div className="flex flex-col items-center p-3 rounded-xl bg-[#171936] border border-[#2B3452]">
                    <div className="h-6 w-12 rounded bg-[#eab308]/20 border border-[#eab308] flex items-center justify-center text-[10px] font-mono text-[#eab308]">
                      {resistance}Ω
                    </div>
                    <span className="text-[11px] font-bold text-[#F4F6FF] mt-1">Resistor</span>
                    <span className="text-[10px] text-[#A8B0CC]">Color-Banded</span>
                  </div>

                  {/* Wire line */}
                  <div className={`flex-1 h-1 mx-2 transition-all ${isCircuitActive ? "bg-[#18C7A5] shadow-[0_0_8px_#18C7A5]" : "bg-[#2B3452]"}`} />

                  {/* 4. Glowing LED Bulb */}
                  <div className="flex flex-col items-center p-3 rounded-xl bg-[#171936] border border-[#2B3452]">
                    <div
                      className="relative h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300"
                      style={{
                        backgroundColor: isCircuitActive && !isBurnedOut ? (ledColor === "cyan" ? "#38D9F5" : ledColor === "amber" ? "#FFC857" : "#18C7A5") : "#2B3452",
                        opacity: isCircuitActive ? ledGlowOpacity : 0.4,
                        boxShadow: isCircuitActive && !isBurnedOut ? `0 0 25px ${ledColor === "cyan" ? "#38D9F5" : ledColor === "amber" ? "#FFC857" : "#18C7A5"}` : "none",
                      }}
                    >
                      <Lightbulb className={`h-6 w-6 ${isCircuitActive && !isBurnedOut ? "text-[#0B1020]" : "text-[#A8B0CC]"}`} />
                    </div>
                    <span className="text-[11px] font-bold text-[#F4F6FF] mt-1">
                      {isBurnedOut ? "Blown LED 💥" : "LED (Light)"}
                    </span>
                    <span className="text-[10px] text-[#A8B0CC]">
                      {isCircuitActive ? (isBurnedOut ? "Exceeded 35mA" : "Emitting Photons") : "Zero Current"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Real-time Current Flow Meter HUD */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-mono">
                <div className="rounded-lg bg-[#141A30] border border-[#2B3452] px-3 py-1.5 flex items-center gap-2">
                  <span className="text-[#A8B0CC]">Supply (V):</span>
                  <span className="text-[#FFC857] font-bold text-sm">{voltage}.0 V</span>
                </div>
                <div className="rounded-lg bg-[#141A30] border border-[#2B3452] px-3 py-1.5 flex items-center gap-2">
                  <span className="text-[#A8B0CC]">Resistance (R):</span>
                  <span className="text-[#38D9F5] font-bold text-sm">{resistance} Ω</span>
                </div>
                <div className="rounded-lg bg-[#141A30] border border-[#2B3452] px-3 py-1.5 flex items-center gap-2">
                  <span className="text-[#A8B0CC]">Current (I = V/R):</span>
                  <span className={`font-bold text-sm ${isBurnedOut ? "text-[#f43f5e]" : "text-[#18C7A5]"}`}>
                    {current_mA} mA
                  </span>
                </div>
              </div>
            </div>
          </div>

          <SimNote>
            This virtual breadboard enforces safe electrical limits. Over-current (&gt;35mA) will flag a blown LED to teach resistor protection.
          </SimNote>
        </div>

        {/* Right: Component Controls & Experiments */}
        <div className="lg:col-span-4 space-y-6">
          {/* Component Parameter Sliders */}
          <Panel title="Component Tuning Panel">
            <div className="space-y-5 text-xs">
              {/* Voltage Slider */}
              <div className="space-y-2">
                <div className="flex justify-between font-semibold">
                  <span className="text-[#F4F6FF]">Battery Voltage:</span>
                  <span className="text-[#FFC857] font-mono">{voltage} Volts</span>
                </div>
                <Slider
                  value={[voltage]}
                  min={3}
                  max={12}
                  step={1}
                  onValueChange={([v]) => v !== undefined && setVoltage(v)}
                />
                <div className="flex justify-between text-[10px] text-[#A8B0CC]">
                  <span>3V (Coin Cell)</span>
                  <span>9V (Transistor)</span>
                  <span>12V (Pack)</span>
                </div>
              </div>

              {/* Resistor Slider */}
              <div className="space-y-2">
                <div className="flex justify-between font-semibold">
                  <span className="text-[#F4F6FF]">Resistor Value:</span>
                  <span className="text-[#38D9F5] font-mono">{resistance} Ohms</span>
                </div>
                <Slider
                  value={[resistance]}
                  min={100}
                  max={1000}
                  step={20}
                  onValueChange={([r]) => r !== undefined && setResistance(r)}
                />
                <div className="flex justify-between text-[10px] text-[#A8B0CC]">
                  <span>100Ω (High Current)</span>
                  <span>330Ω (Standard)</span>
                  <span>1000Ω (Dim)</span>
                </div>
              </div>

              {/* LED Color Picker */}
              <div className="space-y-2">
                <span className="text-[#F4F6FF] font-semibold block">LED Diode Color:</span>
                <div className="grid grid-cols-3 gap-2">
                  {(["cyan", "amber", "green"] as const).map((c) => (
                    <button
                      key={c}
                      onClick={() => setLedColor(c)}
                      className={`rounded-lg py-1.5 text-xs font-semibold uppercase border transition-all ${
                        ledColor === c
                          ? "bg-[#1e2544] border-[#38D9F5] text-[#38D9F5]"
                          : "bg-[#141A30] border-[#2B3452] text-[#A8B0CC]"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Panel>

          {/* Guided Experiments */}
          <Panel title="Guided Hardware Modules">
            <div className="space-y-2.5">
              {experiments.map((exp) => (
                <div
                  key={exp.id}
                  onClick={() => setActiveExperiment(exp.id)}
                  className={`rounded-xl border p-3 cursor-pointer transition-all ${
                    activeExperiment === exp.id
                      ? "bg-[#171936] border-[#18C7A5] shadow-[0_0_12px_rgba(24,199,165,0.2)]"
                      : "bg-[#141A30] border-[#2B3452] hover:border-[#18C7A5]/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-[#F4F6FF]">{exp.title}</span>
                    <Badge variant="outline" className="text-[9px] border-[#2B3452] text-[#A8B0CC]">
                      {exp.difficulty}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-[#A8B0CC]">{exp.desc}</p>
                </div>
              ))}
            </div>

            {/* Arduino Uno Preview */}
            <div className="mt-4 rounded-xl border border-[#38D9F5]/30 bg-[#0B1020] p-3 text-xs flex items-center gap-3">
              <Cpu className="h-8 w-8 text-[#38D9F5] shrink-0" />
              <div>
                <span className="font-bold text-[#F4F6FF] block">Arduino Uno R3 (Planned Module)</span>
                <p className="text-[10px] text-[#A8B0CC]">
                  Digital GPIO pins 0-13, PWM analogWrite, and C++ code generator upcoming in next firmware pack.
                </p>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
