// 計算貼文字元數
export function calculateCharCount(text: string): number {
  let count = 0
  let i = 0

  while (i < text.length) {
    // 跳過 hashtag
    if (text[i] === '#') {
      i++
      while (i < text.length && /[\w\u4e00-\u9fff]/.test(text[i])) {
        i++
      }
      continue
    }

    // 跳過 mention
    if (text[i] === '@') {
      i++
      while (i < text.length && /[\w]/.test(text[i])) {
        i++
      }
      continue
    }

    // 檢查是否為 URL
    const urlMatch = text.slice(i).match(/^https?:\/\/[^\s]+/)
    if (urlMatch) {
      count += 23 // URL 佔 23 字元
      i += urlMatch[0].length
      continue
    }

    // 一般字元
    count++
    i++
  }

  return count
}

// 解析文字並標記連結、hashtag、mention
export function parseText(text: string) {
  const parts: Array<{
    type: 'text' | 'url' | 'hashtag' | 'mention'
    content: string
  }> = []

  let currentText = ''
  let i = 0

  const pushCurrentText = () => {
    if (currentText) {
      parts.push({ type: 'text', content: currentText })
      currentText = ''
    }
  }

  while (i < text.length) {
    // 檢查 URL
    const urlMatch = text.slice(i).match(/^https?:\/\/[^\s]+/)
    if (urlMatch) {
      pushCurrentText()
      parts.push({ type: 'url', content: urlMatch[0] })
      i += urlMatch[0].length
      continue
    }

    // 檢查 hashtag
    if (text[i] === '#') {
      const hashtagMatch = text.slice(i).match(/^#[\w\u4e00-\u9fff]+/)
      if (hashtagMatch) {
        pushCurrentText()
        parts.push({ type: 'hashtag', content: hashtagMatch[0] })
        i += hashtagMatch[0].length
        continue
      }
    }

    // 檢查 mention
    if (text[i] === '@') {
      const mentionMatch = text.slice(i).match(/^@[\w]+/)
      if (mentionMatch) {
        pushCurrentText()
        parts.push({ type: 'mention', content: mentionMatch[0] })
        i += mentionMatch[0].length
        continue
      }
    }

    // 一般字元
    currentText += text[i]
    i++
  }

  pushCurrentText()
  return parts
}

// 渲染解析後的文字
export function renderParsedText(parts: ReturnType<typeof parseText>) {
  return parts.map((part, index) => {
    switch (part.type) {
      case 'url':
        return { key: index, type: 'url', content: part.content, href: part.content }
      case 'hashtag':
        return { key: index, type: 'hashtag', content: part.content, href: `/search?q=${encodeURIComponent(part.content)}` }
      case 'mention':
        const username = part.content.slice(1)
        return { key: index, type: 'mention', content: part.content, href: `/profile/${username}` }
      default:
        return { key: index, type: 'text', content: part.content }
    }
  })
}

