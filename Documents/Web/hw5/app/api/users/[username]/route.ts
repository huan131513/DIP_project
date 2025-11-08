import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET - 取得使用者資料
export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const username = params.username

    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        _count: {
          select: {
            posts: true,
            followers: true,
            following: true,
          },
        },
        followers: session?.user?.id ? {
          where: { followerId: session.user.id },
        } : false,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "使用者不存在" }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json(
      { error: "取得使用者資料時發生錯誤" },
      { status: 500 }
    )
  }
}

// PATCH - 更新使用者資料
export async function PATCH(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "未登入" }, { status: 401 })
    }

    const username = params.username

    // 確認是自己的帳號
    if (session.user.username !== username) {
      return NextResponse.json({ error: "無權限編輯此資料" }, { status: 403 })
    }

    const { name, bio, image, coverImage } = await request.json()

    const updatedUser = await prisma.user.update({
      where: { username },
      data: {
        ...(name !== undefined && { name }),
        ...(bio !== undefined && { bio }),
        ...(image !== undefined && { image }),
        ...(coverImage !== undefined && { coverImage }),
      },
    })

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json(
      { error: "更新使用者資料時發生錯誤" },
      { status: 500 }
    )
  }
}

