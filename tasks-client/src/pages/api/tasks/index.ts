import type { NextRequest, NextResponse } from "next/server";

import { Task } from "@/interfaces/task";
import { CustomResponse, createResponse } from "@/utils/response";

export const runtime = "edge";

function createTask(req: NextRequest, res: NextResponse<CustomResponse>) {
  const currentDate = new Date();
  const task: Task = {
    id: 1,
    title: "foo",
    description: "bar",
    done: false,
    createdAt: currentDate,
    updatedAt: currentDate,
  };

  return createResponse(task, null, 201);
}

function getTasks(req: NextRequest, res: NextResponse<CustomResponse>) {
  const currentDate = new Date();
  const tasks: Task[] = [
    {
      id: 1,
      title: "foo",
      description:
        "bar dhjsad jhsaijod ajdjosdijosdioj asdioj aodjasoijasdiojidj aiodjasioj asioj asijod asijd oia",
      done: false,
      createdAt: currentDate,
      updatedAt: currentDate,
    },
    {
      id: 2,
      title: "foo 2",
      description: "bar 2",
      done: true,
      createdAt: currentDate,
      updatedAt: currentDate,
    },
  ];

  return createResponse(tasks, null, 201);
}

export default function handler(
  req: NextRequest,
  res: NextResponse<CustomResponse>
) {
  switch (req.method) {
    case "POST":
      return createTask(req, res);
    case "GET":
      return getTasks(req, res);
    default:
      return createResponse(null, "Not Allowed", 405);
  }
}
