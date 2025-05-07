// src/components/ui/file-upload.tsx
import * as React from "react";
import { useDropzone, type DropzoneOptions } from "react-dropzone";
import { type FileWithPath } from "react-dropzone";
import { X, Upload, ImageIcon, AlertCircle, CheckCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Progress } from "~/components/ui/progress"
import { Badge } from "~/components/ui/badge";
import { CrossIcon } from "lucide-react";
import { type VariantProps } from "class-variance-authority";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip"
import { Dialog, DialogContent } from "~/components/ui/dialog"
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";

interface FileUploadProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "onChange"> {
  value?: string[];
  onChange?: (files: File[]) => void;
  onRemove?: (value: string) => void;
  maxFiles?: number;
  maxSize?: number;
  accept?: DropzoneOptions["accept"];
}

export function FileUpload({
    value = [],
    onChange,
    onRemove,
    maxFiles = 1,
    maxSize = 1024 * 1024 * 2, // 2MB
    accept = {
        "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    className,
    ...props
    }: FileUploadProps) {
    const [files, setFiles] = React.useState<FileWithPath[]>([]);
    const [previews, setPreviews] = React.useState<string[]>(value);
    const [isDragReject, setIsDragReject] = React.useState(false);
    const [previewImage, setPreviewImage] = React.useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = React.useState<number | null>(
        null
    );

    React.useEffect(() => {
        setPreviews(value);
    }, [value]);

    const onDrop = React.useCallback(
        (acceptedFiles: FileWithPath[], rejectedFiles: any) => {
        if (rejectedFiles.length > 0) {
            // Handle rejected files
            console.error("Alguns arquivos foram rejeitados:", rejectedFiles);
            setIsDragReject(true);
            setTimeout(() => setIsDragReject(false), 3000);
            return;
        }

        // Simulate upload progress
        setUploadProgress(0);
        const interval = setInterval(() => {
            setUploadProgress((prev) => {
            if (prev === null) return 0;
            if (prev >= 100) {
                clearInterval(interval);
                setTimeout(() => setUploadProgress(null), 1000);
                return 100;
            }
            return prev + 5;
            });
        }, 50);

        const newFiles = [...files, ...acceptedFiles].slice(0, maxFiles);
        setFiles(newFiles);

        // Generate previews
        const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
        setPreviews(newPreviews);

        if (onChange) {
            onChange(newFiles);
        }
        },
        [files, maxFiles, onChange]
    );

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject: dropzoneDragReject,
    } = useDropzone({
        onDrop,
        accept,
        maxSize,
        maxFiles,
    });

    const handleRemove = (preview: string) => {
        if (onRemove) {
        onRemove(preview);
        }
        setPreviews(previews.filter((p) => p !== preview));
        setFiles(files.filter((f) => URL.createObjectURL(f) !== preview));
    };

    // Calculate remaining files
    const remainingFiles = maxFiles - previews.length;

    return (
        <div className={cn("space-y-6", className)} {...props}>
        <AnimatePresence>
            {isDragReject && (
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800"
            >
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">
                Alguns arquivos não puderam ser aceitos. Verifique o formato e
                tamanho.
                </span>
            </motion.div>
            )}
        </AnimatePresence>

        <div
            {...getRootProps()}
            className={cn(
            "relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-900/50",
            isDragActive &&
                !dropzoneDragReject &&
                "border-black dark:border-white bg-gray-50 dark:bg-gray-900/50",
            dropzoneDragReject && "border-red-400 bg-red-50 dark:bg-red-900/20",
            isDragAccept &&
                "border-black dark:border-white bg-gray-50 dark:bg-gray-900/50",
            "border-gray-200 dark:border-gray-800"
            )}
        >
            <input {...getInputProps()} />
            <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center gap-3"
            >
            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center"
            >
                {isDragActive ? (
                <Upload className="w-7 h-7 text-black dark:text-white" />
                ) : (
                <ImageIcon className="w-7 h-7 text-gray-500 dark:text-gray-400" />
                )}
            </motion.div>
            <div className="space-y-1">
                <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                {isDragActive
                    ? "Solte os arquivos aqui"
                    : "Arraste imagens ou clique para selecionar"}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                Formatos suportados: JPG, PNG, WEBP (máx. {maxSize / 1024 / 1024}
                MB)
                </p>
                {maxFiles > 1 && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {remainingFiles > 0
                    ? `Você pode adicionar mais ${remainingFiles} ${
                        remainingFiles === 1 ? "imagem" : "imagens"
                        }`
                    : "Limite máximo de imagens atingido"}
                </p>
                )}
            </div>
            </motion.div>

            <AnimatePresence>
            {uploadProgress !== null && (
                <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-3 left-3 right-3"
                >
                <div className="bg-white dark:bg-gray-900 rounded-lg p-3 shadow-md border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Processando imagens
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        {uploadProgress}%
                    </span>
                    </div>
                    <Progress
                    value={uploadProgress}
                    className="h-1.5 bg-gray-100 dark:bg-gray-800"
                    />
                </div>
                </motion.div>
            )}
            </AnimatePresence>
        </div>

        {previews.length > 0 && (
            <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            >
            <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Imagens ({previews.length}/{maxFiles})
                </h4>
                {previews.length > 0 && (
                <Badge
                    variant="outline"
                    className="bg-gray-50 dark:bg-gray-900 text-xs"
                >
                    <CheckCircle className="h-3 w-3 mr-1 text-black dark:text-white" />
                    {previews.length}{" "}
                    {previews.length === 1
                    ? "imagem adicionada"
                    : "imagens adicionadas"}
                </Badge>
                )}
            </div>
            <ScrollArea className="h-[240px] rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
                <AnimatePresence>
                    {previews.map((preview, index) => (
                    <motion.div
                        key={preview}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="relative group"
                    >
                        <div
                        className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800 cursor-pointer transition-transform hover:scale-[1.02]"
                        onClick={() => setPreviewImage(preview)}
                        >
                        <img
                            src={preview || "/placeholder.svg"}
                            alt={`Preview ${index}`}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 dark:group-hover:bg-white/10 transition-colors duration-300" />
                        </div>
                        <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                                onClick={(e) => {
                                e.stopPropagation();
                                handleRemove(preview);
                                }}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                            </TooltipTrigger>
                            <TooltipContent>Remover imagem</TooltipContent>
                        </Tooltip>
                        </TooltipProvider>
                        {index === 0 && (
                        <Badge className="absolute bottom-2 left-2 bg-black text-white dark:bg-white dark:text-black border-0">
                            Principal
                        </Badge>
                        )}
                    </motion.div>
                    ))}
                </AnimatePresence>
                </div>
            </ScrollArea>
            </motion.div>
        )}

        {/* Image Preview Dialog */}
        <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
            <DialogContent className="bg-transparent border-0 shadow-none max-w-4xl">
            <div className="relative">
                <Button
                variant="ghost"
                size="icon"
                onClick={() => setPreviewImage(null)}
                className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full z-10"
                >
                <X className="h-5 w-5" />
                </Button>
                {previewImage && (
                <img
                    src={previewImage || "/placeholder.svg"}
                    alt="Visualização da imagem"
                    className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                />
                )}
            </div>
            </DialogContent>
        </Dialog>
        </div>
    );
}
