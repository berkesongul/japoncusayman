"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";

interface ProductImageZoomProps {
    imageUrl: string;
    altText: string;
}

export function ProductImageZoom({ imageUrl, altText }: ProductImageZoomProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Escape key listeners for closing the modal
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false);
        };
        if (isOpen) {
            document.body.style.overflow = "hidden";
            window.addEventListener("keydown", handleKeyDown);
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    return (
        <>
            {/* The standard view in the layout */}
            <div 
                className="relative w-full h-full cursor-zoom-in group" 
                onClick={() => setIsOpen(true)}
            >
                <Image
                    src={imageUrl}
                    alt={altText}
                    fill
                    className="object-contain p-8 group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                />
                
                {/* Visual cue for zooming */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500 rounded-2xl flex items-center justify-center">
                    <div className="bg-white/90 backdrop-blur-sm p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-90 group-hover:scale-100 shadow-xl">
                        <ZoomIn className="w-6 h-6 text-slate-800" />
                    </div>
                </div>
            </div>

            {/* The Lightbox Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-10"
                        onClick={() => setIsOpen(false)}
                    >
                        {/* Close button */}
                        <button 
                            className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 p-2 rounded-full text-white transition-colors z-[110] backdrop-blur-lg"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsOpen(false);
                            }}
                        >
                            <X className="w-8 h-8" />
                        </button>

                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative w-full h-full max-w-5xl max-h-[85vh] bg-transparent"
                            onClick={(e) => e.stopPropagation()} // Prevent clicks on the image from closing
                        >
                            <Image
                                src={imageUrl}
                                alt={altText}
                                fill
                                className="object-contain select-none"
                                sizes="100vw"
                                priority
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
