export type Category = "all" | "web" | "ai-video" | "etc";

export interface MediaItem {
  type: "image" | "video";
  src: string;
  alt?: string;
}

export interface Project {
  id: string;
  title: string;
  category: Category[];
  date: string;
  tags: string[];
  thumbnail: string;
  description: string;
  media: MediaItem[];
}

// 카테고리 라벨 정의 (count는 아래에서 동적으로 계산)
const categoryLabels: Record<Category, string> = {
  all: "ALL",
  web: "Web",
  "ai-video": "AI Video",
  etc: "Etc",
};

export const projects: Project[] = [
  {
    id: "1",
    title: "QLM 제품 AI 연출컷",
    category: ["etc"],
    date: "2026.01",
    tags: ["nanobanana"],
    thumbnail: "/project01/01.png",
    description: "QLM 제품의 AI 연출컷 제작을 위해 기획되었습니다.",
    media: [
      { type: "image", src: "/project01/01.png" },
      { type: "image", src: "/project01/02.png" },
      { type: "image", src: "/project01/03.png" },
      { type: "image", src: "/project01/04.png" },
      { type: "image", src: "/project01/05.png" },
      { type: "image", src: "/project01/06.png" },
    ],
  },
  {
    id: "2",
    title: "Do you Know Lams?",
    category: ["ai-video"],
    date: "2025.12",
    tags: ["nanobanana", "Photoshop", "kling AI", "Hailuo AI", "CapCut"],
    thumbnail: "/project02/01.png",
    description: "이 프로젝트는 365mc의 LAMS 시술의 인지도를 높이기 위해 기획되었습니다. AI 기술을 활용하여 기존 영상 제작 방식보다 효율적으로 제작되었으며, 특히 캐릭터 움직임 구현에 중점을 두었습니다.",
    media: [
      { type: "image", src: "/project02/01.png" },
      { type: "video", src: "https://drive.google.com/file/d/1hsl6qyStXCWHxTGMwWqgweDTm7iH6Qj7/view?usp=drive_link" },
      { type: "video", src: "https://drive.google.com/file/d/1Lp_P_Ex224j2x2JSVl7Oxy9LOLY91hXP/view?usp=drive_link" },
    ],
  },
  {
    id: "3",
    title: "365mc 줄기세포센터 오픈기념 AI FOOH",
    category: ["ai-video"],
    date: "2025.12",
    tags: ["nanobanana", "kling AI"],
    thumbnail: "/project03/01.png",
    description: "365mc의 줄기세포센터 오픈을 축하하며 FOOH스타일을 참고하여 제작되었습니다.",
    media: [
      { type: "image", src: "/project03/01.png" },
      { type: "video", src: "https://drive.google.com/file/d/13fi2-_L8temvtpL4K-gZV7Rur1k6vYnE/view?usp=drive_link" },
    ],
  },
  {
    id: "4",
    title: "Brand Identity System",
    category: ["etc"],
    date: "2024.09.25",
    tags: ["Branding", "Identity"],
    thumbnail: "/project04/01.png",
    description: "Complete brand identity design for startup",
    media: [
      { type: "image", src: "/project04/01.png" },
      { type: "image", src: "/project04/02.png" },
      { type: "video", src: "https://drive.google.com/file/d/1C5rSEJlL9K9qwoP9zJjMu4ackF0KB6ou/view?usp=drive_link" },
    ],
  },
  {
    id: "5",
    title: "Portfolio Website",
    category: ["web"],
    date: "2024.08.12",
    tags: ["Web", "React"],
    thumbnail: "/project05/01.jpg",
    description: "Creative portfolio website with animations",
    media: [
      { type: "image", src: "/project05/01.jpg" },
      { type: "image", src: "/project05/02.gif" },
    ],
  },
  {
    id: "6",
    title: "Health & Fitness App",
    category: ["etc"],
    date: "2024.07.30",
    tags: ["App", "UI/UX"],
    thumbnail: "/project06/01.jpg",
    description: "Health tracking app with gamification elements",
    media: [
      { type: "image", src: "/project06/01.jpg" },
      { type: "image", src: "/project06/02-1.jpg" },
      { type: "image", src: "/project06/02-2.jpg" },
      { type: "image", src: "/project06/02-3.jpg" },
      { type: "image", src: "/project06/03.jpg" },
      { type: "image", src: "/project06/04.jpg" },
      { type: "image", src: "/project06/05.jpg" },
      { type: "image", src: "/project06/06-1.jpg" },
      { type: "image", src: "/project06/06-2.jpg" },
      { type: "image", src: "/project06/06-3.jpg" },
      { type: "image", src: "/project06/06-4.jpg" },
      { type: "image", src: "/project06/07.jpg" },
      { type: "image", src: "/project06/08.jpg" },
      { type: "image", src: "/project06/09.jpg" },
      { type: "image", src: "/project06/10.gif" },
      { type: "image", src: "/project06/11-1.gif" },
      { type: "image", src: "/project06/11-2.jpg" },
      { type: "image", src: "/project06/11-3.jpg" },
      { type: "image", src: "/project06/11-4.jpg" },
      { type: "image", src: "/project06/12.gif" },
      { type: "image", src: "/project06/13-1.jpg" },
      { type: "image", src: "/project06/13-2.jpg" },
      { type: "image", src: "/project06/13-3.jpg" },
      { type: "image", src: "/project06/14.jpg" },
      { type: "image", src: "/project06/15.jpg" },
      { type: "image", src: "/project06/16.gif" },
    ],
  },
  {
    id: "7",
    title: "AI Music Video",
    category: ["ai-video"],
    date: "2024.06.18",
    tags: ["AI Video", "Creative"],
    thumbnail: "/project07/01.png",
    description: "Experimental AI-generated music video",
    media: [
      { type: "image", src: "/project07/01.png" },
      { type: "image", src: "/project07/01-2.png" },
      { type: "image", src: "/project07/02.png" },
      { type: "image", src: "/project07/03-1.png" },
      { type: "image", src: "/project07/03-2p.png" },
      { type: "image", src: "/project07/04.png" },
      { type: "image", src: "/project07/05.png" },
      { type: "image", src: "/project07/06.png" },
      { type: "image", src: "/project07/07.png" },
      { type: "image", src: "/project07/08.png" },
      { type: "image", src: "/project07/09.png" },
      { type: "image", src: "/project07/10.png" },
    ],
  },
  {
    id: "8",
    title: "Restaurant Branding",
    category: ["etc"],
    date: "2024.05.22",
    tags: ["Branding", "Print"],
    thumbnail: "/project08/01.jpg",
    description: "Complete branding for upscale restaurant",
    media: [
      { type: "image", src: "/project08/01.jpg" },
      { type: "video", src: "https://drive.google.com/file/d/14ScaJACrhl3bqmWlP0xTgqYzJ_w94eKA/view?usp=drive_link" },
    ],
  },
  {
    id: "9",
    title: "SaaS Dashboard",
    category: ["web"],
    date: "2024.04.15",
    tags: ["Web", "Dashboard"],
    thumbnail: "/project09/01.jpg",
    description: "Analytics dashboard for SaaS platform",
    media: [
      { type: "image", src: "/project09/01.jpg" },
      { type: "video", src: "https://drive.google.com/file/d/1ImSb5BF8F5T2vuohKh7GoAG19E95qKv2/view?usp=drive_link" },
    ],
  },
  {
    id: "10",
    title: "Travel App Concept",
    category: ["etc"],
    date: "2024.03.08",
    tags: ["App", "Concept"],
    thumbnail: "/project10/01.png",
    description: "Innovative travel planning app concept",
    media: [
      { type: "image", src: "/project10/01.png" },
      { type: "video", src: "https://drive.google.com/file/d/1zGxr6syfsanE05gv5TxVZIhctXAmzwHY/view?usp=drive_link" },
    ],
  },
];

// projects 기반으로 카테고리별 count 동적 계산
export const categories: { key: Category; label: string; count: number }[] = (
  Object.keys(categoryLabels) as Category[]
).map((key) => ({
  key,
  label: categoryLabels[key],
  count:
    key === "all"
      ? projects.length
      : projects.filter((p) => p.category.includes(key)).length,
}));
