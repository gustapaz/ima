import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "ÍMÃ — Ideias encontram sua outra metade.",
  description: "Afinidades e duplas em um universo inteiramente sintético.",
  metadataBase: new URL("https://ima-gustapaz.starrylinen.chatgpt.site"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "ÍMÃ",
    description: "Afinidades e duplas em um universo inteiramente sintético.",
    type: "website",
    locale: "pt_BR",
  },
  icons: { icon: "/favicon.svg" },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
