"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Car, LogOut, User as UserIcon } from "lucide-react";
import { getUser, clearUser, isAdmin } from "@/lib/auth";
import { useEffect, useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setUser(getUser());
  }, [pathname]);

  const handleLogout = () => {
    clearUser();
    setUser(null);
    router.push("/");
  };

  if (!mounted) return null;

  return (
    <nav className="border-b bg-white sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Car className="h-6 w-6" />
            <span className="hidden sm:inline">Car Rental System</span>
            <span className="sm:hidden">CRS</span>
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link href="/available-cars">
                  <Button variant={pathname === "/available-cars" ? "default" : "ghost"}>
                    Cars
                  </Button>
                </Link>
                <Link href="/my-rentals">
                  <Button variant={pathname === "/my-rentals" ? "default" : "ghost"}>
                    My Rentals
                  </Button>
                </Link>
                {isAdmin() && (
                  <Link href="/admin">
                    <Button variant={pathname === "/admin" ? "default" : "ghost"}>
                      Admin
                    </Button>
                  </Link>
                )}
                <div className="flex items-center gap-2 px-3 py-1 bg-secondary rounded-md">
                  <UserIcon className="h-4 w-4" />
                  <span className="text-sm font-medium hidden sm:inline">{user.name}</span>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant={pathname === "/login" ? "default" : "ghost"}>
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant={pathname === "/register" ? "default" : "outline"}>
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
