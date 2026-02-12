import { useForm } from "@tanstack/react-form";
import { useId } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { useCreateSubscription } from "@/lib/hooks/useCreateSubscription";
import type { Event } from "@/lib/services/events";
import {
  type SubscriptionFormData,
  subscriptionFormSchema,
} from "@/lib/validations/subscription";

interface SubscriptionFormProps {
  events: Event[];
  defaultEventId?: string;
  onSuccess?: () => void;
}

export function SubscriptionForm({
  events,
  defaultEventId,
  onSuccess,
}: SubscriptionFormProps) {
  const createSubscription = useCreateSubscription();
  const nameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const eventId = useId();
  const dataPolicyId = useId();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      eventId: defaultEventId || "",
      acceptsDataPolicy: false,
    } as unknown as SubscriptionFormData,
    onSubmit: async ({ value }) => {
      try {
        await createSubscription.mutateAsync(value);
        toast.success("¡Inscripción exitosa! Te esperamos en el evento.");
        form.reset();
        onSuccess?.();
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Error al procesar inscripción",
        );
      }
    },
  });

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <form.Field
          name="name"
          validators={{
            onChange: ({ value }) => {
              try {
                subscriptionFormSchema.shape.name.parse(value);
                return undefined;
              } catch (error) {
                console.warn(error);
                return "El nombre debe tener al menos 2 caracteres";
              }
            },
          }}
        >
          {(field) => (
            <div className="mb-4">
              <Label htmlFor={nameId}>Nombre completo</Label>
              <Input
                id={nameId}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Juan Pérez"
              />
              {field.state.meta.errors &&
                field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-600 mt-1">
                    {Array.isArray(field.state.meta.errors)
                      ? field.state.meta.errors.join(", ")
                      : field.state.meta.errors}
                  </p>
                )}
            </div>
          )}
        </form.Field>

        <form.Field
          name="email"
          validators={{
            onChange: ({ value }) => {
              try {
                subscriptionFormSchema.shape.email.parse(value);
                return undefined;
              } catch (error) {
                console.warn(error);
                return "Correo electrónico inválido";
              }
            },
          }}
        >
          {(field) => (
            <div className="mb-4">
              <Label htmlFor={emailId}>Correo electrónico</Label>
              <Input
                id={emailId}
                type="email"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="juan@ejemplo.com"
              />
              {field.state.meta.errors &&
                field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-600 mt-1">
                    {Array.isArray(field.state.meta.errors)
                      ? field.state.meta.errors.join(", ")
                      : field.state.meta.errors}
                  </p>
                )}
            </div>
          )}
        </form.Field>

        <form.Field
          name="phone"
          validators={{
            onChange: ({ value }) => {
              try {
                subscriptionFormSchema.shape.phone.parse(value);
                return undefined;
              } catch (error) {
                console.warn(error);
                return "El teléfono debe tener 10 dígitos";
              }
            },
          }}
        >
          {(field) => (
            <div className="mb-4">
              <Label htmlFor={phoneId}>Teléfono</Label>
              <Input
                id={phoneId}
                type="tel"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="3001234567"
              />
              {field.state.meta.errors &&
                field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-600 mt-1">
                    {Array.isArray(field.state.meta.errors)
                      ? field.state.meta.errors.join(", ")
                      : field.state.meta.errors}
                  </p>
                )}
            </div>
          )}
        </form.Field>

        <form.Field
          name="eventId"
          validators={{
            onChange: ({ value }) => {
              try {
                subscriptionFormSchema.shape.eventId.parse(value);
                return undefined;
              } catch (error) {
                console.warn(error);
                return "Debes seleccionar un evento";
              }
            },
          }}
        >
          {(field) => (
            <div className="mb-6">
              <Label htmlFor={eventId}>Selecciona tu evento</Label>
              <Select
                id={eventId}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              >
                <option value="">-- Selecciona un evento --</option>
                {events.map((event) => {
                  const slotsAvailable = event.maxCapacity - event.currentCount;
                  const isFull = slotsAvailable <= 0;
                  return (
                    <option key={event.id} value={event.id} disabled={isFull}>
                      {event.name} (
                      {isFull ? "Lleno" : `${slotsAvailable} cupos disponibles`}
                      )
                    </option>
                  );
                })}
              </Select>
              {field.state.meta.errors &&
                field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-600 mt-1">
                    {Array.isArray(field.state.meta.errors)
                      ? field.state.meta.errors.join(", ")
                      : field.state.meta.errors}
                  </p>
                )}
            </div>
          )}
        </form.Field>

        <form.Field
          name="acceptsDataPolicy"
          validators={{
            onChange: ({ value }) => {
              if (value !== true) {
                return "Debes aceptar la política de tratamiento de datos";
              }
              return undefined;
            },
          }}
        >
          {(field) => (
            <div className="mb-6">
              <div className="flex items-start gap-2">
                <input
                  id={dataPolicyId}
                  type="checkbox"
                  checked={field.state.value === true}
                  onBlur={field.handleBlur}
                  onChange={(e) =>
                    field.handleChange(
                      e.target.checked as unknown as typeof field.state.value,
                    )
                  }
                  className="mt-1 h-4 w-4 shrink-0 rounded border-gray-300"
                />
                <label htmlFor={dataPolicyId} className="text-sm text-gray-700">
                  Autorizo el tratamiento de mis datos personales conforme a la{" "}
                  <a
                    href="/politica-de-datos"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    Política de tratamiento de datos
                  </a>
                </label>
              </div>
              {field.state.meta.errors &&
                field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-600 mt-1">
                    {Array.isArray(field.state.meta.errors)
                      ? field.state.meta.errors.join(", ")
                      : field.state.meta.errors}
                  </p>
                )}
            </div>
          )}
        </form.Field>

        <Button
          type="submit"
          disabled={createSubscription.isPending}
          className="w-full font-grotesk-wide-medium text-lg px-4 py-3 bg-primary hover:bg-primary-dark text-white rounded-md"
        >
          {createSubscription.isPending ? "Procesando..." : "Inscribirse"}
        </Button>
      </form>
    </div>
  );
}
