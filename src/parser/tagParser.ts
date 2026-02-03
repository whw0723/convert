import type { ParsedTag } from '../types'

/**
 * 支持的标签类型列表
 */
const SUPPORTED_TAGS = [
  'button',
  'tag',
  'link',
  'input',
  'select',
  'switch',
  'alert',
  'dialog',
  'progress',
  'badge'
]

/**
 * 解析标签属性字符串
 * 例如: type="primary" size="large" => { type: 'primary', size: 'large' }
 */
function parseAttributes(attrString: string): Record<string, string> {
  const attrs: Record<string, string> = {}
  // 匹配 key="value" 或 key='value' 格式
  const attrRegex = /(\w+)=["']([^"']*)["']/g
  let match

  while ((match = attrRegex.exec(attrString)) !== null) {
    attrs[match[1]] = match[2]
  }

  return attrs
}

/**
 * 解析自定义标签内容
 * 支持:
 * - 自闭合标签: [input placeholder="..."/]
 * - 配对标签: [button type="primary"]内容[/button]
 * - 纯文本
 */
export function parseContent(input: string): ParsedTag[] {
  const result: ParsedTag[] = []
  
  if (!input || input.trim() === '') {
    return result
  }

  // 创建标签名的正则模式
  const tagPattern = SUPPORTED_TAGS.join('|')
  
  // 匹配自闭合标签: [tag attr="value"/]
  const selfClosingRegex = new RegExp(
    `\\[(${tagPattern})([^\\]]*)/\\]`,
    'gi'
  )
  
  // 匹配配对标签: [tag attr="value"]content[/tag]
  const pairedRegex = new RegExp(
    `\\[(${tagPattern})([^\\]]*)\\](.*?)\\[/\\1\\]`,
    'gis'
  )

  // 用于跟踪已处理的位置
  interface TagMatch {
    start: number
    end: number
    tag: ParsedTag
  }
  
  const matches: TagMatch[] = []

  // 查找所有自闭合标签
  let match
  while ((match = selfClosingRegex.exec(input)) !== null) {
    matches.push({
      start: match.index,
      end: match.index + match[0].length,
      tag: {
        type: match[1].toLowerCase(),
        props: parseAttributes(match[2]),
        content: '',
        isText: false
      }
    })
  }

  // 查找所有配对标签
  while ((match = pairedRegex.exec(input)) !== null) {
    matches.push({
      start: match.index,
      end: match.index + match[0].length,
      tag: {
        type: match[1].toLowerCase(),
        props: parseAttributes(match[2]),
        content: match[3].trim(),
        isText: false
      }
    })
  }

  // 按位置排序
  matches.sort((a, b) => a.start - b.start)

  // 处理标签之间的文本和标签
  let lastEnd = 0
  for (const m of matches) {
    // 检查是否与之前的匹配重叠
    if (m.start < lastEnd) {
      continue
    }

    // 添加标签之前的文本
    if (m.start > lastEnd) {
      const textContent = input.slice(lastEnd, m.start).trim()
      if (textContent) {
        result.push({
          type: 'text',
          props: {},
          content: textContent,
          isText: true
        })
      }
    }

    // 添加标签
    result.push(m.tag)
    lastEnd = m.end
  }

  // 添加最后一个标签之后的文本
  if (lastEnd < input.length) {
    const textContent = input.slice(lastEnd).trim()
    if (textContent) {
      result.push({
        type: 'text',
        props: {},
        content: textContent,
        isText: true
      })
    }
  }

  // 如果没有找到任何标签，整个输入作为文本
  if (result.length === 0 && input.trim()) {
    result.push({
      type: 'text',
      props: {},
      content: input.trim(),
      isText: true
    })
  }

  return result
}

/**
 * 验证标签类型是否支持
 */
export function isSupportedTag(tagType: string): boolean {
  return SUPPORTED_TAGS.includes(tagType.toLowerCase())
}

/**
 * 获取所有支持的标签类型
 */
export function getSupportedTags(): string[] {
  return [...SUPPORTED_TAGS]
}
