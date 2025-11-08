import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "未登入" },
        { status: 401 }
      )
    }

    const { username } = await request.json()

    // 驗證 username
    if (!username || username.length < 3) {
      return NextResponse.json(
        { error: "使用者名稱至少需要 3 個字元" },
        { status: 400 }
      )
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return NextResponse.json(
        { error: "使用者名稱只能包含字母、數字和底線" },
        { status: 400 }
      )
    }

    // 檢查 username 是否已被使用
    const existingUser = await prisma.user.findUnique({
      where: { username },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "此使用者名稱已被使用" },
        { status: 400 }
      )
    }

    // 更新使用者的 username
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { username },
    })

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    console.error("Register username error:", error)
    return NextResponse.json(
      { error: "註冊時發生錯誤" },
      { status: 500 }
    )
  }
}

