import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // veya @vitejs/plugin-react

export default defineConfig({
  plugins: [react()],
  base: '/arch-ui-portfolio/', // BURASI ÇOK ÖNEMLİ: Repo adın neyse onu yazmalısın!
})