import { z } from "zod";

const TaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(5),
  done: z.boolean(),
});

export function isAvalidTask(body: any): boolean {
  const result = TaskSchema.safeParse(body);

  return result.success;
}
