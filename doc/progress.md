# 项目进展总结

## 2025-12-28
- [x] 创建项目文件夹 `AutoKiosk-Pro`
- [x] 初始化 Git 仓库
- [x] 初始化 npm 项目并安装 Electron 依赖
- [x] 实现 `main.js` 主进程逻辑（支持全屏、置顶、多重提醒、定时关机）
- [x] 实现 `settings.html` 设置界面（支持多重提醒列表、现代 UI）
- [x] 配置 `package.json` 启动脚本
- [x] 自动创建 GitHub 仓库并推送代码 (已排除 node_modules)
- [x] 添加 README.md 和 MIT LICENSE
- [x] 配置并使用 electron-builder 打包为 Windows .exe 文件
- [x] 修复全局快捷键注册问题（添加 Menu 加速器备选）
- [x] 更新默认 URL 为 https://coren.xin/
- [x] 设置界面支持中英双语切换（默认中文）
- [x] 提醒弹窗改为居中模态框，支持手动关闭和 Markdown 渲染
- [x] 添加 prebuild 脚本自动清理 dist 目录
- [x] 创建 GitHub Release v1.2.0
- [x] 修复设置界面被置顶窗口遮挡问题
- [x] 提醒输入框支持多行文本和 Markdown
- [x] 保存设置后自动关闭设置窗口
- [x] 提醒支持自定义重复（仅一次/每天/工作日/周末）
- [x] 设置界面添加立即关机/重启按钮
- [x] 页面角落添加半透明浮动设置按钮
- [x] 首次启动时高亮显示浮动按钮并给出快捷键提示
- [x] 发布 GitHub Release v1.4.0

### 当前状态
所有功能已完成，当前版本 1.4.0。
