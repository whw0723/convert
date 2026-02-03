<script setup lang="ts">
import { ref } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import { parseContent, getSupportedTags } from '../parser/tagParser'
import type { ParsedTag } from '../types'
import { basicTestCases, complexTestCases, edgeCaseTests, type TestCase } from '../testCases'

// 输入的原始文本
const inputText = ref('')

// 解析后的标签列表
const parsedTags = ref<ParsedTag[]>([])

// 对话框状态管理
const dialogStates = ref<Record<number, boolean>>({})

// 开关状态管理
const switchStates = ref<Record<number, boolean>>({})

// 选择器状态管理
const selectStates = ref<Record<number, string>>({})

// 输入框状态管理
const inputStates = ref<Record<number, string>>({})

// 事件日志
const eventLogs = ref<Array<{ time: string; type: string; message: string }>>([])

// 测试用例下拉框显示
const showTestCases = ref(false)

// 当前选中的测试用例
const currentTestCase = ref<TestCase | null>(null)

// 所有测试用例分组
const testCaseGroups = [
  { label: '基础组件', cases: basicTestCases },
  { label: '综合场景', cases: complexTestCases },
  { label: '边界测试', cases: edgeCaseTests }
]

// 添加事件日志
function addEventLog(type: string, message: string) {
  const now = new Date()
  const time = now.toLocaleTimeString('zh-CN', { hour12: false })
  eventLogs.value.unshift({ time, type, message })
  // 最多保留 20 条日志
  if (eventLogs.value.length > 20) {
    eventLogs.value.pop()
  }
}

// 按钮点击事件
function handleButtonClick(tag: ParsedTag) {
  const message = tag.props.onclick || `点击了 "${tag.content || '按钮'}"`
  
  // 根据按钮类型显示不同样式的消息
  const typeMap: Record<string, 'success' | 'warning' | 'info' | 'error'> = {
    'primary': 'info',
    'success': 'success',
    'warning': 'warning',
    'danger': 'error',
    'info': 'info'
  }
  const msgType = typeMap[tag.props.type] || 'info'
  
  ElMessage({
    message,
    type: msgType,
    duration: 2000
  })
  
  addEventLog('button', message)
}

// 开关切换事件
function handleSwitchChange(index: number, value: boolean, tag: ParsedTag) {
  switchStates.value[index] = value
  const label = tag.props.label || '开关'
  const message = `${label} 已${value ? '开启' : '关闭'}`
  
  ElMessage({
    message,
    type: value ? 'success' : 'info',
    duration: 2000
  })
  
  addEventLog('switch', message)
}

// 选择器改变事件
function handleSelectChange(index: number, value: string, tag: ParsedTag) {
  selectStates.value[index] = value
  const message = `选择了: ${value}`
  
  ElMessage({
    message,
    type: 'success',
    duration: 2000
  })
  
  addEventLog('select', message)
}

// 输入框输入事件（防抖）
let inputTimer: ReturnType<typeof setTimeout> | null = null
function handleInputChange(index: number, value: string, tag: ParsedTag) {
  inputStates.value[index] = value
  
  if (inputTimer) clearTimeout(inputTimer)
  inputTimer = setTimeout(() => {
    if (value.trim()) {
      addEventLog('input', `输入内容: "${value}"`)
    }
  }, 500)
}

// 链接点击事件
function handleLinkClick(event: MouseEvent, tag: ParsedTag) {
  const href = tag.props.href || '#'
  const content = tag.content || '链接'
  
  // 如果是外部链接，显示确认框
  if (href.startsWith('http')) {
    event.preventDefault()
    ElMessageBox.confirm(
      `即将跳转到外部链接：${href}`,
      '跳转确认',
      {
        confirmButtonText: '继续',
        cancelButtonText: '取消',
        type: 'info'
      }
    ).then(() => {
      window.open(href, '_blank')
      addEventLog('link', `跳转到: ${href}`)
    }).catch(() => {
      ElMessage.info('已取消跳转')
    })
  } else {
    addEventLog('link', `点击链接: ${content}`)
    ElMessage.info(`链接地址: ${href}`)
  }
}

// 标签点击事件
function handleTagClick(tag: ParsedTag) {
  const content = tag.content || '标签'
  ElNotification({
    title: '标签详情',
    message: `类型: ${tag.props.type || 'default'}, 内容: ${content}`,
    type: 'info',
    duration: 2000
  })
  addEventLog('tag', `查看标签: ${content}`)
}

