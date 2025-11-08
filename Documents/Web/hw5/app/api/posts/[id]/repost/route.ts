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

    // 檢查是否已轉發
    const existingRepost = await prisma.repost.findUnique({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId,
        },
      },
    })

    if (existingRepost) {
      // 取消轉發
      await prisma.repost.delete({
        where: { id: existingRepost.id },
      })
      return NextResponse.json({ reposted: false })
    } else {
      // 轉發
      await prisma.repost.create({
        data: {
          userId: session.user.id,
          postId,
        },
      })
      return NextResponse.json({ reposted: true })
    }
  } catch (error) {
    console.error("Error reposting:", error)
    return NextResponse.json(
      { error: "轉發時發生錯誤" },
      { status: 500 }
    )
  }
}

