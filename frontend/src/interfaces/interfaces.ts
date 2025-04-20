export interface Task {
  _id: string;
  title: string;
  description?: string;
  createdAt: string;
}

export interface Column {
  _id: string;
  name: string;
  tasks: Task[];
}

export interface Group {
  _id: string;
  name: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  columns: Column[];
}
