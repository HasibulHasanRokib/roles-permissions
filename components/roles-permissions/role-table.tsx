"use client";

import { Edit2, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Role {
  id: string;
  name: string;
  permissions: string[];
  createdDate: string;
}

interface RoleTableProps {
  roles: Role[];
  onEdit: (role: Role) => void;
  onDelete: (roleId: string) => void;
  onView: (role: Role) => void;
}

export function RoleTable({ roles, onEdit, onDelete, onView }: RoleTableProps) {
  return (
    <div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b">
              <TableHead className="font-semibold">Role Name</TableHead>
              <TableHead className="font-semibold">Permissions</TableHead>
              <TableHead className="font-semibold">Created</TableHead>
              <TableHead className="text-right font-semibold">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-muted-foreground py-12 text-center"
                >
                  No roles found
                </TableCell>
              </TableRow>
            ) : (
              roles.map((role) => (
                <TableRow
                  key={role.id}
                  className="hover:bg-primary/5 border-b transition-all duration-300"
                >
                  <TableCell className="text-foreground py-4 font-medium">
                    <div className="flex items-center gap-3">
                      <div className="bg-muted text-primary flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold">
                        {role.name.charAt(0)}
                      </div>
                      {role.name}
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant="secondary"
                        className="bg-muted text-primary transition-colors"
                      >
                        {role.permissions.length} permissions
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground py-4 text-sm">
                    {new Date(role.createdDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex justify-end gap-2">
                      <div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onView(role)}
                          className="hover:bg-primary/20 hover:text-primary h-8 w-8 p-0"
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                      <div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onEdit(role)}
                          className="h-8 w-8 p-0 hover:bg-blue-500/20 hover:text-blue-500"
                          title="Edit role"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onDelete(role.id)}
                          className="hover:bg-destructive/20 hover:text-destructive h-8 w-8 p-0"
                          title="Delete role"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
