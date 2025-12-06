import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createClient } from './client';

// Mock @supabase/ssr
vi.mock('@supabase/ssr', () => ({
  createBrowserClient: vi.fn((url, key) => ({
    _url: url,
    _key: key,
    auth: {
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
    },
  })),
}));

describe('createClient', () => {
  const mockUrl = 'https://test.supabase.co';
  const mockKey = 'test-anon-key';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('应该使用正确的参数创建Supabase客户端', () => {
    const client = createClient(mockUrl, mockKey);
    
    expect(client).toBeDefined();
    expect(client._url).toBe(mockUrl);
    expect(client._key).toBe(mockKey);
  });

  it('应该返回具有auth方法的客户端', () => {
    const client = createClient(mockUrl, mockKey);
    
    expect(client.auth).toBeDefined();
    expect(client.auth.signInWithPassword).toBeDefined();
    expect(client.auth.signOut).toBeDefined();
  });

  it('应该为不同的URL和key创建不同的客户端', () => {
    const client1 = createClient('https://test1.supabase.co', 'key1');
    const client2 = createClient('https://test2.supabase.co', 'key2');
    
    expect(client1._url).not.toBe(client2._url);
    expect(client1._key).not.toBe(client2._key);
  });
});
