# vue3-test

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## 教程

## 1、首先要安装node.js(18.3 或更高版本)

## 2、创建[vue3](https://cn.vuejs.org/guide/quick-start.html)项目

```
npm create vue@latest
```

然后按照自己的需要进行选择就行
![创建vue3的选项](https://i-blog.csdnimg.cn/direct/b4242d2ec9d348eb8b0286bf486bb679.png#pic_center)
**_到此vue3项目创建完成，接下来是搭建项目架构_**

## 3、配置[Vant](https://vant-ui.github.io/vant/#/zh-CN/quickstart#yin-ru-zu-jian) (移动端ui)

vue3项目引入vant，按需引入组件

```
// 引入vant
npm i vant
// 辅助按需引入样式
npm i @vant/auto-import-resolver unplugin-vue-components unplugin-auto-import -D
```

在文件vite.config.js，添加以下代码

```

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from '@vant/auto-import-resolver'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [VantResolver()],
    }),
    Components({
      resolvers: [VantResolver()],
    }),
  ]
})


```

**使用**
vue3中直接在使用的组件，按需引入需要用的组件就行，例如：

```
// test.vue
<template>
  <van-button type="primary">按钮</van-button>
</template>
```

## 4、配置环境变量

配置各个环境的配置文件
![.env配置文件](https://i-blog.csdnimg.cn/direct/ef9d9b6463f5499e973d8779277ffb41.png)

```
// 例如在.env.development文件中

NODE_EVN=development  // 环境变量
VITE_BASE_API=http://dev.os-api.vertlet.com // 请求的地址
```

```
// package.json 文件

 "scripts": {
    "dev": "vite --open --mode development",
    "test2": "vite --open --mode test",
    "gray": "vite --open --mode gray",
    "production": "vite --open --mode production",
    "build:gray": "vite build  --mode gray",
    "build:dev": "vite build  --mode development",
    "build:test2": "vite build  --mode test",
    "build:prod": "vite build",
    "preview": "vite preview"
  },
```

## 5、配置axios请求

```
// 创建request.ts 文件，封装axios
import axios from 'axios'
import { showToast } from 'vant'

const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  timeout: 30000,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
})

// 请求拦截
instance.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem('token')
    // 在发送请求之前做些什么
    if (token) {
      config.headers['Xl-Os-Token'] = token
    }
    if (config.method == 'get') {
      config.params.from_mobile = 1
    } else {
      config.data.from_mobile = 1
    }
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  },
)

// 响应拦截
instance.interceptors.response.use(
  (response) => {
    const { data } = response
    if (data.code === 0) {
      // 请求成功
      return data
    }
    showToast(data.msg)
  },
  function (err) {
    console.log(err)
    return Promise.reject(err)
  },
)

export function GET(url: string, params: object, config?: object) {
  return instance({
    method: 'get',
    url,
    params,
    ...config,
  })
}

export function POST(url: string, data: object, config?: object) {
  return instance({
    method: 'post',
    url,
    data,
    ...config,
  })
}

```

## 6、pinia使用

**定义store**

```
// store/counter.ts

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})

```

**使用store**
在需要的vue组件中，引入store

```
// views/index.vue

<template>
  <p>count:{{ count }}</p>
  <p>doubleCount:{{ doubleCount }}</p>
  <van-button type="primary" @click="increment">anniu</van-button>
</template>

<script setup lang="ts">
// import { getShopGroupList } from '@/service/index'
import { useCounterStore } from '@/stores/counter'
import { storeToRefs } from 'pinia'

const store = useCounterStore()
const { count, doubleCount } = storeToRefs(store)
const { increment } = store
</script>
<style lang="scss" scoped></style>

```

## 移动端设配问题

使用amfe-flexable，postcss-pxtorem，进行移动端适配；

> **amfe-flexable：** 是阿里发布的一套可伸缩适配方案。它能根据设备的宽高来设置页面body元素的字体大小，将1rem设置为设备宽度/10以及在页面大小转换时可以重新计算这些数值，但仅限于`<style></style>`标签里设置的px，对于行内样式和百分比是不生效的。

> **postcss-pxtorem**是postcss的一个插件，可以将对应的像素单位转换为rem。在vite中可以直接对其进行配置，因为vite已经集成了postcss。
>
> 其中最重要的配置属性为：
>
> - rootValue：根元素的值，即1rem对应的像素值大小。一般设置为设计稿尺寸/10
>   以及一些其他属性：
> - propList：需要进行转换的css属性的值，可以使用通配符。如：*意思是将全部属性单位都进行转换；["*position\*"]会匹配到background-position-y
> - selectorBlackList：不进行单位转换的选择器。如设置为字符串body，则所有含有body字符串的选择器都不会被该插件进行转换；若设置为[/^body$/]，则body会被匹配到而不是.body
> - exclude：不需要进行单位转换的文件 mediaQuery：是否允许像素在媒体查询中进行转换

```
//npm方式
npm install postcss-pxtorem --save-dev
npm install amfe-flexible --save-dev

//pnpm方式
pnpm add postcss-pxtorem -D
pnpm add amfe-flexible -D

```

如果项目用的是ts，还需要安装

```
npm i --save-dev @types/postcss-pxtorem
```

由于amfe-flexible没有提供类型信息文件，所以需要自己定义一个`.d.ts`文件；
使用declare关键字来告诉TypeScript编译器存在一个名为amfe-flexible的模块，但是不提供具体的类型信息

```
// amfe-flexible.d.ts

declare module 'amfe-flexible'
```

```
// tsconfig.app.json
{
  "extends": "@vue/tsconfig/tsconfig.dom.json",
  "include": [
    "env.d.ts",
    "src/**/*",
    "./auto-imports.d.ts",
    "./components.d.ts",
    "./amfe-flexible.d.ts"
  ],
  "exclude": ["src/**/__tests__/*"],
  "compilerOptions": {
    "composite": true,
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "allowJs": true,
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}

```

```
// main.js

import 'amfe-flexible'

```

```
// vite.config.js 配置postcss-pxtorem

import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import postCssPxToRem from 'postcss-pxtorem'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css:{
    postcss:{
      plugins:[
        postCssPxToRem({
          rootValue:37.5,
          propList:['*'],
        })
      ]
    }
  }
})


```

## 引入scss

```
npm i sass -D
```

```
// vite.config.ts

export default defineConfig({
  plugins: [
 // ...
  css: {
    preprocessorOptions: {
      scss: {
        // 配置全局sass变量注入
        additionalData: '@use "@/styles/variable.scss";',
      },
    },
  },
})
```

## 添加调试面板VConsole

> vConsole是一个轻量、可拓展、针对手机网页的前端开发者调试面板

```
npm install vconsole
```

```
// main.js

import VConsole from 'vconsole';

if (import.meta.env.MODE !== "production") {
// 生产环境不展示
  new VConsole();
}
```

## 遇到问题

> **BUG**：在vue文件中导入ts，会出现标红报错：Cannot find module '@/service/index' or
> its corresponding type declarations.Vetur(2307)

**解决**：在使用vue2的时候，用的插件是vetur；但是vue3推荐使用的是vue-offical。只要切换一下插件就没问题了。

> **BUG**：配置vant后，由于插件能帮我们自动引入，因此无需手动引入组件，导致ts识别为“Cannot find name
> 'showToast'”，如图：
> ![vant无需导入ts报错](https://i-blog.csdnimg.cn/direct/01a6293a7083434ab69d1759f5846309.png)

**解决**：需要把生成的auto-imports.d.ts和components.d.ts引入tsconfig中，如图
![ts配置auto-import](https://i-blog.csdnimg.cn/direct/bc2f230e87e4403894e0f9e70b2b0cc7.png)
