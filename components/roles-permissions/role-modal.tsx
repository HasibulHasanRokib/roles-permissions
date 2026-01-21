"use client";

import { useState, useMemo, useTransition } from "react";
import { Edit2, Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { createRoleAction, updateRoleAction } from "@/lib/actions/role.actions";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { PERMISSION_CATEGORIES, PERMISSION_LABELS } from "./permission-data";

type RoleModalProps = {
  mode: "create" | "edit";
  role?: {
    id: string;
    name: string;
    permissions: string[];
  };
};

export function RoleModal({ mode, role }: RoleModalProps) {
  const [open, setOpen] = useState(false);
  const [roleName, setRoleName] = useState(role?.name || "");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    role?.permissions || [],
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [isPending, startTransition] = useTransition();

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

  const handleSubmit = () => {
    startTransition(async () => {
      try {
        if (mode === "create") {
          await createRoleAction({
            name: roleName,
            permissions: selectedPermissions,
          });
          toast.success("Role created 🚀");
        } else {
          await updateRoleAction(role!.id, {
            name: roleName,
            permissions: selectedPermissions,
          });
          toast.success("Role updated 🔥");
        }

        setOpen(false);
      } catch {
        toast.error("Something went wrong 😭");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === "create" ? (
          <Button>
            <Plus className="h-4 w-4" />
            Create Role
          </Button>
        ) : (
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
            <Edit2 className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl overflow-hidden p-0">
        {/* Header */}
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle className="text-xl font-bold">
            {mode === "create" ? "Create New Role" : "Edit Role"}
          </DialogTitle>{" "}
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
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={!roleName.trim() || isPending}
          >
            {isPending ? (
              <Spinner />
            ) : mode === "create" ? (
              "Create Role"
            ) : (
              "Update Role"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
