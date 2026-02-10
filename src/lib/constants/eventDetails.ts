import cathyImage from "@/assets/images/cathy-gallahorn-mask.webp";
import johnImage from "@/assets/images/john-gallahorn-mask.webp";
import type { EventDetails } from "../types/event";

export const EVENT_DETAILS_MAP: Record<string, EventDetails> = {
  // These IDs should match the actual event IDs from Supabase
  // Update these with the real IDs from your database
  "70597170-f501-41f6-9062-3f9d6a5ad7e5": {
    speakerName: "MR. JOHN GALLAHORN",
    speakerImage: johnImage,
    date: "15 DE MARZO, 2026",
    time: "6:00 PM - 8:00 PM",
    location: "CENTRO DE EVENTOS EL SEMBRADOR",
    color: "secondary",
  },
  "60811b0d-5b05-4d28-9bff-eb0584c4a9a4": {
    speakerName: "MRS. CATHY GALLAHORN",
    speakerImage: cathyImage,
    date: "22 DE MARZO, 2026",
    time: "6:00 PM - 8:00 PM",
    location: "CENTRO DE EVENTOS EL SEMBRADOR",
    color: "primary",
  },
};

// Default details for events not in the map
export const DEFAULT_EVENT_DETAILS: EventDetails = {
  speakerName: "PONENTE POR CONFIRMAR",
  speakerImage: johnImage, // Fallback image
  date: "POR CONFIRMAR",
  time: "POR CONFIRMAR",
  location: "POR CONFIRMAR",
  color: "primary",
};
