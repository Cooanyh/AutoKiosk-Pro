# AutoKiosk-Pro

一款 Electron 应用，用于在电脑开机后自动全屏打开指定网页，支持置顶显示、缩放记忆、定时提醒和定时关机等功能。

## ✨ 功能特性

- **全屏置顶显示**：开机后自动全屏打开设定的网页，并始终保持在最前端。
- **缩放记忆**：自动保存并恢复您设置的页面缩放比例。
- **开机自启动**：一键设置应用开机自启动。
- **多重定时提醒**：支持设置多个定时消息提醒，以美观的悬浮卡片形式弹出。
- **定时关机**：支持设置自动关机时间。
- **快捷键控制**：
  - `Ctrl+Alt+S`：打开设置界面
  - `Ctrl+Alt+Q`：退出应用

## 🚀 快速开始

### 开发模式

```bash
# 安装依赖
npm install

# 启动应用
npm start
```

### 打包为可执行文件

```bash
# 安装打包依赖
npm install electron-builder --save-dev

# 打包为 Windows 可执行文件
npm run build
```

打包后的 `.exe` 文件位于 `dist/` 目录。

## 📖 使用说明

1. 启动应用后，默认会全屏加载 `https://coren.xin/`。
2. 按下 `Ctrl+Alt+S` 打开设置界面，配置您的启动网址、缩放比例、定时提醒等。
3. 保存设置后，应用会自动应用新配置。
4. 若需要退出应用，请使用 `Ctrl+Alt+Q`。

## 📁 项目结构

```
AutoKiosk-Pro/
├── main.js           # Electron 主进程
├── preload.js        # 预加载脚本
├── settings.html     # 设置界面
├── reminder.js       # 提醒弹窗脚本
├── package.json      # 项目配置
└── doc/              # 项目文档
    └── progress.md   # 开发进度
```

## 📜 许可证

本项目采用 [MIT License](LICENSE) 开源。
