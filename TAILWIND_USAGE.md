# 如何在项目中使用 Tailwind CSS

## 📌 重要说明

这个共享库 **不包含** Tailwind CSS 配置。组件中使用的是 Tailwind 类名（如 `className="flex min-h-screen..."`），但 CSS 编译应该在**最终的 Next.js 应用**中完成。

## ✅ 推荐做法：在 Next.js 应用中配置 Tailwind

### 1. 在你的 Next.js 项目中安装 Tailwind CSS

```bash
# 在你的 Next.js 应用目录中执行
pnpm add -D tailwindcss@latest postcss autoprefixer
npx tailwindcss init -p
```

### 2. 配置 Tailwind 扫描这个共享库

```js
// 你的 Next.js 项目的 tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    
    // 👇 重要：扫描共享库中的组件
    './node_modules/@oueway/js-shared/**/*.{js,mjs}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### 3. 在你的应用中导入 Tailwind CSS

```css
/* app/globals.css 或 styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

```tsx
// app/layout.tsx 或 pages/_app.tsx
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### 4. 使用共享库的组件

```tsx
import { createLoginPage } from '@oueway/js-shared/pages';

const LoginPage = createLoginPage({
  supabase,
  logoLetter: 'M',
  companyName: 'My App',
});

export default LoginPage;
```

## 🎨 自定义样式

你可以在 Next.js 应用的 `tailwind.config.js` 中自定义主题：

```js
module.exports = {
  content: [
    // ...
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          // 自定义你的主色调
          500: '#your-color',
        },
      },
    },
  },
};
```

## 📦 为什么这样做？

1. ✅ **避免重复打包** - CSS 只在最终应用中编译一次
2. ✅ **更灵活** - 每个应用可以自定义主题
3. ✅ **更小的包体积** - 共享库不包含 CSS，只有 JS 代码
4. ✅ **标准做法** - 这是 Tailwind CSS 官方推荐的组件库开发方式

## 🔧 排错

如果样式没有生效，请检查：

1. Tailwind 配置的 `content` 是否包含了 `node_modules/@oueway/js-shared/**/*.{js,mjs}`
2. 是否在应用入口导入了全局 CSS 文件
3. 运行 `pnpm dev` 后重新加载页面
