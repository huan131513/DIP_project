"use client"

import Link from "next/link"
import { useState } from "react"
import { useSession } from "next-auth/react"
import { parseText } from "@/lib/textUtils"

interface Post {
  id: string
  content: string
  createdAt: string
  author: {
    id: string
    name: string | null
    username: string | null
    image: string | null
  }
  likes?: any[]
  reposts?: any[]
  _count: {
    likes: number
    reposts: number
    comments: number
  }
}

interface PostCardProps {
  post: Post
  onUpdate?: () => void
}

export default function PostCard({ post, onUpdate }: PostCardProps) {
  const { data: session } = useSession()
  const [isLiked, setIsLiked] = useState(
    post.likes && post.likes.length > 0
  )
  const [isReposted, setIsReposted] = useState(
    post.reposts && post.reposts.length > 0
  )
  const [likeCount, setLikeCount] = useState(post._count.likes)
  const [repostCount, setRepostCount] = useState(post._count.reposts)
  const [showDeleteMenu, setShowDeleteMenu] = useState(false)

  const isOwnPost = session?.user?.id === post.author.id

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return `${diffInSeconds}秒`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}分鐘`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}小時`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}天`

    const month = date.getMonth() + 1
    const day = date.getDate()
    if (now.getFullYear() === date.getFullYear()) {
      return `${month}月${day}日`
    }
    return `${date.getFullYear()}年${month}月${day}日`
  }

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/posts/${post.id}/like`, {
        method: "POST",
      })

      if (response.ok) {
        setIsLiked(!isLiked)
        setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1))
      }
    } catch (error) {
      console.error("Error liking post:", error)
    }
  }

  const handleRepost = async () => {
    try {
      const response = await fetch(`/api/posts/${post.id}/repost`, {
        method: "POST",
      })

      if (response.ok) {
        setIsReposted(!isReposted)
        setRepostCount((prev) => (isReposted ? prev - 1 : prev + 1))
      }
    } catch (error) {
      console.error("Error reposting:", error)
    }
  }

  const handleDelete = async () => {
    if (!confirm("確定要刪除這篇貼文嗎？")) return

    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        onUpdate?.()
      }
    } catch (error) {
      console.error("Error deleting post:", error)
    }
  }

  const renderContent = () => {
    const parts = parseText(post.content)
    return parts.map((part, index) => {
      switch (part.type) {
        case "url":
          return (
            <a
              key={index}
              href={part.content}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {part.content}
            </a>
          )
        case "hashtag":
          return (
            <Link
              key={index}
              href={`/search?q=${encodeURIComponent(part.content)}`}
              className="text-primary hover:underline"
            >
              {part.content}
            </Link>
          )
        case "mention":
          const username = part.content.slice(1)
          return (
            <Link
              key={index}
              href={`/profile/${username}`}
              className="text-primary hover:underline"
            >
              {part.content}
            </Link>
          )
        default:
          return <span key={index}>{part.content}</span>
      }
    })
  }

  return (
    <div className="border-b border-border p-4 hover:bg-hover/50 transition-colors">
      <div className="flex gap-3">
        <Link href={`/profile/${post.author.username}`}>
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden flex-shrink-0">
            {post.author.image ? (
              <img
                src={post.author.image}
                alt={post.author.name || "User"}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-lg font-semibold">
                {post.author.name?.charAt(0) || "?"}
              </span>
            )}
          </div>
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Link
              href={`/profile/${post.author.username}`}
              className="font-semibold hover:underline"
            >
              {post.author.name}
            </Link>
            <Link
              href={`/profile/${post.author.username}`}
              className="text-secondary text-sm"
            >
              @{post.author.username}
            </Link>
            <span className="text-secondary text-sm">·</span>
            <span className="text-secondary text-sm">
              {formatTime(post.createdAt)}
            </span>
            
            {isOwnPost && (
              <div className="ml-auto relative">
                <button
                  onClick={() => setShowDeleteMenu(!showDeleteMenu)}
                  className="text-secondary hover:text-foreground"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                    <path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
                  </svg>
                </button>
                
                {showDeleteMenu && (
                  <div className="absolute right-0 top-full mt-1 bg-background border border-border rounded-lg shadow-lg overflow-hidden z-10">
                    <button
                      onClick={handleDelete}
                      className="block w-full px-4 py-2 text-left text-red-500 hover:bg-hover whitespace-nowrap"
                    >
                      刪除
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <Link href={`/posts/${post.id}`}>
            <p className="mb-3 whitespace-pre-wrap break-words">
              {renderContent()}
            </p>
          </Link>

          <div className="flex items-center gap-6 text-secondary">
            <Link
              href={`/posts/${post.id}`}
              className="flex items-center gap-2 hover:text-primary transition-colors group"
            >
              <div className="p-2 rounded-full group-hover:bg-primary/10">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M12 22C6.5 22 2 17.5 2 12S6.5 2 12 2s10 4.5 10 10-4.5 10-10 10zm0-18c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8z" />
                  <path d="M13 7h-2v5h2V7zm0 6h-2v2h2v-2z" />
                </svg>
              </div>
              <span className="text-sm">{post._count.comments}</span>
            </Link>

            <button
              onClick={handleRepost}
              className={`flex items-center gap-2 hover:text-green-500 transition-colors group ${
                isReposted ? "text-green-500" : ""
              }`}
            >
              <div className="p-2 rounded-full group-hover:bg-green-500/10">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M4 5h13v2H4V5zm0 12h13v2H4v-2zm15-10l5 5-5 5V7z" />
                </svg>
              </div>
              <span className="text-sm">{repostCount}</span>
            </button>

            <button
              onClick={handleLike}
              className={`flex items-center gap-2 hover:text-red-500 transition-colors group ${
                isLiked ? "text-red-500" : ""
              }`}
            >
              <div className="p-2 rounded-full group-hover:bg-red-500/10">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  {isLiked ? (
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  ) : (
                    <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z" />
                  )}
                </svg>
              </div>
              <span className="text-sm">{likeCount}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

