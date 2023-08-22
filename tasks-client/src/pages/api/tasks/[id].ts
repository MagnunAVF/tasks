import type { NextRequest, NextResponse } from "next/server";

import { NewTask, Task } from "@/interfaces/task";
import { CustomResponse, createResponse } from "@/utils/response";
import { generateAuthToken } from "@/utils/auth";
import { isAvalidTask } from "@/utils/validations";

export const runtime = "edge";

class InvalidIDError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "Invalid ID.";
  }
}

async function getTaskById(id: number) {
  try {
    const resp = await fetch(`${process.env.TASKS_API_URL}/tasks/${id}`);

    if (resp.status === 404) {
      return createResponse(null, "Task not found.", 404);
    } else if (resp.status !== 200) {
      throw new Error(
        `Error fetching task. Status: ${resp.status} ; Error: ${resp.statusText}`
      );
    } else {
      const data = await resp.json();
      const task: Task = {
        ...data,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };

      return createResponse(task, null, 200);
    }
  } catch (error) {
    console.log(`Error fetching task`);
    console.log(error);

    return createResponse(null, "Internal Server Error", 500);
  }
}

async function updateTaskById(req: NextRequest, id: number) {
  try {
    const data = await req.json();
    const validTask: boolean = isAvalidTask(data);

    if (!validTask) {
      return createResponse(null, "Invalid task attributes.", 400);
    } else {
      const newTask: NewTask = data;
      const resp = await fetch(`${process.env.TASKS_API_URL}/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${generateAuthToken()}`,
        },
        body: JSON.stringify(newTask),
      });

      if (resp.status !== 200) {
        throw new Error(
          `Error updating tasks. Status: ${resp.status} ; Error: ${resp.statusText}`
        );
      } else {
        const task: Task = await resp.json();

        return createResponse(task, null, 200);
      }
    }
  } catch (error) {
    console.log(`Error creating task`);
    console.log(error);

    return createResponse(null, "Internal Server Error", 500);
  }
}

async function deleteTaskById(id: number) {
  try {
    const resp = await fetch(`${process.env.TASKS_API_URL}/tasks/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${generateAuthToken()}`,
      },
    });

    if (resp.status !== 204) {
      throw new Error(
        `Error creating tasks. Status: ${resp.status} ; Error: ${resp.statusText}`
      );
    } else {
      return createResponse(null, null, 200);
    }
  } catch (error) {
    console.log(`Error creating task`);
    console.log(error);

    return createResponse(null, "Internal Server Error", 500);
  }
}

function getTaskId(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const idParam = searchParams.get("id");

  if (!idParam) {
    throw new InvalidIDError("Invalid ID.");
  }

  let id = parseInt(idParam);
  if (isNaN(id)) {
    throw new InvalidIDError("Invalid ID.");
  }

  return id;
}

export default function handler(
  req: NextRequest,
  res: NextResponse<CustomResponse>
) {
  let id: number;
  try {
    id = getTaskId(req);
  } catch (error) {
    return createResponse(null, "Invalid ID.", 400);
  }

  switch (req.method) {
    case "GET":
      return getTaskById(id);
    case "PUT":
      return updateTaskById(req, id);
    case "DELETE":
      return deleteTaskById(id);
    default:
      return createResponse(null, "Not Allowed", 405);
  }
}
