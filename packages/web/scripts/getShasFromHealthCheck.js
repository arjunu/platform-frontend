const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const { getArtifactsSubmoduleRelativePath } = require("./getArtifacts");

const getApiSha = async () => {
  try {
    console.log(`Requesting SHA from Health Check API`);

    const response = await (
      await fetch("https://platform.neufund.io/api/health", {
        method: "GET",
      })
    ).json();

    console.log(`Artifacts SHA: ${response.artifacts_sha}`);
    console.log(`Commit SHA: ${response.commit_sha}`);
    const checkMode = process.argv[2];

    if (checkMode === "--check") {
      const oldCommits = JSON.parse(
        fs.readFileSync(path.resolve(__dirname, "..", "health-check-sha.json"), "utf8"),
      );

      if (response.artifacts_sha !== oldCommits.artifactsSha) {
        console.error(
          "The Artifacts Commit does not match the artifacts SHA in the health check API. Please run yarn prepare locally",
        );
        process.exit(1);
      } else {
        console.log("Contract Artifacts SHA up to date");
      }
    } else {
      fs.writeFileSync(
        path.resolve(__dirname, "..", "health-check-sha.json"),
        JSON.stringify({ artifactsSha: response.artifacts_sha, commitSha: response.commit_sha }),
      );

      console.log("Checking out to the correct contract artifacts version");

      const contractArtifactsDir = getArtifactsSubmoduleRelativePath();

      const CI_COMMAND = `git submodule update --init --recursive && git fetch && git checkout ${response.artifacts_sha} && git status`;
      const LOCAL_COMMAND = `git submodule update --init --recursive && cd ${contractArtifactsDir} && git fetch && git checkout ${response.artifacts_sha} && git status`;

      if (process.env.CIRCLE_BUILD_NUM) {
        console.log("Detected Circle-CI running");
        COMMAND = CI_COMMAND;
      } else {
        console.log("Detected Local machine running");
        COMMAND = LOCAL_COMMAND;
      }
      exec(COMMAND, (err, stdout) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log(stdout);
      });
    }
  } catch (e) {
    console.log("There was an error while fetching the health API", e);
  }
};

getApiSha();
