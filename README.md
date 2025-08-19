# Mealcomes Component Library

Mealcomes 是一个基于 [Vue 3](https://vuejs.org/) 和 [Vite](https://vitejs.dev/) 的个人用于学习前端的组件库，参考了 [Element Plus](https://element-plus.org/) 的工程结构。

## 特性

-   🌈 ~~按需引入~~ & 全局注册
-   ⚡️ Vite 极速打包
-   💡 TypeScript 类型支持
-   🎨 可扩展主题（theme-chalk）
-   🧩 ~~丰富的~~UI 组件

## 安装

```bash
npm install mealcomes
# 或
pnpm add mealcomes
```

## 完整引入

``` ts
// main.ts
import { createApp } from 'vue'
import App from './App.vue'

import Mealcomes from 'mealcomes'
import 'mealcomes/theme-chalk/index.css'

const app = createApp(App)

app.use(Mealcomes)
app.mount('#app')
```

## 文档 (完善中)

见 [https://mealcomes.github.io/mc-component](https://mealcomes.github.io/mc-component/)

## 目录结构

```
mealcomes/
├── packages/
│   ├── components/    # 组件目录，每个组件一个文件夹
│   ├── utils/         # 工具函数
│   ├── constants/     # 常量
│   ├── theme-chalk/   # 主题样式
├── typings/           # 类型声明
├── dist/              # 打包产物
├── docs/              # 文档
├── play/              # 本地调试
├── scripts/           # 辅助脚本
```
