import type { Job, JobResult } from "./types/job";
import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";

const TIME_LIMIT = 5000;

export async function executeC(job: Job) {
  const jobDir = path.join(process.cwd(), "jobs", job.jobId);
  const conatainerName = `compiler-${job.jobId}`;

  try {
    // code to execute c lang
    let stdOut = "";
    let stdErr = "";
    let timeout = false;

    await fs.mkdir(jobDir, { recursive: true });

    await fs.writeFile(path.join(jobDir, "main.c"), job.srcCode);
    const docker = spawn("docker", [
      "run",
      "--rm",
      "-i",

      "--name",
      conatainerName,

      // Network isolation
      "--network",
      "none",

      // Resource limits
      "--memory",
      "128m",
      "--memory-swap",
      "128m",
      "--cpus",
      "0.5",
      "--pids-limit",
      "64",

      // Source directory
      "--mount",
      `type=bind,src=${jobDir},dst=/src`,

      "--workdir",
      "/src",

      "gcc:14",
      "sh",
      "-c",
      "gcc main.c -o main && ./main",
    ]);
    docker.stdout.on("data", (data) => {
      console.log(`stdout:\n${data}`);
      stdOut += data.toString();
    });
    docker.stderr.on("data", (data) => {
      console.log(`stderr : ${data}`);
      stdErr += data.toString();
    });

    docker.stdin.write(job.stdIn ?? "");
    docker.stdin.end();

    const timer = setTimeout(() => {
      timeout = true;

      const killer = spawn("docker", ["kill", conatainerName]);
      killer.on("error", (error) => {
        console.error("Container kill failed:", error);
      });
    }, TIME_LIMIT);

    const result = await new Promise<JobResult>((resolve, reject) => {
      docker.on("error", (error) => {
        reject(error);
      });
      docker.on("close", (code) => {
        clearTimeout(timer);

        resolve({
          jobId: job.jobId,
          userId: job.userId,
          stdErr,
          stdOut,
          exitCode: code ?? -1,
        });
        console.log(`Process closed with code ${code}`);
      });
    });

    return result;
  } catch (error) {
    console.log("Error detected : ", error);
    throw error;
  } finally {
    await fs.rm(jobDir, {
      recursive: true,
      force: true,
    });
  }
}

export async function executejs(job: Job) {
  // code to execute js lang

  const jobDir = path.join(process.cwd(), "jobs", job.jobId);

  await fs.mkdir(jobDir, { recursive: true });

  await fs.writeFile(path.join(jobDir, "main.js"), job.srcCode);

  const docker = spawn("docker", [
    "run",
    "--rm",
    "-i",
    "--network",
    "none",
    "--mount",
    `type=bind,src=${jobDir},dst=/src`,
    "--workdir",
    "/src",
    "node:22-alpine",
    "node",
    "main.js",
  ]);

  docker.stdout.on("data", (data) => {
    console.log(`stdOut : ${data}`);
  });
  docker.stderr.on("data", (data) => {
    console.log(`stdErr : ${data}`);
  });
  docker.on("close", (code) => {
    console.log(`"process exited with code" : ${code}`);
  });
  await fs.rm(jobDir, {
    recursive: true,
    force: true,
  });
}

export async function executePy(job: Job) {
  // code to execute Python lang
  const jobDir = path.join(process.cwd(), "jobs", job.jobId);

  await fs.mkdir(jobDir, { recursive: true });

  await fs.writeFile(path.join(jobDir, "main.py"), job.srcCode);

  const docker = spawn("docker", [
    "run",
    "--rm",
    "-i",
    "--network",
    "none",
    "--mount",
    `type=bind,src=${jobDir},dst=/src`,
    "--workdir",
    "/src",
    "python:3.12-slim",
    "python",
    "main.py",
  ]);

  docker.stdout.on("data", (data) => {
    console.log(`StdOut : ${data}`);
  });
  docker.stderr.on("data", (data) => {
    console.log(`stdErr : ${data}`);
  });
  docker.on("close", (code) => {
    console.log(`Process ended with code ${code}`);
  });
  await fs.rm(jobDir, {
    recursive: true,
    force: true,
  });
}

// executeC({
//   jobId: "1",
//   userId: "2",
//   language: "c",
//   srcCode: `#include <stdio.h>
//               int main() {
//                 // Print text to the screen
//                 printf("Hello, World!");

//                 // Indicate that the program ran successfully
//                 return 0;
//           }`,
// });

// executePy({
//   jobId: "1",
//   userId: "2",
//   language: "py",
//   srcCode: `print("Hello world")`,
// });
