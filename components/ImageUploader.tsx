import React, { useCallback, useRef, useState } from 'react';
import { UploadIcon } from './icons';

interface ImageUploaderProps {
    onImageUpload: (file: File) => void;
    imageUrl: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, imageUrl }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileSelect = (files: FileList | null) => {
        if (files && files[0]) {
            if (files[0].type.startsWith('image/')) {
                onImageUpload(files[0]);
            } else {
                alert("Please select a valid image file.");
            }
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        handleFileSelect(e.dataTransfer.files);
    }, [onImageUpload]);

    const uploaderClasses = `relative border-2 border-dashed border-slate-600 rounded-lg p-4 text-center cursor-pointer transition-colors duration-200 group hover:border-indigo-500 hover:bg-slate-700/50 ${isDragging ? 'border-indigo-500 bg-slate-700/50' : ''}`;

    return (
        <div>
            <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleFileSelect(e.target.files)}
                accept="image/*"
                className="hidden"
            />
            <div
                onClick={handleClick}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={uploaderClasses}
            >
                {imageUrl ? (
                    <img src={imageUrl} alt="Uploaded preview" className="max-h-40 mx-auto rounded-md object-contain" />
                ) : (
                    <div className="flex flex-col items-center justify-center h-32 text-slate-400">
                        <UploadIcon className="w-8 h-8 mb-2 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                        <p className="font-semibold">Click to upload</p>
                        <p className="text-sm">or drag and drop an image</p>
                    </div>
                )}
            </div>
        </div>
    );
};
