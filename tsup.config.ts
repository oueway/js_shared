import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/lib/index.ts', 'src/components/index.ts', 'src/pages/index.ts'],
  format: ['esm'],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom', 'next', '@supabase/ssr', '@supabase/supabase-js', 'lucide-react'],
});
