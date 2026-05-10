export type UserRole = "Admin" | "Member";

export type TaskStatus = "Todo" | "In Progress" | "Done";

export interface User {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  members: User[];
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  project: Project;
  assignedTo: User;
  createdBy: User;
  status: TaskStatus;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
}
