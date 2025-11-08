# SongYY - X (Twitter) Clone 社群網站

一個功能完整的社群媒體平台，靈感來自 X (Twitter)，具備發文、留言、按讚、轉發、追蹤等核心功能。

## 🚀 部署連結 (Deployed Link)

**重要：部署連結將在設定資料庫和環境變數後提供**

待部署至 Vercel 後更新：`https://your-app.vercel.app`

## 🔑 註冊金鑰 (REG_KEY)

本應用目前開放註冊，無需特殊金鑰。

## ✨ 功能清單

### 核心功能 (Basic Features)

#### 1. 認證系統
- ✅ 支援 Google / GitHub / Facebook OAuth 登入
- ✅ 使用者名稱 (username) 註冊系統
- ✅ Session 管理與持久化登入
- ✅ 同一個 OAuth Provider 不同帳號視為不同使用者

#### 2. 主選單與導航
- ✅ 側邊導航欄（Home、Profile）
- ✅ SongYY Logo 設計
- ✅ 發文按鈕（藍色醒目）
- ✅ 使用者資訊顯示與登出功能
- ✅ Hover 效果與視覺回饋

#### 3. 發表文章
- ✅ 發文 Modal 視窗
- ✅ 280 字元限制（連結佔 23 字元）
- ✅ Hashtag 和 @mention 不計入字元數
- ✅ 草稿儲存與讀取功能
- ✅ 放棄發文時顯示儲存/捨棄選項
- ✅ 自動偵測連結、Hashtag、Mention 並建立超連結

#### 4. 閱讀文章 (Feed)
- ✅ All / Following 兩種 Feed 模式
- ✅ 文章列表（從新到舊排序）
- ✅ 顯示作者資訊、發文時間
- ✅ 按讚、轉發、留言功能
- ✅ 按讚狀態視覺回饋（toggle on/off）
- ✅ 刪除自己的貼文（三點選單）

#### 5. 留言功能
- ✅ 點擊貼文進入詳細頁面
- ✅ 顯示所有留言
- ✅ 發表新留言
- ✅ 留言支援連結、Hashtag、Mention

#### 6. 個人資料頁面
- ✅ 顯示使用者資訊（頭像、姓名、username、簡介）
- ✅ 背景圖與大頭貼
- ✅ 追蹤/粉絲數量
- ✅ Posts / Likes 分頁
- ✅ 編輯個人資料功能（僅限本人）
- ✅ Follow / Following 按鈕（他人頁面）
- ✅ Likes 頁面僅本人可見

### 進階功能 (Advanced Features)

#### New Post Notice
- ✅ 當追蹤的人發文時，顯示通知
- ✅ 在 Feed 上方顯示最近發文者的頭像
- ✅ 支援最多顯示前三個發文者
- ✅ 點擊可重新整理 Feed

## 🏗️ 架構圖

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (Next.js)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Login UI   │  │   Home Feed  │  │  Profile UI  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Post Modal  │  │  Post Detail │  │  Edit Modal  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ API Requests
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Routes (Next.js)                      │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  /api/auth/[...nextauth]  - NextAuth OAuth & Session  │ │
│  │  /api/posts               - CRUD 貼文                  │ │
│  │  /api/posts/[id]/like     - 按讚功能                  │ │
│  │  /api/posts/[id]/repost   - 轉發功能                  │ │
│  │  /api/posts/[id]/comments - 留言功能                  │ │
│  │  /api/posts/drafts        - 草稿管理                  │ │
│  │  /api/users/[username]    - 使用者資料                │ │
│  │  /api/users/[id]/follow   - 追蹤功能                  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Prisma ORM
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     PostgreSQL Database                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   User   │  │   Post   │  │  Comment │  │   Like   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Follow  │  │  Repost  │  │  Draft   │  │ Account  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## 🛠️ 使用技術

### 前端
- **Next.js 14+** - React 全端框架（App Router）
- **TypeScript** - 型別安全
- **Tailwind CSS** - 實用優先的 CSS 框架
- **NextAuth.js** - OAuth 認證解決方案

### 後端
- **Next.js API Routes** - RESTful API
- **Prisma** - 現代化 ORM
- **PostgreSQL** - 關聯式資料庫

### 部署
- **Vercel** - 應用程式部署平台
- **Vercel Postgres** (或其他) - 資料庫託管

## 📦 安裝與執行

### 1. 安裝依賴套件

```bash
cd hw5
npm install
```

### 2. 設定環境變數

複製 `env.template` 並重新命名為 `.env`，然後填入以下資訊：

