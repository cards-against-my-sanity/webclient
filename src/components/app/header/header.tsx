import Image from "next/image"
import ProfileDropdown from "./profile-dropdown"
import Link from "next/link"

export default function AppHeader() {
  return (
    <header className="flex justify-between py-4">
      <Link href='/'>
        <Image src="/logo.svg" width={80} height={80} alt='Cards Against my Sanity' />
      </Link>
      <ProfileDropdown />
    </header>
  )
}