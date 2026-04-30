"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { Badge } from "@workspace/ui/components/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { MoreHorizontal, Phone, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  role: "USER" | "ADMIN";
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
};

// Mock data based on the schema
const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    emailVerified: true,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    role: "ADMIN",
    phone: "+1 (555) 123-4567",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-04-28"),
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.chen@example.com",
    emailVerified: true,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    role: "USER",
    phone: "+1 (555) 234-5678",
    createdAt: new Date("2024-02-20"),
    updatedAt: new Date("2024-04-25"),
  },
  {
    id: "3",
    name: "Emma Davis",
    email: "emma.davis@example.com",
    emailVerified: true,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    role: "USER",
    phone: "+1 (555) 345-6789",
    createdAt: new Date("2024-03-10"),
    updatedAt: new Date("2024-04-20"),
  },
  {
    id: "4",
    name: "James Wilson",
    email: "james.wilson@example.com",
    emailVerified: false,
    role: "USER",
    phone: "+1 (555) 456-7890",
    createdAt: new Date("2024-03-25"),
    updatedAt: new Date("2024-04-18"),
  },
  {
    id: "5",
    name: "Lisa Anderson",
    email: "lisa.anderson@example.com",
    emailVerified: true,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
    role: "USER",
    phone: "+1 (555) 567-8901",
    createdAt: new Date("2024-04-01"),
    updatedAt: new Date("2024-04-26"),
  },
  {
    id: "6",
    name: "David Martinez",
    email: "david.martinez@example.com",
    emailVerified: true,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    role: "ADMIN",
    phone: "+1 (555) 678-9012",
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-04-29"),
  },
  {
    id: "7",
    name: "Jessica Taylor",
    email: "jessica.taylor@example.com",
    emailVerified: true,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica",
    role: "USER",
    createdAt: new Date("2024-02-14"),
    updatedAt: new Date("2024-04-22"),
  },
  {
    id: "8",
    name: "Robert Brown Titu",
    email: "robert.brown@example.com",
    emailVerified: false,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
    role: "USER",
    phone: "+1 (555) 789-0123",
    createdAt: new Date("2024-04-05"),
    updatedAt: new Date("2024-04-28"),
  },
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export function UsersTable() {
  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="w-[300px] text-foreground">User</TableHead>
              <TableHead className="text-foreground">Email Status</TableHead>
              <TableHead className="hidden text-foreground sm:table-cell">
                Phone
              </TableHead>
              <TableHead className="text-foreground">Role</TableHead>
              <TableHead className="hidden text-foreground lg:table-cell">
                Joined
              </TableHead>
              <TableHead className="hidden text-foreground lg:table-cell">
                Last Updated
              </TableHead>
              <TableHead className="text-right text-foreground">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_USERS.map((user) => (
              <TableRow
                key={user.id}
                className="border-border transition-colors hover:bg-muted/30"
              >
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border border-border">
                      <AvatarImage src={user.image} alt={user.name} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-0.5">
                      <p className="font-medium text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <Badge
                    variant={user.emailVerified ? "default" : "secondary"}
                    className={
                      user.emailVerified
                        ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                        : "bg-amber-500/20 text-amber-700 dark:text-amber-400"
                    }
                  >
                    {user.emailVerified ? "Verified" : "Pending"}
                  </Badge>
                </TableCell>
                <TableCell className="hidden py-4 text-sm text-foreground sm:table-cell">
                  {user.phone ? (
                    <a
                      href={`tel:${user.phone}`}
                      className="flex items-center gap-2 hover:text-primary"
                    >
                      <Phone className="h-4 w-4" />
                      {user.phone}
                    </a>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="py-4">
                  <Badge
                    variant={user.role === "ADMIN" ? "default" : "secondary"}
                    className={
                      user.role === "ADMIN"
                        ? "bg-blue-500/20 text-blue-700 dark:text-blue-400"
                        : "bg-gray-500/20 text-gray-700 dark:text-gray-400"
                    }
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="hidden py-4 text-sm text-muted-foreground lg:table-cell">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDistanceToNow(user.createdAt, { addSuffix: true })}
                  </div>
                </TableCell>
                <TableCell className="hidden py-4 text-sm text-muted-foreground lg:table-cell">
                  {formatDistanceToNow(user.updatedAt, { addSuffix: true })}
                </TableCell>
                <TableCell className="py-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit User</DropdownMenuItem>
                      <DropdownMenuItem>Send Email</DropdownMenuItem>
                      <DropdownMenuItem>Resend Verification</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="border-t border-border px-4 py-3 sm:px-6">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{MOCK_USERS.length}</span> of{" "}
          <span className="font-medium">{MOCK_USERS.length}</span> users
        </p>
      </div>
    </div>
  );
}
