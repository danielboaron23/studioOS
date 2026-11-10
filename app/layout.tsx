// GENERATED WRAPPER — Spring canvas auth exemption for the ROOT layout.
// The original layout is preserved verbatim below and runs UNCHANGED unless the
// process-local env marker SPRING_CANVAS_EXEMPT is set (throwaway canvas dev server
// ONLY, never committed). Under that marker we return the styled <html> shell WITHOUT
// the app's auth check so the reserved /__spring_canvas__ route renders.
/* eslint-disable */
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar";
import { Header } from "@/components/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Studio OS",
  description: "Studio OS Dashboard",
};

function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <Header />
            <div className="flex-1 p-4 md:p-6 max-w-screen-xl mx-auto w-full">{children}</div>
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}

const __SpringCanvasOriginalRootLayout = RootLayout;

// --- Spring canvas exemption wrapper (appended) ---
const __springCanvasThemeScript =
  "(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark');}}catch(e){}})();";

// Declared async so an original async layout (the common App-Router shape, which awaits
// headers()) is awaited correctly on the non-exempt path. Next supports an async layout.
export default async function RootLayout(props) {
  if (process.env.SPRING_CANVAS_EXEMPT) {
    // Env-marker short-circuit: styled shell, NO auth check. Re-emit font vars + theme.
    return (
      <html lang="en" suppressHydrationWarning className="__variable_geist __variable_geist_mono h-full antialiased">
        <head>
          <script dangerouslySetInnerHTML={{ __html: __springCanvasThemeScript }} />
        </head>
        <body className="h-full bg-background text-foreground">{props && props.children}</body>
      </html>
    );
  }
  // Non-exempt path: the app's original layout, unchanged (awaited in case it is async).
  return await __SpringCanvasOriginalRootLayout(props);
}
