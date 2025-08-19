---
title: 指南
---

## 安装

::: code-group

```shell [npm]
$ npm install mealcomes --save
```

```shell [yarn]
$ yarn add mealcomes
```

```shell [pnpm]
$ pnpm install mealcomes
```

:::

## 快速开始

### 完整引入

```ts [main.ts]
import { createApp } from 'vue';
import App from './App.vue';
import MealComes from 'mealcomes';
import 'mealcomes/theme-chalk/index.css';

const app = createApp(App);

app.use(MealComes);
app.mount('#app');
```
