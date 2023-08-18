export interface Task {
  id: number;
  title: string;
  description: string;
  done: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface newTask {
  title: string;
  description: string;
  done: boolean;
}

export interface updatedTask {
  title?: string;
  description?: string;
  done?: boolean;
}
