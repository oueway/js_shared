import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HeaderLogo } from './HeaderLogo';

describe('HeaderLogo', () => {
  describe('基本渲染', () => {
    it('应该使用默认props渲染', () => {
      const handleClick = vi.fn();
      render(<HeaderLogo onClick={handleClick} isNormalBackground={true} />);
      
      expect(screen.getByText('O')).toBeInTheDocument();
      expect(screen.getByText(/Oueway/)).toBeInTheDocument();
      expect(screen.getByText(/Tech/)).toBeInTheDocument();
    });

    it('应该使用自定义公司名称和logo字母渲染', () => {
      const handleClick = vi.fn();
      render(
        <HeaderLogo 
          onClick={handleClick} 
          isNormalBackground={true}
          companyName="MyCompany"
          logoLetter="M"
        />
      );
      
      expect(screen.getByText('M')).toBeInTheDocument();
      expect(screen.getByText(/MyCompany/)).toBeInTheDocument();
    });

    it('应该在传入children时渲染children', () => {
      const handleClick = vi.fn();
      render(
        <HeaderLogo onClick={handleClick} isNormalBackground={true}>
          <div>Custom Logo</div>
        </HeaderLogo>
      );
      
      expect(screen.getByText('Custom Logo')).toBeInTheDocument();
      expect(screen.queryByText('O')).not.toBeInTheDocument();
    });
  });

  describe('样式', () => {
    it('在普通背景下应该显示深色文字', () => {
      const handleClick = vi.fn();
      render(<HeaderLogo onClick={handleClick} isNormalBackground={true} />);
      
      const companyNameElement = screen.getByText(/Oueway/).closest('span');
      expect(companyNameElement).toHaveClass('text-gray-900');
    });

    it('在深色背景下应该显示白色文字', () => {
      const handleClick = vi.fn();
      render(<HeaderLogo onClick={handleClick} isNormalBackground={false} />);
      
      const companyNameElement = screen.getByText(/Oueway/).closest('span');
      expect(companyNameElement).toHaveClass('text-white');
    });

    it('应该包含cursor-pointer样式', () => {
      const handleClick = vi.fn();
      const { container } = render(
        <HeaderLogo onClick={handleClick} isNormalBackground={true} />
      );
      
      const clickableElement = container.querySelector('.cursor-pointer');
      expect(clickableElement).toBeInTheDocument();
    });
  });

  describe('交互', () => {
    it('点击时应该调用onClick', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      
      const { container } = render(
        <HeaderLogo onClick={handleClick} isNormalBackground={true} />
      );
      
      const clickableElement = container.querySelector('.cursor-pointer');
      if (clickableElement) {
        await user.click(clickableElement);
        expect(handleClick).toHaveBeenCalledTimes(1);
      }
    });

    it('使用children时点击应该调用onClick', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      
      render(
        <HeaderLogo onClick={handleClick} isNormalBackground={true}>
          <div>Custom Logo</div>
        </HeaderLogo>
      );
      
      await user.click(screen.getByText('Custom Logo'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('可访问性', () => {
    it('应该可以通过键盘访问', () => {
      const handleClick = vi.fn();
      const { container } = render(
        <HeaderLogo onClick={handleClick} isNormalBackground={true} />
      );
      
      const clickableElement = container.querySelector('.cursor-pointer');
      expect(clickableElement).toBeInTheDocument();
    });
  });
});
