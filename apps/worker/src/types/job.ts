export interface Job {
  jobId: string;
  userId: string;
  language: "c" | "js" | "py";
  srcCode: string;
  stdIn?: string;
}
export interface JobResult {
  jobId: string;
  userId: string;
  stdOut: string;
  stdErr: string;
  exitCode: number;
}
