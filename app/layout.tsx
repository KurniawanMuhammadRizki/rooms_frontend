import type {Metadata} from "next";
import "./globals.css";
import Navbar from "@/components/navbar";
import ReactQueryProvider from "@/utils/providers/ReactQueryProvider";
import {persistQueryClient} from "@tanstack/react-query-persist-client";
import {createSyncStoragePersister} from "@tanstack/query-sync-storage-persister";
import {SessionProvider} from "next-auth/react";
import {QueryClient} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import Footer from "@/components/Footer";
import {SearchProvider} from "@/context/useSearchContext";

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <ReactQueryProvider>
            <SearchProvider>
                <body className={"max-w-[1440px]]"}>
                <div className={""}>
                    <div>
                        <SessionProvider>
                            <Navbar/>
                            {children}
                            <Footer/>
                        </SessionProvider>
                    </div>
                </div>
                <ReactQueryDevtools initialIsOpen={false}/>
                </body>
            </SearchProvider>
        </ReactQueryProvider>

        </html>
    );
}
