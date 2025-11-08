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

    const followingId = params.id

    // 不能追蹤自己
    if (followingId === session.user.id) {
      return NextResponse.json(
        { error: "不能追蹤自己" },
        { status: 400 }
      )
    }

    // 檢查目標使用者是否存在
    const targetUser = await prisma.user.findUnique({
      where: { id: followingId },
    })

    if (!targetUser) {
      return NextResponse.json({ error: "使用者不存在" }, { status: 404 })
    }

    // 檢查是否已追蹤
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId,
        },
      },
    })

    if (existingFollow) {
      // 取消追蹤
      await prisma.follow.delete({
        where: { id: existingFollow.id },
      })
      return NextResponse.json({ following: false })
    } else {
      // 追蹤
      await prisma.follow.create({
        data: {
          followerId: session.user.id,
          followingId,
        },
      })
      return NextResponse.json({ following: true })
    }
  } catch (error) {
    console.error("Error following user:", error)
    return NextResponse.json(
      { error: "追蹤時發生錯誤" },
      { status: 500 }
    )
  }
}

