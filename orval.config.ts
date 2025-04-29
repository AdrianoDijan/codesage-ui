import { defineConfig } from "orval";

export default defineConfig({
  codesage: {
    input: {
      target: "http://localhost:8080/api/openapi.json",
    },
    output: {
      mode: "tags-split",
      target: "./src/api/endpoints",
      schemas: "./src/api/models",
      client: "react-query",
      fileExtension: ".gen.ts",
    },
    hooks: {
      afterAllFilesWrite: "prettier --write",
    },
  },
});
