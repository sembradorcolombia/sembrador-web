// ── Shared mock data for E2E tests ──────────────────────────────────────────

// ── Site Settings ───────────────────────────────────────────────────────────

export const MOCK_SITE_SETTINGS = {
	_id: "site-settings-1",
	churchName: "El Sembrador",
	tagline: "Comunidad de fe en Medellín",
	footerTagline: "Transformando vidas con el evangelio",
	address: "Calle 10 #43A-30, Medellín",
	contactPhone: "+57 300 123 4567",
	contactEmail: "info@elsembrador.co",
	aboutDescription:
		"Somos una comunidad de fe comprometida con compartir el amor de Dios.",
	aboutLocation: "Medellín, Antioquia, Colombia",
	aboutServiceTimes: "Domingos 10:00 AM",
	socialLinks: [
		{ platform: "Instagram", url: "https://instagram.com/elsembrador" },
		{ platform: "Youtube", url: "https://youtube.com/@elsembrador" },
	],
};

// ── Blog Posts ───────────────────────────────────────────────────────────────

export const MOCK_BLOG_POSTS = [
	{
		_id: "post-1",
		title: "La gracia transformadora",
		slug: { _type: "slug", current: "la-gracia-transformadora" },
		publishedAt: "2025-06-01T10:00:00Z",
		category: "sermon",
		excerpt: "Un mensaje sobre el poder de la gracia de Dios.",
		featuredImage: {
			_type: "image",
			asset: { _ref: "image-abc123-800x600-jpg", _type: "reference" },
			alt: "Gracia transformadora",
		},
		author: {
			name: "Pastor Juan",
			image: {
				_type: "image",
				asset: { _ref: "image-author1-100x100-jpg", _type: "reference" },
			},
		},
	},
	{
		_id: "post-2",
		title: "Nuevo programa juvenil",
		slug: { _type: "slug", current: "nuevo-programa-juvenil" },
		publishedAt: "2025-05-20T08:00:00Z",
		category: "news",
		excerpt: "Lanzamos un nuevo espacio para los jóvenes de nuestra comunidad.",
		featuredImage: {
			_type: "image",
			asset: { _ref: "image-def456-800x600-jpg", _type: "reference" },
			alt: "Programa juvenil",
		},
		author: {
			name: "María López",
			image: {
				_type: "image",
				asset: { _ref: "image-author2-100x100-jpg", _type: "reference" },
			},
		},
	},
];

export const MOCK_BLOG_POST_DETAIL = {
	_id: "post-1",
	title: "La gracia transformadora",
	slug: { _type: "slug", current: "la-gracia-transformadora" },
	publishedAt: "2025-06-01T10:00:00Z",
	category: "sermon",
	excerpt: "Un mensaje sobre el poder de la gracia de Dios.",
	body: [
		{
			_type: "block",
			_key: "block-1",
			style: "normal",
			children: [
				{
					_type: "span",
					_key: "span-1",
					text: "La gracia de Dios nos transforma cada día.",
					marks: [],
				},
			],
			markDefs: [],
		},
	],
	featuredImage: {
		_type: "image",
		asset: { _ref: "image-abc123-800x600-jpg", _type: "reference" },
		alt: "Gracia transformadora",
	},
	author: {
		_id: "author-1",
		name: "Pastor Juan",
		image: {
			_type: "image",
			asset: { _ref: "image-author1-100x100-jpg", _type: "reference" },
		},
		bio: "Pastor principal de El Sembrador",
		role: "Pastor",
	},
	scriptureReferences: ["Efesios 2:8-9"],
};

// ── Event Series ────────────────────────────────────────────────────────────

export const MOCK_EVENT_SERIES_LIST = [
	{
		_id: "series-1",
		name: "Equilibrio",
		slug: { _type: "slug", current: "equilibrio" },
		description: "Una serie sobre el balance en la vida cristiana",
		isActive: true,
	},
	{
		_id: "series-2",
		name: "Serie Inactiva",
		slug: { _type: "slug", current: "serie-inactiva" },
		description: "Esta serie ya terminó",
		isActive: false,
	},
];

// Use the real event ID so findEventBySlug resolves correctly
const REAL_EVENT_ID = "70597170-f501-41f6-9062-3f9d6a5ad7e5";

export const MOCK_EVENT_SERIES_WITH_EVENTS = {
	_id: "series-1",
	name: "Equilibrio",
	slug: { _type: "slug", current: "equilibrio" },
	description: "Una serie sobre el balance en la vida cristiana",
	isActive: true,
	events: [
		{
			_id: "event-1",
			name: "Paz Financiera",
			slug: { _type: "slug", current: "paz-financiera" },
			date: "2025-07-15",
			time: "7:00 PM",
			location: "Sede principal",
			supabaseEventId: REAL_EVENT_ID,
			description: "Aprende a manejar tus finanzas con sabiduría bíblica.",
			status: "upcoming",
		},
	],
};

// ── Next Steps ──────────────────────────────────────────────────────────────

export const MOCK_NEXT_STEPS = [
	{
		_id: "step-1",
		title: "Conectar",
		description: "Únete a un grupo pequeño y conoce a otros creyentes.",
		icon: "Users",
		ctaText: "Conocer más",
		ctaLink: "/acerca",
		order: 1,
	},
	{
		_id: "step-2",
		title: "Crecer",
		description: "Participa en nuestros cursos de formación bíblica.",
		icon: "BookOpen",
		ctaText: "Ver cursos",
		ctaLink: "/blog",
		order: 2,
	},
];

// ── Giving Options ──────────────────────────────────────────────────────────

export const MOCK_GIVING_OPTIONS = [
	{
		_id: "give-1",
		title: "Transferencia bancaria",
		description: "Realiza tu ofrenda por transferencia bancaria.",
		type: "bank",
		details: "Banco Davivienda\nCuenta 123456789",
		order: 1,
	},
	{
		_id: "give-2",
		title: "Nequi",
		description: "Envía tu ofrenda por Nequi de forma rápida.",
		type: "nequi",
		details: "300 123 4567",
		order: 2,
	},
];

// ── Supabase Events ─────────────────────────────────────────────────────────

export const MOCK_SUPABASE_EVENTS = [
	{
		id: REAL_EVENT_ID,
		name: "Paz Financiera",
		max_capacity: 100,
		current_count: 10,
		created_at: "2025-01-01T00:00:00Z",
	},
];

// ── Admin Session ───────────────────────────────────────────────────────────

export const ADMIN_SESSION = {
	access_token: "mock-admin-token",
	refresh_token: "mock-refresh-token",
	token_type: "bearer",
	expires_in: 3600,
	user: {
		id: "admin-1",
		email: "admin@sembrador.co",
		app_metadata: { is_admin: true },
	},
};
