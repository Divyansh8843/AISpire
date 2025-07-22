import { dark, shadesOfPurple } from "@clerk/themes";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/ScrollToTop";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import AIChatbot from "@/components/AIChatbot";
// import ClientToaster from "@/components/ClientToaster";

const inter = Inter({ subsets: ["latin"] });
export const metadata = {
  title: "AIspire",
  description: "Inspiring careers through AI.",
  icons: {
    icon: "./favicon.ico",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} overflow-x-hidden`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <SmoothScrollProvider>
              <Header />
              <main className="min-h-screen">{children}</main>
              <Toaster richColors />
              {/* <ClientToaster /> */}
              <Footer />
              <ScrollToTop />
              <AIChatbot />
            </SmoothScrollProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
