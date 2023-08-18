import type { NextRequest, NextResponse } from "next/server";

import { Task } from "@/interfaces/task";
import { CustomResponse, createResponse } from "@/utils/response";

export const runtime = "edge";

class InvalidIDError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "Invalid ID.";
  }
}

function getTaskById(
  req: NextRequest,
  res: NextResponse<CustomResponse>,
  id: number
) {
  const currentDate = new Date();
  const task: Task = {
    id,
    title: "foo",
    description: "bar",
    done: false,
    createdAt: currentDate,
    updatedAt: currentDate,
  };

  return createResponse(task, null, 200);
}

function updateTaskById(
  req: NextRequest,
  res: NextResponse<CustomResponse>,
  id: number
) {
  const currentDate = new Date();
  const task: Task = {
    id,
    title: "foo",
    description: "bar",
    done: false,
    createdAt: currentDate,
    updatedAt: currentDate,
  };

  return createResponse(task, null, 200);
}

function deleteTaskById(
  req: NextRequest,
  res: NextResponse<CustomResponse>,
  id: number
) {
  console.log("Deleting ", id);
  return createResponse(null, null, 200);
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
      return getTaskById(req, res, id);
    case "PUT":
      return updateTaskById(req, res, id);
    case "DELETE":
      return deleteTaskById(req, res, id);
    default:
      return createResponse(null, "Not Allowed", 405);
  }
}
