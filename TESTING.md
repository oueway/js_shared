# 测试文档

本项目使用 Vitest 和 React Testing Library 进行测试。

## 技术栈

- **Vitest**: 快速的单元测试框架
- **React Testing Library**: React 组件测试工具
- **@testing-library/jest-dom**: 额外的 DOM 断言
- **@testing-library/user-event**: 用户交互模拟
- **jsdom**: DOM 环境模拟

## 测试命令

```bash
# 运行所有测试
pnpm test

# 监听模式运行测试
pnpm test --watch

# 查看测试覆盖率
pnpm test:coverage

# 使用UI界面运行测试
pnpm test:ui
```

## 项目结构

```
src/
├── components/
│   ├── HeaderLogo.tsx
│   └── HeaderLogo.test.tsx          # 组件测试
├── lib/
│   ├── client.ts
│   ├── client.test.ts               # 工具函数测试
│   ├── context.tsx
│   └── context.test.tsx             # Context测试
├── pages/
│   └── auth/
│       ├── LoginPage.tsx
│       ├── LoginPage.test.tsx       # 页面组件测试
│       ├── RegisterPage.test.tsx
│       └── ForgotPasswordPage.test.tsx
└── test/
    ├── setup.ts                     # 测试环境配置
    ├── mocks.ts                     # Mock对象
    └── utils.tsx                    # 测试工具函数
```

## 测试覆盖范围

### 1. 组件测试 (HeaderLogo)

- ✅ 基本渲染
- ✅ Props传递
- ✅ 样式变化
- ✅ 用户交互
- ✅ 可访问性

### 2. 工具函数测试 (client.ts)

- ✅ Supabase客户端创建
- ✅ 参数验证
- ✅ 实例管理

### 3. Context测试 (context.tsx)

- ✅ Provider渲染
- ✅ Context值传递
- ✅ Hooks使用
- ✅ 错误处理
- ✅ 嵌套Provider

### 4. 页面组件测试 (LoginPage, RegisterPage, ForgotPasswordPage)

- ✅ 表单渲染
- ✅ 用户输入
- ✅ 表单提交
- ✅ 成功/错误处理
- ✅ OAuth登录
- ✅ 加载状态
- ✅ 导航链接
- ✅ 表单验证
- ✅ 可访问性

## 编写测试的最佳实践

### 1. 测试文件命名

测试文件应与被测试文件同名,并添加 `.test.tsx` 或 `.test.ts` 后缀:

```
Component.tsx → Component.test.tsx
utils.ts → utils.test.ts
```

### 2. 测试结构

使用 `describe` 和 `it` 组织测试:

```typescript
describe('ComponentName', () => {
  describe('功能模块1', () => {
    it('应该做某事', () => {
      // 测试代码
    });
  });
});
```

### 3. 使用中文描述

测试描述使用中文,提高可读性:

```typescript
it('应该成功登录', () => { ... });
it('应该显示错误消息', () => { ... });
```

### 4. AAA模式

遵循 Arrange-Act-Assert 模式:

```typescript
it('应该调用onClick', async () => {
  // Arrange - 准备
  const handleClick = vi.fn();
  render(<Button onClick={handleClick} />);
  
  // Act - 执行
  await user.click(screen.getByRole('button'));
  
  // Assert - 断言
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### 5. 使用 userEvent

优先使用 `userEvent` 而不是 `fireEvent`:

```typescript
import userEvent from '@testing-library/user-event';

it('应该输入文本', async () => {
  const user = userEvent.setup();
  render(<Input />);
  
  await user.type(screen.getByRole('textbox'), 'Hello');
});
```

### 6. 查询优先级

按以下优先级选择查询方法:

1. `getByRole` - 最推荐
2. `getByLabelText` - 表单元素
3. `getByText` - 非交互元素
4. `getByTestId` - 最后选择

```typescript
// ✅ 推荐
screen.getByRole('button', { name: /submit/i });
screen.getByLabelText(/email/i);

// ❌ 避免
screen.getByTestId('submit-button');
```

### 7. Mock Supabase

使用提供的 mock 工具:

```typescript
import { createMockSupabaseClient } from '../../test/mocks';

const mockSupabase = createMockSupabaseClient();
mockSupabase.auth.signInWithPassword = vi.fn().mockResolvedValue({
  data: { user: { id: '123' } },
  error: null,
});
```

### 8. 异步测试

使用 `waitFor` 等待异步操作:

```typescript
await user.click(submitButton);

await waitFor(() => {
  expect(screen.getByText(/success/i)).toBeInTheDocument();
});
```

### 9. 清理和重置

在 `beforeEach` 中清理 mock:

```typescript
beforeEach(() => {
  vi.clearAllMocks();
});
```

### 10. 测试可访问性

确保组件可访问:

```typescript
it('应该有正确的标签', () => {
  render(<Input />);
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
});

it('应该有正确的角色', () => {
  render(<Button />);
  expect(screen.getByRole('button')).toBeInTheDocument();
});
```

## 常用断言

```typescript
// 元素存在
expect(element).toBeInTheDocument();
expect(element).not.toBeInTheDocument();

// 文本内容
expect(element).toHaveTextContent('Hello');

// 属性
expect(element).toHaveAttribute('href', '/login');
expect(element).toHaveClass('active');

// 状态
expect(button).toBeDisabled();
expect(checkbox).toBeChecked();

// 可见性
expect(element).toBeVisible();

// 函数调用
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledTimes(1);
expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
```

## 调试技巧

### 1. 打印DOM结构

```typescript
import { screen } from '@testing-library/react';

screen.debug(); // 打印整个DOM
screen.debug(element); // 打印特定元素
```

### 2. 查看可用的roles

```typescript
screen.logTestingPlaygroundURL();
```

### 3. 查看查询结果

```typescript
// 显示所有可用的查询
screen.getByRole(''); // 会列出所有可用的roles
```

## 覆盖率目标

- 语句覆盖率: > 80%
- 分支覆盖率: > 75%
- 函数覆盖率: > 80%
- 行覆盖率: > 80%

## CI/CD集成

在持续集成中运行测试:

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
      - run: pnpm install
      - run: pnpm test:coverage
      - uses: codecov/codecov-action@v3
```

## 故障排查

### 问题: 测试超时

```typescript
// 增加超时时间
it('慢速测试', async () => {
  // ...
}, 10000); // 10秒超时
```

### 问题: act() 警告

确保使用 `await` 等待异步操作:

```typescript
// ✅ 正确
await user.click(button);
await waitFor(() => expect(element).toBeInTheDocument());

// ❌ 错误
user.click(button); // 缺少 await
```

### 问题: 找不到元素

使用 `screen.debug()` 查看当前DOM结构,或使用 `findBy` 查询等待元素出现:

```typescript
const element = await screen.findByText(/loading/i);
```

## 参考资源

- [Vitest 文档](https://vitest.dev/)
- [React Testing Library 文档](https://testing-library.com/react)
- [Testing Library 备忘单](https://testing-library.com/docs/react-testing-library/cheatsheet)
- [Common mistakes with React Testing Library](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
