"use client"

import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"

export default function RegisterPage() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // 如果已經有 username，導向首頁
    if (session?.user?.username) {
      router.push("/home")
    }
  }, [session, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // 驗證 username 格式
    if (username.length < 3) {
      setError("使用者名稱至少需要 3 個字元")
      setLoading(false)
      return
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError("使用者名稱只能包含字母、數字和底線")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/register-username", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "註冊失敗")
        setLoading(false)
        return
      }

      // 更新 session
      await update()
      
      // 導向首頁
      router.push("/home")
    } catch (error) {
      console.error("Registration error:", error)
      setError("註冊時發生錯誤，請稍後再試")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">設定您的使用者名稱</h1>
          <p className="text-secondary">選擇一個獨特的使用者名稱</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-2">
              使用者名稱
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary">
                @
              </span>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-transparent border border-border rounded-lg py-3 pl-8 pr-4 focus:outline-none focus:border-primary"
                placeholder="username"
                required
                disabled={loading}
              />
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-500">{error}</p>
            )}
            <p className="mt-2 text-xs text-secondary">
              至少 3 個字元，只能包含字母、數字和底線
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || !username}
            className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3 px-6 rounded-full transition-colors disabled:opacity-50"
          >
            {loading ? "註冊中..." : "繼續"}
          </button>
        </form>
      </div>
    </div>
  )
}

