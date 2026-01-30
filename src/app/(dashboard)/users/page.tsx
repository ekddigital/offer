import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { UsersManagement } from "@/components/dashboard/users-management";

export default async function UsersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/users");
  }

  // Only SUPER_ADMIN and ADMIN can access user management
  if (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN") {
    redirect("/products");
  }

  return (
    <div className="mx-auto max-w-7xl">
      <UsersManagement currentUserRole={session.user.role} />
    </div>
  );
}
