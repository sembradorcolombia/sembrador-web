import type { AuthorRole } from "./types/cms";

const AUTHOR_ROLE_LABELS: Record<AuthorRole, string> = {
	speaker: "Predicador",
	leader: "Líder",
	publisher: "Editor",
};

/** Human-readable, comma-separated role list; empty string when there are none. */
export function formatAuthorRoles(roles?: AuthorRole[]): string {
	if (!roles?.length) return "";
	return roles.map((role) => AUTHOR_ROLE_LABELS[role] ?? role).join(", ");
}
