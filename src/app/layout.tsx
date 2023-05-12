export const metadata = {
  title: 'ChatNext',
  description: '一个简便的ChatGPT工具',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
