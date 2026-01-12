"use client"

import { Button } from "@/components/ui/button"
import { Twitter, Facebook, Linkedin, Link as LinkIcon, Check } from "lucide-react"
import { toast } from "sonner"
import { useState } from "react"

interface ShareButtonsProps {
    title: string
    slug: string
}

export function ShareButtons({ title, slug }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false)

    // Construct full URL (client-side only to be safe, or assume deployed domain)
    // For now we use window.location.origin if available, or just relative for hrefs that support it
    // But social sharing needs absolute URLs.

    // In a real app, you'd use your production domain env var. 
    // We'll try to get it from window in useEffect or just use a placeholder if SSR.
    const getShareUrl = () => {
        if (typeof window !== 'undefined') {
            return `${window.location.origin}/blog/${slug}`
        }
        return `https://yourdomain.com/blog/${slug}`
    }

    const shareUrl = getShareUrl()
    const encodedUrl = encodeURIComponent(shareUrl)
    const encodedTitle = encodeURIComponent(title)

    const shareLinks = {
        twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
    }

    const openShare = (url: string) => {
        window.open(url, '_blank', 'width=600,height=400')
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl)
        setCopied(true)
        toast.success("Link copied to clipboard!")
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="flex flex-col gap-3 p-2 bg-background/50 backdrop-blur-sm rounded-full border shadow-sm">
            <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2] transition-colors h-10 w-10"
                onClick={() => openShare(shareLinks.twitter)}
                title="Share on Twitter"
            >
                <Twitter className="h-5 w-5" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-[#1877F2]/10 hover:text-[#1877F2] transition-colors h-10 w-10"
                onClick={() => openShare(shareLinks.facebook)}
                title="Share on Facebook"
            >
                <Facebook className="h-5 w-5" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-[#0A66C2]/10 hover:text-[#0A66C2] transition-colors h-10 w-10"
                onClick={() => openShare(shareLinks.linkedin)}
                title="Share on LinkedIn"
            >
                <Linkedin className="h-5 w-5" />
            </Button>
            <div className="h-[1px] w-full bg-border my-1" />
            <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors h-10 w-10"
                onClick={copyToClipboard}
                title="Copy Link"
            >
                {copied ? <Check className="h-5 w-5" /> : <LinkIcon className="h-5 w-5" />}
            </Button>
        </div>
    )
}
