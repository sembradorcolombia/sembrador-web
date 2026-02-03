import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="text-center">
      <header className="min-h-screen flex flex-col items-center justify-center bg-[#282c34] bg-[url('/images/ciudad-del-rio-medellin.jpg')] bg-cover bg-center text-white text-[calc(10px+2vmin)]">
        <div className="backdrop-blur-[2px] p-4 rounded-2xl min-h-screen w-full flex flex-col items-center justify-center">
          <img
            src="/header-logo.svg"
            className="h-20 pointer-events-none"
            alt="logo"
          />
          <p className="text-xl">Próximamente</p>
          <h1 className="text-4xl font-bold uppercase">El Sembrador</h1>
          <h2 className="text-xl">Medellín</h2>
        </div>
      </header>
    </div>
  )
}
