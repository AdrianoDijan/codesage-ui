import { RepoScannerResultDisplay } from "@/components/repo-scanner-result";
import { SupervisorResultsDisplay } from "@/components/supervisor-results";
import { ToolAnalysisResultDisplay } from "@/components/tool-analysis-result";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface TaskResultRendererProps {
  content: any; // The JSON content from a task message
}

export function TaskResultRenderer({ content }: TaskResultRendererProps) {
  // Check if the content has a valid structure
  if (!content || typeof content !== 'object') {
    return <UnsupportedResultType message="Invalid content format" />;
  }

  // Extract the type and result
  const { type, result } = content;

  if (!type || !result) {
    return <UnsupportedResultType message="Missing type or result data" />;
  }

  // Render based on the result type
  switch (type) {
    case "RepoScannerResults":
      return <RepoScannerResultDisplay data={result.results[0]} />;
    
    case "RepoScannerResultsInput":
    case "RepoScannerResultsOutput":
      return <RepoScannerResultDisplay data={result.results[0]} />;
    
    case "SupervisorResults":
    case "SupervisorResultsInput":
    case "SupervisorResultsOutput":
      return <SupervisorResultsDisplay data={result} />;
    
    case "ToolAnalysisResult":
    case "ToolAnalysisResultInput":
    case "ToolAnalysisResultOutput":
      return <ToolAnalysisResultDisplay data={result} />;
    
    default:
      return <UnsupportedResultType message={`Unsupported result type: ${type}`} />;
  }
}

interface UnsupportedResultTypeProps {
  message: string;
}

function UnsupportedResultType({ message }: UnsupportedResultTypeProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-amber-500 flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Unsupported Result Type
        </CardTitle>
        <CardDescription>
          This result type cannot be rendered using the available components
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-4 bg-muted rounded-md">
          <code className="text-sm">{message}</code>
        </div>
      </CardContent>
    </Card>
  );
}