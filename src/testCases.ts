/**
 * 测试用例集合 - 可在界面中直接使用
 */

export interface TestCase {
  name: string
  description: string
  input: string
  expectedComponents: number
}

/**
 * 基础组件测试用例
 */
export const basicTestCases: TestCase[] = [
  {
    name: '按钮测试',
    description: '测试各种类型的按钮',
    input: `[button]默认按钮[/button]
[button type="primary"]主要按钮[/button]
[button type="success"]成功按钮[/button]
[button type="warning"]警告按钮[/button]
[button type="danger"]危险按钮[/button]
[button type="info"]信息按钮[/button]`,
    expectedComponents: 6
  },
  {
    name: '标签测试',
    description: '测试各种类型的标签',
    input: `[tag]默认标签[/tag]
[tag type="success"]成功[/tag]
[tag type="info"]信息[/tag]
[tag type="warning"]警告[/tag]
[tag type="danger"]危险[/tag]`,
    expectedComponents: 5
  },
  {
    name: '链接测试',
    description: '测试链接组件',
    input: `[link href="https://www.baidu.com"]百度[/link]
[link href="https://www.google.com" type="success"]Google[/link]
[link href="https://github.com" type="warning"]GitHub[/link]`,
    expectedComponents: 3
  },
  {
    name: '输入框测试',
    description: '测试输入框组件',
    input: `[input placeholder="请输入用户名"/]
[input placeholder="请输入密码" type="password"/]
[input placeholder="请输入邮箱"/]`,
    expectedComponents: 3
  },
  {
    name: '选择器测试',
    description: '测试选择器组件',
    input: `[select options="北京,上海,广州,深圳" placeholder="请选择城市"/]
[select options="男,女" placeholder="请选择性别"/]
[select options="1-10岁,11-20岁,21-30岁,31岁以上" placeholder="请选择年龄段"/]`,
    expectedComponents: 3
  },
  {
    name: '开关测试',
    description: '测试开关组件',
    input: `[switch/]
[switch/]
[switch/]`,
    expectedComponents: 3
  },
  {
    name: '警告提示测试',
    description: '测试各种类型的警告提示',
    input: `[alert type="success" title="成功"]操作成功完成！[/alert]
[alert type="warning" title="警告"]请注意数据安全！[/alert]
[alert type="info" title="提示"]这是一条提示信息[/alert]
[alert type="error" title="错误"]发生了一个错误！[/alert]`,
    expectedComponents: 4
  },
  {
    name: '进度条测试',
    description: '测试进度条组件',
    input: `[progress percentage="0"/]
[progress percentage="25"/]
[progress percentage="50"/]
[progress percentage="75"/]
[progress percentage="100" status="success"/]`,
    expectedComponents: 5
  },
  {
    name: '徽章测试',
    description: '测试徽章组件',
    input: `[badge value="3"]消息[/badge]
[badge value="12"]通知[/badge]
[badge value="99+"]邮件[/badge]`,
    expectedComponents: 3
  },
  {
    name: '对话框测试',
    description: '测试对话框组件',
    input: `[dialog title="提示"]这是一个简单的提示对话框[/dialog]
[dialog title="确认删除"]确定要删除这条记录吗？此操作不可恢复。[/dialog]`,
    expectedComponents: 2
  }
]

/**
 * 综合测试用例
 */
