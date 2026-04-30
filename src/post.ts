import * as core from "@actions/core";
import { saveTombiCache } from "./cache";

export async function runPost(): Promise<void> {
  try {
    await saveTombiCache();
  } catch (error) {
    if (error instanceof Error) {
      core.warning(`Failed to save Tombi cache: ${error.message}`);
      return;
    }

    core.warning("Failed to save Tombi cache");
  }
}

if (process.env.NODE_ENV !== "test") {
  void runPost();
}
