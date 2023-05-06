## 项目概述

1. 使用`Next.js`框架开发前端页面及服务端接口；
2. 前端页面采用`"use client";`的方式进行页面渲染；
3. 服务端通过`fetch`调用`openai`相关接口；
4. 当前`openai`所使用的`model`是`gpt-3.5-turbo-0301`；

## 如何开始

### 安装依赖

```bash
npm install
```

### 本地运行

```bash
npm run dev
```

### 本地预览

使用浏览器打开 [http://localhost:3000](http://localhost:3000) 查看结果。

## 如何修改

1. 修改`src/app/page.tsx`文件进行页面调整；
2. 修改`src/app/api/chat/route.ts`文件进行接口维护；

## 配置管理
1. `.env.local`用于管理本地开发过程所使用的`OPENAI_API_ORGANIZATION`、`OPENAI_API_KEY`
2. `.env.production`用于管理生产环境所使用的`OPENAI_API_ORGANIZATION`、`OPENAI_API_KEY`

> 1. `.env.local`已经被`.gitignore`
> 2. 第一次部署到生产环境的时候，需要手动创建一份`.env.production`