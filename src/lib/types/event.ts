import type { Event } from "../services/events";

export interface EventDetails {
	slug: string;
	speakerName: string;
	speakerImage: string;
	date: string;
	time: string;
	location: string;
	color: "primary" | "secondary";
	sortDate: string;
}

export interface EventWithDetails extends Event {
	details: EventDetails;
}
