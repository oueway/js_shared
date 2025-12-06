import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createForgotPasswordPage } from './ForgotPasswordPage';
import { createMockSupabaseClient } from '../../test/mocks';
import { renderWithAuth } from '../../test/utils';

describe('ForgotPasswordPage', () => {
  let mockSupabase: ReturnType<typeof createMockSupabaseClient>;
  let ForgotPasswordPage: ReturnType<typeof createForgotPasswordPage>;

  beforeEach(() => {
    mockSupabase = createMockSupabaseClient();
    vi.clearAllMocks();
    
    ForgotPasswordPage = createForgotPasswordPage();
  });

  describe('基本渲染', () => {
    it('应该渲染忘记密码表单', () => {
      renderWithAuth(<ForgotPasswordPage />, { supabase: mockSupabase });

      expect(screen.getByPlaceholderText(/name@company.com/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
    });

    it('应该显示自定义公司名称', () => {
      renderWithAuth(<ForgotPasswordPage />, {
        supabase: mockSupabase,
        uiConfig: { appName: 'TestCompany' },
      });

      expect(screen.getByText(/TestCompany/i)).toBeInTheDocument();
    });
  });

  describe('密码重置', () => {
    it('应该成功发送重置邮件', async () => {
      const user = userEvent.setup();
      mockSupabase.auth.resetPasswordForEmail = vi.fn().mockResolvedValue({
        data: {},
        error: null,
      });

      renderWithAuth(<ForgotPasswordPage />, { supabase: mockSupabase });

      const emailInput = screen.getByPlaceholderText(/name@company.com/i);
      const submitButton = screen.getByRole('button', { name: /send/i });

      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);

      expect(mockSupabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
        'test@example.com',
        expect.any(Object)
      );

      await waitFor(() => {
        expect(screen.getByText(/check your email/i)).toBeInTheDocument();
      });
    });

    it('应该显示重置错误', async () => {
      const user = userEvent.setup();
      mockSupabase.auth.resetPasswordForEmail = vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'User not found' },
      });

      renderWithAuth(<ForgotPasswordPage />, { supabase: mockSupabase });

      const emailInput = screen.getByPlaceholderText(/name@company.com/i);
      const submitButton = screen.getByRole('button', { name: /send/i });

      await user.type(emailInput, 'notfound@example.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/User not found/i)).toBeInTheDocument();
      });
    });
  });

  describe('导航链接', () => {
    it('应该显示返回登录链接', () => {
      renderWithAuth(<ForgotPasswordPage />, {
        supabase: mockSupabase,
        uiConfig: { loginLink: '/login' },
      });

      const loginLink = screen.getByText(/back to login/i).closest('a');
      expect(loginLink).toHaveAttribute('href', '/login');
    });
  });
});
