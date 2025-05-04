import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SupervisorResultInput, SupervisorResultOutput, SupervisorResultsInput, SupervisorResultsOutput } from "@/api/models";
import { RepoScannerResultDisplay } from "./repo-scanner-result";
import { ToolAnalysisResultDisplay } from "./tool-analysis-result";
import { Badge } from "@/components/ui/badge";

interface SupervisorResultsProps {
  data: SupervisorResultsInput | SupervisorResultsOutput;
}

export function SupervisorResultsDisplay({ data }: SupervisorResultsProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Supervisor Results</CardTitle>
        <CardDescription>
          Analysis results for {data.results.length} {data.results.length === 1 ? 'project' : 'projects'} in the repository
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {data.results.map((result, index) => (
            <SupervisorResultCard key={index} result={result} index={index} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface SupervisorResultCardProps {
  result: SupervisorResultInput | SupervisorResultOutput;
  index: number;
}

function SupervisorResultCard({ result, index }: SupervisorResultCardProps) {
  return (
    <Card className="bg-muted/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          Project {index + 1}
          {result.subpath && <Badge variant="outline">{result.subpath}</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="scanner" className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="scanner" className="flex-1">Repository Scan</TabsTrigger>
            <TabsTrigger value="tools" className="flex-1">Tool Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="scanner">
            <RepoScannerResultDisplay data={result.scanner_result} />
          </TabsContent>
          
          <TabsContent value="tools">
            <ToolAnalysisResultDisplay data={result.tool_analysis_result} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}