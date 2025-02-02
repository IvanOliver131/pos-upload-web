import { UploadWidget } from "./components/upload-widget";

export function App() {
  return (
    // dvh = dinamic viewport height
    <main className="h-dvh flex flex-col items-center justify-center p-10">
      <UploadWidget />
    </main>
  )
}
