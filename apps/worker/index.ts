import { createClient } from "redis";
import { executeC, executejs, executePy } from "./src/executeCodes";
import type { Job, JobResult } from "./src/types/job";
import { db } from "@repo/db";

const client = createClient();

async function startWorker() {
  await client.connect();

  console.log("Worker started. Waiting for jobs...");
  while (1) {
    try {
      const response = await client.brPop("problemStatement", 0);

      if (!response) {
        continue;
      }
      console.log("running");

      const parsedResponse = JSON.parse(response.element);

      const job: Job = {
        userId: parsedResponse.userId,
        language: parsedResponse.language,
        srcCode: parsedResponse.srcCode,
        jobId: parsedResponse.jobId,
        stdIn: parsedResponse.stdIn,
      };

      console.log("Running Job ", job.jobId);

      let result: JobResult;

      await db.orm.public.Submission.where({
        id: job.jobId,
      }).update({
        status: "RUNNING",
      });

      switch (job.language) {
        case "c":
          console.log("c code running");

          result = await executeC(job);

          console.log("hello");

          break;
        // case "js":
        //   console.log("python running");
        //   result = await executePy(job);

        // case "py":
        //   result = await executejs(job);

        default:
          throw new Error(`Unsupported language: ${job.language}`);
          break;
      }

      await db.orm.public.Submission.where({
        id: result.jobId,
      }).update({
        status: "COMPLETED",
        stdOut: result.stdOut,
        stdErr: result.stdErr,
        exitcode: result.exitCode,
      });
      console.log(result);

      //update the db
    } catch (error) {
      console.error("Job execution failed:", error);
    }
  }
}

startWorker().catch((error) => {
  console.error("Worker startup failed:", error);
  process.exitCode = 1;
});
