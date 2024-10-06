# OpenAI Assistants 管理器

[English README](README.md)

OpenAI Assistants 管理器是一个基于 Next.js 开发的简单 Web 应用，用于管理和配置您的 OpenAI Assistants。这个轻量级工具提供了一个直观的界面，让您无需复杂设置即可轻松查看、编辑和更新您的 AI 助手。

## 功能特点

- 简单直观的界面
- 查看和管理所有 OpenAI Assistants
- 快速编辑助手的名称、指令和模型
- 轻松调整助手的响应格式、温度和 top_p 参数
- 安全的 API 密钥管理（客户端存储）
- 响应式设计，支持桌面和移动设备
- 无需后端 - 完全在浏览器中运行

## 本地开发

1. 克隆仓库：

   ```bash
   git clone https://github.com/okooo5km/openai-assistants-manager.git
   ```

2. 进入项目目录：

   ```bash
   cd openai-assistants-manager
   ```

3. 安装依赖：

   ```bash
   npm install
   ```

4. 启动开发服务器：

   ```bash
   npm run dev
   ```

5. 打开浏览器并访问：

   ```bash
   # macOS 下
   open http://localhost:3000
   # Windows 下
   start http://localhost:3000
   ```

## 部署

### Vercel 部署

这个简单的项目可以通过几次点击轻松部署到 Vercel。点击下方按钮进行部署：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fokooo5km%2Fopenai-assistants-manager)

### Netlify 部署

您也可以将此项目部署到 Netlify。按照以下步骤操作：

1. 将此仓库 fork 到您的 GitHub 账户。
2. 登录您的 Netlify 账户。
3. 点击 "New site from Git"。
4. 选择 GitHub 作为您的 Git 提供商。
5. 选择您 fork 的仓库。
6. 在 "Build settings" 部分：
   - 设置构建命令为：`npm run build`
   - 设置发布目录为：`.next`
7. 点击 "Deploy site"。

或者，您可以点击下方按钮快速部署：

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/okooo5km/openai-assistants-manager)

## 贡献

欢迎提交 issues 和 pull requests 来改进这个简单的项目。如果您有任何建议或发现了 bug，请随时提出。

## 许可证

[MIT License](LICENSE)

## 联系方式

如果您对这个简单工具有任何问题或建议，请通过以下方式联系我们：

- 创建一个 GitHub issue
- 发送邮件到：[okooo5km@gmail.com](mailto:okooo5km@gmail.com)

感谢您使用 OpenAI Assistants 管理器！
