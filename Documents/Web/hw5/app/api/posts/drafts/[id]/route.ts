import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// DELETE - 刪除草稿
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "未登入" }, { status: 401 })
    }

    const draft = await prisma.draft.findUnique({
      where: { id: params.id },
    })

    if (!draft) {
      return NextResponse.json({ error: "草稿不存在" }, { status: 404 })
    }

    if (draft.authorId !== session.user.id) {
      return NextResponse.json({ error: "無權限刪除此草稿" }, { status: 403 })
    }

    await prisma.draft.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting draft:", error)
    return NextResponse.json(
      { error: "刪除草稿時發生錯誤" },
      { status: 500 }
    )
  }
}

