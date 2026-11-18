import express from "express";
import { createClient } from "redis";
import { randomUUID } from "node:crypto";
import { db } from "@repo/db";
import cors from "cors";
const client = createClient();

client.on("error", (err) => console.log("Redis Client Error", err));

await client.connect();

const app = express();

app.use(express.json());
app.use(cors());

app.post("/submission", async (req, res) => {
  const { srcCode, language, stdIn, userId } = req.body;

  const job = await db.orm.public.Submission.create({
    language,
    srcCode,
    stdIn,
    userId: userId,
  });

  client.lPush(
    "problemStatement",
    JSON.stringify({
      jobId: job.id,
      userId,
      srcCode,
      language,
      stdIn,
    }),
  );

  res.status(200).json({ message: "QUEUED", id: job.id });
});

app.get("/submission/:sumbissionId", async (req, res) => {
  const sumbissionId = req.params.sumbissionId;
  const response = await db.orm.public.Submission.where({
    id: sumbissionId,
  }).first();
  res.status(200).json({
    data: response,
    message: "fetched succesfully",
  });

  return;
});

app.listen(3000);
