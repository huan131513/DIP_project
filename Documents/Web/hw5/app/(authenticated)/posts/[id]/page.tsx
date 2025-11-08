"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import PostCard from "@/components/PostCard"
import { parseText } from "@/lib/textUtils"
import Link from "next/link"

export default function PostDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { data: session } = useSession()
  const [post, setPost] = useState<any>(null)
  const [comments, setComments] = useState<any[]>([])
  const [commentContent, setCommentContent] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchPost()
  }, [params.id])

  const fetchPost = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/posts/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setPost(data.post)
        setComments(data.post.comments || [])
      } else {
        router.push("/home")
      }
    } catch (error) {
      console.error("Error fetching post:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentContent.trim()) return

    setSubmitting(true)
    try {
      const response = await fetch(`/api/posts/${params.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: commentContent }),
      })

      if (response.ok) {
        setCommentContent("")
        fetchPost()
      }
    } catch (error) {
      console.error("Error submitting comment:", error)
    } finally {
      setSubmitting(false)
    }
  }

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

  const renderContent = (content: string) => {
    const parts = parseText(content)
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

  if (loading) {
    return (
      <div className="p-8 text-center text-secondary">
        <p>載入中...</p>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="p-8 text-center text-secondary">
        <p>貼文不存在</p>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="border-b border-border p-4 flex items-center gap-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <button onClick={() => router.back()} className="hover:bg-hover p-2 rounded-full">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
        </button>
        <h1 className="text-xl font-bold">貼文</h1>
      </div>

      {/* Post */}
      <PostCard post={post} onUpdate={() => router.push("/home")} />

      {/* Comment Form */}
      <div className="border-b border-border p-4">
        <form onSubmit={handleSubmitComment} className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden flex-shrink-0">
            {session?.user?.image ? (
              <img src={session.user.image} alt="User" className="w-full h-full object-cover" />
            ) : (
              <span className="text-lg font-semibold">
                {session?.user?.name?.charAt(0) || "?"}
              </span>
            )}
          </div>
          <div className="flex-1">
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="發表你的留言"
              className="w-full bg-transparent border border-border rounded-lg p-3 outline-none focus:border-primary resize-none"
              rows={3}
              disabled={submitting}
            />
            <div className="mt-2 flex justify-end">
              <button
                type="submit"
                disabled={submitting || !commentContent.trim()}
                className="bg-primary hover:bg-primary-hover text-white font-semibold py-2 px-6 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "留言中..." : "留言"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Comments */}
      <div>
        {comments.length === 0 ? (
          <div className="p-8 text-center text-secondary">
            <p>還沒有留言</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="border-b border-border p-4 hover:bg-hover/50 transition-colors">
              <div className="flex gap-3">
                <Link href={`/profile/${comment.author.username}`}>
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden flex-shrink-0">
                    {comment.author.image ? (
                      <img
                        src={comment.author.image}
                        alt={comment.author.name || "User"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-semibold">
                        {comment.author.name?.charAt(0) || "?"}
                      </span>
                    )}
                  </div>
                </Link>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Link
                      href={`/profile/${comment.author.username}`}
                      className="font-semibold hover:underline"
                    >
                      {comment.author.name}
                    </Link>
                    <Link
                      href={`/profile/${comment.author.username}`}
                      className="text-secondary text-sm"
                    >
                      @{comment.author.username}
                    </Link>
                    <span className="text-secondary text-sm">·</span>
                    <span className="text-secondary text-sm">
                      {formatTime(comment.createdAt)}
                    </span>
                  </div>

                  <p className="whitespace-pre-wrap break-words">
                    {renderContent(comment.content)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

