// src/components/ui/file-upload.tsx
import * as React from 'react';
import { useDropzone, type DropzoneOptions } from 'react-dropzone';
import { type FileWithPath } from 'react-dropzone';
import { CrossIcon } from 'lucide-react';
import { type VariantProps } from 'class-variance-authority';

import { cn } from '~/lib/utils';
import { Button } from '~/components/ui/button';
import { ScrollArea } from '~/components/ui/scroll-area';

interface FileUploadProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'onChange'> {
    value?: string[];
    onChange?: (files: File[]) => void;
    onRemove?: (value: string) => void;
    maxFiles?: number;
    maxSize?: number;
    accept?: DropzoneOptions['accept'];
}
export function FileUpload({
    value = [],
    onChange,
    onRemove,
    maxFiles = 1,
    maxSize = 1024 * 1024 * 2, // 2MB
    accept = {
        'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    className,
    ...props
    }: FileUploadProps) {
    const [files, setFiles] = React.useState<FileWithPath[]>([]);
    const [previews, setPreviews] = React.useState<string[]>(value);

    React.useEffect(() => {
        setPreviews(value);
    }, [value]);

    const onDrop = React.useCallback(
        (acceptedFiles: FileWithPath[], rejectedFiles: any) => {
        if (rejectedFiles.length > 0) {
            // Handle rejected files
            console.error('Alguns arquivos foram rejeitados:', rejectedFiles);
            return;
        }

        const newFiles = [...files, ...acceptedFiles].slice(0, maxFiles);
        setFiles(newFiles);
        
        // Generate previews
        const newPreviews = newFiles.map(file => URL.createObjectURL(file));
        setPreviews(newPreviews);
        
        if (onChange) {
            onChange(newFiles);
        }
        },
        [files, maxFiles, onChange]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept,
        maxSize,
        maxFiles
    });

    const handleRemove = (preview: string) => {
        if (onRemove) {
        onRemove(preview);
        }
        setPreviews(previews.filter(p => p !== preview));
        setFiles(files.filter(f => URL.createObjectURL(f) !== preview));
    };

    return (
        <div className={cn('space-y-4', className)} {...props}>
        <div
            {...getRootProps()}
            className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
            isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/30'
            )}
        >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
                >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
                </svg>
            </div>
            <p className="text-sm font-medium">
                {isDragActive ? 'Solte os arquivos aqui' : 'Arraste arquivos ou clique para selecionar'}
            </p>
            <p className="text-xs text-muted-foreground">
                Formatos suportados: JPG, PNG, WEBP (máx. {maxSize / 1024 / 1024}MB)
            </p>
            {maxFiles > 1 && (
                <p className="text-xs text-muted-foreground">
                Máximo de {maxFiles} arquivos
                </p>
            )}
            </div>
        </div>

        {previews.length > 0 && (
            <ScrollArea className="h-[200px] rounded-md border">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
                {previews.map((preview, index) => (
                <div key={index} className="relative group">
                    <img
                    src={preview}
                    alt={`Preview ${index}`}
                    className="h-32 w-full object-cover rounded-md"
                    />
                    <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRemove(preview)}
                    >
                    <CrossIcon className="h-4 w-4" />
                    </Button>
                </div>
                ))}
            </div>
            </ScrollArea>
        )}
        </div>
    );
}