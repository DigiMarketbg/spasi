
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // Improved hot module reload
    hmr: {
      overlay: true
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Optimize build settings
    target: 'es2015',
    minify: 'terser',
    cssMinify: true,
    // Improve chunking strategy
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@/components/ui/button', '@/components/ui/card', '@/components/ui/toast'],
          // Separate core functionality into chunks
          auth: ['@/components/AuthProvider'],
          theme: ['@/components/ThemeProvider']
        },
        // Improve resource caching with content hashing
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    },
    // Enable source maps for production to assist with debugging
    sourcemap: mode !== 'production',
    // Improve asset compression
    assetsInlineLimit: 4096, // 4kb
    // Speed up build process
    emptyOutDir: true,
    copyPublicDir: true,
    reportCompressedSize: false
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    // Prebundle these dependencies for faster startup
    esbuildOptions: {
      target: 'es2020'
    }
  },
  // Improved preview server
  preview: {
    port: 8080,
    host: true
  }
}));
