"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  User,
  LayoutDashboard,
  LogOut,
  Shield,
  Home,
  Package,
  Mail,
} from "lucide-react";

type UserRole = "SUPER_ADMIN" | "ADMIN" | "STAFF" | "BUYER";

interface UserMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string;
  };
  links?: Array<{ label: string; href: string }>;
}

const roleLabels: Record<UserRole, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  STAFF: "Staff",
  BUYER: "Buyer",
};

const roleColors: Record<UserRole, string> = {
  SUPER_ADMIN: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  ADMIN: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  STAFF: "bg-green-500/10 text-green-600 dark:text-green-400",
  BUYER: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
};

const navIcons: Record<string, typeof Home> = {
  Home,
  Products: Package,
  Contact: Mail,
};

export function UserMenu({ user, links = [] }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await fetch("/api/auth/signout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ callbackUrl: "/" }),
      });
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Sign out error:", error);
      setIsSigningOut(false);
    }
  };

  const hasAdminAccess =
    user.role === "SUPER_ADMIN" ||
    user.role === "ADMIN" ||
    user.role === "STAFF";

  return (
    <div className="relative" ref={menuRef}>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-ecommerce-border bg-card/95 text-foreground shadow-md transition hover:bg-ecommerce-secondary-hover hover:border-ecommerce-secondary-border"
          aria-label="User menu"
          title={user.name || user.email || "User menu"}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#A5F3FC] to-[#22D3EE] text-[#0B1220]">
            <User className="h-4 w-4" />
          </div>
        </button>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {isOpen && (
        <div className="absolute right-0 z-[9999] mt-3 w-64 rounded-lg border-2 border-ecommerce-border bg-white shadow-2xl dark:bg-[#111827]">
          <div className="border-b border-border bg-white p-4 dark:bg-[#111827]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#A5F3FC] to-[#22D3EE] text-[#0B1220]">
                <User className="h-5 w-5" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-semibold text-[#0B1220] dark:text-white">
                  {user.name || "User"}
                </p>
                <p className="truncate text-xs text-[#64748B] dark:text-[#9CA3AF]">
                  {user.email}
                </p>
              </div>
            </div>
            {user.role && (
              <div className="mt-3">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                    roleColors[user.role as UserRole] ||
                    "bg-secondary text-secondary-foreground"
                  }`}
                >
                  <Shield className="h-3" />
                  {roleLabels[user.role as UserRole] || user.role}
                </span>
              </div>
            )}
          </div>

          <div className="bg-white p-2 dark:bg-[#111827]">
            {links.length > 0 && (
              <div className="mb-2">
                {links.map((link) => {
                  const Icon = navIcons[link.label] ?? LayoutDashboard;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-medium text-[#0B1220] transition hover:bg-[#F1F5F9] dark:bg-[#111827] dark:text-white dark:hover:bg-[#1F2937]"
                    >
                      <Icon className="h-4 w-4" />
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            )}
            {hasAdminAccess && (
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-medium text-[#0B1220] transition hover:bg-[#F1F5F9] dark:bg-[#111827] dark:text-white dark:hover:bg-[#1F2937]"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
            )}

            <button
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="flex w-full items-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-500/10 disabled:opacity-50 dark:bg-[#111827] dark:text-red-400"
            >
              <LogOut className="h-4 w-4" />
              {isSigningOut ? "Signing Out..." : "Sign Out"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
