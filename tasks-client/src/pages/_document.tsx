import { Html, Head, Main, NextScript } from 'next/document'

import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="flex flex-col min-h-screen bg-white text-green-500">
        <Header />

        <main className="container mx-auto p-4">
          <Main />

          <NextScript />
        </main>

        <Footer />
      </body>
    </Html>
  )
}
