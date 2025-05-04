import { Badge } from "@/components/ui/badge";
import { EnvironmentSetupResult as EnvironmentSetupResultModel } from "@/api/models";

interface EnvironmentSetupResultProps {
  data: EnvironmentSetupResultModel;
  index?: number;
}

export function EnvironmentSetupResult({
  data,
  index,
}: EnvironmentSetupResultProps) {
  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="font-semibold leading-none">Environment Setup Result</h3>
        <p className="text-sm text-muted-foreground">
          Details of the environment setup
          {index !== undefined && ` for Environment ${String(index + 1)}`}
        </p>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-0">
            <h4 className="text-sm font-medium mb-2">Package Manager</h4>
            <div>
              {data.manager ? (
                <Badge variant="secondary" className="w-fit">
                  {data.manager}
                </Badge>
              ) : (
                <span className="text-muted-foreground">
                  No package manager detected
                </span>
              )}
            </div>
          </div>

          <div className="p-0">
            <h4 className="text-sm font-medium mb-2">Environment Path</h4>
            <div>
              {data.environment_path ? (
                <Badge variant="secondary" className="w-fit">
                  {data.environment_path}
                </Badge>
              ) : (
                <span className="text-muted-foreground">
                  No environment path detected
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface EnvironmentSetupResultsProps {
  data: EnvironmentSetupResultModel[];
}

export function EnvironmentSetupResults({
  data,
}: EnvironmentSetupResultsProps) {
  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="font-semibold leading-none">
          Environment Setup Results
        </h3>
        <p className="text-sm text-muted-foreground">
          Setup results for {data.length}{" "}
          {data.length === 1 ? "environment" : "environments"}
        </p>
      </div>
      <div className="space-y-6">
        {data.map((result) => (
          <EnvironmentSetupResult data={result} key={result.environment_path} />
        ))}
      </div>
    </div>
  );
}
