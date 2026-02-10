import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
	"inline-flex items-center justify-center px-4 py-2 text-xs font-bold uppercase tracking-wide",
	{
		variants: {
			variant: {
				"entrada-gratuita": "bg-white text-primary",
				"cupos-limitados": "bg-white text-secondary",
				"charlas-gratuitas": "bg-transparent text-white border-2 border-white",
			},
		},
		defaultVariants: {
			variant: "entrada-gratuita",
		},
	},
);

export interface EventBadgeProps
	extends React.HTMLAttributes<HTMLSpanElement>,
		VariantProps<typeof badgeVariants> {}

const EventBadge = React.forwardRef<HTMLSpanElement, EventBadgeProps>(
	({ className, variant, ...props }, ref) => {
		return (
			<span
				className={cn(badgeVariants({ variant }), className)}
				ref={ref}
				{...props}
			/>
		);
	},
);
EventBadge.displayName = "EventBadge";

export { EventBadge, badgeVariants };
