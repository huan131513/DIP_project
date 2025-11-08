"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Sidebar from "@/components/Sidebar"
import PostModal from "@/components/PostModal"

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [showPostModal, setShowPostModal] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (status === "authenticated" && !session?.user?.username) {
      router.push("/register")
    }
  }, [status, session, router])

  const handlePostCreated = () => {
    setRefreshKey((prev) => prev + 1)
  }

  if (status === "loading" || !session?.user?.username) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">載入中...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar onPostClick={() => setShowPostModal(true)} />
      <main className="flex-1 border-r border-border max-w-[600px]" key={refreshKey}>
        {children}
      </main>
      <div className="flex-1"></div>
      
      <PostModal
        isOpen={showPostModal}
        onClose={() => setShowPostModal(false)}
        onPostCreated={handlePostCreated}
      />
    </div>
  )
}

