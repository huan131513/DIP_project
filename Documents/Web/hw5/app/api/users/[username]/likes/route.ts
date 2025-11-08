import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const username = params.username

    // 只有自己可以看到自己按過讚的貼文
    if (!session || session.user.username !== username) {
      return NextResponse.json(
        { error: "無權限查看" },
        { status: 403 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { username },
    })

    if (!user) {
      return NextResponse.json({ error: "使用者不存在" }, { status: 404 })
    }

    const likes = await prisma.like.findMany({
      where: { userId: user.id },
      include: {
        post: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
              },
            },
            likes: {
              where: { userId: session.user.id },
            },
            reposts: {
              where: { userId: session.user.id },
            },
            _count: {
              select: {
                likes: true,
                reposts: true,
                comments: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    const posts = likes.map((like) => like.post)

    return NextResponse.json({ posts })
  } catch (error) {
    console.error("Error fetching liked posts:", error)
    return NextResponse.json(
      { error: "取得按讚貼文時發生錯誤" },
      { status: 500 }
    )
  }
}

