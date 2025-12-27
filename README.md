<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 抽奖与分组工具 (Lottery & Grouping Tool)

这是一个基于 React 和 Vite 构建的 AI 辅助应用，用于运行抽奖和分组任务。

## 本地运行 (Run Locally)

**前置要求:** [Node.js](https://nodejs.org/)

1. **安装依赖**:

   ```bash
   npm install
   ```

2. **配置环境变量**:
   复制 `.env.example` (如果有) 或直接在项目根目录新建 `.env` 文件，并设置 Gemini API Key:

   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

   *(注意: Vite 项目中环境变量通常以 `VITE_` 开头)*

3. **启动应用**:

   ```bash
   npm run dev
   ```

## 部署 (Deployment)

本项目已配置 GitHub Actions 自动部署。

1. 确保你的代码已推送到 GitHub 仓库的 `main` 分支。
2. GitHub Action 会自动触发构建，并将构建产物 (`dist` 目录) 部署到 `gh-pages` 分支。
3. 进入 GitHub 仓库 -> **Settings** -> **Pages**。
4. 在 **Build and deployment** 下 source 选择 **Deploy from a branch**。
5. Branch 选择 **gh-pages** / **root**，然后保存。
6. 稍等片刻，你的应用即可通过 GitHub Pages URL 访问。

## 目录结构

- `src/`: 源代码
- `public/`: 静态资源
- `.github/workflows/`: 自动部署脚本