// 进度条完成通知
function handleProgressClick(tag: ParsedTag) {
  const percentage = Number(tag.props.percentage) || 0
  let message = `当前进度: ${percentage}%`
  let type: 'success' | 'warning' | 'info' = 'info'
  
  if (percentage >= 100) {
    message = '任务已完成!'
    type = 'success'
  } else if (percentage >= 50) {
    message = `进度过半: ${percentage}%`
    type = 'info'
  } else {
    message = `进度较低: ${percentage}%`
    type = 'warning'
  }
  
  ElMessage({ message, type, duration: 2000 })
  addEventLog('progress', message)
}

// 徽章点击事件
function handleBadgeClick(tag: ParsedTag) {
  const value = tag.props.value || '0'
  const content = tag.content || '消息'
  ElMessage.success(`${content}: ${value} 条新通知`)
  addEventLog('badge', `查看${content}: ${value}条`)
}

// 执行转换
function handleConvert() {
  parsedTags.value = parseContent(inputText.value)
  // 重置所有状态
  dialogStates.value = {}
  switchStates.value = {}
  selectStates.value = {}
  inputStates.value = {}
  
  if (parsedTags.value.length > 0) {
    addEventLog('system', `转换成功，共 ${parsedTags.value.length} 个元素`)
  }
}

// 加载测试用例
function loadTestCase(testCase: TestCase) {
  currentTestCase.value = testCase
  inputText.value = testCase.input
  showTestCases.value = false
  handleConvert()
  addEventLog('system', `加载测试用例: ${testCase.name}`)
}

// 清空内容
function clearContent() {
  inputText.value = ''
  parsedTags.value = []
  dialogStates.value = {}
  switchStates.value = {}
  selectStates.value = {}
  inputStates.value = {}
  currentTestCase.value = null
  eventLogs.value = []
}

// 打开对话框
function openDialog(index: number) {
  dialogStates.value[index] = true
  addEventLog('dialog', '打开对话框')
}

// 关闭对话框
function closeDialog(index: number, confirmed: boolean = false) {
  dialogStates.value[index] = false
  addEventLog('dialog', confirmed ? '确认并关闭对话框' : '关闭对话框')
  if (confirmed) {
    ElMessage.success('操作已确认')
  }
}

// 获取支持的标签列表
const supportedTags = getSupportedTags()

// 获取日志标签类型
function getLogTagType(type: string): '' | 'success' | 'warning' | 'info' | 'danger' {
  const typeMap: Record<string, '' | 'success' | 'warning' | 'info' | 'danger'> = {
    'button': '',
    'switch': 'success',
    'select': 'success',
    'input': 'info',
    'link': 'warning',
    'tag': 'info',
    'dialog': '',
    'progress': 'warning',
    'badge': 'danger',
    'system': 'info'
  }
  return typeMap[type] || 'info'
}
</script>

<template>
  <div class="converter-container">
    <div class="converter-header">
      <h1>内容转换器</h1>
      <p class="subtitle">将自定义标签转换为 Element Plus 组件</p>
    </div>

    <div class="converter-body">
      <!-- 左侧输入区 -->
      <div class="input-panel">
        <div class="panel-header">
          <span class="panel-title">输入区</span>
          <div class="panel-actions">
            <el-dropdown trigger="click" @command="loadTestCase">
              <el-button size="small" type="primary">
                测试用例 <el-icon class="el-icon--right"><arrow-down /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <template v-for="group in testCaseGroups" :key="group.label">
                    <el-dropdown-item disabled class="dropdown-group-title">
                      {{ group.label }}
                    </el-dropdown-item>
                    <el-dropdown-item 
                      v-for="testCase in group.cases" 
                      :key="testCase.name"
                      :command="testCase"
                    >
                      {{ testCase.name }}
                    </el-dropdown-item>
                  </template>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-button size="small" @click="clearContent">清空</el-button>
          </div>
        </div>
        <!-- 当前测试用例信息 -->
        <div v-if="currentTestCase" class="test-case-info">
          <el-tag type="success" size="small">{{ currentTestCase.name }}</el-tag>
          <span class="test-case-desc">{{ currentTestCase.description }}</span>
          <span class="test-case-expected">预期: {{ currentTestCase.expectedComponents }} 个组件</span>
        </div>
        <el-input
          v-model="inputText"
          type="textarea"
          :rows="20"
          placeholder="请输入自定义标签内容，例如：
