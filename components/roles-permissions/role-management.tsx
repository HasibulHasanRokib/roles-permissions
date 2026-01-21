import { RoleModal } from "./role-modal";
import { RoleTable } from "./role-table";

export function RoleManagement() {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="mb-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-foreground text-3xl font-bold">
              Roles Management
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Create and manage roles with dynamic permissions
            </p>
          </div>
          <RoleModal mode="create" />
        </div>
      </div>
      <RoleTable />
    </div>
  );
}
