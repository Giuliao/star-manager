import { Skeleton } from "@/components/ui/skeleton";

export default function StartContentLoading() {
  return (
    <div className="p-4 flex flex-col gap-2">
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
    </div>
  )
}
