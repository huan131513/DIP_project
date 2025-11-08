import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET - 取得所有貼文或特定使用者的貼文
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const type = searchParams.get("type") // "all" or "following"
    const session = await getServerSession(authOptions)

    let posts

    if (userId) {
      // 取得特定使用者的貼文
      posts = await prisma.post.findMany({
        where: { authorId: userId },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
            },
          },
          likes: true,
          reposts: true,
          comments: true,
          _count: {
            select: {
              likes: true,
              reposts: true,
              comments: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      })
    } else if (type === "following" && session?.user?.id) {
      // 取得追蹤者的貼文
      const following = await prisma.follow.findMany({
        where: { followerId: session.user.id },
        select: { followingId: true },
      })

      const followingIds = following.map((f) => f.followingId)

      posts = await prisma.post.findMany({
        where: {
          authorId: { in: followingIds },
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
            },
          },
          likes: session?.user?.id ? {
            where: { userId: session.user.id },
          } : false,
          reposts: session?.user?.id ? {
            where: { userId: session.user.id },
          } : false,
          comments: true,
          _count: {
            select: {
              likes: true,
              reposts: true,
              comments: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      })
    } else {
      // 取得所有貼文
      posts = await prisma.post.findMany({
        include: {
          author: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
            },
          },
          likes: session?.user?.id ? {
            where: { userId: session.user.id },
          } : false,
          reposts: session?.user?.id ? {
            where: { userId: session.user.id },
          } : false,
          comments: true,
          _count: {
            select: {
              likes: true,
              reposts: true,
              comments: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      })
    }

    return NextResponse.json({ posts })
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json(
      { error: "取得貼文時發生錯誤" },
      { status: 500 }
    )
  }
}

// POST - 建立新貼文
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "未登入" }, { status: 401 })
    }

    const { content } = await request.json()

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "貼文內容不能為空" },
        { status: 400 }
      )
    }

    const post = await prisma.post.create({
      data: {
        content,
        authorId: session.user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        _count: {
          select: {
            likes: true,
            reposts: true,
            comments: true,
          },
        },
      },
    })

    return NextResponse.json({ post })
  } catch (error) {
    console.error("Error creating post:", error)
    return NextResponse.json(
      { error: "建立貼文時發生錯誤" },
      { status: 500 }
    )
  }
}

