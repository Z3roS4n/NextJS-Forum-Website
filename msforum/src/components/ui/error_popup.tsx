"use client"

import { useEffect, useState } from "react";

interface Params {
    title: string;
    content: string;
    button_text: string;
    onClose: () => void;
}

const ErrorPopup = ({ title = "Client Error", content = "There was an error, retry.", button_text = "Close", onClose }: Params) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Mostra il popup con animazione al mount
        const timer = setTimeout(() => setVisible(true), 10);
        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        // Avvia animazione di chiusura
        setVisible(false);
        // Dopo la fine dell'animazione (300ms), chiudi
        setTimeout(() => onClose(), 300);
    };

    const handleOverlayClick = () => {
        handleClose();
    };

    const handleContentClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30" onClick={handleOverlayClick}>
            <div className={`
                    bg-white rounded-2xl p-6 shadow-lg max-w-sm w-full mx-4 transform transition-all duration-300 ease-out
                    ${visible ? "opacity-100 scale-100" : "opacity-0 scale-95"}
                `} onClick={handleContentClick}>

                <h2 className="text-xl font-bold mb-2">{title}</h2>
                <p className="mb-4">{content}</p>
                <button className="btn-danger" onClick={handleClose}>
                    {button_text}
                </button>
            </div>
        </div>
    );
}

export default ErrorPopup;