import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/equilibrio')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/equilibrio"!</div>
}
