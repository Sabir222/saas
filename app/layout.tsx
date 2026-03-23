import "./globals.css"
import "@/lib/logger"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
