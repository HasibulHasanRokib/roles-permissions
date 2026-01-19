"use client";

import { Shield, Calendar, Lock } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Role {
  id: string;
  name: string;
  permissions: string[];
  createdDate: string;
}

interface RoleDetailsDrawerProps {
  open: boolean;
  role: Role | null;
  onClose: () => void;
}

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

const PERMISSION_CATEGORIES: Record<string, string[]> = {
  "User Management": ["user:view", "user:create", "user:update", "user:delete"],
  "Admin Management": ["admin:create", "admin:update", "admin:delete"],
  "Task Management": ["task:assign", "task:update", "task:delete"],
};

export function RoleDetailsDrawer({
  open,
  role,
  onClose,
}: RoleDetailsDrawerProps) {
  if (!role) return null;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right">
        {/* Header */}
        <SheetHeader className="border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold">
                {role.name.charAt(0)}
              </div>
              <SheetTitle className="text-lg font-bold">{role.name}</SheetTitle>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-64px)]">
          <div className="space-y-6 p-4">
            {/* Stats */}
            <div className="grid gap-4">
              <div className="rounded-lg border p-4">
                <div className="flex gap-3">
                  <Shield className="text-primary h-5 w-5" />
                  <div>
                    <p className="text-muted-foreground text-xs">
                      Total Permissions
                    </p>
                    <p className="text-2xl font-bold">
                      {role.permissions.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex gap-3">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-muted-foreground text-xs">Created</p>
                    <p className="text-sm font-semibold">
                      {new Date(role.createdDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Permissions */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <Lock className="text-primary h-4 w-4" />
                Assigned Permissions
              </h3>

              {Object.entries(PERMISSION_CATEGORIES).map(
                ([category, perms]) => {
                  const matched = role.permissions.filter((p) =>
                    perms.includes(p),
                  );

                  if (!matched.length) return null;

                  return (
                    <div key={category} className="rounded-lg border p-4">
                      <h4 className="text-muted-foreground mb-3 text-xs font-semibold tracking-wide uppercase">
                        {category}
                      </h4>

                      <div className="flex flex-wrap gap-2">
                        {matched.map((permission) => (
                          <Badge key={permission} variant="secondary">
                            ✓ {PERMISSION_LABELS[permission]}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
