import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from './providers';
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Lexi AI",
  description: "Flashcards made easy with Lexi AI",
};

export default function RootLayout({ children }) {
  return (
    <Providers>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className}`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <header className="bg-gray-800 text-white">
              <Navbar />
            </header>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </Providers>
  );
}
