import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/navbar";
import { ClerkProvider } from "@clerk/nextjs";
import Footer from "@/components/footer";
import { ErrorProvider } from "./context/ErrorContext";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"]
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"]
});

export const metadata: Metadata = {
    title: "msforum",
    description: "A simple forum with basic function, made in NextJS."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <ErrorProvider>
            <ClerkProvider>
                <html lang="en">
                    <head>
                        <script src="https://kit.fontawesome.com/e02d7efcb9.js" crossOrigin="anonymous"></script>
                    </head>
                    <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                        <NavBar></NavBar>
                        {children}
                        <Footer></Footer>
                    </body>
                </html>
            </ClerkProvider>
        </ErrorProvider>
    );
}
