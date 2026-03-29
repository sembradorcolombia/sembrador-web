import { useNavigate, useSearch } from "@tanstack/react-router";

type Category = "sermon" | "news";

interface FilterOption {
	label: string;
	value: Category | undefined;
}

const FILTER_OPTIONS: FilterOption[] = [
	{ label: "Todos", value: undefined },
	{ label: "Sermones", value: "sermon" },
	{ label: "Noticias", value: "news" },
];

export function CategoryFilter() {
	const navigate = useNavigate({ from: "/blog/" });
	const search = useSearch({ from: "/blog/" });
	const activeCategory = (search as Record<string, string | undefined>)
		.categoria as Category | undefined;

	function handleFilter(value: Category | undefined) {
		navigate({
			search: value ? { categoria: value } : {},
		});
	}

	return (
		<div className="flex gap-2 flex-wrap">
			{FILTER_OPTIONS.map((option) => {
				const isActive = activeCategory === option.value;
				return (
					<button
						key={option.label}
						type="button"
						onClick={() => handleFilter(option.value)}
						className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
							isActive
								? "bg-green-700 text-white"
								: "bg-gray-100 text-gray-700 hover:bg-gray-200"
						}`}
					>
						{option.label}
					</button>
				);
			})}
		</div>
	);
}