export const complexTestCases: TestCase[] = [
  {
    name: '登录表单',
    description: '模拟一个完整的登录表单',
    input: `请输入登录信息：
[input placeholder="用户名"/]
[input placeholder="密码" type="password"/]
[switch/] 记住我
[button type="primary"]登录[/button]
[link href="/register"]还没有账号？立即注册[/link]`,
    expectedComponents: 5
  },
  {
    name: '用户信息卡片',
    description: '展示用户信息的卡片',
    input: `用户信息
[tag type="success"]已认证[/tag]
[badge value="VIP"]会员等级[/badge]
[progress percentage="80"/] 经验值
[button type="primary"]编辑资料[/button]
[button]退出登录[/button]`,
    expectedComponents: 5
  },
  {
    name: '操作确认',
    description: '危险操作确认场景',
    input: `[alert type="warning" title="警告"]您即将执行危险操作！[/alert]
[dialog title="确认操作"]确定要继续吗？此操作不可撤销。[/dialog]
[button type="danger"]确认删除[/button]
[button]取消[/button]`,
    expectedComponents: 4
  },
  {
    name: '设置页面',
    description: '模拟设置页面',
    input: `系统设置
[switch/] 开启通知
[switch/] 深色模式
[switch/] 自动更新
[select options="中文,English,日本語" placeholder="选择语言"/]
[button type="primary"]保存设置[/button]`,
    expectedComponents: 5
  },
  {
    name: '任务进度',
    description: '展示任务完成进度',
    input: `任务进度追踪
[tag type="info"]进行中[/tag]
[progress percentage="30"/] 数据收集
[progress percentage="60"/] 数据处理
[progress percentage="100" status="success"/] 数据验证
[alert type="info" title="提示"]预计还需要2小时完成[/alert]`,
    expectedComponents: 5
  },
  {
    name: '混合内容',
    description: '测试文本与组件混合',
    input: `欢迎来到 [tag type="primary"]内容转换器[/tag] 系统！

点击 [button type="primary"]开始使用[/button] 立即体验。

如有问题请 [link href="mailto:support@example.com"]联系我们[/link]`,
    expectedComponents: 3
  },
  {
    name: '事件交互测试',
    description: '测试各种组件的事件触发',
    input: `事件交互演示：

[button type="primary" onclick="欢迎使用内容转换器！"]点击弹出消息[/button]
[button type="success" onclick="操作成功！"]成功操作[/button]
[button type="danger" onclick="危险操作警告！"]危险操作[/button]

[switch label="通知开关"/] 切换开关查看状态

[select options="北京,上海,广州,深圳" placeholder="选择城市"/] 选择后显示结果

[input placeholder="输入内容会记录到日志"/]

[link href="https://github.com"]点击链接会弹出确认[/link]

[progress percentage="75"/] 点击查看进度详情

[badge value="99"]消息[/badge] 点击查看通知

[dialog title="交互测试"]这是一个可交互的对话框，点击按钮会有不同响应。[/dialog]`,
    expectedComponents: 11
  }
]

/**
 * 边界测试用例
 */
export const edgeCaseTests: TestCase[] = [
  {
    name: '空内容',
    description: '测试空输入',
    input: '',
    expectedComponents: 0
  },
  {
    name: '纯文本',
    description: '测试无标签的纯文本',
    input: '这是一段没有任何标签的纯文本内容，用于测试系统对纯文本的处理能力。',
    expectedComponents: 1
  },
  {
    name: '特殊字符',
    description: '测试包含特殊字符的内容',
    input: '[button type="primary"]点击 < > & " \' 特殊字符[/button]',
    expectedComponents: 1
  },
  {
    name: '超长内容',
    description: '测试超长文本内容',
    input: `[alert title="长文本测试"]${'这是一段很长的文本内容。'.repeat(10)}[/alert]`,
    expectedComponents: 1
  },
  {
    name: '连续标签无空格',
    description: '测试紧密排列的标签',
    input: '[button]1[/button][button]2[/button][button]3[/button][button]4[/button][button]5[/button]',
    expectedComponents: 5
  }
]

/**
 * 获取所有测试用例
 */
export function getAllTestCases(): TestCase[] {
  return [...basicTestCases, ...complexTestCases, ...edgeCaseTests]
}

/**
 * 获取随机测试用例
 */
export function getRandomTestCase(): TestCase {
  const allCases = getAllTestCases()
  return allCases[Math.floor(Math.random() * allCases.length)]
}
