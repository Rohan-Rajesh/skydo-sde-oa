export interface Task {
  id?: number;
  title: string;
  description: string;
  user: number;
  startDate: Date;
  dueDate: Date;
  priority: number;
  status: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TaskUser {
  id: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}
