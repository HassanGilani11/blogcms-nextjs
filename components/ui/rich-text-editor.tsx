"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Link from "@tiptap/extension-link"
import { Button } from "@/components/ui/button"
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    List,
    ListOrdered,
    Heading2,
    Heading3,
    Link as LinkIcon,
    Undo,
    Redo,
    Strikethrough,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect } from "react"

interface RichTextEditorProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: "text-primary underline cursor-pointer",
                },
            }),
        ],
        content: value,
        editorProps: {
            attributes: {
                class: "min-h-[300px] w-full bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 prose prose-sm max-w-none dark:prose-invert",
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        immediatelyRender: false,
    })

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            if (value === "" && editor.getHTML() === "<p></p>") return
            if (editor.getText() === "" && value === "") {
                editor.commands.setContent(value)
            }
        }
    }, [value, editor])

    if (!editor) {
        return null
    }

    const ToolbarButton = ({
        isActive,
        onClick,
        icon: Icon,
        label
    }: {
        isActive?: boolean
        onClick: () => void
        icon: any
        label: string
    }) => (
        <Button
            variant={isActive ? "secondary" : "ghost"}
            size="sm"
            onClick={(e) => {
                e.preventDefault()
                onClick()
            }}
            className="h-8 w-8 p-0"
            title={label}
            type="button"
        >
            <Icon className="h-4 w-4" />
            <span className="sr-only">{label}</span>
        </Button>
    )

    return (
        <div className="flex flex-col rounded-md border border-input bg-transparent focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
            <div className="flex flex-wrap items-center gap-1 border-b bg-muted/20 p-1">
                <ToolbarButton
                    isActive={editor.isActive("bold")}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    icon={Bold}
                    label="Bold"
                />
                <ToolbarButton
                    isActive={editor.isActive("italic")}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    icon={Italic}
                    label="Italic"
                />
                <ToolbarButton
                    isActive={editor.isActive("underline")}
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    icon={UnderlineIcon}
                    label="Underline"
                />
                <ToolbarButton
                    isActive={editor.isActive("strike")}
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    icon={Strikethrough}
                    label="Strikethrough"
                />
                <div className="mx-1 h-6 w-px bg-border" />
                <ToolbarButton
                    isActive={editor.isActive("heading", { level: 2 })}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    icon={Heading2}
                    label="Heading 2"
                />
                <ToolbarButton
                    isActive={editor.isActive("heading", { level: 3 })}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    icon={Heading3}
                    label="Heading 3"
                />
                <div className="mx-1 h-6 w-px bg-border" />
                <ToolbarButton
                    isActive={editor.isActive("bulletList")}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    icon={List}
                    label="Bullet List"
                />
                <ToolbarButton
                    isActive={editor.isActive("orderedList")}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    icon={ListOrdered}
                    label="Ordered List"
                />
                <div className="mx-1 h-6 w-px bg-border" />
                <ToolbarButton
                    isActive={editor.isActive("link")}
                    onClick={() => {
                        const previousUrl = editor.getAttributes('link').href
                        const url = window.prompt('URL', previousUrl)
                        if (url === null) return
                        if (url === '') {
                            editor.chain().focus().extendMarkRange('link').unsetLink().run()
                            return
                        }
                        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
                    }}
                    icon={LinkIcon}
                    label="Link"
                />
                <div className="ml-auto flex items-center gap-1">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().undo().run()}
                        icon={Undo}
                        label="Undo"
                    />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().redo().run()}
                        icon={Redo}
                        label="Redo"
                    />
                </div>
            </div>
            <EditorContent editor={editor} className="min-h-[300px] w-full p-0" />
        </div>
    )
}
