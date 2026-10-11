import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Network, Wifi, WifiOff, RefreshCw, Server, Laptop, Radio,
  ShieldCheck, HardDrive, ArrowRightLeft, CheckCircle2, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader, Panel, SimNote } from "@/components/vv/primitives";
import { useDemo } from "@/lib/demo-store";

export const Route = createFileRoute("/_shell/mesh")({
  head: () => ({
    meta: [
      { title: "Offline Learning Mesh · VidyaVerse" },
      { name: "description", content: "Peer-to-peer and micro-server local educational Wi-Fi network status." },
    ],
  }),
  component: LearningMeshPage,
});

function LearningMeshPage() {
  const d = useDemo();
  const [isSyncing, setIsSyncing] = useState(false);

  const connectedNodes = [
    { id: "node-hub", name: "Kalyan School Micro-Server", role: "Primary Hub (Local Cache)", status: "Active", ip: "192.168.4.1", latency: "2ms", color: "#6541F5", bg: "#EAE7FF" },
    { id: "node-1", name: "Ananya's Tablet (This Device)", role: "Class 7 Student", status: "Active Peer", ip: "192.168.4.15", latency: "4ms", color: "#42A5E8", bg: "#DDF2FC" },
    { id: "node-2", name: "Ravi's Laptop", role: "Class 7 Student", status: "Mesh Relay", ip: "192.168.4.22", latency: "7ms", color: "#19B99A", bg: "#DDF8EE" },
    { id: "node-3", name: "Teacher Priya's Terminal", role: "Classroom Master", status: "Active Peer", ip: "192.168.4.2", latency: "3ms", color: "#F5A623", bg: "#FFF0D5" },
  ];

  const syncQueue = [
    { id: "sync-1", title: "Circuits Practice Quiz Result", timestamp: "Today, 10:45 AM", size: "24 KB", status: "Pending Hub Sync" },
    { id: "sync-2", title: "CodeBot Maze Stage 3 Clear XP", timestamp: "Yesterday, 3:15 PM", size: "12 KB", status: "Synced" },
    { id: "sync-3", title: "Decimal Fractions Note Annotation", timestamp: "9 Oct, 11:20 AM", size: "110 KB", status: "Synced" },
  ];

  const handleTriggerSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      d.syncNow();
      setIsSyncing(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Learning Mesh &amp; School Hub Network"
        description="Zero-cellular data distribution system. Students stream interactive lessons and PlayLab offline from solar-powered micro-servers."
        eyebrow={
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#DDF8EE] px-3 py-1 text-xs font-bold text-[#19B99A]">
            <Network className="h-3 w-3" /> Peer Mesh Architecture
          </span>
        }
        actions={
          <Button
            onClick={handleTriggerSync}
            disabled={isSyncing}
            size="sm"
            className="bg-[#6541F5] text-white hover:bg-[#5230E8] font-bold text-xs shadow-sm"
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isSyncing ? "animate-spin" : ""}`} />
            {isSyncing ? "Syncing With School Hub..." : "Synchronize Queue With Hub"}
          </Button>
        }
      />

      {/* 1. Hub Server & Network State Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Mesh Status (Teal) */}
        <div className="card-surface p-4.5 rounded-xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground">Mesh Status</span>
            <span className="h-2.5 w-2.5 rounded-full bg-[#19B99A] animate-pulse" />
          </div>
          <div className="text-xl font-black text-foreground">Connected to Hub</div>
          <p className="mt-1 text-xs font-semibold text-[#19B99A]">SSID: VidyaVerse-School-Mesh</p>
        </div>

        {/* Local Micro-Server (Blue) */}
        <div className="card-surface p-4.5 rounded-xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground">Local Micro-Server</span>
            <Server className="h-4 w-4 text-[#42A5E8]" />
          </div>
          <div className="text-xl font-black text-foreground">Raspberry Pi 5 Hub</div>
          <p className="mt-1 text-xs text-muted-foreground font-medium">IP: 192.168.4.1 (Low 5W Power)</p>
        </div>

        {/* Local Storage Cached (Orange) */}
        <div className="card-surface p-4.5 rounded-xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground">Local Storage Cached</span>
            <HardDrive className="h-4 w-4 text-[#F5A623]" />
          </div>
          <div className="text-xl font-black text-foreground">128 GB NVMe</div>
          <p className="mt-1 text-xs font-semibold text-[#F5A623]">420 Lessons Available Offline</p>
        </div>

        {/* Sync Queue (Purple) */}
        <div className="card-surface p-4.5 rounded-xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground">Sync Queue</span>
            <Radio className="h-4 w-4 text-[#6541F5]" />
          </div>
          <div className="text-xl font-black text-foreground">{d.pendingSyncCount} Items Queued</div>
          <p className="mt-1 text-xs text-muted-foreground font-medium">Last sync: {d.lastSyncTime}</p>
        </div>
      </div>

      {/* 2. Topology Diagram & Device Discovery */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7 card-surface p-6 rounded-xl border border-border shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <Network className="h-4 w-4 text-[#42A5E8]" /> Active Mesh Nodes in Classroom 7B
            </h3>
            <span className="rounded-md bg-[#DDF8EE] px-2 py-0.5 text-[10px] font-bold text-[#19B99A] border border-[#19B99A]/30">
              4 Devices Paired
            </span>
          </div>

          <div className="space-y-2.5">
            {connectedNodes.map((node) => (
              <div
                key={node.id}
                className="rounded-xl border border-border bg-card p-3.5 flex items-center justify-between text-xs transition-colors hover:border-[#6541F5]/30"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-9 w-9 rounded-lg flex items-center justify-center font-bold"
                    style={{ backgroundColor: node.bg, color: node.color }}
                  >
                    {node.role.includes("Hub") ? <Server className="h-4 w-4" /> : <Laptop className="h-4 w-4" />}
                  </div>
                  <div>
                    <span className="font-bold text-foreground block">{node.name}</span>
                    <span className="text-[11px] text-muted-foreground font-medium">{node.role} · IP {node.ip}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#DDF8EE] text-[#19B99A] border border-[#19B99A]/30">
                    {node.status}
                  </span>
                  <span className="block text-[10px] text-muted-foreground mt-0.5 font-mono">{node.latency} latency</span>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-dashed border-border bg-muted/30 p-4 text-xs text-muted-foreground space-y-2">
            <span className="font-bold text-foreground block">How Learning Mesh Works in Rural Schools:</span>
            <p className="leading-relaxed">
              1. The teacher powers a small solar-backed micro-hub. It emits a local Wi-Fi bubble covering the school compound without internet connection fees.
            </p>
            <p className="leading-relaxed">
              2. Students stream high-definition lesson videos and run CircuitVerse/PlayLab directly from the local micro-hub.
            </p>
            <p className="leading-relaxed">
              3. Quizzes and XP are queued locally on each student's tablet. When the teacher's phone connects to mobile data in town, scores sync to the state cloud dashboard!
            </p>
          </div>
        </div>

        {/* Right: Pending Sync Queue */}
        <div className="lg:col-span-5 space-y-6">
          <Panel title="Pending Sync Queue">
            <p className="text-xs text-muted-foreground mb-3 font-medium">
              Records stored securely on device storage awaiting reconciliation:
            </p>

            <div className="space-y-2.5">
              {syncQueue.map((item) => (
                <div key={item.id} className="rounded-xl border border-border bg-card p-3 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">{item.title}</span>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                        item.status.includes("Pending")
                          ? "bg-[#FFF0D5] text-[#F5A623] border border-[#F5A623]/30"
                          : "bg-[#DDF8EE] text-[#19B99A] border border-[#19B99A]/30"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-muted-foreground">
                    <span>{item.timestamp}</span>
                    <span className="font-mono">{item.size}</span>
                  </div>
                </div>
              ))}
            </div>

            <Button
              onClick={handleTriggerSync}
              disabled={isSyncing || d.pendingSyncCount === 0}
              className="w-full mt-4 bg-[#19B99A] text-white hover:bg-[#19B99A]/90 font-bold text-xs shadow-sm"
            >
              {d.pendingSyncCount === 0 ? "All Records Synced ✓" : "Sync Pending Records Now"}
            </Button>
          </Panel>

          <SimNote>
            Simulated demonstration network. All mesh transitions and sync records update in browser local state.
          </SimNote>
        </div>
      </div>
    </div>
  );
}
