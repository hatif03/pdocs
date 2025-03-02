"use client";

import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/use-editor-store";
import { 
    LucideIcon, 
    Undo2Icon, 
    Redo2Icon, 
    PrinterIcon, 
    SpellCheckIcon, 
    BoldIcon, 
    ItalicIcon, 
    UnderlineIcon,
    MessageSquarePlusIcon, 
    ListTodoIcon,
    RemoveFormattingIcon,
    ChevronDownIcon,
    HighlighterIcon,
    Link2Icon,
    ImageIcon,
    UploadIcon,
    SearchIcon,
    AlignLeftIcon,
    AlignCenterIcon,
    AlignRightIcon,
    AlignJustifyIcon
} from "lucide-react";

import { 
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
 } from "../../../components/ui/dropdown-menu";

 import { 
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
 } from "@/components/ui/dialog";

 import { type Level } from "@tiptap/extension-heading";
 import { type ColorResult, SketchPicker } from "react-color";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TextAlign from "@tiptap/extension-text-align";


const AlignButton = () => {
    const { editor } = useEditorStore();

    const alignments = [
        { label: "Left", value: "left", icon: AlignLeftIcon },
        { label: "Center", value: "center", icon: AlignCenterIcon },
        { label: "Right", value: "right", icon: AlignRightIcon },
        { label: "Justify", value: "justify", icon: AlignJustifyIcon },
    ]

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
                    <AlignLeftIcon className=" size-4"/>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
                {alignments.map(({ label, value, icon: Icon }) => (
                    <button
                        key={value}
                        onClick={() => editor?.chain().focus().setTextAlign(value).run()}
                        className={cn(
                            "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80",
                            editor?.isActive({textAlign: value}) && "bg-neutral-200/80"
                        )}
                    >
                        <Icon className=" size-4"/>
                        <span className=" text-sm">{label}</span>
                    </button>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}


const ImageButton = () => {
    const { editor } = useEditorStore();
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [imageUrl, setImgUrl] = useState("");

    const onChange = (src:string) => {
        editor?.chain().focus().setImage({src}).run();
    };

    const onUpload = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";

        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const imgUrl = URL.createObjectURL(file);
                onChange(imgUrl);
            }
        }

        input.click();
    };

    const handleImageUrlSubmit = () => {
        if (imageUrl) {
            onChange(imageUrl);
            setImgUrl("");
            setDialogOpen(false);
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
                        <ImageIcon className=" size-4"/>
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={onUpload}>
                        <UploadIcon className=" size-4 mr-2"/>
                        Upload
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setDialogOpen(true)}>
                        <SearchIcon className=" size-4 mr-2"/>
                        Paste image URL
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Paste image URL</DialogTitle>
                    </DialogHeader>
                    <Input
                        placeholder="https://example.com/image.jpg"
                        value={imageUrl}
                        onChange={(e) => setImgUrl(e.target.value)}
                        onKeyDown={(e) => {
                            if(e.key === "Enter") {
                                handleImageUrlSubmit();
                            }
                        }}
                    />
                    <DialogFooter>
                        <Button onClick={handleImageUrlSubmit}>Apply</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
 }


 const LinkButton = () => {
    const { editor } = useEditorStore();
    const [value, setValue] = useState("");

    const onChange = (href:string) => {
        editor?.chain().focus().extendMarkRange("link").setLink({href}).run();
        setValue("");
    };

    return (
        <DropdownMenu onOpenChange={(open) => {
            if (open) {
                setValue(editor?.getAttributes("link").href || ""); 
            }
        }}>
            <DropdownMenuTrigger asChild>
                <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
                    <Link2Icon className=" size-4"/>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-2.5 items-center flex gap-x-2">
                <Input
                    placeholder="https://example.com"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
                <Button onClick={() => onChange(value)}>
                    Apply
                </Button>
            </DropdownMenuContent>
        </DropdownMenu>
    )
 }


 const HighlightColorButton = () => {
    const { editor } = useEditorStore();
    const value = editor?.getAttributes("highlight").color || "#FFFFFFFF";
    const onChange = (color: ColorResult) => {
        editor?.chain().focus().setHighlight({color: color.hex}).run();
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
                    <HighlighterIcon className=" size-4"/>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-0">
                <SketchPicker color={value} onChange={onChange} />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}


 const TextColorButton = () => {
    const { editor } = useEditorStore();
    const value = editor?.getAttributes("textStyle").color || "#000000";
    const onChange = (color: ColorResult) => {
        editor?.chain().focus().setColor(color.hex).run();
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
                    <span className="text-xs">A</span>
                    <div className=" h-0.5 w-full" style={{backgroundColor: value}}></div>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-0">
                <SketchPicker color={value} onChange={onChange} />
            </DropdownMenuContent>
        </DropdownMenu>
    )
 }


 const HeadingLevelButton = () => {
    const { editor } = useEditorStore();
    
    const headings = [
        { label: "Normal text", value: 0, fontSize: "16px" },
        { label: 'Heading 1', value: 1, fontSize: '32px' },
        { label: 'Heading 2', value: 2, fontSize: '24px' },
        { label: 'Heading 3', value: 3, fontSize: '20px' },
        { label: 'Heading 4', value: 4, fontSize: '18px' },
        { label: 'Heading 5', value: 5, fontSize: '16px' },
    ];

    const getCurrentHeading = () => {
        for (let level = 1; level <= 5; level++) {        
            if (editor?.isActive("heading", { level })) {
                return `Heading ${level}`;
            }
        }

        return "Normal text";
    };
        
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="h-7 min-w-7 shrink-0 flex items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
                    <span className="truncate">
                        {getCurrentHeading()}
                    </span>
                    <ChevronDownIcon className=" ml-2 size-4 shrink-0"/>
                </button>
            </DropdownMenuTrigger>    
            <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
                {headings.map(({ label, value, fontSize }) => (
                    <button 
                        onClick={() => {
                            if (value === 0) {
                                editor?.chain().focus().setParagraph().run();
                            } else {
                                editor?.chain().focus().toggleHeading({ level: value as Level }).run();
                            }
                        }}
                        key={value}
                        className={cn(
                            "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80",
                            (value === 0 && !editor?.isActive("heading")) || editor?.isActive("heading", {level: value }) && "bg-neutral-200/80"
                        )}
                        style={{fontSize}}
                    >
                        {label}
                    </button>

                ))}

            </DropdownMenuContent>        
        </DropdownMenu>
    )
}


const FontFamilyButton = () => {
    const {editor} = useEditorStore();

    const fonts = [
        { label: "Arial", value: "Arial" },
        { label: 'Times New Roman', value: 'Times New Roman' },
        { label: 'Courier New', value: 'Courier New' },
        { label: 'Georgia', value: 'Georgia' },
        { label: 'Verdana', value: 'Verdana' },
    ];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="h-7 w-[120px] shrink-0 flex items-center justify-between rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
                    <span className="truncate">
                        {editor?.getAttributes("textStyle").fontFamily || "Arial"}
                    </span>
                    <ChevronDownIcon className=" ml-2 size-4 shrink-0"/>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
                {fonts.map(({ label, value }) => (
                    <button 
                        onClick={() => editor?.chain().focus().setFontFamily(value).run()}
                        key={value}
                        className={cn(
                            "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80",
                            editor?.getAttributes("textStyle").fontFamily === value && "bg-neutral-200/80"
                        )}
                        style={{fontFamily: value}}
                    >
                        <span className=" text-sm">{label}</span>
                    </button>

                ))}

            </DropdownMenuContent>
        </DropdownMenu>
    )
}


