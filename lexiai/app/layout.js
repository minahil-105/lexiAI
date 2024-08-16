import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from './providers';
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Lexi AI",
  description: "Flashcards made easy with Lexi AI",
};

export default function RootLayout({ children }) {
  return (
    <Providers>
      <html lang="en">
        <body className={`${inter.className}`}>
          <header className="bg-gray-800 text-white">
            <Navbar />
          </header>
          {children}
        </body>
      </html>
    </Providers>
  );
}
