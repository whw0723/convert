import { describe, it, expect } from 'vitest'
import { parseContent, isSupportedTag, getSupportedTags } from './tagParser'

describe('tagParser', () => {
  
  describe('parseContent - 基础功能测试', () => {
    
    it('应该正确解析按钮标签', () => {
      const input = '[button type="primary"]点击我[/button]'
      const result = parseContent(input)
      
      expect(result).toHaveLength(1)
      expect(result[0].type).toBe('button')
      expect(result[0].props.type).toBe('primary')
      expect(result[0].content).toBe('点击我')
      expect(result[0].isText).toBe(false)
    })

    it('应该正确解析标签组件', () => {
      const input = '[tag type="success"]成功[/tag]'
      const result = parseContent(input)
      
      expect(result).toHaveLength(1)
      expect(result[0].type).toBe('tag')
      expect(result[0].props.type).toBe('success')
      expect(result[0].content).toBe('成功')
    })

    it('应该正确解析链接标签', () => {
      const input = '[link href="https://example.com"]访问链接[/link]'
      const result = parseContent(input)
      
      expect(result).toHaveLength(1)
      expect(result[0].type).toBe('link')
      expect(result[0].props.href).toBe('https://example.com')
      expect(result[0].content).toBe('访问链接')
    })

    it('应该正确解析自闭合输入框标签', () => {
      const input = '[input placeholder="请输入用户名"/]'
      const result = parseContent(input)
      
      expect(result).toHaveLength(1)
      expect(result[0].type).toBe('input')
      expect(result[0].props.placeholder).toBe('请输入用户名')
      expect(result[0].content).toBe('')
    })

    it('应该正确解析自闭合选择器标签', () => {
      const input = '[select options="选项A,选项B,选项C"/]'
      const result = parseContent(input)
      
      expect(result).toHaveLength(1)
      expect(result[0].type).toBe('select')
      expect(result[0].props.options).toBe('选项A,选项B,选项C')
    })

    it('应该正确解析自闭合开关标签', () => {
      const input = '[switch/]'
      const result = parseContent(input)
      
      expect(result).toHaveLength(1)
      expect(result[0].type).toBe('switch')
      expect(result[0].content).toBe('')
    })

    it('应该正确解析警告提示标签', () => {
      const input = '[alert type="warning" title="警告"]这是警告信息[/alert]'
      const result = parseContent(input)
      
      expect(result).toHaveLength(1)
      expect(result[0].type).toBe('alert')
      expect(result[0].props.type).toBe('warning')
      expect(result[0].props.title).toBe('警告')
      expect(result[0].content).toBe('这是警告信息')
    })

    it('应该正确解析对话框标签', () => {
      const input = '[dialog title="确认操作"]是否确认删除？[/dialog]'
      const result = parseContent(input)
      
      expect(result).toHaveLength(1)
      expect(result[0].type).toBe('dialog')
      expect(result[0].props.title).toBe('确认操作')
      expect(result[0].content).toBe('是否确认删除？')
    })

    it('应该正确解析进度条标签', () => {
      const input = '[progress percentage="75"/]'
      const result = parseContent(input)
      
      expect(result).toHaveLength(1)
      expect(result[0].type).toBe('progress')
      expect(result[0].props.percentage).toBe('75')
    })

    it('应该正确解析徽章标签', () => {
      const input = '[badge value="5"]消息[/badge]'
      const result = parseContent(input)
      
      expect(result).toHaveLength(1)
      expect(result[0].type).toBe('badge')
      expect(result[0].props.value).toBe('5')
      expect(result[0].content).toBe('消息')
    })
  })

  describe('parseContent - 多标签解析', () => {
    
    it('应该正确解析多个连续标签', () => {
      const input = '[button type="primary"]按钮1[/button][button type="success"]按钮2[/button]'
      const result = parseContent(input)
      
      expect(result).toHaveLength(2)
      expect(result[0].type).toBe('button')
      expect(result[0].props.type).toBe('primary')
      expect(result[1].type).toBe('button')
      expect(result[1].props.type).toBe('success')
    })

    it('应该正确解析混合类型标签', () => {
      const input = '[button]按钮[/button][tag type="info"]标签[/tag][switch/]'
      const result = parseContent(input)
      
      expect(result).toHaveLength(3)
      expect(result[0].type).toBe('button')
      expect(result[1].type).toBe('tag')
      expect(result[2].type).toBe('switch')
    })

    it('应该正确解析标签与文本混合内容', () => {
      const input = '欢迎使用[button type="primary"]开始[/button]系统'
      const result = parseContent(input)
      
      expect(result).toHaveLength(3)
      expect(result[0].isText).toBe(true)
      expect(result[0].content).toBe('欢迎使用')
      expect(result[1].type).toBe('button')
      expect(result[2].isText).toBe(true)
      expect(result[2].content).toBe('系统')
    })
  })

  describe('parseContent - 边界情况', () => {
    
    it('应该处理空字符串', () => {
      const result = parseContent('')
      expect(result).toHaveLength(0)
    })

    it('应该处理只有空白的字符串', () => {
      const result = parseContent('   ')
      expect(result).toHaveLength(0)
    })

    it('应该处理纯文本（无标签）', () => {
      const input = '这是一段纯文本内容'
      const result = parseContent(input)
      
      expect(result).toHaveLength(1)
      expect(result[0].isText).toBe(true)
      expect(result[0].content).toBe('这是一段纯文本内容')
    })

    it('应该处理不支持的标签作为文本', () => {
      const input = '[unknown]内容[/unknown]'
      const result = parseContent(input)
      
      // 不支持的标签被当作纯文本处理
      expect(result).toHaveLength(1)
      expect(result[0].isText).toBe(true)
    })

    it('应该处理没有属性的标签', () => {
      const input = '[button]默认按钮[/button]'
      const result = parseContent(input)
      
      expect(result).toHaveLength(1)
      expect(result[0].type).toBe('button')
      expect(result[0].props).toEqual({})
      expect(result[0].content).toBe('默认按钮')
    })

    it('应该处理多个属性', () => {
      const input = '[button type="primary" size="large"]大按钮[/button]'
      const result = parseContent(input)
      
      expect(result).toHaveLength(1)
      expect(result[0].props.type).toBe('primary')
      expect(result[0].props.size).toBe('large')
    })

    it('应该处理单引号属性值', () => {
      const input = "[button type='warning']警告[/button]"
      const result = parseContent(input)
      
      expect(result).toHaveLength(1)
      expect(result[0].props.type).toBe('warning')
    })

    it('应该处理换行的内容', () => {
      const input = `[button type="primary"]按钮[/button]
[tag type="success"]标签[/tag]`
      const result = parseContent(input)
      
      expect(result).toHaveLength(2)
    })
  })

  describe('parseContent - 复杂场景', () => {
    
    it('应该正确解析完整的表单示例', () => {
      const input = `请填写信息：
[input placeholder="用户名"/]
[input placeholder="密码"/]
[select options="管理员,普通用户"/]
[switch/]
[button type="primary"]提交[/button]`
      
      const result = parseContent(input)
      
      expect(result.length).toBeGreaterThanOrEqual(5)
      
      const types = result.filter(r => !r.isText).map(r => r.type)
      expect(types).toContain('input')
      expect(types).toContain('select')
      expect(types).toContain('switch')
      expect(types).toContain('button')
    })

    it('应该正确解析对话框与按钮组合', () => {
      const input = '[dialog title="确认"]确定要删除吗？[/dialog][button type="danger"]删除[/button]'
      const result = parseContent(input)
      
      expect(result).toHaveLength(2)
      expect(result[0].type).toBe('dialog')
      expect(result[1].type).toBe('button')
    })
  })

  describe('isSupportedTag', () => {
    
    it('应该识别所有支持的标签', () => {
      const supportedTags = ['button', 'tag', 'link', 'input', 'select', 'switch', 'alert', 'dialog', 'progress', 'badge']
      
      supportedTags.forEach(tag => {
        expect(isSupportedTag(tag)).toBe(true)
      })
    })

    it('应该识别不支持的标签', () => {
      expect(isSupportedTag('div')).toBe(false)
      expect(isSupportedTag('span')).toBe(false)
      expect(isSupportedTag('unknown')).toBe(false)
    })

    it('应该忽略大小写', () => {
      expect(isSupportedTag('BUTTON')).toBe(true)
      expect(isSupportedTag('Button')).toBe(true)
    })
  })

  describe('getSupportedTags', () => {
    
    it('应该返回所有支持的标签', () => {
      const tags = getSupportedTags()
      
      expect(tags).toContain('button')
      expect(tags).toContain('tag')
      expect(tags).toContain('link')
      expect(tags).toContain('input')
      expect(tags).toContain('select')
      expect(tags).toContain('switch')
      expect(tags).toContain('alert')
      expect(tags).toContain('dialog')
      expect(tags).toContain('progress')
      expect(tags).toContain('badge')
      expect(tags).toHaveLength(10)
    })
  })
})
