# 内容转换器

一个将自定义标签转换为 Element Plus 组件的 Web 应用。

## 在线演示

访问: https://whw0723.github.io/convert/

## 功能特性

- 自定义标签语法，类似 BBCode 格式
- 支持 10 种 Element Plus 组件
- 实时预览转换效果
- 事件交互支持
- 事件日志记录
- 内置测试用例

## 支持的组件

| 标签 | 示例 |
|------|------|
| `[button]` | `[button type="primary"]按钮[/button]` |
| `[tag]` | `[tag type="success"]标签[/tag]` |
| `[link]` | `[link href="url"]链接[/link]` |
| `[input]` | `[input placeholder="请输入"/]` |
| `[select]` | `[select options="A,B,C"/]` |
| `[switch]` | `[switch/]` |
| `[alert]` | `[alert type="warning"]警告[/alert]` |
| `[dialog]` | `[dialog title="标题"]内容[/dialog]` |
| `[progress]` | `[progress percentage="70"/]` |
| `[badge]` | `[badge value="99"]消息[/badge]` |

## 技术栈

- Vue 3 + TypeScript
- Vite
- Element Plus

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 运行测试
npm run test

# 构建生产版本
npm run build
```

## 项目结构

```
src/
├── components/
│   └── ContentConverter.vue  # 主转换器组件
├── parser/
│   ├── tagParser.ts          # 标签解析器
│   └── tagParser.test.ts     # 单元测试
├── types/
│   └── index.ts              # 类型定义
├── testCases.ts              # 测试用例集合
├── App.vue
├── main.ts
└── style.css
```

## License

MIT
