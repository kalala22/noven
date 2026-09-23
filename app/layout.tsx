import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Simulateur EcoFlow by NOVEN",
  description:
    "Trouvez la station d’énergie EcoFlow adaptée à vos appareils et à l’autonomie souhaitée. Simulateur NOVEN, Kinshasa.",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "light",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
