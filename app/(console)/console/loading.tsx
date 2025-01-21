import { LoaderCircle } from "lucide-react"
export default function Loading() {
  return (
    <main className="flex-1 gap-2 flex min-h-screen w-screen items-start justify-start p-4">
      <LoaderCircle className="animate-spin" />  loading...
    </main>
  )
}
