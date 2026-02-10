import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { SubscriptionForm } from "@/components/forms/SubscriptionForm";
import type { Event } from "@/lib/services/events";

interface SubscriptionModalProps {
	events: Event[];
	selectedEventId?: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function SubscriptionModal({
	events,
	selectedEventId,
	open,
	onOpenChange,
}: SubscriptionModalProps) {
	const handleSuccess = () => {
		// Close modal on successful submission
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange} modal={true}>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold">
						Reserva tu cupo
					</DialogTitle>
					<DialogDescription>
						Completa el formulario para inscribirte en el evento de tu
						preferencia.
					</DialogDescription>
				</DialogHeader>
				<SubscriptionForm
					events={events}
					defaultEventId={selectedEventId}
					onSuccess={handleSuccess}
				/>
			</DialogContent>
		</Dialog>
	);
}
