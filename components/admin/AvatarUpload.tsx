"use client"

import { MediaAssetModal } from "./posts/media-asset-modal"
import { setAvatarUrl } from "@/app/(auth)/actions"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Camera } from "lucide-react"

interface AvatarUploadProps {
    currentUrl: string | null
    initials: string
}

export function AvatarUpload({ currentUrl, initials }: AvatarUploadProps) {
    const handleLibrarySelect = async (url: string) => {
        try {
            await setAvatarUrl(url)
            toast.success("Avatar updated successfully!")
        } catch (error) {
            toast.error("Failed to update avatar")
            console.error(error)
        }
    }

    return (
        <div className="relative mx-auto w-24 h-24 mb-4">
            <Avatar className="w-24 h-24 border-4 border-background shadow-xl scale-110">
                <AvatarImage src={currentUrl || ""} />
                <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>

            <MediaAssetModal onSelect={handleLibrarySelect} folder="avatars">
                <Button
                    size="icon"
                    variant="secondary"
                    className="absolute bottom-0 right-0 rounded-full h-8 w-8 shadow-md border ring-1 ring-border/50"
                    type="button"
                >
                    <Camera className="h-4 w-4" />
                </Button>
            </MediaAssetModal>
        </div>
    )
}
