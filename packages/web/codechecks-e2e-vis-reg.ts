import { codechecks } from "@codechecks/client";
import * as exec from "await-exec";
import { join } from "path";

export async function main(): Promise<void> {
  await visReg();
}

async function visReg(): Promise<void> {
  const execOptions = { timeout: 300000, cwd: process.cwd(), log: true };
  await codechecks.saveCollection("e2e-vis-reg", join(__dirname, "packages/web/cypress/screenshots"));

  if (codechecks.isPr()) {
    await codechecks.getCollection("e2e-vis-reg", join(__dirname, ".reg/expected"));
    await exec("./node_modules/.bin/reg-suit compare", execOptions);

    await codechecks.saveCollection("e2e-vis-reg-report", join(__dirname, ".reg"));

    const reportData = require("./.reg/out.json");
    await codechecks.success({
      name: "Visual regression for E2E",
      shortDescription: `Changed: ${reportData.failedItems.length}, New: ${reportData.newItems.length}, Deleted: ${reportData.deletedItems.length}`,
      detailsUrl: codechecks.getArtifactLink("/e2e-vis-reg-report/index.html"),
    });
  }
}
