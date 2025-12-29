"use client";

import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

export function AdminHeader() {
  return (
    <header className="border-b bg-background">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">Admin Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm">
            <User className="mr-2 h-4 w-4" />
            Admin User
          </Button>
        </div>
      </div>
    </header>
  );
}

