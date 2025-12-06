# 测试快速参考

## 常用命令

```bash
# 运行所有测试
pnpm test

# 监听模式 (推荐开发时使用)
pnpm test --watch

# 运行特定文件
pnpm test LoginPage.test.tsx

# 查看覆盖率
pnpm test:coverage

# UI 模式
pnpm test:ui

# 只运行失败的测试
pnpm test --run --reporter=verbose --changed
```

## 快速创建测试

### 1. 组件测试模板

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { YourComponent } from './YourComponent';

describe('YourComponent', () => {
  it('应该渲染', () => {
    render(<YourComponent />);
    expect(screen.getByText(/some text/i)).toBeInTheDocument();
  });

  it('应该处理用户交互', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    
    render(<YourComponent onClick={handleClick} />);
    await user.click(screen.getByRole('button'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### 2. Hook 测试模板

```typescript
import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useYourHook } from './useYourHook';

describe('useYourHook', () => {
  it('应该返回初始值', () => {
    const { result } = renderHook(() => useYourHook());
    expect(result.current.value).toBe(initialValue);
  });
});
```

### 3. 异步测试模板

```typescript
import { waitFor } from '@testing-library/react';

it('应该处理异步操作', async () => {
  const user = userEvent.setup();
  render(<AsyncComponent />);
  
  await user.click(screen.getByRole('button'));
  
  await waitFor(() => {
    expect(screen.getByText(/success/i)).toBeInTheDocument();
  });
});
```

## 常用查询

```typescript
// 按角色 (最推荐)
screen.getByRole('button', { name: /submit/i })
screen.getByRole('textbox', { name: /email/i })
screen.getByRole('heading', { level: 1 })

// 按标签
screen.getByLabelText(/email/i)
screen.getByLabelText('Password')

// 按占位符
screen.getByPlaceholderText(/enter email/i)

// 按文本
screen.getByText(/welcome/i)
screen.getByText('Exact Text')

// 按测试ID (最后选择)
screen.getByTestId('custom-element')

// 查询变体
screen.getBy...      // 找不到抛出错误
screen.queryBy...    // 找不到返回 null
screen.findBy...     // 异步查找
```

## 常用断言

```typescript
// 存在性
expect(element).toBeInTheDocument()
expect(element).not.toBeInTheDocument()

// 可见性
expect(element).toBeVisible()
expect(element).not.toBeVisible()

// 文本内容
expect(element).toHaveTextContent('Hello')
expect(element).toHaveTextContent(/hello/i)

// 属性
expect(element).toHaveAttribute('href', '/login')
expect(element).toHaveClass('active')
expect(element).toHaveStyle({ color: 'red' })

// 表单状态
expect(input).toHaveValue('text')
expect(checkbox).toBeChecked()
expect(button).toBeDisabled()
expect(input).toHaveFocus()

// 函数调用
expect(mockFn).toHaveBeenCalled()
expect(mockFn).toHaveBeenCalledTimes(1)
expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2')
expect(mockFn).toHaveBeenLastCalledWith('arg')
```

## 用户交互

```typescript
const user = userEvent.setup();

// 点击
await user.click(element)
await user.dblClick(element)

// 输入
await user.type(input, 'Hello World')
await user.clear(input)

// 键盘
await user.keyboard('{Enter}')
await user.keyboard('{Shift>}A{/Shift}') // Shift+A
await user.tab()

// 选择
await user.selectOptions(select, 'option1')

// 上传
await user.upload(input, file)

// Hover
await user.hover(element)
await user.unhover(element)
```

## Mock Supabase

```typescript
import { createMockSupabaseClient } from '../test/mocks';

const mockSupabase = createMockSupabaseClient();

// Mock 登录
mockSupabase.auth.signInWithPassword = vi.fn().mockResolvedValue({
  data: { user: { id: '123' } },
  error: null,
});

// Mock 错误
mockSupabase.auth.signInWithPassword = vi.fn().mockResolvedValue({
  data: null,
  error: { message: 'Invalid credentials' },
});

// Mock OAuth
mockSupabase.auth.signInWithOAuth = vi.fn().mockResolvedValue({
  data: { url: 'https://provider.com/oauth' },
  error: null,
});
```

## 调试技巧

```typescript
// 打印 DOM
screen.debug()
screen.debug(element)

// 查看可用角色
screen.logTestingPlaygroundURL()

// 查看查询
console.log(screen.getByRole(''))  // 列出所有可用 roles

// 等待
await screen.findByText('Loading...', {}, { timeout: 5000 })

// 查看所有匹配
screen.getAllByRole('button')
```

## 常见模式

### 测试表单提交

```typescript
it('应该提交表单', async () => {
  const user = userEvent.setup();
  const handleSubmit = vi.fn();
  
  render(<Form onSubmit={handleSubmit} />);
  
  await user.type(screen.getByLabelText(/email/i), 'test@example.com');
  await user.type(screen.getByLabelText(/password/i), 'password123');
  await user.click(screen.getByRole('button', { name: /submit/i }));
  
  expect(handleSubmit).toHaveBeenCalledWith({
    email: 'test@example.com',
    password: 'password123',
  });
});
```

### 测试条件渲染

```typescript
it('应该根据条件渲染', () => {
  const { rerender } = render(<Component showMessage={false} />);
  
  expect(screen.queryByText(/message/i)).not.toBeInTheDocument();
  
  rerender(<Component showMessage={true} />);
  
  expect(screen.getByText(/message/i)).toBeInTheDocument();
});
```

### 测试错误状态

```typescript
it('应该显示错误', async () => {
  const user = userEvent.setup();
  mockApi.mockRejectedValue(new Error('API Error'));
  
  render(<Component />);
  await user.click(screen.getByRole('button'));
  
  await waitFor(() => {
    expect(screen.getByText(/API Error/i)).toBeInTheDocument();
  });
});
```

### 测试加载状态

```typescript
it('应该显示加载状态', async () => {
  mockApi.mockImplementation(() => 
    new Promise(resolve => setTimeout(resolve, 100))
  );
  
  render(<Component />);
  await user.click(screen.getByRole('button'));
  
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
  
  await waitFor(() => {
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });
});
```

## 性能优化

```typescript
// 批量操作
const user = userEvent.setup();
await user.type(input, 'fast text', { delay: null });

// 跳过清理 (测试间不共享状态时)
afterEach(() => {
  cleanup();
});

// 使用 screen 而不是 container
// ✅ 推荐
screen.getByRole('button')

// ❌ 避免
container.querySelector('button')
```

## 疑难解答

### 问题: act() 警告

```typescript
// 确保异步操作有 await
await user.click(button);
await waitFor(() => expect(...));
```

### 问题: 元素找不到

```typescript
// 使用 findBy 等待元素出现
const element = await screen.findByText(/text/i);

// 使用 queryBy 检查不存在
expect(screen.queryByText(/text/i)).not.toBeInTheDocument();
```

### 问题: 测试超时

```typescript
// 增加超时时间
it('慢速测试', async () => {
  // ...
}, 10000);

// 或在 waitFor 中
await waitFor(() => {
  expect(...);
}, { timeout: 5000 });
```

## 资源链接

- [Vitest 文档](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [user-event 文档](https://testing-library.com/docs/user-event/intro)
- [jest-dom 匹配器](https://github.com/testing-library/jest-dom)
