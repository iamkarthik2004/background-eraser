import React, { useState } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ImageDisplay } from './components/ImageDisplay';
import { editImageWithPrompt } from './services/geminiService';
import { MagicWandIcon } from './components/icons';

const App: React.FC = () => {
    const [originalImage, setOriginalImage] = useState<File | null>(null);
    const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
    const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null);
    const [prompt, setPrompt] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleImageUpload = (file: File) => {
        setOriginalImage(file);
        setOriginalImageUrl(URL.createObjectURL(file));
        setEditedImageUrl(null);
        setError(null);
    };

    const handleGeneration = async () => {
        if (!originalImage || !prompt.trim()) {
            setError("Please upload an image and provide a non-empty prompt.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setEditedImageUrl(null);

        try {
            const resultUrl = await editImageWithPrompt(originalImage, prompt);
            setEditedImageUrl(resultUrl);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPrompt(e.target.value);
    };

    return (
        <div className="bg-slate-900 text-slate-100 min-h-screen font-sans">
            <header className="py-6 border-b border-slate-700">
                <div className="container mx-auto px-4 md:px-8 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-500">
                        Gemini Image Editor
                    </h1>
                    <p className="text-slate-400 mt-2">Clean up product photos and more with simple text instructions.</p>
                </div>
            </header>
            <main className="container mx-auto p-4 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 bg-slate-800 rounded-xl shadow-lg p-6 flex flex-col gap-6 h-fit sticky top-8">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-slate-300">1. Upload Image</label>
                            <ImageUploader onImageUpload={handleImageUpload} imageUrl={originalImageUrl} />
                        </div>

                        <div className="flex flex-col gap-2">
                             <label htmlFor="prompt-input" className="text-sm font-medium text-slate-300">2. Describe Your Edit</label>
                            <textarea
                                id="prompt-input"
                                value={prompt}
                                onChange={handlePromptChange}
                                placeholder="e.g., remove the background and make it white"
                                className="w-full h-28 p-3 bg-slate-700 border border-slate-600 rounded-md placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 resize-none disabled:opacity-50"
                                disabled={!originalImage || isLoading}
                            />
                        </div>
                        
                        <button
                            onClick={handleGeneration}
                            disabled={isLoading || !originalImage || !prompt.trim()}
                            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition duration-200 shadow-md"
                        >
                            <MagicWandIcon className="w-5 h-5" />
                            <span>{isLoading ? 'Generating...' : 'Generate'}</span>
                        </button>

                        {error && (
                            <div className="bg-red-900/50 text-red-300 border border-red-700 rounded-md p-3 text-sm">
                                <p className="font-semibold">Error</p>
                                <p>{error}</p>
                            </div>
                        )}
                    </div>
                    
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <ImageDisplay title="Original" imageUrl={originalImageUrl} />
                        <ImageDisplay
                            title="Edited"
                            imageUrl={editedImageUrl}
                            isLoading={isLoading}
                            placeholderText="Your edited image will appear here."
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;
