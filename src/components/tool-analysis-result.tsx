import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ToolAnalysisResultInput,
  ToolAnalysisResultOutput,
} from "@/api/models";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

interface ToolAnalysisResultProps {
  data: ToolAnalysisResultInput | ToolAnalysisResultOutput;
}

export function ToolAnalysisResultDisplay({ data }: ToolAnalysisResultProps) {
  // Group results by tool
  const resultsByTool = data.results.reduce((acc, result) => {
    const tool = result.tool;
    if (!acc[tool]) {
      acc[tool] = [];
    }
    acc[tool].push(result);
    return acc;
  }, {} as Record<string, typeof data.results>);

  const toolNames = Object.keys(resultsByTool);
  const issueCount = data.results.length;

  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high":
        return <XCircle className="h-4 w-4 text-destructive" />;
      case "medium":
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case "low":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case "info":
        return <CheckCircle2 className="h-4 w-4 text-info" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getSeverityClass = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "medium":
        return "bg-warning/10 text-warning border-warning/20";
      case "low":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "info":
        return "bg-info/10 text-info border-info/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {toolNames.map((tool) => (
        <div key={tool} className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium">{tool}</h3>
            <Badge variant="outline">
              {resultsByTool[tool].length}{" "}
              {resultsByTool[tool].length === 1 ? "issue" : "issues"}
            </Badge>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Severity</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resultsByTool[tool].map((result, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getSeverityIcon(result.severity)}
                      <Badge className={getSeverityClass(result.severity)}>
                        {result.severity}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {result.description}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {result.code_point.file}:{result.code_point.line_number}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ))}

      {issueCount === 0 && (
        <div className="flex items-center justify-center p-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
            <p className="text-lg font-medium">No issues found</p>
            <p className="text-sm text-muted-foreground">
              All tools ran successfully and didn't detect any issues
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