```env
# Database
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"  # 使用 openssl rand -base64 32 生成

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"

FACEBOOK_CLIENT_ID="your-facebook-client-id"
FACEBOOK_CLIENT_SECRET="your-facebook-client-secret"

# Pusher (選用)
NEXT_PUBLIC_PUSHER_APP_KEY="your-pusher-key"
PUSHER_APP_ID="your-pusher-app-id"
PUSHER_SECRET="your-pusher-secret"
NEXT_PUBLIC_PUSHER_CLUSTER="your-pusher-cluster"
```

### 3. 設定資料庫

```bash
# 生成 Prisma Client
npx prisma generate

# 執行資料庫遷移
npx prisma migrate dev --name init

# (選用) 使用 Prisma Studio 查看資料庫
npx prisma studio
```

### 4. 執行開發伺服器

```bash
npm run dev
```

開啟瀏覽器訪問 [http://localhost:3000](http://localhost:3000)

## 🚀 部署到 Vercel

### 1. 推送程式碼到 GitHub

```bash
git add .
git commit -m "完成 SongYY 專案"
git push
```

### 2. 在 Vercel 上建立專案

1. 前往 [Vercel Dashboard](https://vercel.com/dashboard)
2. 點擊 "New Project"
3. 選擇你的 GitHub repository
4. 設定環境變數（與 `.env` 相同）
5. 點擊 "Deploy"

### 3. 設定資料庫

- 選項 1：使用 Vercel Postgres
- 選項 2：使用外部 PostgreSQL 服務（如 Supabase、Railway）

### 4. 執行資料庫遷移

```bash
# 在 Vercel 專案設定中，或使用本地執行
npx prisma migrate deploy
```

## 📝 OAuth 設定指南

### Google OAuth
1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 建立新專案
3. 啟用 Google+ API
4. 建立 OAuth 2.0 憑證
5. 新增授權重新導向 URI：`http://localhost:3000/api/auth/callback/google`

### GitHub OAuth
1. 前往 [GitHub Settings > Developer settings > OAuth Apps](https://github.com/settings/developers)
2. 建立新的 OAuth App
3. 設定 Authorization callback URL：`http://localhost:3000/api/auth/callback/github`

### Facebook OAuth
1. 前往 [Facebook Developers](https://developers.facebook.com/)
2. 建立新應用程式
3. 新增 Facebook Login 產品
4. 設定有效的 OAuth 重新導向 URI：`http://localhost:3000/api/auth/callback/facebook`

## 🔍 主要檔案結構

```
hw5/
├── app/
│   ├── (authenticated)/       # 需要登入的頁面
│   │   ├── home/             # 首頁 Feed
│   │   ├── posts/[id]/       # 貼文詳細頁面
│   │   └── profile/[username]/ # 個人資料頁面
│   ├── api/                  # API Routes
│   │   ├── auth/             # NextAuth 認證
│   │   ├── posts/            # 貼文相關 API
│   │   └── users/            # 使用者相關 API
│   ├── login/                # 登入頁面
│   └── register/             # 註冊 username 頁面
├── components/               # React 組件
│   ├── PostCard.tsx          # 貼文卡片
│   ├── PostModal.tsx         # 發文視窗
│   ├── Sidebar.tsx           # 側邊導航欄
│   └── SessionProvider.tsx   # Session 提供者
├── lib/                      # 工具函數
│   ├── auth.ts               # NextAuth 設定
│   ├── prisma.ts             # Prisma Client
│   └── textUtils.ts          # 文字處理工具
├── prisma/
│   └── schema.prisma         # 資料庫 Schema
└── types/                    # TypeScript 型別定義
```

## 🎨 設計特色

- **深色主題**：參考 X (Twitter) 的深色模式設計
- **響應式設計**：適配不同螢幕尺寸（基礎支援）
- **流暢動畫**：Hover 效果與過渡動畫
- **清晰視覺層次**：明確的資訊架構與視覺回饋

## 🐛 已知問題與限制

1. **圖片上傳**：目前尚未實作圖片上傳功能，使用者頭像來自 OAuth 提供者
2. **即時通知**：Pusher 整合需要外部服務設定
3. **搜尋功能**：Hashtag 搜尋頁面尚未完整實作
4. **多媒體支援**：目前僅支援文字貼文
5. **手機版優化**：部分功能在手機版可能需要進一步優化

## 📄 授權

本專案為學術作業，僅供學習用途。

## 👤 作者

**彭子桓**
- GitHub: [@pengzihuan]
- 課程：網路服務程式設計 (Web Programming)
- 學期：114-1

## 🙏 致謝

感謝課程助教與教授的指導，以及 X (Twitter) 提供的設計靈感。

---

**最後更新：2025-01-08**
