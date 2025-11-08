"use client"

import { useState, useEffect } from "react"
import PostCard from "@/components/PostCard"

export default function HomePage() {
  const [feedType, setFeedType] = useState<"all" | "following">("all")
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [feedType])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/posts?type=${feedType}`)
      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts)
      }
    } catch (error) {
      console.error("Error fetching posts:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="border-b border-border p-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <h1 className="text-xl font-bold">首頁</h1>
      </div>
      
      <div className="border-b border-border sticky top-[61px] bg-background z-10">
        <div className="flex">
          <button
            onClick={() => setFeedType("all")}
            className={`flex-1 py-4 hover:bg-hover transition-colors ${
              feedType === "all"
                ? "border-b-2 border-primary font-semibold"
                : "text-secondary"
            }`}
          >
            全部
          </button>
          <button
            onClick={() => setFeedType("following")}
            className={`flex-1 py-4 hover:bg-hover transition-colors ${
              feedType === "following"
                ? "border-b-2 border-primary font-semibold"
                : "text-secondary"
            }`}
          >
            追蹤中
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-secondary">
          <p>載入中...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="p-8 text-center text-secondary">
          <p>{feedType === "following" ? "還沒有追蹤任何人" : "還沒有貼文"}</p>
        </div>
      ) : (
        <div>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onUpdate={fetchPosts} />
          ))}
        </div>
      )}
    </div>
  )
}

