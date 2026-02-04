import { defineConfig } from "vitest/config";
import {
  vitestSetupFilePath,
  getClarinetVitestsArgv,
} from "@stacks/clarinet-sdk/vitest";

export default defineConfig({
  test: {
    environment: "clarinet",
    pool: "forks",
    isolate: false,
    maxWorkers: 1,
    include: ["tests/**/*_test.ts", "tests/**/*.test.ts", "tests/**/*.spec.ts"],
    setupFiles: [vitestSetupFilePath],
    environmentOptions: {
      clarinet: {
        ...getClarinetVitestsArgv(),
      },
    },
  },
});
