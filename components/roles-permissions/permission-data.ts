export const PERMISSION_CATEGORIES = {
  "User Management": ["user.view", "user.create", "user.update", "user.delete"],
  "Admin Management": ["admin.create", "admin.update", "admin.delete"],
  "Task Management": ["task.assign", "task.update", "task.delete"],
};

export const PERMISSION_LABELS: Record<string, string> = {
  "user.view": "View Users",
  "user.create": "Create User",
  "user.update": "Update User",
  "user.delete": "Delete User",
  "admin.create": "Create Admin",
  "admin.update": "Update Admin",
  "admin.delete": "Delete Admin",
  "task.assign": "Assign Task",
  "task.update": "Update Task",
  "task.delete": "Delete Task",
};
