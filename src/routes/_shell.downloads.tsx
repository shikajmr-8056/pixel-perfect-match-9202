import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Download, HardDrive, Trash2, RefreshCw, CheckCircle2, AlertCircle,
  FileText, Video, Sparkles, FolderDown, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PageHeader, Panel, Meter, SimNote } from "@/components/vv/primitives";
import { useDemo } from "@/lib/demo-store";
import { learningPacks } from "@/data/demo";

export const Route = createFileRoute("/_shell/downloads")({
  head: () => ({
    meta: [
      { title: "Downloads & Offline Cache · VidyaVerse" },
      { name: "description", content: "Manage downloaded curriculum content packs, language voice packs and SD card storage." },
    ],
  }),
  component: DownloadsPage,
});

function DownloadsPage() {
  const d = useDemo();
  const [packToDelete, setPackToDelete] = useState<string | null>(null);

  // Storage calculation
  const totalCachedMb = learningPacks.reduce((acc, p) => {
    return d.downloads[p.id] === "saved" ? acc + p.sizeMb : acc;
  }, 0);
  const maxStorageMb = 512; // 512MB demo quota on student device
  const storagePct = Math.round((totalCachedMb / maxStorageMb) * 100);

  const languagePacks = [
    { code: "kn", name: "Kannada (ಕನ್ನಡ) Voice Synthesizer & Audio Lessons", sizeMb: 35, status: "saved" },
    { code: "hi", name: "Hindi (हिन्दी) Voice Synthesizer & Glossaries", sizeMb: 42, status: "saved" },
    { code: "en", name: "English Offline Grammar Audio Engine", sizeMb: 28, status: "saved" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Downloads & Offline Storage Manager"
        description="Preload comprehensive curriculum chapters and multilingual voice packs onto local tablet storage before leaving the school Wi-Fi zone."
        eyebrow={<Badge variant="outline" className="border-[#18C7A5]/50 text-[#18C7A5]">Offline Storage Engine</Badge>}
      />

      {/* Storage Gauge Banner */}
      <div className="rounded-2xl border border-[#2B3452] bg-[#141A30] p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <HardDrive className="h-6 w-6 text-[#38D9F5]" />
            <div>
              <span className="font-bold text-sm text-[#F4F6FF]">Internal SD Card Space</span>
              <p className="text-xs text-[#A8B0CC]">Allocated for VidyaVerse Offline Learning Hub</p>
            </div>
          </div>
          <div className="text-right">
            <span className="font-mono font-bold text-base text-[#F4F6FF]">{totalCachedMb} MB / {maxStorageMb} MB</span>
            <span className="text-xs text-[#18C7A5] ml-2">({storagePct}% utilized)</span>
          </div>
        </div>

        <Meter value={storagePct} tone="cyan" label="Storage Quota" className="h-3" />
        <div className="flex justify-between text-[11px] text-[#A8B0CC] mt-2">
          <span>Wi-Fi Only Downloads: {d.wifiOnlyDownloads ? "Active" : "Disabled"}</span>
          <span>Automatic Cache Pruning: Protected</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Content Packs */}
        <div className="lg:col-span-8 space-y-4">
          <h2 className="font-bold text-sm text-[#F4F6FF] flex items-center gap-2">
            <FolderDown className="h-4 w-4 text-[#38D9F5]" /> Curriculum Content Packs
          </h2>

          <div className="space-y-3">
            {learningPacks.map((pack) => {
              const state = d.downloads[pack.id] || "none";
              const isDownloaded = state === "saved";
              const isDownloading = state === "downloading";

              return (
                <div
                  key={pack.id}
                  className="rounded-2xl border border-[#2B3452] bg-[#171D33] p-4 flex items-center justify-between transition-all hover:border-[#38D9F5]/40"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-[#F4F6FF]">{pack.name}</h3>
                      {isDownloaded && (
                        <Badge className="bg-[#18C7A5]/20 text-[#18C7A5] border-[#18C7A5]/50 text-[10px]">
                          Cached Offline ✓
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-[#A8B0CC]">
                      {pack.lessons} complete interactive lessons, quizzes and worksheets · {pack.sizeMb} MB
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {isDownloading ? (
                      <Button size="sm" disabled className="bg-[#38D9F5]/20 text-[#38D9F5] text-xs h-8">
                        <RefreshCw className="h-3.5 w-3.5 animate-spin mr-1.5" /> Downloading...
                      </Button>
                    ) : isDownloaded ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setPackToDelete(pack.id)}
                        className="border-[#2B3452] text-[#f43f5e] hover:bg-[#f43f5e]/10 text-xs h-8"
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => d.startDownload(pack.id)}
                        className="bg-[#38D9F5] text-[#0B1020] hover:bg-[#38D9F5]/90 font-bold text-xs h-8"
                      >
                        <Download className="h-3.5 w-3.5 mr-1" /> Download
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Language Voice Synthesis Packs */}
          <h2 className="font-bold text-sm text-[#F4F6FF] flex items-center gap-2 pt-4">
            <Sparkles className="h-4 w-4 text-[#FFC857]" /> Multilingual Voice Synthesis Models
          </h2>

          <div className="space-y-3">
            {languagePacks.map((lp) => (
              <div key={lp.code} className="rounded-2xl border border-[#2B3452] bg-[#171D33] p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[#F4F6FF]">{lp.name}</h3>
                  <p className="text-xs text-[#A8B0CC]">Local edge speech pronunciation model · {lp.sizeMb} MB</p>
                </div>
                <Badge className="bg-[#18C7A5]/20 text-[#18C7A5] border-[#18C7A5]/40 text-xs">
                  Active in Storage ✓
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Right Info */}
        <div className="lg:col-span-4 space-y-6">
          <Panel title="Offline Readiness Guarantee">
            <div className="space-y-3 text-xs text-[#A8B0CC] leading-relaxed">
              <p>
                <strong className="text-[#F4F6FF]">Zero Battery & Data Drain:</strong> Downloaded packages store locally within indexed browser storage. Video lectures stream without buffering or cellular bills.
              </p>
              <p>
                <strong className="text-[#F4F6FF]">Auto-Sync When Returning to Class:</strong> Any quiz attempts taken on downloaded lessons will queue until your tablet re-enters the school mesh boundary.
              </p>
            </div>
          </Panel>

          <SimNote>
            Simulated content storage using local browser cache for prototype fidelity.
          </SimNote>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!packToDelete} onOpenChange={() => setPackToDelete(null)}>
        <DialogContent className="bg-[#171936] border-[#2B3452] text-[#F4F6FF]">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-[#f43f5e] flex items-center gap-2">
              <Trash2 className="h-5 w-5" /> Remove Downloaded Content Pack?
            </DialogTitle>
          </DialogHeader>
          <p className="text-xs text-[#A8B0CC] my-2">
            This will free storage on your device. You can re-download this pack anytime when connected to the School Mesh Hub.
          </p>
          <div className="flex gap-2 justify-end mt-4">
            <Button variant="outline" onClick={() => setPackToDelete(null)} className="border-[#2B3452] text-xs">
              Keep Pack
            </Button>
            <Button
              onClick={() => {
                if (packToDelete) d.removeDownload(packToDelete);
                setPackToDelete(null);
              }}
              className="bg-[#f43f5e] text-white hover:bg-[#f43f5e]/90 text-xs font-bold"
            >
              Confirm Removal
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
