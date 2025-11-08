"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import PostCard from "@/components/PostCard"
import Link from "next/link"

export default function ProfilePage({ params }: { params: { username: string } }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [posts, setPosts] = useState<any[]>([])
  const [tab, setTab] = useState<"posts" | "likes">("posts")
  const [loading, setLoading] = useState(true)
  const [isFollowing, setIsFollowing] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editForm, setEditForm] = useState({ name: "", bio: "" })

  const isOwnProfile = session?.user?.username === params.username

  useEffect(() => {
    fetchUser()
    fetchPosts()
  }, [params.username, tab])

  const fetchUser = async () => {
    try {
      const response = await fetch(`/api/users/${params.username}`)
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        setIsFollowing(data.user.followers && data.user.followers.length > 0)
        setEditForm({ name: data.user.name || "", bio: data.user.bio || "" })
      } else {
        router.push("/home")
      }
    } catch (error) {
      console.error("Error fetching user:", error)
    }
  }

  const fetchPosts = async () => {
    setLoading(true)
    try {
      let url
      if (tab === "likes" && isOwnProfile) {
        url = `/api/users/${params.username}/likes`
      } else {
        url = `/api/posts?userId=${user?.id}`
      }
      
      const response = await fetch(url)
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

  const handleFollow = async () => {
    if (!user) return
    try {
      const response = await fetch(`/api/users/${user.id}/follow`, {
        method: "POST",
      })
      if (response.ok) {
        setIsFollowing(!isFollowing)
        fetchUser()
      }
    } catch (error) {
      console.error("Error following user:", error)
    }
  }

  const handleUpdateProfile = async () => {
    try {
      const response = await fetch(`/api/users/${params.username}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      })
      if (response.ok) {
        setShowEditModal(false)
        fetchUser()
      }
    } catch (error) {
      console.error("Error updating profile:", error)
    }
  }

  if (!user) {
    return <div className="p-8 text-center text-secondary">載入中...</div>
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
        <div>
          <h1 className="text-xl font-bold">{user.name}</h1>
          <p className="text-sm text-secondary">{user._count.posts} 貼文</p>
        </div>
      </div>

      {/* Cover Image */}
      <div className="h-48 bg-secondary relative">
        {user.coverImage && (
          <img src={user.coverImage} alt="Cover" className="w-full h-full object-cover" />
        )}
      </div>

      {/* Profile Info */}
      <div className="px-4 pb-4">
        <div className="flex justify-between items-start -mt-16 mb-4">
          <div className="w-32 h-32 rounded-full border-4 border-background bg-secondary flex items-center justify-center overflow-hidden">
            {user.image ? (
              <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl font-semibold">{user.name?.charAt(0) || "?"}</span>
            )}
          </div>
          {isOwnProfile ? (
            <button
              onClick={() => setShowEditModal(true)}
              className="mt-3 border border-border hover:bg-hover px-4 py-2 rounded-full font-semibold"
            >
              編輯個人資料
            </button>
          ) : (
            <button
              onClick={handleFollow}
              className={`mt-3 px-4 py-2 rounded-full font-semibold ${
                isFollowing
                  ? "border border-border hover:bg-hover"
                  : "bg-foreground text-background hover:bg-foreground/90"
              }`}
            >
              {isFollowing ? "追蹤中" : "追蹤"}
            </button>
          )}
        </div>

        <h2 className="text-xl font-bold">{user.name}</h2>
        <p className="text-secondary">@{user.username}</p>
        {user.bio && <p className="mt-3">{user.bio}</p>}
        
        <div className="flex gap-4 mt-3 text-sm">
          <Link href="#" className="hover:underline">
            <span className="font-semibold">{user._count.following}</span>{" "}
            <span className="text-secondary">追蹤中</span>
          </Link>
          <Link href="#" className="hover:underline">
            <span className="font-semibold">{user._count.followers}</span>{" "}
            <span className="text-secondary">追蹤者</span>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border sticky top-[61px] bg-background z-10">
        <div className="flex">
          <button
            onClick={() => setTab("posts")}
            className={`flex-1 py-4 hover:bg-hover ${
              tab === "posts" ? "border-b-2 border-primary font-semibold" : "text-secondary"
            }`}
          >
            貼文
          </button>
          {isOwnProfile && (
            <button
              onClick={() => setTab("likes")}
              className={`flex-1 py-4 hover:bg-hover ${
                tab === "likes" ? "border-b-2 border-primary font-semibold" : "text-secondary"
              }`}
            >
              喜歡的內容
            </button>
          )}
        </div>
      </div>

      {/* Posts */}
      {loading ? (
        <div className="p-8 text-center text-secondary">載入中...</div>
      ) : posts.length === 0 ? (
        <div className="p-8 text-center text-secondary">
          {tab === "likes" ? "還沒有按過讚" : "還沒有貼文"}
        </div>
      ) : (
        <div>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onUpdate={fetchPosts} />
          ))}
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-xl max-w-[600px] w-full mx-4 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">編輯個人資料</h2>
              <button onClick={() => setShowEditModal(false)} className="text-secondary hover:text-foreground">
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                  <path d="M18.3 5.71a.996.996 0 00-1.41 0L12 10.59 7.11 5.7A.996.996 0 105.7 7.11L10.59 12 5.7 16.89a.996.996 0 101.41 1.41L12 13.41l4.89 4.88a.996.996 0 101.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">姓名</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full bg-transparent border border-border rounded-lg p-3 outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">簡介</label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  className="w-full bg-transparent border border-border rounded-lg p-3 outline-none focus:border-primary resize-none"
                  rows={4}
                />
              </div>
              <button
                onClick={handleUpdateProfile}
                className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3 rounded-full"
              >
                儲存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

