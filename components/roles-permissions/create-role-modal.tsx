"use client";

import { useState, useMemo } from "react";
import { Check } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

interface Role {
  id: string;
  name: string;
  permissions: string[];
  createdDate: string;
}

interface CreateRoleModalProps {
  open: boolean;
  role: Role | null;
  onSave: (roleData: { name: string; permissions: string[] }) => void;
  onClose: () => void;
}

const PERMISSION_CATEGORIES = {
  "User Management": ["user:view", "user:create", "user:update", "user:delete"],
  "Admin Management": ["admin:create", "admin:update", "admin:delete"],
  "Task Management": ["task:assign", "task:update", "task:delete"],
};

const PERMISSION_LABELS: Record<string, string> = {
  "user:view": "View Users",
  "user:create": "Create User",
  "user:update": "Update User",
  "user:delete": "Delete User",
  "admin:create": "Create Admin",
  "admin:update": "Update Admin",
  "admin:delete": "Delete Admin",
  "task:assign": "Assign Task",
  "task:update": "Update Task",
  "task:delete": "Delete Task",
};

export function CreateRoleModal({
  open,
  role,
  onSave,
  onClose,
}: CreateRoleModalProps) {
  const [roleName, setRoleName] = useState(role?.name || "");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    role?.permissions || [],
  );
  const [searchTerm, setSearchTerm] = useState("");

  const allPermissions = useMemo(
    () => Object.values(PERMISSION_CATEGORIES).flat(),
    [],
  );

  const togglePermission = (permission: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission],
    );
  };

  const toggleSelectAll = () => {
    if (selectedPermissions.length === allPermissions.length) {
      setSelectedPermissions([]);
    } else {
      setSelectedPermissions([...allPermissions]);
    }
  };

  const handleSave = () => {
    if (!roleName.trim()) return;

    onSave({
      name: roleName.trim(),
      permissions: selectedPermissions,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl overflow-hidden p-0">
        {/* Header */}
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle className="text-xl font-bold">
            {role ? "Edit Role" : "Create New Role"}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6 p-4">
            <div>
              <Label>Role Name</Label>
              <Input
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                placeholder="e.g. Content Manager"
                className="mt-2"
              />
            </div>

            {/* Search */}
            <div>
              <Label>Permissions</Label>
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search permissions..."
                className="mt-2"
              />
            </div>

            {/* Select all */}
            <div className="bg-muted flex items-center gap-3 rounded-lg p-3">
              <Checkbox
                checked={selectedPermissions.length === allPermissions.length}
                onCheckedChange={toggleSelectAll}
              />
              <p className="text-sm font-medium">
                Select All ({selectedPermissions.length}/{allPermissions.length}
                )
              </p>
            </div>

            {/* Permissions */}
            {Object.entries(PERMISSION_CATEGORIES).map(
              ([category, permissions]) => (
                <div key={category} className="rounded-lg border p-4">
                  <h3 className="mb-3 text-sm font-semibold">{category}</h3>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {permissions
                      .filter(
                        (perm) =>
                          !searchTerm ||
                          PERMISSION_LABELS[perm]
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()),
                      )
                      .map((permission) => (
                        <div
                          key={permission}
                          className="flex items-center gap-3"
                        >
                          <Checkbox
                            checked={selectedPermissions.includes(permission)}
                            onCheckedChange={() => togglePermission(permission)}
                          />
                          <label className="cursor-pointer text-sm">
                            {PERMISSION_LABELS[permission]}
                          </label>
                        </div>
                      ))}
                  </div>
                </div>
              ),
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t px-6 py-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button onClick={handleSave} disabled={!roleName.trim()}>
            <Check className="mr-1 h-4 w-4" />
            {role ? "Update Role" : "Create Role"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
