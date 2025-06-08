import { defineConfig } from 'vitest/config'
import viteConfig from './vite.config.js'

export default defineConfig({
  ...viteConfig,
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [],
    coverage: {
      include: [
        'src/api/merchant.js',
        'src/views/Merchant/MerchantDish.vue',
        'src/views/Merchant/MerchantHome.vue',
        'src/views/Merchant/MerchantPersonal.vue',
        'src/views/Merchant/MyOrder.vue',
        'src/views/Merchant/SpecialOffer.vue'
      ],
      all: true,
      branches: true,
      statements: true,
      functions: false,
      lines: false,
      
    }
  }
})
