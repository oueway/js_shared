import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRegisterPage } from './RegisterPage';
import { createMockSupabaseClient } from '../../test/mocks';
import { renderWithAuth } from '../../test/utils';

describe('RegisterPage', () => {
  let mockSupabase: ReturnType<typeof createMockSupabaseClient>;
  let RegisterPage: ReturnType<typeof createRegisterPage>;

  beforeEach(() => {
    mockSupabase = createMockSupabaseClient();
    vi.clearAllMocks();
    
    RegisterPage = createRegisterPage();
  });

  describe('基本渲染', () => {
    it('应该渲染注册表单', () => {
      renderWithAuth(<RegisterPage />, { supabase: mockSupabase });

      expect(screen.getByPlaceholderText(/name@company.com/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/••••••••/)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    });

    it('应该显示自定义公司名称', () => {
      renderWithAuth(<RegisterPage />, {
        supabase: mockSupabase,
        uiConfig: { appName: 'TestCompany' },
      });

      expect(screen.getByText(/TestCompany/i)).toBeInTheDocument();
    });
  });

  describe('用户注册', () => {
    it('应该成功注册', async () => {
      const user = userEvent.setup();
      mockSupabase.auth.signUp = vi.fn().mockResolvedValue({
        data: { user: { id: '123' } },
        error: null,
      });

      renderWithAuth(<RegisterPage />, { supabase: mockSupabase });

      const nameInput = screen.getByPlaceholderText(/Full Name/i);
      const emailInput = screen.getByPlaceholderText(/name@company.com/i);
      const passwordInput = screen.getByPlaceholderText(/••••••••/);
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      await user.type(nameInput, 'Test User');
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'test@example.com',
          password: 'password123',
        })
      );
    });

    it('应该显示注册错误', async () => {
      const user = userEvent.setup();
      mockSupabase.auth.signUp = vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Email already exists' },
      });

      renderWithAuth(<RegisterPage />, { supabase: mockSupabase });

      const nameInput = screen.getByPlaceholderText(/Full Name/i);
      const emailInput = screen.getByPlaceholderText(/name@company.com/i);
      const passwordInput = screen.getByPlaceholderText(/••••••••/);
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      await user.type(nameInput, 'Test User');
      await user.type(emailInput, 'existing@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Email already exists/i)).toBeInTheDocument();
      });
    });
  });

  describe('导航链接', () => {
    it('应该显示登录链接', () => {
      renderWithAuth(<RegisterPage />, {
        supabase: mockSupabase,
        uiConfig: { loginLink: '/login' },
      });

      const loginLink = screen.getByText(/Log in/i).closest('a');
      expect(loginLink).toHaveAttribute('href', '/login');
    });
  });
});
