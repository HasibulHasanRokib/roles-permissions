import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { RoleDetailsDrawer } from "./role-details-drawer";
import { RoleDelete } from "./role-delete";
import { RoleModal } from "./role-modal";

export async function RoleTable() {
  const roles = await prisma.role.findMany({
    include: {
      permissions: {
        include: {
          permission: true,
        },
      },
    },
  });

  return (
    <div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b">
              <TableHead className="font-semibold">Role Name</TableHead>
              <TableHead className="font-semibold">Permissions</TableHead>
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

                  <TableCell className="py-4">
                    <div className="flex justify-end gap-2">
                      <div>
                        <RoleDetailsDrawer role={role} />
                      </div>
                      <div>
                        <RoleModal
                          mode="edit"
                          role={{
                            id: role.id,
                            name: role.name,
                            permissions: role.permissions.map(
                              (p) => p.permission.key,
                            ),
                          }}
                        />
                      </div>
                      <div>
                        <RoleDelete roleId={role.id} />
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
