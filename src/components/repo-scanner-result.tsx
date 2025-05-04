import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RepoScannerResult } from "@/api/models";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RepoScannerResultProps {
  data: RepoScannerResult;
}

export function RepoScannerResultDisplay({ data }: RepoScannerResultProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col">
        <h3 className="text-sm font-medium mb-2">Environment</h3>
        <Badge className="w-fit" variant="secondary">
          {data.environment}
        </Badge>
      </div>

      <div className="flex flex-col">
        <h3 className="text-sm font-medium mb-2">Programming Language</h3>
        <Badge className="w-fit" variant="secondary">
          {data.language}
        </Badge>
      </div>

      <div className="flex flex-col">
        <h3 className="text-sm font-medium mb-2">Tools & Linters</h3>
        <div className="flex flex-wrap gap-2">
          {data.tools.map((tool, index) => (
            <Badge key={index} variant="outline">
              {tool}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex flex-col">
        <h3 className="text-sm font-medium mb-2">Libraries & Dependencies</h3>
        <div className="flex flex-wrap gap-2">
          {data.libraries.map((lib, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger>
                  <Badge variant="outline" className="cursor-help">
                    {lib.name}
                    {lib.version && ` (${lib.version})`}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {lib.name}
                    {lib.version ? ` - v${lib.version}` : ""}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
    </div>
  );
}
