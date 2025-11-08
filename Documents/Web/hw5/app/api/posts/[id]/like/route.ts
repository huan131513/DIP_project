import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "未登入" }, { status: 401 })
    }

    const postId = params.id

    // 檢查貼文是否存在
    const post = await prisma.post.findUnique({
      where: { id: postId },
    })

    if (!post) {
      return NextResponse.json({ error: "貼文不存在" }, { status: 404 })
    }

    // 檢查是否已按讚
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId,
        },
      },
    })

    if (existingLike) {
      // 取消按讚
      await prisma.like.delete({
        where: { id: existingLike.id },
      })
      return NextResponse.json({ liked: false })
    } else {
      // 按讚
      await prisma.like.create({
        data: {
          userId: session.user.id,
          postId,
        },
      })
      return NextResponse.json({ liked: true })
    }
  } catch (error) {
    console.error("Error liking post:", error)
    return NextResponse.json(
      { error: "按讚時發生錯誤" },
      { status: 500 }
    )
  }
}

