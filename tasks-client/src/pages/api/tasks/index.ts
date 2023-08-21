import type { NextRequest, NextResponse } from "next/server";

import { Task, NewTask } from "@/interfaces/task";
import { CustomResponse, createResponse } from "@/utils/response";
import { isAvalidTask } from "@/utils/validations";
import { generateAuthToken } from "@/utils/auth";

export const runtime = "edge";

async function createTask(req: NextRequest) {
  try {
    const data = await req.json();
    const validTask: boolean = isAvalidTask(data);

    if (!validTask) {
      return createResponse(null, "Invalid task attributes.", 400);
    } else {
      const newTask: NewTask = data;
      const resp = await fetch(`${process.env.TASKS_API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${generateAuthToken()}`,
        },
        body: JSON.stringify(newTask),
      });

      if (resp.status !== 200) {
        throw new Error(
          `Error creating tasks. Status: ${resp.status} ; Error: ${resp.statusText}`
        );
      } else {
        const task: Task = await resp.json();

        return createResponse(task, null, 201);
      }
    }
  } catch (error) {
    console.log(`Error creating task`);
    console.log(error);

    return createResponse(null, "Internal Server Error", 500);
  }
}

async function getTasks() {
  try {
    const resp = await fetch(`${process.env.TASKS_API_URL}/tasks`);

    if (resp.status !== 200) {
      throw new Error(
        `Error fetching tasks. Status: ${resp.status} ; Error: ${resp.statusText}`
      );
    } else {
      const tasks: Task[] = (await resp.json()).map((t: any) => {
        return {
          ...t,
          createdAt: new Date(t.created_at),
          updatedAt: new Date(t.updated_at),
        };
      });

      return createResponse(tasks, null, 200);
    }
  } catch (error) {
    console.log(`Error fetching tasks`);
    console.log(error);

    return createResponse(null, "Internal Server Error", 500);
  }
}

export default function handler(
  req: NextRequest,
  res: NextResponse<CustomResponse>
) {
  switch (req.method) {
    case "POST":
      return createTask(req);
    case "GET":
      return getTasks();
    default:
      return createResponse(null, "Not Allowed", 405);
  }
}
