"use client"; // Se sei in app/ directory (Next.js 13+)

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import ErrorPopup from "@/components/ui/error_popup"; // o il tuo path

interface ErrorContextType {
    showError: (message: string, title?: string) => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const useError = () => {
    const context = useContext(ErrorContext);
    if (!context) throw new Error("useError deve essere usato dentro <ErrorProvider>");
    return context;
};

export const ErrorProvider = ({ children }: { children: ReactNode }) => {
    const [error, setError] = useState<string | null>(null);
    const [title, setTitle] = useState<string>("");

    const showError = (message: string, customTitle = "Errore") => {
        setTitle(customTitle);
        setError(message);
    };

    const closeError = () => {
        setError(null);
        setTitle("");
    };

    useEffect(() => {
        if (!error) return;

        const timeout = setTimeout(() => {
        closeError();
        }, 2000); // chiude dopo 2 secondi

        return () => clearTimeout(timeout); // pulizia se cambia prima
    }, [error]);

    return (
        <ErrorContext.Provider value={{ showError }}>
            {children}
            {error && (
                <ErrorPopup
                    title={title}
                    content={error}
                    button_text="Chiudi"
                    onClose={closeError}
                />
            )}
        </ErrorContext.Provider>
    );
};
