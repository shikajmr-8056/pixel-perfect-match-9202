import {
  Home, BookOpen, Gamepad2, CircuitBoard, Code2, Bot, Mic, Network, Users,
  Trophy, Award, LineChart, Download, FolderGit2, Target, GraduationCap, HeartHandshake, Settings,
  type LucideIcon,
} from "lucide-react";
import type { Lang } from "@/lib/demo-store";

export interface NavItem {
  to: string;
  icon: LucideIcon;
  label: Record<Lang, string>;
  category: "core" | "labs" | "progress" | "roles";
  badge?: string;
}

export const allNav: NavItem[] = [
  // 1. Home
  { to: "/dashboard", icon: Home, label: { en: "Home", hi: "मुख्य पृष्ठ", kn: "ಮುಖಪುಟ" }, category: "core" },
  // 2. Learn
  { to: "/learn", icon: BookOpen, label: { en: "Learn", hi: "पाठ्यक्रम", kn: "ಕಲಿಯಿರಿ" }, category: "core" },
  // 3. PlayLab
  { to: "/playlab", icon: Gamepad2, label: { en: "PlayLab", hi: "प्ले लैब", kn: "ಪ್ಲೇ ಲ್ಯಾಬ್" }, category: "labs", badge: "Games" },
  // 4. CircuitVerse
  { to: "/circuitverse", icon: CircuitBoard, label: { en: "CircuitVerse", hi: "सर्किट वर्स", kn: "ಸರ್ಕ್ಯೂಟ್ ವರ್ಸ್" }, category: "labs", badge: "Sim" },
  // 5. CodeVerse
  { to: "/codeverse", icon: Code2, label: { en: "CodeVerse", hi: "कोड वर्स", kn: "ಕೋಡ್ ವರ್ಸ್" }, category: "labs", badge: "Blocks" },
  // 6. AI Tutor
  { to: "/tutor", icon: Bot, label: { en: "AI Tutor", hi: "AI शिक्षक", kn: "AI ಶಿಕ್ಷಕ" }, category: "core", badge: "Detective" },
  // 7. VidyaVerse Voice
  { to: "/voice", icon: Mic, label: { en: "VidyaVerse Voice", hi: "वाणी सहायक", kn: "ಧ್ವನಿ ಸಹಾಯಕ" }, category: "labs", badge: "Audio" },
  // 8. Learning Mesh
  { to: "/mesh", icon: Network, label: { en: "Learning Mesh", hi: "लर्निंग मेश", kn: "ಲರ್ನಿಂಗ್ ಮೆಶ್" }, category: "labs", badge: "Offline" },
  // 9. Classrooms
  { to: "/classrooms", icon: Users, label: { en: "Classrooms", hi: "कक्षाएँ", kn: "ತರಗತಿಗಳು" }, category: "core" },
  // 10. Leaderboard
  { to: "/leaderboard", icon: Trophy, label: { en: "Leaderboard", hi: "लीडरबोर्ड", kn: "ಲೀಡರ್‌ಬೋರ್ಡ್" }, category: "progress" },
  // 11. Rewards Store
  { to: "/rewards", icon: Award, label: { en: "Rewards Store", hi: "इनाम केंद्र", kn: "ಬಹುಮಾನ ಅಂಗಡಿ" }, category: "progress" },
  // 12. My Progress
  { to: "/progress", icon: LineChart, label: { en: "My Progress", hi: "मेरी प्रगति", kn: "ನನ್ನ ಪ್ರಗತಿ" }, category: "progress" },
  // 13. Downloads
  { to: "/downloads", icon: Download, label: { en: "Downloads", hi: "डाउनलोड्स", kn: "ಡೌನ್‌ಲೋಡ್‌ಗಳು" }, category: "progress" },
  // 14. Projects & Portfolio
  { to: "/projects", icon: FolderGit2, label: { en: "Projects & Portfolio", hi: "प्रोजेक्ट्स", kn: "ಯೋಜನೆಗಳು" }, category: "progress" },
  // 15. Challenges
  { to: "/challenges", icon: Target, label: { en: "Challenges", hi: "चुनौतियाँ", kn: "ಸವಾಲುಗಳು" }, category: "progress", badge: "XP" },
  // 16. Teacher Dashboard
  { to: "/teacher", icon: GraduationCap, label: { en: "Teacher Dashboard", hi: "शिक्षक डैशबोर्ड", kn: "ಶಿಕ್ಷಕರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್" }, category: "roles" },
  // 17. Parent Dashboard
  { to: "/parent", icon: HeartHandshake, label: { en: "Parent Dashboard", hi: "अभिभावक दृश्य", kn: "ಪೋಷಕರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್" }, category: "roles" },
  // 18. Settings
  { to: "/settings", icon: Settings, label: { en: "Settings", hi: "सेटिंग्स", kn: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು" }, category: "roles" },
];

export const primaryNav = allNav.filter((n) => n.category === "core");
export const labsNav = allNav.filter((n) => n.category === "labs");
export const progressNav = allNav.filter((n) => n.category === "progress");
export const rolesNav = allNav.filter((n) => n.category === "roles");

export const langNames: Record<Lang, string> = {
  en: "English",
  hi: "हिन्दी",
  kn: "ಕನ್ನಡ",
};
