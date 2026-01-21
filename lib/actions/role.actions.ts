"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createRoleAction(data: {
  name: string;
  permissions: string[];
}) {
  const { name, permissions } = data;

  const role = await prisma.role.create({
    data: { name },
  });

  for (const key of permissions) {
    const permission = await prisma.permission.findUnique({
      where: { key },
    });

    if (!permission) continue;

    await prisma.rolePermission.create({
      data: {
        roleId: role.id,
        permissionId: permission.id,
      },
    });
  }

  revalidatePath("/");

  return { success: true };
}

export async function updateRoleAction(
  roleId: string,
  data: { name: string; permissions: string[] },
) {
  const { name, permissions } = data;

  await prisma.role.update({
    where: { id: roleId },
    data: { name },
  });

  // reset permissions
  await prisma.rolePermission.deleteMany({
    where: { roleId },
  });

  for (const key of permissions) {
    const p = await prisma.permission.findUnique({
      where: { key },
    });

    if (!p) continue;

    await prisma.rolePermission.create({
      data: {
        roleId,
        permissionId: p.id,
      },
    });
  }

  revalidatePath("/dashboard/roles");

  return { success: true };
}

export async function deleteRoleAction(roleId: string) {
  const role = await prisma.role.findUnique({
    where: { id: roleId },
  });

  if (!role) {
    return { error: "Role not found" };
  }

  await prisma.rolePermission.deleteMany({
    where: { roleId },
  });

  // await prisma.user.updateMany({
  //   where: { roleId },
  //   data: {
  //     roleId: process.env.DEFAULT_ROLE_ID!
  //   }
  // })

  await prisma.role.delete({
    where: { id: roleId },
  });

  revalidatePath("/");

  return { success: true };
}
