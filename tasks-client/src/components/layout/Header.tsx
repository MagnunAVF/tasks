import Link from "next/link"

function Header() {
  return (
    <header className="w-full p-4 bg-blue-500 text-white">
      <Link href="/">
        <h1 className="text-lg"><strong>Tasks</strong></h1>
      </Link>
    </header>
  )
}

export default Header
