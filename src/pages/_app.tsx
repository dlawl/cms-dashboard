import "@/styles/globals.css";
import { Inter, Noto_Sans_KR } from "next/font/google";
import dynamic from "next/dynamic";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const notoSansKR = Noto_Sans_KR({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-noto" });

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
const Toaster = dynamic(() => import("react-hot-toast").then(mod => mod.Toaster), { ssr: false });

const queryCliet = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryCliet}>
      <main className={`${inter.className} ${notoSansKR.className}`}>
        <Component {...pageProps} />
      </main>
      <Toaster />
    </QueryClientProvider>
  );
}
