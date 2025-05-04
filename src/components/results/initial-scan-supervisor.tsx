import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  InitialScanSupervisorResults,
  InitialScanSupervisorResult,
} from "@/api/models";
import { RepoScannerResult } from "./repo-scanner";
import { ToolAnalysisResult } from "./tool-analysis";
import { Badge } from "@/components/ui/badge";

interface SupervisorResultsProps {
  data: InitialScanSupervisorResults;
}

export function SupervisorResults({ data }: SupervisorResultsProps) {
  return (
    <div className="space-y-6">
      {data.results.map((result, index) => (
        <SupervisorResult key={result.subpath} result={result} index={index} />
      ))}
    </div>
  );
}

interface ProjectResultPanelProps {
  result: InitialScanSupervisorResult;
  index: number;
}

function SupervisorResult({ result, index }: ProjectResultPanelProps) {
  return (
    <div className="p-0">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-base font-medium">Project {index + 1}</h3>
        {result.subpath && <Badge variant="outline">{result.subpath}</Badge>}
      </div>
      <Tabs defaultValue="scanner" className="w-full">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="scanner" className="flex-1">
            Repository Scan
          </TabsTrigger>
          <TabsTrigger value="tools" className="flex-1">
            Tool Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scanner">
          <RepoScannerResult data={result.scanner_result} />
        </TabsContent>

        <TabsContent value="tools">
          <ToolAnalysisResult data={result.tool_analysis_result} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
