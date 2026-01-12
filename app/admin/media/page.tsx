"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UploadCloud, Image as ImageIcon, Trash2, MoreHorizontal, Filter, Search, Loader2 } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { getMediaLibrary, uploadMedia, deleteMedia } from "./actions"
import { toast } from "sonner"

export default function MediaPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [mediaFiles, setMediaFiles] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        fetchMedia()
    }, [])

    async function fetchMedia() {
        setIsLoading(true)
        const result = await getMediaLibrary()
        if (result.success) {
            setMediaFiles(result.data)
        } else {
            toast.error(result.message || "Failed to fetch media")
        }
        setIsLoading(false)
    }

    async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        const formData = new FormData()
        formData.append('file', file)

        const result = await uploadMedia(formData)
        if (result.success) {
            toast.success(result.message)
            fetchMedia()
        } else {
            toast.error(result.message || "Upload failed")
        }
        setIsUploading(false)
        if (fileInputRef.current) fileInputRef.current.value = ""
    }

    async function handleDelete(fileName: string, folder: string) {
        if (!confirm("Are you sure you want to delete this file?")) return

        const result = await deleteMedia(fileName, folder)
        if (result.success) {
            toast.success(result.message)
            fetchMedia()
        } else {
            toast.error(result.message || "Delete failed")
        }
    }

    const filteredMedia = useMemo(() => {
        return mediaFiles.filter((file) =>
            file.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [searchTerm, mediaFiles])

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Media Library</h2>
                    <p className="text-muted-foreground">
                        Manage your images and files.
                    </p>
                </div>
                <div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleUpload}
                    />
                    <Button
                        className="gap-2 shadow-sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                    >
                        {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
                        {isUploading ? "Uploading..." : "Upload File"}
                    </Button>
                </div>
            </div>

            <Card className="shadow-sm border-none ring-1 ring-border/50 gap-0">
                <Tabs defaultValue="grid">
                    <CardHeader className="p-6 pb-6">
                        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
                            <CardTitle>Files</CardTitle>
                            <div className="flex w-full md:w-auto items-center gap-2">
                                <div className="relative w-full md:w-[300px]">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        placeholder="Search files..."
                                        className="pl-8 bg-background"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <Button variant="outline" size="icon">
                                    <Filter className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <TabsList className="h-auto p-0 bg-transparent gap-2">
                                <TabsTrigger
                                    value="grid"
                                    className="h-8 px-4 rounded-full data-[state=active]:bg-primary/10 data-[state=active]:text-primary text-muted-foreground hover:text-primary transition-all font-medium whitespace-nowrap"
                                >
                                    Grid View
                                </TabsTrigger>
                                <TabsTrigger
                                    value="list"
                                    className="h-8 px-4 rounded-full data-[state=active]:bg-primary/10 data-[state=active]:text-primary text-muted-foreground hover:text-primary transition-all font-medium whitespace-nowrap"
                                >
                                    List View
                                </TabsTrigger>
                            </TabsList>
                            <div className="text-sm text-muted-foreground hidden sm:block">
                                Showing {filteredMedia.length} files
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">

                        {/* Drop Zone Visual */}
                        <div
                            className="mb-8 border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer bg-muted/20"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                {isUploading ? <Loader2 className="h-6 w-6 text-primary animate-spin" /> : <UploadCloud className="h-6 w-6 text-primary" />}
                            </div>
                            <h3 className="text-lg font-semibold">{isUploading ? "Uploading file..." : "Drop files here to upload"}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                Supports JPG, PNG, WEBP, SVG up to 10MB
                            </p>
                            <Button variant="outline" size="sm" className="mt-4" disabled={isUploading}>
                                Select Files
                            </Button>
                        </div>

                        {isLoading ? (
                            <div className="h-40 flex items-center justify-center border rounded-lg bg-muted/20 text-muted-foreground">
                                <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                                <span>Loading media assets...</span>
                            </div>
                        ) : (
                            <>
                                <TabsContent value="grid" className="mt-0">
                                    {filteredMedia.length > 0 ? (
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                            {filteredMedia.map((file) => (
                                                <div key={file.id} className="group relative rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                                    <div className="aspect-square bg-muted relative flex items-center justify-center overflow-hidden">
                                                        {file.url ? (
                                                            <img
                                                                src={file.url}
                                                                alt={file.name}
                                                                className="object-cover w-full h-full transition-transform group-hover:scale-105"
                                                            />
                                                        ) : (
                                                            <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
                                                        )}
                                                        {/* Folder Badge */}
                                                        <div className="absolute top-2 left-2 z-10">
                                                            <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm shadow-sm capitalize text-[10px] py-0 px-2 h-5">
                                                                {file.folder}
                                                            </Badge>
                                                        </div>
                                                        {/* Overlay Actions */}
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                            <Button
                                                                variant="destructive"
                                                                size="icon"
                                                                className="h-8 w-8 rounded-full"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDelete(file.name, file.folder);
                                                                }}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <div className="p-3">
                                                        <div className="font-medium truncate text-sm" title={file.name}>{file.name}</div>
                                                        <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                                                            <span>{file.size}</span>
                                                            <span className="uppercase text-[10px]">{file.type.split('/')[1]}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="h-40 flex flex-col items-center justify-center border rounded-lg bg-muted/20 text-muted-foreground">
                                            <ImageIcon className="h-8 w-8 mb-2 opacity-20" />
                                            <p>No files found matching your search.</p>
                                        </div>
                                    )}
                                </TabsContent>
                                <TabsContent value="list" className="mt-0">
                                    {filteredMedia.length > 0 ? (
                                        <div className="rounded-md border">
                                            <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 p-3 font-medium text-sm text-muted-foreground bg-muted/50 border-b">
                                                <div className="w-10"></div>
                                                <div>Name</div>
                                                <div>Folder</div>
                                                <div className="text-right">Size</div>
                                                <div className="text-right">Type</div>
                                                <div className="w-10"></div>
                                            </div>
                                            {filteredMedia.map((file) => (
                                                <div key={file.id} className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 p-3 items-center text-sm border-b last:border-0 hover:bg-muted/50 transition-colors">
                                                    <div className="w-10 h-10 rounded bg-muted flex items-center justify-center overflow-hidden">
                                                        {file.url ? (
                                                            <img src={file.url} alt={file.name} className="object-cover w-full h-full" />
                                                        ) : (
                                                            <ImageIcon className="h-4 w-4 text-muted-foreground" />
                                                        )}
                                                    </div>
                                                    <div className="font-medium truncate">{file.name}</div>
                                                    <div>
                                                        <Badge variant="outline" className="capitalize text-[10px] py-0 h-5">
                                                            {file.folder}
                                                        </Badge>
                                                    </div>
                                                    <div className="text-right text-muted-foreground">{file.size}</div>
                                                    <div className="text-right text-muted-foreground uppercase">{file.type.split('/')[1]}</div>
                                                    <div className="flex justify-end">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem
                                                                    className="text-destructive focus:text-destructive"
                                                                    onClick={() => handleDelete(file.name, file.folder)}
                                                                >
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    Delete
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="h-40 flex flex-col items-center justify-center border rounded-lg bg-muted/20 text-muted-foreground">
                                            <Search className="h-8 w-8 mb-2 opacity-20" />
                                            <p>No files found.</p>
                                        </div>
                                    )}
                                </TabsContent>
                            </>
                        )}
                    </CardContent>
                </Tabs>
            </Card>
        </div >
    )
}
