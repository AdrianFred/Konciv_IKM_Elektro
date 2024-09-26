import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import toast, { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  manifest: "/manifest.json",
  title: "KONCIV Login ",
  description: "IKM Elektro app by Konciv",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <div className="flex-grow flex flex-col bg-[#869ea5]">{children}</div>
        {<Toaster toastOptions={{ duration: 4000 }} />}
      </body>
    </html>
  );
}
