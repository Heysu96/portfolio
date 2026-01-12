export type Category = "all" | "web" | "app" | "ai-video" | "branding";

export interface Project {
  id: string;
  title: string;
  category: Category[];
  date: string;
  tags: string[];
  thumbnail: string;
  description: string;
}

export const categories: { key: Category; label: string; count: number }[] = [
  { key: "all", label: "ALL", count: 12 },
  { key: "web", label: "Web", count: 5 },
  { key: "app", label: "App", count: 3 },
  { key: "ai-video", label: "AI Video", count: 2 },
  { key: "branding", label: "Branding", count: 2 },
];

export const projects: Project[] = [
  {
    id: "1",
    title: "E-Commerce Redesign",
    category: ["web"],
    date: "2024.12.15",
    tags: ["Web", "UI/UX"],
    thumbnail: "/projects/project-1.jpg",
    description: "Modern e-commerce platform redesign with focus on user experience",
  },
  {
    id: "2",
    title: "Finance App UI",
    category: ["app"],
    date: "2024.11.20",
    tags: ["App", "Mobile"],
    thumbnail: "/projects/project-2.jpg",
    description: "Intuitive finance management app design",
  },
  {
    id: "3",
    title: "AI Product Video",
    category: ["ai-video"],
    date: "2024.10.08",
    tags: ["AI Video", "Motion"],
    thumbnail: "/projects/project-3.jpg",
    description: "AI-generated promotional video for tech product",
  },
  {
    id: "4",
    title: "Brand Identity System",
    category: ["branding"],
    date: "2024.09.25",
    tags: ["Branding", "Identity"],
    thumbnail: "/projects/project-4.jpg",
    description: "Complete brand identity design for startup",
  },
  {
    id: "5",
    title: "Portfolio Website",
    category: ["web"],
    date: "2024.08.12",
    tags: ["Web", "React"],
    thumbnail: "/projects/project-5.jpg",
    description: "Creative portfolio website with animations",
  },
  {
    id: "6",
    title: "Health & Fitness App",
    category: ["app"],
    date: "2024.07.30",
    tags: ["App", "UI/UX"],
    thumbnail: "/projects/project-6.jpg",
    description: "Health tracking app with gamification elements",
  },
  {
    id: "7",
    title: "AI Music Video",
    category: ["ai-video"],
    date: "2024.06.18",
    tags: ["AI Video", "Creative"],
    thumbnail: "/projects/project-7.jpg",
    description: "Experimental AI-generated music video",
  },
  {
    id: "8",
    title: "Restaurant Branding",
    category: ["branding"],
    date: "2024.05.22",
    tags: ["Branding", "Print"],
    thumbnail: "/projects/project-8.jpg",
    description: "Complete branding for upscale restaurant",
  },
  {
    id: "9",
    title: "SaaS Dashboard",
    category: ["web"],
    date: "2024.04.15",
    tags: ["Web", "Dashboard"],
    thumbnail: "/projects/project-9.jpg",
    description: "Analytics dashboard for SaaS platform",
  },
  {
    id: "10",
    title: "Travel App Concept",
    category: ["app"],
    date: "2024.03.08",
    tags: ["App", "Concept"],
    thumbnail: "/projects/project-10.jpg",
    description: "Innovative travel planning app concept",
  },
  {
    id: "11",
    title: "Corporate Website",
    category: ["web"],
    date: "2024.02.20",
    tags: ["Web", "Corporate"],
    thumbnail: "/projects/project-11.jpg",
    description: "Professional corporate website redesign",
  },
  {
    id: "12",
    title: "Landing Page Design",
    category: ["web"],
    date: "2024.01.10",
    tags: ["Web", "Marketing"],
    thumbnail: "/projects/project-12.jpg",
    description: "High-converting landing page design",
  },
];
