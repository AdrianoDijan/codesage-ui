import { RepoScannerResult } from "./repo-scanner";
import { SupervisorResults } from "./initial-scan-supervisor";
import { ToolAnalysisResult } from "./tool-analysis";
import { EnvironmentSetupResult } from "./environment-setup";

import { AlertCircle } from "lucide-react";
import {
  EnvironmentSetupResult as EnvironmentSetupResultModel,
  InitialScanSupervisorResults as InitialScanSupervisorResultsModel,
  RepoScannerResults as RepoScannerResultsModel,
  TaskResultSchema,
  ToolAnalysisResult as ToolAnalysisResultModel,
} from "@/api/models";

interface TaskResultProps {
  content: TaskResultSchema;
}

export function TaskResult({ content }: TaskResultProps) {
  const { type, result } = content;

  switch (type) {
    case "RepoScannerResults":
      return (
        <RepoScannerResult
          data={(result as RepoScannerResultsModel).results[0]}
        />
      );

    case "InitialScanSupervisorResults":
      return (
        <SupervisorResults data={result as InitialScanSupervisorResultsModel} />
      );

    case "ToolAnalysisResult":
      return <ToolAnalysisResult data={result as ToolAnalysisResultModel} />;

    case "ToolAnalysisResults":
      return (
        <div className="flex flex-col gap-2">
          {result.results.map((singleResult: ToolAnalysisResult) => {
            return (
              <ToolAnalysisResult
                data={singleResult as ToolAnalysisResultModel}
              />
            );
          })}
        </div>
      );

    case "EnvironmentSetupResult":
      return (
        <EnvironmentSetupResult data={result as EnvironmentSetupResultModel} />
      );

    case "EnvironmentSetupResults":
      return (
        <div className="flex flex-col gap-2">
          {result.results.map((singleResult: EnvironmentSetupResultModel) => {
            return (
              <EnvironmentSetupResult
                data={singleResult as EnvironmentSetupResultModel}
              />
            );
          })}
        </div>
      );

    default:
      return (
        <UnsupportedResultType message={`Unsupported result type: ${type}`} />
      );
  }
}

interface UnsupportedResultTypeProps {
  message: string;
}

function UnsupportedResultType({ message }: UnsupportedResultTypeProps) {
  return (
    <div className="w-full">
      <div className="mb-3">
        <h3 className="text-amber-500 flex items-center gap-2 font-medium leading-none">
          <AlertCircle className="h-5 w-5" />
          Unsupported Result Type
        </h3>
        <p className="text-muted-foreground text-sm mt-1">
          This result type cannot be rendered
        </p>
      </div>
      <div className="bg-muted/40 p-3 rounded">
        <code className="text-sm">{message}</code>
      </div>
    </div>
  );
}
