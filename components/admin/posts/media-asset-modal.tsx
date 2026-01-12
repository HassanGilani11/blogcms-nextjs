"use client"

import { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Image as ImageIcon, Upload, Search, CheckCircle2, RefreshCw, Loader2 } from "lucide-react"
import { getMediaAssets } from "@/app/admin/posts/actions"
import { uploadMedia } from "@/app/admin/media/actions"
import { toast } from "sonner"

interface MediaAssetModalProps {
    onSelect: (url: string) => void
    children: React.ReactNode
    folder?: string
}

export function MediaAssetModal({ onSelect, children, folder = "posts" }: MediaAssetModalProps) {
    const [assets, setAssets] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedUrl, setSelectedUrl] = useState<string | null>(null)
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        if (isOpen) {
            loadAssets()
        }
    }, [isOpen])

    async function loadAssets() {
        setIsLoading(true)
        const result = await getMediaAssets()
        if (result.success) {
            setAssets(result.data || [])
        } else {
            toast.error("Failed to load media library")
        }
        setIsLoading(false)
    }

    const filteredAssets = assets.filter(asset =>
        asset.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    function handleSelect(url: string) {
        setSelectedUrl(url)
    }

    function confirmSelection() {
        if (selectedUrl) {
            onSelect(selectedUrl)
            setIsOpen(false)
            setSelectedUrl(null)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col p-0 border-none shadow-2xl ring-1 ring-border/50">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <ImageIcon className="h-6 w-6 text-primary" />
                        Media Assets
                    </DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="library" className="flex-1 flex flex-col overflow-hidden">
                    <div className="px-6 border-b">
                        <TabsList className="h-12 bg-transparent gap-8 p-0">
                            <TabsTrigger
                                value="library"
                                className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 font-semibold text-muted-foreground data-[state=active]:text-foreground transition-all focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none focus:ring-0 ring-0 shadow-none outline-none !outline-none !ring-0 !shadow-none"
                            >
                                Media Library
                            </TabsTrigger>
                            <TabsTrigger
                                value="upload"
                                className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 font-semibold text-muted-foreground data-[state=active]:text-foreground transition-all focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none focus:ring-0 ring-0 shadow-none outline-none !outline-none !ring-0 !shadow-none"
                            >
                                Upload New
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="library" className="flex-1 overflow-hidden flex flex-col p-0 m-0 relative">
                        <div className="p-6 pb-4 flex items-center gap-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search images..."
                                    className="pl-9 bg-muted/20 border-none ring-1 ring-border/50 focus-visible:ring-primary/30"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" size="sm" onClick={loadAssets} disabled={isLoading} className="gap-2">
                                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                                Refresh
                            </Button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-6 min-h-[300px] scrollbar-thin scrollbar-thumb-muted-foreground/20">
                            {isLoading ? (
                                <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-2 py-20">
                                    <RefreshCw className="h-8 w-8 animate-spin text-primary/50" />
                                    <p className="text-sm font-medium">Loading library...</p>
                                </div>
                            ) : filteredAssets.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 py-2">
                                    {filteredAssets.map((asset) => (
                                        <div
                                            key={asset.url}
                                            className={`relative aspect-square group cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-200 ${selectedUrl === asset.url
                                                ? 'border-primary ring-4 ring-primary/20 scale-[0.98]'
                                                : 'border-muted/50 hover:border-primary/50 hover:shadow-md'
                                                }`}
                                            onClick={() => handleSelect(asset.url)}
                                            onDoubleClick={() => {
                                                handleSelect(asset.url);
                                                confirmSelection();
                                            }}
                                        >
                                            <img
                                                src={asset.url}
                                                alt={asset.name}
                                                className={`w-full h-full object-cover transition-all duration-500 ${selectedUrl === asset.url ? 'brightness-50' : 'group-hover:scale-110'
                                                    }`}
                                            />
                                            {selectedUrl === asset.url && (
                                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 animate-in fade-in zoom-in duration-200">
                                                    <CheckCircle2 className="h-10 w-10 text-primary fill-white" />
                                                    <span className="text-[10px] font-black text-white bg-primary px-2 py-0.5 rounded-full uppercase tracking-widest shadow-lg">Selected</span>
                                                </div>
                                            )}
                                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                                <p className="text-[10px] text-white font-medium truncate">{asset.name}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-4 py-20">
                                    <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center">
                                        <ImageIcon className="h-8 w-8 opacity-20" />
                                    </div>
                                    <p className="text-sm font-medium">No images found in library</p>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t bg-muted/10 flex items-center justify-between gap-4 sticky bottom-0 z-10">
                            <div className="text-xs text-muted-foreground font-medium">
                                {selectedUrl ? (
                                    <span className="text-primary flex items-center gap-1.5">
                                        <CheckCircle2 className="h-3.5 w-3.5" /> 1 Image Selected
                                    </span>
                                ) : (
                                    "Choose an image to continue"
                                )}
                            </div>
                            <div className="flex gap-3">
                                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="text-muted-foreground">Cancel</Button>
                                <Button
                                    disabled={!selectedUrl}
                                    onClick={confirmSelection}
                                    className="gap-2 shadow-lg shadow-primary/20 bg-primary px-6"
                                    size="sm"
                                >
                                    Choose Image
                                </Button>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="upload" className="flex-1 flex flex-col items-center justify-center p-12 m-0 gap-8">
                        {isUploading ? (
                            <div className="flex flex-col items-center gap-4">
                                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                                <p className="text-lg font-semibold animate-pulse">Uploading asset...</p>
                            </div>
                        ) : (
                            <>
                                <div className="relative">
                                    <div className="h-24 w-24 rounded-3xl bg-primary/10 flex items-center justify-center">
                                        <Upload className="h-10 w-10 text-primary" />
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-background border shadow-sm flex items-center justify-center">
                                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                </div>
                                <div className="text-center space-y-3">
                                    <h3 className="text-2xl font-bold tracking-tight">Upload Asset</h3>
                                    <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
                                        Choose a file from your computer to add it to the <span className="font-bold text-primary">{folder}</span> library.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-4 w-full max-w-xs">
                                    <input
                                        type="file"
                                        id="modal-upload"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0]
                                            if (!file) return

                                            setIsUploading(true)
                                            const formData = new FormData()
                                            formData.append('file', file)

                                            try {
                                                const result = await uploadMedia(formData, folder)
                                                if (result.success && result.url) {
                                                    toast.success("Asset uploaded successfully!")
                                                    onSelect(result.url)
                                                    setIsOpen(false)
                                                } else {
                                                    toast.error(result.message || "Upload failed")
                                                }
                                            } catch (error) {
                                                toast.error("An unexpected error occurred")
                                            } finally {
                                                setIsUploading(false)
                                            }
                                        }}
                                    />
                                    <Button asChild className="w-full h-12 rounded-xl text-md font-semibold shadow-lg shadow-primary/20">
                                        <label htmlFor="modal-upload" className="cursor-pointer">
                                            Select File to Upload
                                        </label>
                                    </Button>
                                    <p className="text-[10px] text-muted-foreground text-center uppercase tracking-widest font-bold">
                                        JPG, PNG, WEBP max 10MB
                                    </p>
                                </div>
                            </>
                        )}
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}
