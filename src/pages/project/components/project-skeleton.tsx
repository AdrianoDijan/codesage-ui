import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProjectSkeleton() {
  return (
    <div className="container mx-auto max-w-7xl">
      <div className="flex flex-col space-y-8">
        {/* Project details skeleton */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-10 w-64 mb-2" />
              <Skeleton className="h-4 w-96" />
            </div>
            <Skeleton className="h-6 w-24" />
          </div>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-72" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  {[1, 2, 3].map((value) => (
                    <div key={value} className="flex items-center gap-2">
                      <Skeleton className="h-5 w-5 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <Skeleton className="h-4 w-32 mb-4" />
                  <div className="space-y-4">
                    {[1, 2, 3].map((value) => (
                      <div key={value} className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tasks skeleton */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <Skeleton className="h-6 w-24 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-9 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                {[1, 2, 3, 4, 5].map((value) => (
                  <Skeleton key={value} className="h-4 w-24" />
                ))}
              </div>
              {[1, 2, 3].map((value) => (
                <div key={value} className="flex justify-between">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Skeleton key={value} className="h-6 w-24" />
                  ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
