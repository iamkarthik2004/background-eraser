import React from 'react';
import { Loader } from './Loader';
import { DownloadIcon, ImageIcon } from './icons';

interface ImageDisplayProps {
    title: string;
    imageUrl: string | null;
    isLoading?: boolean;
    placeholderText?: string;
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ title, imageUrl, isLoading = false, placeholderText = 'Upload an image to begin.' }) => {
    
    const DownloadButton = ({ href }: { href: string }) => (
        <a 
          href={href} 
          download={`${title.toLowerCase().replace(' ', '-')}-image.png`} 
          className="absolute bottom-4 right-4 bg-slate-900/70 text-white py-2 px-4 rounded-lg hover:bg-slate-900 transition-all duration-200 flex items-center gap-2 backdrop-blur-sm"
          onClick={(e) => e.stopPropagation()}
        >
            <DownloadIcon className="w-5 h-5" />
            <span>Download</span>
        </a>
    );
    
    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                    <Loader />
                    <p className="mt-4 text-lg">Generating your image...</p>
                    <p className="text-sm text-slate-500">This can take a moment.</p>
                </div>
            );
        }

        if (!imageUrl) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-slate-500">
                    <ImageIcon className="w-16 h-16 mb-4" />
                    <p className="font-medium text-center">{placeholderText}</p>
                </div>
            );
        }

        return (
            <div className="relative w-full h-full group">
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-contain"
                />
                 {title === 'Edited' && <DownloadButton href={imageUrl} />}
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold text-slate-300 text-center">{title}</h2>
            <div className="aspect-square bg-slate-800/50 rounded-xl w-full flex items-center justify-center p-2 border border-slate-700">
               {renderContent()}
            </div>
        </div>
    );
};