[button type=&quot;primary&quot;]点击我[/button]
[tag type=&quot;success&quot;]标签[/tag]
[input placeholder=&quot;请输入...&quot;/]"
          class="input-textarea"
        />
        <div class="supported-tags">
          <span class="tags-label">支持的标签：</span>
          <el-tag 
            v-for="tag in supportedTags" 
            :key="tag" 
            size="small" 
            class="tag-item"
          >
            [{{ tag }}]
          </el-tag>
        </div>
      </div>

      <!-- 中间转换按钮 -->
      <div class="convert-action">
        <el-button type="primary" size="large" @click="handleConvert">
          转换 →
        </el-button>
      </div>

      <!-- 右侧预览区 -->
      <div class="preview-panel">
        <div class="panel-header">
          <span class="panel-title">预览区</span>
          <div class="panel-header-right">
            <el-tag type="info" size="small">
              {{ parsedTags.length }} 个元素
            </el-tag>
            <el-tag v-if="eventLogs.length > 0" type="success" size="small">
              {{ eventLogs.length }} 条事件
            </el-tag>
          </div>
        </div>
        <div class="preview-content">
          <template v-if="parsedTags.length === 0">
            <div class="empty-preview">
              <el-empty description="请输入内容并点击转换" />
            </div>
          </template>
          <template v-else>
            <div class="rendered-items">
              <template v-for="(tag, index) in parsedTags" :key="index">
                <!-- 纯文本 -->
                <span v-if="tag.isText" class="text-content">
                  {{ tag.content }}
                </span>

                <!-- 按钮 -->
                <el-button
                  v-else-if="tag.type === 'button'"
                  :type="(tag.props.type as any) || 'default'"
                  :size="(tag.props.size as any) || 'default'"
                  @click="handleButtonClick(tag)"
                >
                  {{ tag.content || '按钮' }}
                </el-button>

                <!-- 标签 -->
                <el-tag
                  v-else-if="tag.type === 'tag'"
                  :type="(tag.props.type as any) || ''"
                  :size="(tag.props.size as any) || 'default'"
                  class="clickable-tag"
                  @click="handleTagClick(tag)"
                >
                  {{ tag.content || '标签' }}
                </el-tag>

                <!-- 链接 -->
                <el-link
                  v-else-if="tag.type === 'link'"
                  :type="(tag.props.type as any) || 'primary'"
                  :href="tag.props.href || '#'"
                  @click="handleLinkClick($event, tag)"
                >
                  {{ tag.content || '链接' }}
                </el-link>

                <!-- 输入框 -->
                <el-input
                  v-else-if="tag.type === 'input'"
                  v-model="inputStates[index]"
                  :placeholder="tag.props.placeholder || '请输入'"
                  :type="tag.props.type || 'text'"
                  style="width: 200px"
                  @input="handleInputChange(index, inputStates[index] || '', tag)"
                />

                <!-- 选择器 -->
                <el-select
                  v-else-if="tag.type === 'select'"
                  v-model="selectStates[index]"
                  :placeholder="tag.props.placeholder || '请选择'"
                  style="width: 200px"
                  @change="handleSelectChange(index, selectStates[index] || '', tag)"
                >
                  <el-option
                    v-for="opt in (tag.props.options || '').split(',')"
                    :key="opt"
                    :label="opt.trim()"
                    :value="opt.trim()"
                  />
                </el-select>

                <!-- 开关 -->
                <el-switch
                  v-else-if="tag.type === 'switch'"
                  v-model="switchStates[index]"
                  @change="handleSwitchChange(index, switchStates[index] || false, tag)"
                />

                <!-- 警告提示 -->
                <el-alert
                  v-else-if="tag.type === 'alert'"
                  :title="tag.props.title || '提示'"
                  :type="(tag.props.type as any) || 'info'"
                  :description="tag.content"
                  :closable="false"
                  show-icon
                  style="margin: 8px 0"
                />

                <!-- 进度条 -->
                <el-progress
                  v-else-if="tag.type === 'progress'"
                  :percentage="Number(tag.props.percentage) || 0"
                  :status="(tag.props.status as any) || ''"
                  style="width: 200px; cursor: pointer"
                  @click="handleProgressClick(tag)"
                />

                <!-- 徽章 -->
                <el-badge
                  v-else-if="tag.type === 'badge'"
                  :value="tag.props.value || '0'"
                  class="badge-item"
                >
                  <el-button size="small" @click="handleBadgeClick(tag)">{{ tag.content || '消息' }}</el-button>
                </el-badge>

                <!-- 对话框 -->
                <template v-else-if="tag.type === 'dialog'">
                  <el-button type="primary" @click="openDialog(index)">
                    打开对话框
                  </el-button>
                  <el-dialog
                    v-model="dialogStates[index]"
                    :title="tag.props.title || '对话框'"
                    width="500"
                  >
                    <p>{{ tag.content }}</p>
                    <template #footer>
                      <el-button @click="closeDialog(index, false)">关闭</el-button>
                      <el-button type="primary" @click="closeDialog(index, true)">确定</el-button>
                    </template>
                  </el-dialog>
                </template>
              </template>
            </div>
          </template>
        </div>
        
        <!-- 事件日志 -->
        <div v-if="eventLogs.length > 0" class="event-logs">
          <div class="logs-header">
            <span class="logs-title">事件日志</span>
            <el-button size="small" text type="danger" @click="eventLogs = []">
              清空
            </el-button>
          </div>
          <div class="logs-content">
            <div 
              v-for="(log, idx) in eventLogs" 
              :key="idx" 
              class="log-item"
            >
              <span class="log-time">{{ log.time }}</span>
              <el-tag size="small" :type="getLogTagType(log.type)">{{ log.type }}</el-tag>
              <span class="log-message">{{ log.message }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.converter-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
}

