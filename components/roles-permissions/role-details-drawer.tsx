import { Shield, Lock, Eye } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "../ui/button";
import { Permission, Role } from "@/lib/generated/prisma/client";
import { PERMISSION_CATEGORIES, PERMISSION_LABELS } from "./permission-data";

type RoleWithPermissions = Role & {
  permissions: {
    permission: Permission;
  }[];
};

export function RoleDetailsDrawer({
  role,
}: {
  role: RoleWithPermissions | null;
}) {
  if (!role) return null;
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          className="hover:bg-primary/20 hover:text-primary h-8 w-8 p-0"
          title="View details"
        >
          <Eye className="h-4 w-4" />
        </Button>
      </SheetTrigger>
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
                    perms.includes(p.permission.key),
                  );

                  if (!matched.length) return null;

                  return (
                    <div key={category} className="rounded-lg border p-4">
                      <h4 className="text-muted-foreground mb-3 text-xs font-semibold tracking-wide uppercase">
                        {category}
                      </h4>

                      <div className="flex flex-wrap gap-2">
                        {matched.map((permission) => (
                          <Badge
                            key={permission.permission.id}
                            variant="secondary"
                          >
                            ✓ {PERMISSION_LABELS[permission.permission.key]}
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
