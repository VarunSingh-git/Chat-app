import "./globals.css";
import { AuthProvider } from "@/context/AuthProvider"
import { SocketProvider } from "@/context/SocketProvider"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
      <AuthProvider>
        <SocketProvider>
          {children}
        </SocketProvider>
      </AuthProvider>
      </body>
    </html>
  );
}
