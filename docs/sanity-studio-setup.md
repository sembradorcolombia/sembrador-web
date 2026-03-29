# Sanity Studio Setup Guide — El Sembrador

## Prerequisites

- Node.js 20+
- A Sanity account (sign up free at [sanity.io](https://www.sanity.io))

## 1. Create the Sanity Project

```bash
# Navigate to the parent directory (sibling to sembrador-web)
cd /Users/jorge.ossa/Sites/sembrador/web

# Create the Sanity project
pnpm create sanity@latest -- --project-name "El Sembrador CMS" --dataset production --output-path sembrador-studio
```

During the interactive setup:
- **Login**: Sign in with your preferred method (Google, GitHub, email)
- **Project name**: `El Sembrador CMS`
- **Dataset**: `production`
- **Template**: Choose "Clean project with no predefined schema types"
- **TypeScript**: Yes
- **Package manager**: pnpm

## 2. Configure CORS Origins

After creation, go to [manage.sanity.io](https://manage.sanity.io):

1. Select the **El Sembrador CMS** project
2. Go to **API** → **CORS Origins**
3. Add these origins:
   - `http://localhost:3000` (Allow credentials: No)
   - Your production domain (e.g., `https://elsembrador.co`) (Allow credentials: No)

## 3. Get Your Project ID

From the Sanity dashboard or from `sembrador-studio/sanity.config.ts`, copy the **Project ID** (looks like `abcd1234`).

Then update the web app's `.env.local`:

```bash
# In sembrador-web/.env.local, add:
VITE_SANITY_PROJECT_ID=<your-project-id>
VITE_SANITY_DATASET=production
```

## 4. Define Schemas

Inside `sembrador-studio/schemaTypes/`, create the following schema files:

### `schemaTypes/author.ts`

```typescript
import { defineField, defineType } from "sanity";

export const author = defineType({
	name: "author",
	title: "Autor",
	type: "document",
	fields: [
		defineField({
			name: "name",
			title: "Nombre",
			type: "string",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "image",
			title: "Imagen",
			type: "image",
			options: { hotspot: true },
			fields: [
				defineField({
					name: "alt",
					title: "Texto alternativo",
					type: "string",
				}),
			],
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "bio",
			title: "Biografía",
			type: "text",
		}),
		defineField({
			name: "role",
			title: "Rol",
			type: "string",
		}),
	],
});
```

### `schemaTypes/blogPost.ts`

```typescript
import { defineField, defineType } from "sanity";

export const blogPost = defineType({
	name: "blogPost",
	title: "Publicación del Blog",
	type: "document",
	fields: [
		defineField({
			name: "title",
			title: "Título",
			type: "string",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "slug",
			title: "Slug",
			type: "slug",
			options: { source: "title", maxLength: 96 },
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "publishedAt",
			title: "Fecha de publicación",
			type: "datetime",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "category",
			title: "Categoría",
			type: "string",
			options: {
				list: [
					{ title: "Sermón", value: "sermon" },
					{ title: "Noticia", value: "news" },
				],
			},
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "excerpt",
			title: "Extracto",
			type: "text",
			validation: (rule) => rule.required().max(300),
		}),
		defineField({
			name: "body",
			title: "Contenido",
			type: "array",
			of: [
				{ type: "block" },
				{
					type: "image",
					options: { hotspot: true },
					fields: [
						defineField({
							name: "alt",
							title: "Texto alternativo",
							type: "string",
						}),
					],
				},
			],
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "featuredImage",
			title: "Imagen destacada",
			type: "image",
			options: { hotspot: true },
			fields: [
				defineField({
					name: "alt",
					title: "Texto alternativo",
					type: "string",
				}),
			],
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "author",
			title: "Autor",
			type: "reference",
			to: [{ type: "author" }],
		}),
		defineField({
			name: "scriptureReferences",
			title: "Referencias bíblicas",
			type: "array",
			of: [{ type: "string" }],
		}),
		defineField({
			name: "audioUrl",
			title: "URL de audio",
			type: "url",
		}),
		defineField({
			name: "videoUrl",
			title: "URL de video",
			type: "url",
		}),
	],
	orderings: [
		{
			title: "Fecha de publicación (reciente)",
			name: "publishedAtDesc",
			by: [{ field: "publishedAt", direction: "desc" }],
		},
	],
	preview: {
		select: {
			title: "title",
			subtitle: "category",
			media: "featuredImage",
		},
	},
});
```

### `schemaTypes/eventSeries.ts`

```typescript
import { defineField, defineType } from "sanity";

export const eventSeries = defineType({
	name: "eventSeries",
	title: "Serie de Eventos",
	type: "document",
	fields: [
		defineField({
			name: "name",
			title: "Nombre",
			type: "string",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "slug",
			title: "Slug",
			type: "slug",
			options: { source: "name", maxLength: 96 },
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "description",
			title: "Descripción",
			type: "text",
		}),
		defineField({
			name: "logo",
			title: "Logo",
			type: "image",
			options: { hotspot: true },
		}),
		defineField({
			name: "themeColor",
			title: "Color del tema",
			type: "string",
			description: 'Color hex (e.g., "#FF2D77") or name (e.g., "primary")',
		}),
		defineField({
			name: "isActive",
			title: "Activa",
			type: "boolean",
			initialValue: true,
		}),
	],
	preview: {
		select: {
			title: "name",
			media: "logo",
		},
	},
});
```

### `schemaTypes/event.ts`

```typescript
import { defineField, defineType } from "sanity";

export const event = defineType({
	name: "event",
	title: "Evento",
	type: "document",
	fields: [
		defineField({
			name: "name",
			title: "Nombre",
			type: "string",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "slug",
			title: "Slug",
			type: "slug",
			options: { source: "name", maxLength: 96 },
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "eventSeries",
			title: "Serie de eventos",
			type: "reference",
			to: [{ type: "eventSeries" }],
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "date",
			title: "Fecha",
			type: "date",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "time",
			title: "Hora",
			type: "string",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "location",
			title: "Ubicación",
			type: "string",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "supabaseEventId",
			title: "Supabase Event ID",
			type: "string",
			description: "UUID del evento en la tabla events de Supabase",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "speaker",
			title: "Ponente",
			type: "reference",
			to: [{ type: "author" }],
		}),
		defineField({
			name: "speakerImage",
			title: "Imagen del ponente",
			type: "image",
			options: { hotspot: true },
			fields: [
				defineField({
					name: "alt",
					title: "Texto alternativo",
					type: "string",
				}),
			],
		}),
		defineField({
			name: "description",
			title: "Descripción",
			type: "text",
		}),
		defineField({
			name: "themeColor",
			title: "Color del tema",
			type: "string",
			description: 'e.g., "primary", "secondary", or a hex color',
		}),
		defineField({
			name: "status",
			title: "Estado",
			type: "string",
			options: {
				list: [
					{ title: "Próximo", value: "upcoming" },
					{ title: "Pasado", value: "past" },
				],
			},
			initialValue: "upcoming",
		}),
	],
	orderings: [
		{
			title: "Fecha (próximos primero)",
			name: "dateAsc",
			by: [{ field: "date", direction: "asc" }],
		},
	],
	preview: {
		select: {
			title: "name",
			subtitle: "date",
			media: "speakerImage",
		},
	},
});
```

### `schemaTypes/nextStep.ts`

```typescript
import { defineField, defineType } from "sanity";

export const nextStep = defineType({
	name: "nextStep",
	title: "Siguiente Paso",
	type: "document",
	fields: [
		defineField({
			name: "title",
			title: "Título",
			type: "string",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "description",
			title: "Descripción",
			type: "text",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "icon",
			title: "Ícono",
			type: "string",
			description:
				"Nombre del ícono de Lucide (e.g., 'heart', 'users', 'book-open')",
		}),
		defineField({
			name: "ctaText",
			title: "Texto del botón",
			type: "string",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "ctaLink",
			title: "Enlace del botón",
			type: "string",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "order",
			title: "Orden",
			type: "number",
			validation: (rule) => rule.required(),
		}),
	],
	orderings: [
		{
			title: "Orden",
			name: "orderAsc",
			by: [{ field: "order", direction: "asc" }],
		},
	],
	preview: {
		select: {
			title: "title",
			subtitle: "order",
		},
		prepare({ title, subtitle }) {
			return {
				title,
				subtitle: `Orden: ${subtitle}`,
			};
		},
	},
});
```

### `schemaTypes/givingOption.ts`

```typescript
import { defineField, defineType } from "sanity";

export const givingOption = defineType({
	name: "givingOption",
	title: "Opción de Ofrenda",
	type: "document",
	fields: [
		defineField({
			name: "title",
			title: "Título",
			type: "string",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "description",
			title: "Descripción",
			type: "text",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "type",
			title: "Tipo",
			type: "string",
			options: {
				list: [
					{ title: "Cuenta bancaria", value: "bank" },
					{ title: "Nequi", value: "nequi" },
					{ title: "Daviplata", value: "daviplata" },
					{ title: "Otro", value: "other" },
				],
			},
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "details",
			title: "Detalles",
			type: "text",
			description: "Número de cuenta, instrucciones, etc.",
		}),
		defineField({
			name: "qrCodeImage",
			title: "Imagen del código QR",
			type: "image",
		}),
		defineField({
			name: "order",
			title: "Orden",
			type: "number",
			validation: (rule) => rule.required(),
		}),
	],
	orderings: [
		{
			title: "Orden",
			name: "orderAsc",
			by: [{ field: "order", direction: "asc" }],
		},
	],
	preview: {
		select: {
			title: "title",
			subtitle: "type",
		},
	},
});
```

### `schemaTypes/siteSettings.ts`

```typescript
import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
	name: "siteSettings",
	title: "Configuración del Sitio",
	type: "document",
	fields: [
		defineField({
			name: "churchName",
			title: "Nombre de la iglesia",
			type: "string",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "tagline",
			title: "Lema",
			type: "string",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "heroImage",
			title: "Imagen principal",
			type: "image",
			options: { hotspot: true },
		}),
		defineField({
			name: "aboutDescription",
			title: "Descripción (Acerca de)",
			type: "text",
		}),
		defineField({
			name: "aboutLocation",
			title: "Ubicación",
			type: "string",
		}),
		defineField({
			name: "aboutServiceTimes",
			title: "Horarios de servicio",
			type: "string",
		}),
		defineField({
			name: "socialLinks",
			title: "Redes sociales",
			type: "array",
			of: [
				{
					type: "object",
					fields: [
						defineField({
							name: "platform",
							title: "Plataforma",
							type: "string",
							validation: (rule) => rule.required(),
						}),
						defineField({
							name: "url",
							title: "URL",
							type: "url",
							validation: (rule) => rule.required(),
						}),
					],
					preview: {
						select: {
							title: "platform",
							subtitle: "url",
						},
					},
				},
			],
		}),
	],
	preview: {
		select: {
			title: "churchName",
		},
	},
});
```

### `schemaTypes/index.ts`

Register all schemas:

```typescript
import { author } from "./author";
import { blogPost } from "./blogPost";
import { event } from "./event";
import { eventSeries } from "./eventSeries";
import { givingOption } from "./givingOption";
import { nextStep } from "./nextStep";
import { siteSettings } from "./siteSettings";

export const schemaTypes = [
	author,
	blogPost,
	eventSeries,
	event,
	nextStep,
	givingOption,
	siteSettings,
];
```

## 5. Configure the Singleton for Site Settings

In `sanity.config.ts`, update to use Structure Builder for the singleton:

```typescript
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./schemaTypes";

export default defineConfig({
	name: "default",
	title: "El Sembrador CMS",

	projectId: "<your-project-id>",
	dataset: "production",

	plugins: [
		structureTool({
			structure: (S) =>
				S.list()
					.title("Contenido")
					.items([
						// Singleton: Site Settings
						S.listItem()
							.title("Configuración del Sitio")
							.id("siteSettings")
							.child(
								S.document()
									.schemaType("siteSettings")
									.documentId("siteSettings"),
							),
						S.divider(),
						// Regular document types
						...S.documentTypeListItems().filter(
							(item) => item.getId() !== "siteSettings",
						),
					]),
		}),
	],

	schema: {
		types: schemaTypes,
	},
});
```

## 6. Deploy the Studio

```bash
cd sembrador-studio

# Start locally to verify schemas
pnpm dev

# Deploy to Sanity hosting
pnpm sanity deploy
# Choose a hostname (e.g., "elsembrador")
# Studio will be available at https://elsembrador.sanity.studio
```

## 7. Seed Initial Content

After the Studio is running, create the following documents manually in the Studio:

### Authors

1. **John Gallahorn** — Role: "Speaker"
2. **Cathy Gallahorn** — Role: "Speaker"

Upload their images from the web app's `src/assets/images/` directory.

### Event Series

1. **Equilibrio** — Slug: `equilibrio`, Active: Yes

### Events

1. **Paz Financiera** — Series: Equilibrio, Speaker: John Gallahorn, Date: 2025-03-13, Time: "Desde las 6:00 P.M.", Location: "Hotel 10 Park - Poblado", Supabase Event ID: `70597170-f501-41f6-9062-3f9d6a5ad7e5`, Theme Color: "secondary", Status: past
2. **Emociones y Liderazgo** — Series: Equilibrio, Speaker: Cathy Gallahorn, Date: 2025-03-14, Time: "Desde las 3:00 P.M.", Location: "Hotel 10 Park - Poblado", Supabase Event ID: `60811b0d-5b05-4d28-9bff-eb0584c4a9a4`, Theme Color: "primary", Status: past

### Site Settings

1. **Church Name**: "El Sembrador"
2. **Tagline**: "Iglesia en Medellín"

## 8. Initialize Git (optional)

```bash
cd sembrador-studio
git init
git add .
git commit -m "Initial Sanity Studio setup with all schemas"
```

---

After completing these steps, the web app will be able to connect to Sanity using the environment variables configured in step 3. Continue with the web app integration (types, services, hooks) which are already implemented in the `setup-sanity-cms` change.
