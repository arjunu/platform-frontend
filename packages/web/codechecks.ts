import { codechecks } from "@codechecks/client";

// disabling faulty rules
// tslint:disable:no-useless-cast restrict-plus-operands
export async function main(): Promise<void> {
  await checkPackageLock();
}

async function checkPackageLock(): Promise<void> {
  if (!codechecks.isPr()) {
    return;
  }
  const hasPackageLock = codechecks.context.pr!.files.added.includes("package-lock.json");

  if (hasPackageLock) {
    await codechecks.failure({
      name: "Package lock detected",
      shortDescription: "Do not use npm, use yarn instead.",
    });
  }
}
