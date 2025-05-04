import * as React from "react";
import { Link } from "react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useBreadcrumbs } from "@/hooks/use-breadcrumbs";

interface AppBreadcrumbsProps {
  projects?: {
    id: string;
    name: string;
  }[];
}

export function AppBreadcrumbs({ projects }: AppBreadcrumbsProps) {
  const breadcrumbs = useBreadcrumbs(projects);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((breadcrumb, index) => (
          <React.Fragment
            key={`${breadcrumb.path ?? "null"}-${breadcrumb.label}`}
          >
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {breadcrumb.path ? (
                <BreadcrumbLink asChild>
                  <Link to={breadcrumb.path}>{breadcrumb.label}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
