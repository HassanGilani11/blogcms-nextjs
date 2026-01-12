"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Search,
    UserPlus,
    MoreHorizontal,
    Shield,
    User,
    Mail,
    Calendar,
    Edit2,
    Trash2,
    Filter,
    Loader2
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Select as UISelect,
    SelectContent as UISelectContent,
    SelectItem as UISelectItem,
    SelectTrigger as UISelectTrigger,
    SelectValue as UISelectValue,
} from "@/components/ui/select"
import { getUsers, deleteUser } from "./actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function UsersPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [roleFilter, setRoleFilter] = useState("all")
    const [users, setUsers] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    const fetchUsers = async () => {
        setIsLoading(true)
        const result = await getUsers()
        if (result.success && result.data) {
            setUsers(result.data)
        } else {
            toast.error("Failed to load users")
        }
        setIsLoading(false)
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const handleDelete = async (userId: string) => {
        if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            const result = await deleteUser(userId)
            if (result.success) {
                toast.success("User deleted successfully")
                fetchUsers() // Refresh list
            } else {
                toast.error(result.message || "Failed to delete user")
            }
        }
    }

    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesRole = roleFilter === "all" || user.role.toLowerCase() === roleFilter.toLowerCase()
            return matchesSearch && matchesRole
        })
    }, [searchTerm, roleFilter, users])

    const getRoleBadge = (role: string) => {
        const normalizedRole = role.toLowerCase() === "user" ? "subscriber" : role.toLowerCase()
        switch (normalizedRole) {
            case "super admin":
                return <Badge className="bg-purple-500 hover:bg-purple-600 border-none px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs uppercase tracking-wider font-bold"><Shield className="h-3 w-3 mr-1" /> {normalizedRole}</Badge>
            case "admin":
                return <Badge className="bg-blue-500 hover:bg-blue-600 border-none px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs uppercase tracking-wider font-bold"><User className="h-3 w-3 mr-1" /> {normalizedRole}</Badge>
            default:
                return <Badge variant="secondary" className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs uppercase tracking-wider font-bold">{normalizedRole}</Badge>
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold tracking-tight">Users</h2>
                    <p className="text-muted-foreground">Manage your team and their permissions.</p>
                </div>
                <Link href="/admin/users/new" className="w-full sm:w-auto">
                    <Button className="w-full font-semibold">
                        <UserPlus className="mr-2 h-4 w-4" /> Add New User
                    </Button>
                </Link>
            </div>

            <Card className="shadow-sm border-none ring-1 ring-border/50 gap-0">
                <CardHeader className="p-6 pb-6">
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CardTitle>All Users</CardTitle>
                            <Badge variant="secondary" className="h-5 px-1.5 text-xs font-bold">
                                {filteredUsers.length}
                            </Badge>
                        </div>
                        <div className="flex w-full md:w-auto items-center gap-2">
                            <div className="relative w-full md:w-[250px]">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search users..."
                                    className="pl-8 bg-background"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <UISelect value={roleFilter} onValueChange={setRoleFilter}>
                                <UISelectTrigger className="w-[140px] bg-background">
                                    <div className="flex items-center gap-2">
                                        <Filter className="h-4 w-4 text-muted-foreground" />
                                        <UISelectValue placeholder="All Roles" />
                                    </div>
                                </UISelectTrigger>
                                <UISelectContent>
                                    <UISelectItem value="all">All Roles</UISelectItem>
                                    <UISelectItem value="super admin">Super Admin</UISelectItem>
                                    <UISelectItem value="admin">Admin</UISelectItem>
                                    <UISelectItem value="editor">Editor</UISelectItem>
                                    <UISelectItem value="author">Author</UISelectItem>
                                    <UISelectItem value="subscriber">Subscriber</UISelectItem>
                                </UISelectContent>
                            </UISelect>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                    <div className="rounded-md border overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead className="w-[300px]">User</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Joined Date</TableHead>
                                    <TableHead>Posts</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">
                                            <div className="flex items-center justify-center gap-2 text-muted-foreground">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Loading users...
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => (
                                        <TableRow key={user.id} className="hover:bg-muted/30 transition-colors">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-10 w-10 border shadow-sm">
                                                        <AvatarImage src={user.avatar} alt={user.name} />
                                                        <AvatarFallback>{user.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-foreground leading-none mb-1">{user.name}</span>
                                                        <span className="text-xs text-muted-foreground flex items-center gap-1 leading-none">
                                                            <Mail className="h-3 w-3" /> {user.email}
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {getRoleBadge(user.role)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                                                    <Calendar className="h-3.5 w-3.5" />
                                                    {user.joinedDate}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="font-black">
                                                    {user.postsCount}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">Actions</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-[160px]">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <Link href={`/admin/users/${user.id}/edit`}>
                                                            <DropdownMenuItem className="cursor-pointer">
                                                                <Edit2 className="mr-2 h-4 w-4" /> Edit User
                                                            </DropdownMenuItem>
                                                        </Link>
                                                        <DropdownMenuItem
                                                            className="text-destructive focus:text-destructive cursor-pointer"
                                                            onClick={() => handleDelete(user.id)}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" /> Delete User
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                            No users found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
