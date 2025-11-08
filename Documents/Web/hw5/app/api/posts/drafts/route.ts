import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET - 取得所有草稿
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "未登入" }, { status: 401 })
    }

    const drafts = await prisma.draft.findMany({
      where: { authorId: session.user.id },
      orderBy: { updatedAt: "desc" },
    })

    return NextResponse.json({ drafts })
  } catch (error) {
    console.error("Error fetching drafts:", error)
    return NextResponse.json(
      { error: "取得草稿時發生錯誤" },
      { status: 500 }
    )
  }
}

// POST - 建立新草稿
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "未登入" }, { status: 401 })
    }

    const { content } = await request.json()

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "草稿內容不能為空" },
        { status: 400 }
      )
    }

    const draft = await prisma.draft.create({
      data: {
        content,
        authorId: session.user.id,
      },
    })

    return NextResponse.json({ draft })
  } catch (error) {
    console.error("Error creating draft:", error)
    return NextResponse.json(
      { error: "建立草稿時發生錯誤" },
      { status: 500 }
    )
  }
}

