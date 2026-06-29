import { CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export function HomeSkeleton() {
  return (
    <CardContent>
      <Skeleton className="h-4 w-40 mb-2" />
      <Skeleton className="h-3 w-75 mb-5" />
      <Skeleton className="h-3 w-40 mb-2" />
      <Skeleton className="h-8 w-full mb-3" />
      <Skeleton className="h-8 w-full mb-4" />
      <Skeleton className="h-3 w-full mb-4" />
      <Skeleton className="h-3 w-40 mb-2" />
      <Skeleton className="h-8 w-full" />
    </CardContent>
  );
}
