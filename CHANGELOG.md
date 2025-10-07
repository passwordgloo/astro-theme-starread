# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.10.0](https://gitee.com/passwordgloo/star-read/compare/v1.9.1...v1.10.0) (2025-10-07)


### 🔧 Chores

* 移除 conventional-changelog 相关依赖和脚本 ([5e1bef1](https://gitee.com/passwordgloo/star-read/commit/5e1bef15134aa8c34f5ae2f8399d08892cbc577f))


### 🎨 Style

* **layouts:** 更新分类页面样式使用主题色 ([0024584](https://gitee.com/passwordgloo/star-read/commit/0024584e2d3c3c7dfa553b1f11ad82ba6136c22f))
* **tag:** 更新标签页面的颜色样式以匹配主题 ([4432a7e](https://gitee.com/passwordgloo/star-read/commit/4432a7eb6f763cc7e5df05828e8a968b422e6c04))
* 优化代码块样式并清理无用配置 ([0d88671](https://gitee.com/passwordgloo/star-read/commit/0d886717dd901e0b497cffe6a861a63a9569b38c))


### ✨ Features

* **ArticleInfo:** 添加深色模式波浪动画效果并优化样式 ([b3b1fa1](https://gitee.com/passwordgloo/star-read/commit/b3b1fa185539e399c5372199c599127284d0172d))
* **ArticleNav:** 添加 basePath 属性支持不同路径的文章导航 ([aed8228](https://gitee.com/passwordgloo/star-read/commit/aed82282eb8c0cf0e3852658347a9f54e132d4b7))
* **ArticleTOC:** 将文章目录组件从Astro迁移到React并添加交互功能 ([c8bca00](https://gitee.com/passwordgloo/star-read/commit/c8bca00e9928bffadc583d9b33dcf235981236e4))
* **layouts:** 添加canonical链接并支持多内容类型 ([1d3a595](https://gitee.com/passwordgloo/star-read/commit/1d3a59555dcd4ee7810ce4804d7cface96f92c7d))
* **notes:** 添加笔记功能模块，包括配置和页面 ([3daf3f3](https://gitee.com/passwordgloo/star-read/commit/3daf3f3e79ead73e27334dc1e6c577c9be883f4e))
* **search:** 将搜索服务提供商切换为Algolia并添加相关组件 ([f340f97](https://gitee.com/passwordgloo/star-read/commit/f340f9758d495828139d9506399ef40df8974066))
* 支持笔记集合并优化文章链接处理 ([556a3c4](https://gitee.com/passwordgloo/star-read/commit/556a3c4ad999b235b25ef5985b406ea38cb53fcd))
* 添加主题包作为依赖安装支持 ([ed2f307](https://gitee.com/passwordgloo/star-read/commit/ed2f307f13be26483462ff9dfe8eec0b711a2d85))
* 添加多语言主题文档并更新配置 ([7055e2e](https://gitee.com/passwordgloo/star-read/commit/7055e2ee2b65c0eaf931df7b1bfe1dc6639eb09c))
* 添加多语言支持和永久链接功能 ([f6ff099](https://gitee.com/passwordgloo/star-read/commit/f6ff09972a890be9b4dcc5ce8e24210e7238d501))
* 添加多语言文档并更新package.json配置 ([cf7737a](https://gitee.com/passwordgloo/star-read/commit/cf7737aac1716bc72a936b901dea8b54c0a32987))
* 添加客户端路由并优化搜索组件 ([99f0a9c](https://gitee.com/passwordgloo/star-read/commit/99f0a9c1b95b2567c9f9c796edd2f43a54d9bc55))
* 添加自动更新永久链接和索引功能 ([f0cd353](https://gitee.com/passwordgloo/star-read/commit/f0cd353f855fbf46ec987c479b596db6a1d4e117))
* **路由:** 添加随机permalink支持并实现动态路由 ([e62b99c](https://gitee.com/passwordgloo/star-read/commit/e62b99c8d32b3be87eb1aa08ac4754e2beb2667a))

### [1.9.1](https://gitee.com/passwordgloo/star-read/compare/v1.9.0...v1.9.1) (2025-09-21)


### 🎨 Style

* **NavBar:** 优化搜索组件样式并移除冗余代码 ([e4ee914](https://gitee.com/passwordgloo/star-read/commit/e4ee914435a32f8ae68e59559e13602acc0491ca))


### ✨ Features

* **algolia:** 添加writeApiKey支持并优化配置处理 ([f2221bd](https://gitee.com/passwordgloo/star-read/commit/f2221bda26c23352c81caa5cc70fb39da485119a))
* **scripts:** 重写初始化脚本并添加交互式安装功能 ([c58d37c](https://gitee.com/passwordgloo/star-read/commit/c58d37ceb73d9c67417ad2751407346841a2a13c))
* **搜索:** 切换搜索服务提供商到algolia并添加错误处理 ([9c426c6](https://gitee.com/passwordgloo/star-read/commit/9c426c6864949976da3f98ab793d3d789c184038))
* **搜索:** 将默认搜索提供商改为本地并添加粘性目录功能 ([f882a51](https://gitee.com/passwordgloo/star-read/commit/f882a5123081154a7d85003dffc0e3842ca410d0))
* **搜索组件:** 添加基于Pagefind UI的搜索功能组件 ([9036da5](https://gitee.com/passwordgloo/star-read/commit/9036da57f14622c120859eaf2c6903b557ea4d96))
* 更新主题配置和安装脚本 ([461d01b](https://gitee.com/passwordgloo/star-read/commit/461d01bfd1eb11cbe2b0f7a3bb0aec4751584d64))
* 替换Algolia搜索为Pagefind实现本地搜索功能 ([5f3de0e](https://gitee.com/passwordgloo/star-read/commit/5f3de0e81137f2aac2c292dc707e83d22e0ba7e6))
* 添加Algolia搜索支持并优化主题配置 ([7a6bb42](https://gitee.com/passwordgloo/star-read/commit/7a6bb42f9c7d128839ad599b46e90135a5f7530f))
* 重构主题配置并添加多语言文档 ([ed90567](https://gitee.com/passwordgloo/star-read/commit/ed9056778c680c22a33ee7c815f452e4b595b620))


### 🔧 Chores

* **release:** 0.0.5 ([190dfc5](https://gitee.com/passwordgloo/star-read/commit/190dfc5989c5242325db70327a8c23a106c6af8a))
* **release:** 0.0.6 ([6e50c7a](https://gitee.com/passwordgloo/star-read/commit/6e50c7abb0f7c63c39f7e18aa8e5124ae2316439))
* 回滚版本号至1.9.0并更新发布脚本 ([febacf8](https://gitee.com/passwordgloo/star-read/commit/febacf8cf65024d8811104a35fd276864917adf5))
* 拆分发布命令为独立操作并添加组合发布命令 ([134f51c](https://gitee.com/passwordgloo/star-read/commit/134f51cb4566fef5462f06028f71eaf05b90a398))
* 更新 release 脚本并移除旧版 CHANGELOG ([f97a4bd](https://gitee.com/passwordgloo/star-read/commit/f97a4bdb858b4948eb5bbe1c0e916b23d78c9aba))
* 更新仓库链接至新地址 astro-theme-starread ([5073129](https://gitee.com/passwordgloo/star-read/commit/5073129d90820abc7cb6d79101e5f89ceecbb99a))
