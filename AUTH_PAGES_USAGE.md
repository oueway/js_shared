# 认证页面使用指南

## ✨ 特性

- **统一配置**：Supabase 和 UI 配置只需设置一次
- **零参数**：所有页面创建函数不需要传递参数
- **自动共享**：所有页面自动共享配置

## 📦 完整设置示例

### 1. 在应用根部配置 Providers

```tsx
// app/layout.tsx (Next.js App Router)
import { AuthProvider, AuthUIProvider } from '@oueway/js-shared/lib';
import { createClient } from '@oueway/js-shared/lib';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider
          supabase={supabase}
          config={{
            supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
            supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          }}
        >
          <AuthUIProvider
            config={{
              logo: 'M', // 或传入任意 React 元素
              companyName: 'My App',
              enableOAuth: true,
              oauthProviders: ['google', 'apple'],
              redirectAfterLogin: '/dashboard',
              redirectAfterRegister: '/dashboard',
              forgotPasswordLink: '/forgot-password',
              registerLink: '/register',
              loginLink: '/login',
              authCallbackUrl: '/auth/callback',
            }}
          >
            {children}
          </AuthUIProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
```

### 2. 创建认证页面（零配置！）

```tsx
// app/login/page.tsx
import { createLoginPage } from '@oueway/js-shared/pages';

const LoginPage = createLoginPage();
export default LoginPage;
```

```tsx
// app/register/page.tsx
import { createRegisterPage } from '@oueway/js-shared/pages';

const RegisterPage = createRegisterPage();
export default RegisterPage;
```

```tsx
// app/forgot-password/page.tsx
import { createForgotPasswordPage } from '@oueway/js-shared/pages';

const ForgotPasswordPage = createForgotPasswordPage();
export default ForgotPasswordPage;
```

```tsx
// app/reset-password/page.tsx
import { createResetPasswordPage } from '@oueway/js-shared/pages';

const ResetPasswordPage = createResetPasswordPage();
export default ResetPasswordPage;
```

### 3. 可选：页面级覆盖配置

如果某个页面需要特殊配置，可以传递参数：

```tsx
// 重置密码后跳转到特定页面
const ResetPasswordPage = createResetPasswordPage({
  redirectAfterReset: '/welcome',
});
```

```tsx
// 自定义密码重置链接
const ForgotPasswordPage = createForgotPasswordPage({
  resetPasswordUrl: 'https://myapp.com/reset-password',
});
```

## 🎨 AuthUIConfig 配置项

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `logo` | `React.ReactNode` | `'O'` | Logo（可以是文本、图片或任意组件） |
| `appName` | `string` | `undefined` | 应用名称 |
| `enableOAuth` | `boolean` | `true` | 是否启用 OAuth |
| `oauthProviders` | `Array<'google' \| 'apple'>` | `['google', 'apple']` | OAuth 提供商 |
| `redirectAfterLogin` | `string` | `'/dashboard'` | 登录后跳转 |
| `redirectAfterRegister` | `string` | `'/dashboard'` | 注册后跳转 |
| `forgotPasswordLink` | `string` | `'/forgot-password'` | 忘记密码链接 |
| `registerLink` | `string` | `'/register'` | 注册链接 |
| `loginLink` | `string` | `'/login'` | 登录链接 |
| `authCallbackUrl` | `string` | `undefined` | OAuth 回调 URL |

## 🔄 Before vs After

### ❌ 之前（需要重复配置）

```tsx
// 每个页面都要传递相同的配置
const LoginPage = createLoginPage({
  supabase,
  logoLetter: 'M',
  appName: 'My App',
  enableOAuth: true,
  // ... 更多重复配置
});

const RegisterPage = createRegisterPage({
  supabase,
  logoLetter: 'M',
  appName: 'My App',
  enableOAuth: true,
  // ... 又是相同的配置
});
```

### ✅ 现在（配置一次，到处使用）

```tsx
// 在根部配置一次
<AuthProvider supabase={supabase} config={...}>
  <AuthUIProvider config={{ logo: <YourLogo />, appName: 'My App', ... }}>
    {children}
  </AuthUIProvider>
</AuthProvider>

// 页面中零配置
const LoginPage = createLoginPage();
const RegisterPage = createRegisterPage();
const ForgotPasswordPage = createForgotPasswordPage();
const ResetPasswordPage = createResetPasswordPage();
```

## 🎨 Logo 自定义示例

### 使用文本字母
```tsx
<AuthUIProvider config={{ logo: 'M' }}>
```

### 使用图片
```tsx
<AuthUIProvider config={{
  logo: <img src="/logo.png" alt="Logo" className="w-10 h-10" />
}}>
```

### 使用自定义组件
```tsx
<AuthUIProvider config={{
  logo: (
    <div className="flex items-center justify-center">
      <YourLogoSVG className="w-8 h-8" />
    </div>
  )
}}>
```

### 使用 Next.js Image
```tsx
import Image from 'next/image';

<AuthUIProvider config={{
  logo: <Image src="/logo.png" alt="Logo" width={40} height={40} />
}}>
```

## 💡 提示

1. **Tailwind CSS**：记得在你的 Next.js 项目中配置 Tailwind，参考 `TAILWIND_USAGE.md`
2. **类型安全**：所有配置都有完整的 TypeScript 类型支持
3. **默认值**：如果不提供配置，使用合理的默认值
4. **灵活性**：可以在应用级统一配置，也可以在页面级个性化覆盖
5. **Logo 容器**：Logo 会被渲染在一个 `h-12 w-12` 的圆角方形容器中，可以根据需要调整 logo 大小
