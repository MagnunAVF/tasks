import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const runtime = 'experimental-edge';

export default function Home() {
  return (
    <main className="flex-grow p-4">
      <h2>Main Content</h2>
    </main>
  )
}
