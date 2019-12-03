const { join } = require("path");
const { readFileSync, writeFileSync } = require("fs");
const glob = require("glob");

const defaultLocale = "en-en";
const defaultLocalePath = join(__dirname, "../intl/locales/", defaultLocale + ".json");
const messageFilesPath = join(__dirname, "../intl/messages");

function readFileOrDefault(path, def) {
  try {
    const fileContents = readFileSync(path, "utf8") || def;

    return fileContents.trim();
  } catch (e) {
    return def;
  }
}

function stringifyAndSort(obj) {
  return JSON.stringify(obj, Object.keys(obj).sort(), 2);
}

function getEmptyStrings(localeFile) {
  return Object.keys(localeFile).filter(local => localeFile[local] === "");
}

function main() {
  // only check if there are no changes to the baseline
  const checkMode = process.argv[2] === "--check";

  const oldLocaleFileContents = readFileOrDefault(defaultLocalePath, "{}");
  const oldLocale = JSON.parse(oldLocaleFileContents);

  const newLocale = {};

  const messageFiles = glob.sync(messageFilesPath + "/**/*.json", { absolute: true });

  messageFiles.forEach(path => {
    const messages = JSON.parse(readFileOrDefault(path, "{}"));

    const extractedIds = messages.map(m => m.id);

    // add new ids to default locale file
    for (const id of extractedIds) {
      newLocale[id] = oldLocale[id] || "";
    }
  });

  // some stats
  const oldLocaleSize = Object.keys(oldLocale).length;
  const newLocaleSize = Object.keys(newLocale).length;
  const diff = newLocaleSize - oldLocaleSize;
  const diffFormatted = diff >= 0 ? "+" + diff : diff;

  if (checkMode) {
    // both strings are trimmed — meaning we dont care about line endings b/c phrasepp integration breaks it anyway
    if (oldLocaleFileContents !== stringifyAndSort(newLocale)) {
      console.error(`Some strings were not extracted! Diff: ${diffFormatted}`);
      process.exit(1);
    }

    const emptyStrings = getEmptyStrings(newLocale);
    if (emptyStrings.length !== 0) {
      console.error(
        `Some strings are missing. Please check the following locales: ${emptyStrings.join(", ")}.`,
      );
      process.exit(1);
    }
  } else {
    writeFileSync(defaultLocalePath, stringifyAndSort(newLocale));
    console.log(`File ${defaultLocalePath} saved...`);
    console.log(`Extracted translations:  ${newLocaleSize}(${diffFormatted})`);
  }
}

main();
