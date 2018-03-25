# ReactIntl

## 目录结构

```bash
├── /tools/                     
│ └── extractChineseWords.js   # NodeJs，用于扫描和抽取文件夹下面文件中的中文
├── /src/                      # 项目源码目录
│ ├── /components/             # 组件
│ │ └── Translate.jsx          # 国际化组件，透传language context和封装antd国际化
│ ├── /pages/                  # 业务
│ │ └── International.jsx      # 国际化使用demo
│ ├── /languages/              # 语音包
│ │ └── EN.js                  # EN
│ ├── index.js                 # 入口文件，引入patchLanguage.js
│ └── patchLanguage.js         # 改写React.createElement方法来实现
└── .babelrc                   # babel配置
```

## 背景
```bash
由于公司业务发展，需要将现在成熟的系统国际化，开放给国际使用。
```

## 国际化方法

### 简单粗暴法（很累，人力成本大）    不可取
```bash
挨个文件处理，将中文抽离并且将变量关联起来，能用脚本抽离中文，但不能用脚本关联起来。
```

### 技术方法
```bash
通过技术的手段来实现国际化，最大程度的降低成本。

想法来源：
React.createElement方法的改写
参数1：元素标签
参数2: 属性
参数3: child [Arrary]

初步想法：
通过改写React.createElement方法，对第三个参数child为string的情况进行一层封装，包装一层组件。该组件作用是更具context.language属性进行语言切换。

要解决的问题：
1. 抽离中文的时候，如何规避掉注释
2. Input placeholder 也是需要国际化的一部分
3. 通过何种手段来实现国际化

方案：
1. node脚本抽离时使用babel对文件进行编译把注视过滤掉，然后抽离剩下的中文      ---参考tools／extractChineseWords.js
2. 同理对有placeholder属性的Input进行一层封装
3. React.createElement方法改写，child进行遍历，问string的时候套一层翻译组件
```