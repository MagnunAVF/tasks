export interface Task {
  id: number;
  title: string;
  description: string;
  done: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewTask {
  title: string;
  description: string;
  done: boolean;
}

export interface UpdateTask {
  id?: number;
  title?: string;
  description?: string;
  done?: boolean;
}