interface ToolbarButtonProps {
    icon: LucideIcon;
    onClick?: () => void;
    isActive?: boolean;
}

const ToolbarButton = ({icon: Icon, onClick, isActive}: ToolbarButtonProps) => {
    return (
        <button
        onClick={onClick}
        className={cn(
            "text-sm h-7 min-w-7 flex items-center justify-center rounded-sm hover:bg-neutral-200/80",
            isActive && "bg-neutral-200/80"
        )}
        >
            <Icon/>
        </button>
    )
}

export const Toolbar = () => {
    const {editor} = useEditorStore()

    const sections: {
        label: string;
        icon: LucideIcon;
        onClick?: () => void;
        isActive?: boolean;
    }[][] = [
        [
            {
                label: 'Undo',
                icon: Undo2Icon,
                onClick: () => editor?.chain().focus().undo().run(),
            },
            {
                label: "Redo",
                icon: Redo2Icon,
                onClick: () => editor?.chain().focus().redo().run(),
            },
            {
                label: "Print",
                icon: PrinterIcon,
                onClick: () => window.print(),
            },
            {
                label: "Spell Check",
                icon: SpellCheckIcon,
                onClick: () => {
                const current = editor?.view.dom.getAttribute("spellcheck");
                editor?.view.dom.setAttribute("spellcheck", current === "false" ? "true" : "false");
                },
            }
        ],
        [
            {
                label: "Bold",                
                icon: BoldIcon,                
                isActive: editor?.isActive("bold"),                
                onClick: () => editor?.chain().focus().toggleBold().run(),
            },
            {
                label: "Italic",                
                icon: ItalicIcon,                
                isActive: editor?.isActive("italic"),                
                onClick: () => editor?.chain().focus().toggleItalic().run(),
            },
            {
                label: "Underline",                
                icon: UnderlineIcon,                
                isActive: editor?.isActive("underline"),                
                onClick: () => editor?.chain().focus().toggleUnderline().run(),
            }
        ],
        [
            {
                label: "Comment",
                icon: MessageSquarePlusIcon,
                onClick: () => console.log("TODO: Comment"),
                isActive: false,
            },
            {
                label: "List Todo",
                icon: ListTodoIcon,
                onClick: () => editor?.chain().focus().toggleTaskList().run(),
                isActive: editor?.isActive("taskList"),
            },
            {
                label: "Remove Formatting",
                icon: RemoveFormattingIcon,
                onClick: () => editor?.chain().focus().unsetAllMarks().run(),
            }
        ]
    ];

  return (
    <div className=" bg-[#F1F4F9] px-2.5 py-0.5 rounded-[24px] min-h-[40px] flex items-center gap-x-0.5 overflow-x-auto">
        {sections[0].map((item) => (
            <ToolbarButton key={item.label} {...item}/>
        ))}
        <Separator orientation="vertical" className="h-6 bg-neutral-600" />
        <FontFamilyButton/>
        <Separator orientation="vertical" className="h-6 bg-neutral-300" />
        <HeadingLevelButton/>
        <Separator orientation="vertical" className="h-6 bg-neutral-300" />
        {/* TODO: Font size */}
        <Separator orientation="vertical" className="h-6 bg-neutral-300" />
        {sections [1].map((item) => (
            <ToolbarButton key={item.label} {...item} />
        ))}
        <TextColorButton/>
        <HighlightColorButton/>
        <Separator orientation="vertical" className="h-6 bg-neutral-300" />
        <LinkButton/>
        <ImageButton/>
        <AlignButton/>
        {/* TODO: Line height */}
        {/* TODO: List */}
        {sections[2].map((item) => (
        <ToolbarButton key={item.label} {...item} />
        ))}
    </div>
  )
}


