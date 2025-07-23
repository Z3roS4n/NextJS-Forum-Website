'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClerkProvider } from '@clerk/nextjs';
import { ErrorProvider } from './context/ErrorContext';
import { useState } from 'react';

const Providers = ({ children }: { children: React.ReactNode }) => {
    // Ensure a stable QueryClient instance across renders
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <ClerkProvider>
                <ErrorProvider>
                    {children}
                </ErrorProvider>
            </ClerkProvider>
        </QueryClientProvider>
    );
}

export default Providers;