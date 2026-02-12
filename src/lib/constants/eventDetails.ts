import cathyImage from "@/assets/images/cathy-gallahorn-mask.webp";
import johnImage from "@/assets/images/john-gallahorn-mask.webp";
import type { EventDetails } from "../types/event";

export const EVENT_DETAILS_MAP: Record<string, EventDetails> = {
  // These IDs should match the actual event IDs from Supabase
  // Update these with the real IDs from your database
  "70597170-f501-41f6-9062-3f9d6a5ad7e5": {
    slug: "paz-financiera",
    speakerName: "MR. JOHN GALLAHORN",
    speakerImage: johnImage,
    date: "Viernes 13 de marzo",
    time: "Desde las 6:00 P.M.",
    location: "Hotel 10 Park - Poblado",
    color: "secondary",
    sortDate: "2025-03-13",
  },
  "60811b0d-5b05-4d28-9bff-eb0584c4a9a4": {
    slug: "emociones-y-liderazgo",
    speakerName: "MRS. CATHY GALLAHORN",
    speakerImage: cathyImage,
    date: "Sábado 14 de marzo",
    time: "Desde las 3:00 P.M.",
    location: "Hotel 10 Park - Poblado",
    color: "primary",
    sortDate: "2025-03-14",
  },
};

// Default details for events not in the map
export const DEFAULT_EVENT_DETAILS: EventDetails = {
  slug: "por-confirmar",
  speakerName: "PONENTE POR CONFIRMAR",
  speakerImage: johnImage, // Fallback image
  date: "POR CONFIRMAR",
  time: "POR CONFIRMAR",
  location: "POR CONFIRMAR",
  color: "primary",
  sortDate: "9999-12-31",
};
