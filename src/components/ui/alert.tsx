import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const alertVariants = cva("relative w-full rounded-lg border p-4", {
	variants: {
		variant: {
			default: "bg-background text-foreground",
			success: "border-green-500/50 bg-green-50 text-green-900",
			error: "border-red-500/50 bg-red-50 text-red-900",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

export interface AlertProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof alertVariants> {}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
	({ className, variant, ...props }, ref) => (
		<div
			ref={ref}
			role="alert"
			className={cn(alertVariants({ variant }), className)}
			{...props}
		/>
	),
);
Alert.displayName = "Alert";

export { Alert, alertVariants };
