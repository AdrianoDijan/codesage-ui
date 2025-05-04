import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router";

interface ProjectErrorProps {
  error: Error;
}

export function ProjectError({ error }: ProjectErrorProps) {
  const errorMessage = error.message;

  return (
    <div className="container mx-auto max-w-7xl">
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="bg-destructive/10 p-4 rounded-full mb-4">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Failed to load project</h2>
        <p className="text-muted-foreground mb-6">{errorMessage}</p>
        <Button asChild variant="outline">
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
