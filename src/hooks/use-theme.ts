import { use } from "react";
import { ThemeProviderContext } from "@/components/theme-provider";

export const useTheme = () => {
  const context = use(ThemeProviderContext);
  return context;
};
