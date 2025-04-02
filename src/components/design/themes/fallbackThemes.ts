
import { Theme } from "@/lib/types";

// Fallback themes in case the API fails
export const FALLBACK_THEMES: Theme[] = [
  { 
    id: "travel", 
    name: "Travel", 
    description: "Capture your wanderlust",
    image_url: "/placeholder.svg", 
    primary_color: "#00B4D8", 
    secondary_color: "#0077B6",
    category: "Artistic" 
  },
  { 
    id: "music", 
    name: "Music", 
    description: "Express your rhythm",
    image_url: "/placeholder.svg", 
    primary_color: "#9D4EDD", 
    secondary_color: "#7B2CBF",
    category: "Artistic" 
  },
  { 
    id: "sports", 
    name: "Sports", 
    description: "Show your active side",
    image_url: "/placeholder.svg", 
    primary_color: "#FB5607", 
    secondary_color: "#FC9E4F",
    category: "Minimal" 
  },
  { 
    id: "nature", 
    name: "Nature", 
    description: "Connect with the outdoors",
    image_url: "/placeholder.svg", 
    primary_color: "#80B918", 
    secondary_color: "#55A630",
    category: "Nature" 
  },
  { 
    id: "abstract", 
    name: "Abstract", 
    description: "Bold geometric patterns",
    image_url: "/placeholder.svg", 
    primary_color: "#FF006E", 
    secondary_color: "#8338EC",
    category: "Abstract" 
  },
  { 
    id: "vintage", 
    name: "Vintage", 
    description: "Classic retro aesthetics",
    image_url: "/placeholder.svg", 
    primary_color: "#B08968", 
    secondary_color: "#DDA15E",
    category: "Typography" 
  },
  { 
    id: "minimal", 
    name: "Minimal", 
    description: "Clean, simple designs",
    image_url: "/placeholder.svg", 
    primary_color: "#212529", 
    secondary_color: "#6C757D",
    category: "Minimal" 
  },
  { 
    id: "bold", 
    name: "Bold", 
    description: "Make a statement",
    image_url: "/placeholder.svg", 
    primary_color: "#D00000", 
    secondary_color: "#DC2F02",
    category: "Typography" 
  },
  { 
    id: "funny", 
    name: "Funny", 
    description: "Add humor to your style",
    image_url: "/placeholder.svg", 
    primary_color: "#FFC300", 
    secondary_color: "#FFD60A",
    category: "Artistic" 
  },
  { 
    id: "artistic", 
    name: "Artistic", 
    description: "Creative expression",
    image_url: "/placeholder.svg", 
    primary_color: "#06D6A0", 
    secondary_color: "#1B9AAA",
    category: "Artistic" 
  },
  { 
    id: "gaming", 
    name: "Gaming", 
    description: "For the gamers",
    image_url: "/placeholder.svg", 
    primary_color: "#7209B7", 
    secondary_color: "#3A0CA3",
    category: "Abstract" 
  },
  { 
    id: "tech", 
    name: "Technology", 
    description: "Digital innovation",
    image_url: "/placeholder.svg", 
    primary_color: "#4895EF", 
    secondary_color: "#4361EE",
    category: "Minimal" 
  },
  { 
    id: "animals", 
    name: "Animals", 
    description: "Wildlife inspired",
    image_url: "/placeholder.svg", 
    primary_color: "#588157", 
    secondary_color: "#3A5A40",
    category: "Nature" 
  },
  { 
    id: "food", 
    name: "Food", 
    description: "Culinary delights",
    image_url: "/placeholder.svg", 
    primary_color: "#E63946", 
    secondary_color: "#F1FAEE",
    category: "Artistic" 
  },
  { 
    id: "motivational", 
    name: "Motivational", 
    description: "Inspiring quotes & designs",
    image_url: "/placeholder.svg", 
    primary_color: "#1D3557", 
    secondary_color: "#457B9D",
    category: "Typography" 
  },
];
