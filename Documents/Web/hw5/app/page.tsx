import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (session?.user) {
    // 如果已登入且有 username，導向首頁
    if (session.user.username) {
      redirect("/home")
    } else {
      // 如果已登入但沒有 username，導向註冊頁面
      redirect("/register")
    }
  } else {
    // 如果未登入，導向登入頁面
    redirect("/login")
  }
}
