"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

interface SidebarProps {
  onPostClick: () => void
}

export default function Sidebar({ onPostClick }: SidebarProps) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const isActive = (path: string) => {
    return pathname === path
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" })
  }

  return (
    <div className="w-[275px] h-screen sticky top-0 flex flex-col border-r border-border">
      <div className="flex-1 px-4 py-2">
        {/* Logo */}
        <div className="w-12 h-12 flex items-center justify-center mb-4">
          <Link href="/home" className="text-2xl font-bold hover:bg-hover rounded-full p-2 transition-colors">
            <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          <Link
            href="/home"
            className={`flex items-center gap-4 px-4 py-3 rounded-full transition-colors ${
              isActive("/home")
                ? "font-bold"
                : "hover:bg-hover"
            }`}
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
              <path d="M12 2.5l-9 8.1v11.4h6v-7h6v7h6V10.6l-9-8.1z" />
            </svg>
            <span className="text-xl">首頁</span>
          </Link>

          <Link
            href={`/profile/${session?.user?.username}`}
            className={`flex items-center gap-4 px-4 py-3 rounded-full transition-colors ${
              pathname?.startsWith("/profile")
                ? "font-bold"
                : "hover:bg-hover"
            }`}
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
            <span className="text-xl">個人資料</span>
          </Link>
        </nav>

        {/* Post Button */}
        <button
          onClick={onPostClick}
          className="w-full mt-4 bg-primary hover:bg-primary-hover text-white font-semibold py-3 px-6 rounded-full transition-colors"
        >
          發文
        </button>
      </div>

      {/* User Info */}
      <div className="relative px-4 py-3">
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="w-full flex items-center gap-3 p-3 rounded-full hover:bg-hover transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
            {session?.user?.image ? (
              <img src={session.user.image} alt="User" className="w-full h-full object-cover" />
            ) : (
              <span className="text-lg font-semibold">
                {session?.user?.name?.charAt(0) || "?"}
              </span>
            )}
          </div>
          <div className="flex-1 text-left">
            <div className="font-semibold">{session?.user?.name}</div>
            <div className="text-secondary text-sm">@{session?.user?.username}</div>
          </div>
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
            <path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
          </svg>
        </button>

        {/* User Menu */}
        {showUserMenu && (
          <div className="absolute bottom-full left-4 right-4 mb-2 bg-background border border-border rounded-xl shadow-lg overflow-hidden">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 text-left hover:bg-hover transition-colors font-semibold"
            >
              登出 @{session?.user?.username}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