.converter-header {
  text-align: center;
  margin-bottom: 32px;
}

.converter-header h1 {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  color: #303133;
  letter-spacing: 2px;
}

.subtitle {
  margin: 12px 0 0;
  color: #606266;
  font-size: 15px;
}

.converter-body {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.input-panel,
.preview-panel {
  flex: 1;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 24px;
  border: 1px solid #ebeef5;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f2f5;
}

.panel-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  display: flex;
  align-items: center;
  gap: 8px;
}

.panel-title::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 18px;
  background: linear-gradient(180deg, #409eff 0%, #79bbff 100%);
  border-radius: 2px;
}

.panel-actions {
  display: flex;
  gap: 8px;
}

.input-textarea {
  width: 100%;
}

.input-textarea :deep(.el-textarea__inner) {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
  font-size: 13px;
  line-height: 1.7;
  border-radius: 8px;
  border: 1px solid #dcdfe6;
  transition: border-color 0.2s;
}

.input-textarea :deep(.el-textarea__inner:focus) {
  border-color: #409eff;
}

.supported-tags {
  margin-top: 16px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.tags-label {
  font-size: 13px;
  color: #606266;
  font-weight: 500;
}

.tag-item {
  font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
  font-size: 12px;
}

.convert-action {
  display: flex;
  align-items: center;
  padding: 0 12px;
}

.convert-action :deep(.el-button) {
  padding: 16px 28px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
  transition: all 0.3s;
}

.convert-action :deep(.el-button:hover) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.4);
}

.preview-content {
  min-height: 400px;
  background: linear-gradient(180deg, #fafbfc 0%, #f5f7fa 100%);
  border-radius: 8px;
  padding: 24px;
  border: 1px dashed #dcdfe6;
}

.empty-preview {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 360px;
}

.rendered-items {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-start;
}

.text-content {
  color: #606266;
  line-height: 32px;
  font-size: 14px;
}

.badge-item {
  margin-right: 20px;
}

.test-case-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background: linear-gradient(135deg, #f0f9eb 0%, #e1f3d8 100%);
  border-radius: 8px;
  margin-bottom: 12px;
  border: 1px solid #c2e7b0;
}

.test-case-desc {
  font-size: 13px;
  color: #606266;
  flex: 1;
}

.test-case-expected {
  font-size: 12px;
  color: #67c23a;
  font-weight: 500;
  background: #fff;
  padding: 4px 8px;
  border-radius: 4px;
}

.dropdown-group-title {
  font-weight: 600;
  color: #909399;
  font-size: 12px;
  cursor: default;
}

:deep(.el-dropdown-menu__item.is-disabled) {
  color: #303133 !important;
  font-weight: 600;
  background: #f5f7fa;
}

.panel-header-right {
  display: flex;
  gap: 8px;
  align-items: center;
}

.clickable-tag {
  cursor: pointer;
  transition: transform 0.2s;
}

.clickable-tag:hover {
  transform: scale(1.05);
}

.event-logs {
  margin-top: 16px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  background: #fff;
  overflow: hidden;
}

.logs-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7ed 100%);
  border-bottom: 1px solid #e4e7ed;
}

.logs-title {
  font-size: 13px;
  font-weight: 600;
  color: #606266;
}

.logs-content {
  max-height: 150px;
  overflow-y: auto;
  padding: 8px;
}

.log-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 4px;
  font-size: 12px;
  transition: background 0.2s;
}

.log-item:hover {
  background: #f5f7fa;
}

.log-time {
  color: #909399;
  font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
  font-size: 11px;
  min-width: 70px;
}

.log-message {
  color: #606266;
  flex: 1;
}
</style>
