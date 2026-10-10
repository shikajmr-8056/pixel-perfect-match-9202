import {
  Home, BookOpen, Gamepad2, CircuitBoard, Code2, MessageCircleQuestion, Users, Award, LineChart, Download, Settings,
  SearchCheck, Network, GraduationCap, HeartHandshake, type LucideIcon,
} from "lucide-react";
import type { Lang } from "@/lib/demo-store";

export interface NavItem {
  to: string;
  icon: LucideIcon;
  label: Record<Lang, string>;
}

export const primaryNav: NavItem[] = [
  { to: "/dashboard", icon: Home, label: { en: "Home", hi: "मुख्य पृष्ठ", kn: "ಮುಖಪುಟ" } },
  { to: "/learn", icon: BookOpen, label: { en: "Learn", hi: "सीखें", kn: "ಕಲಿಯಿರಿ" } },
  { to: "/playlab", icon: Gamepad2, label: { en: "PlayLab", hi: "PlayLab", kn: "PlayLab" } },
  { to: "/circuitverse", icon: CircuitBoard, label: { en: "CircuitVerse", hi: "CircuitVerse", kn: "CircuitVerse" } },
  { to: "/codeverse", icon: Code2, label: { en: "CodeVerse", hi: "CodeVerse", kn: "CodeVerse" } },
  { to: "/tutor", icon: MessageCircleQuestion, label: { en: "AI Tutor", hi: "AI शिक्षक", kn: "AI ಶಿಕ್ಷಕ" } },
  { to: "/classrooms", icon: Users, label: { en: "Classrooms", hi: "कक्षाएँ", kn: "ತರಗತಿಗಳು" } },
  { to: "/rewards", icon: Award, label: { en: "Rewards", hi: "पुरस्कार", kn: "ಬಹುಮಾನಗಳು" } },
  { to: "/progress", icon: LineChart, label: { en: "My Progress", hi: "मेरी प्रगति", kn: "ನನ್ನ ಪ್ರಗತಿ" } },
  { to: "/downloads", icon: Download, label: { en: "Downloads", hi: "डाउनलोड", kn: "ಡೌನ್‌ಲೋಡ್‌ಗಳು" } },
  { to: "/settings", icon: Settings, label: { en: "Settings", hi: "सेटिंग्स", kn: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು" } },
];

export const exploreNav: NavItem[] = [
  { to: "/concept-detective", icon: SearchCheck, label: { en: "Concept Detective", hi: "Concept Detective", kn: "Concept Detective" } },
  { to: "/mesh", icon: Network, label: { en: "Learning Mesh", hi: "Learning Mesh", kn: "Learning Mesh" } },
  { to: "/teacher", icon: GraduationCap, label: { en: "Teacher view", hi: "शिक्षक दृश्य", kn: "ಶಿಕ್ಷಕರ ನೋಟ" } },
  { to: "/parent", icon: HeartHandshake, label: { en: "Parent view", hi: "अभिभावक दृश्य", kn: "ಪೋಷಕರ ನೋಟ" } },
];

export const allNav = [...primaryNav, ...exploreNav];

export const langNames: Record<Lang, string> = { en: "English", hi: "हिन्दी", kn: "ಕನ್ನಡ" };
