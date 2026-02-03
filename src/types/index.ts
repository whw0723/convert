/**
 * 解析后的标签结构
 */
export interface ParsedTag {
  /** 组件类型: button, tag, link, input, select, switch, alert, dialog, progress, badge */
  type: string
  /** 组件属性 */
  props: Record<string, string>
  /** 标签内容 */
  content: string
  /** 是否为纯文本 */
  isText: boolean
}

/**
 * 支持的组件类型
 */
export type ComponentType = 
  | 'button'
  | 'tag'
  | 'link'
  | 'input'
  | 'select'
  | 'switch'
  | 'alert'
  | 'dialog'
  | 'progress'
  | 'badge'
  | 'text'

/**
 * 组件映射配置
 */
export interface ComponentConfig {
  /** Element Plus 组件名 */
  component: string
  /** 默认属性 */
  defaultProps?: Record<string, unknown>
}
