"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { calculateCharCount } from "@/lib/textUtils"

interface PostModalProps {
  isOpen: boolean
  onClose: () => void
  onPostCreated?: () => void
}

export default function PostModal({ isOpen, onClose, onPostCreated }: PostModalProps) {
  const { data: session } = useSession()
  const [content, setContent] = useState("")
  const [charCount, setCharCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [showDiscardMenu, setShowDiscardMenu] = useState(false)
  const [showDrafts, setShowDrafts] = useState(false)
  const [drafts, setDrafts] = useState<any[]>([])

  const MAX_CHARS = 280

  useEffect(() => {
    if (isOpen) {
      setContent("")
      setCharCount(0)
      setShowDiscardMenu(false)
      setShowDrafts(false)
    }
  }, [isOpen])

  useEffect(() => {
    setCharCount(calculateCharCount(content))
  }, [content])

  useEffect(() => {
    if (showDrafts) {
      fetchDrafts()
    }
  }, [showDrafts])

  const fetchDrafts = async () => {
    try {
      const response = await fetch("/api/posts/drafts")
      if (response.ok) {
        const data = await response.json()
        setDrafts(data.drafts)
      }
    } catch (error) {
      console.error("Error fetching drafts:", error)
    }
  }

  const handlePost = async () => {
    if (charCount > MAX_CHARS || !content.trim()) return

    setLoading(true)
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      })

      if (response.ok) {
        setContent("")
        onPostCreated?.()
        onClose()
      }
    } catch (error) {
      console.error("Error creating post:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (content.trim()) {
      setShowDiscardMenu(true)
    } else {
      onClose()
    }
  }

  const handleSaveDraft = async () => {
    if (!content.trim()) return

    try {
      await fetch("/api/posts/drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      })
      setContent("")
      setShowDiscardMenu(false)
      onClose()
    } catch (error) {
      console.error("Error saving draft:", error)
    }
  }

  const handleDiscard = () => {
    setContent("")
    setShowDiscardMenu(false)
    onClose()
  }

  const handleLoadDraft = (draft: any) => {
    setContent(draft.content)
    setShowDrafts(false)
  }

  const handleDeleteDraft = async (draftId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await fetch(`/api/posts/drafts/${draftId}`, {
        method: "DELETE",
      })
      fetchDrafts()
    } catch (error) {
      console.error("Error deleting draft:", error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-xl max-w-[600px] w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-4">
            <button
              onClick={handleClose}
              className="text-secondary hover:text-foreground"
              disabled={loading}
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                <path d="M18.3 5.71a.996.996 0 00-1.41 0L12 10.59 7.11 5.7A.996.996 0 105.7 7.11L10.59 12 5.7 16.89a.996.996 0 101.41 1.41L12 13.41l4.89 4.88a.996.996 0 101.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" />
              </svg>
            </button>
            <button
              onClick={() => setShowDrafts(!showDrafts)}
              className="text-primary hover:underline font-semibold"
            >
              草稿
            </button>
          </div>
        </div>

        {/* Drafts List */}
        {showDrafts && (
          <div className="border-b border-border max-h-[200px] overflow-y-auto">
            {drafts.length === 0 ? (
              <div className="p-4 text-center text-secondary">沒有草稿</div>
            ) : (
              <div className="divide-y divide-border">
                {drafts.map((draft) => (
                  <div
                    key={draft.id}
                    onClick={() => handleLoadDraft(draft)}
                    className="p-4 hover:bg-hover cursor-pointer flex justify-between items-start"
                  >
                    <p className="flex-1 truncate">{draft.content}</p>
                    <button
                      onClick={(e) => handleDeleteDraft(draft.id, e)}
                      className="ml-2 text-secondary hover:text-red-500"
                    >
                      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-4">
          <div className="flex gap-3">
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
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="有什麼新鮮事？"
                className="w-full bg-transparent border-none outline-none text-xl resize-none min-h-[120px]"
                disabled={loading}
                maxLength={charCount > MAX_CHARS ? content.length : undefined}
              />
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <span className={charCount > MAX_CHARS ? "text-red-500 font-semibold" : "text-secondary"}>
                  {charCount} / {MAX_CHARS}
                </span>
              </div>
              <button
                onClick={handlePost}
                disabled={loading || !content.trim() || charCount > MAX_CHARS}
                className="bg-primary hover:bg-primary-hover text-white font-semibold py-2 px-6 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "發布中..." : "發文"}
              </button>
            </div>
          </div>
        </div>

        {/* Discard Menu */}
        {showDiscardMenu && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-background rounded-xl p-6 max-w-[300px] mx-4">
              <h3 className="text-xl font-bold mb-2">儲存草稿？</h3>
              <p className="text-secondary mb-6">
                您可以儲存此草稿，稍後再繼續編輯
              </p>
              <div className="space-y-2">
                <button
                  onClick={handleSaveDraft}
                  className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-2 px-4 rounded-full transition-colors"
                >
                  儲存
                </button>
                <button
                  onClick={handleDiscard}
                  className="w-full border border-border hover:bg-hover font-semibold py-2 px-4 rounded-full transition-colors"
                >
                  捨棄
                </button>
                <button
                  onClick={() => setShowDiscardMenu(false)}
                  className="w-full text-secondary hover:text-foreground font-semibold py-2 px-4"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

