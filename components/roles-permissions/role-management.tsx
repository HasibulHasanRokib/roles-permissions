"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreateRoleModal } from "./create-role-modal";
import { RoleDetailsDrawer } from "./role-details-drawer";
import { toast } from "sonner";
import { RoleTable } from "./role-table";

interface Role {
  id: string;
  name: string;
  permissions: string[];
  createdDate: string;
}

const INITIAL_ROLES: Role[] = [
  {
    id: "1",
    name: "User",
    permissions: ["user:view", "user:create"],
    createdDate: "2024-01-15",
  },
  {
    id: "2",
    name: "Admin",
    permissions: [
      "user:view",
      "user:create",
      "user:update",
      "user:delete",
      "admin:create",
      "admin:update",
      "admin:delete",
    ],
    createdDate: "2024-01-10",
  },
  {
    id: "3",
    name: "Moderator",
    permissions: ["user:view", "user:update", "task:assign", "task:update"],
    createdDate: "2024-01-08",
  },
  {
    id: "4",
    name: "Super Admin",
    permissions: [
      "user:view",
      "user:create",
      "user:update",
      "user:delete",
      "admin:create",
      "admin:update",
      "admin:delete",
      "task:assign",
      "task:update",
      "task:delete",
    ],
    createdDate: "2024-01-01",
  },
];

export function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>(INITIAL_ROLES);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleCreateRole = (roleData: {
    name: string;
    permissions: string[];
  }) => {
    if (editingRole) {
      setRoles(
        roles.map((r) =>
          r.id === editingRole.id
            ? { ...r, name: roleData.name, permissions: roleData.permissions }
            : r,
        ),
      );
      toast.success("Role updated successfully");
      setEditingRole(null);
    } else {
      const newRole: Role = {
        id: Math.random().toString(),
        name: roleData.name,
        permissions: roleData.permissions,
        createdDate: new Date().toISOString().split("T")[0],
      };
      setRoles([...roles, newRole]);
      toast.success("Role created successfully");
    }
    setIsModalOpen(false);
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setIsModalOpen(true);
  };

  const handleDeleteRole = (roleId: string) => {
    setRoles(roles.filter((r) => r.id !== roleId));
    toast.error("Role deleted successfully");
  };

  const handleViewRole = (role: Role) => {
    setSelectedRole(role);
    setIsDrawerOpen(true);
  };

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
          <div>
            <Button
              onClick={() => {
                setEditingRole(null);
                setIsModalOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Create Role
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-10">
        <div className="relative">
          <Input
            placeholder="Search roles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2" />
        </div>
      </div>

      <div>
        <RoleTable
          roles={filteredRoles}
          onEdit={handleEditRole}
          onDelete={handleDeleteRole}
          onView={handleViewRole}
        />
      </div>

      {isModalOpen && (
        <CreateRoleModal
          open={isModalOpen}
          role={editingRole}
          onSave={handleCreateRole}
          onClose={() => {
            setIsModalOpen(false);
            setEditingRole(null);
          }}
        />
      )}

      {isDrawerOpen && selectedRole && (
        <RoleDetailsDrawer
          open={isDrawerOpen}
          role={selectedRole}
          onClose={() => setIsDrawerOpen(false)}
        />
      )}
    </div>
  );
}
