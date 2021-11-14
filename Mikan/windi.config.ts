import { defineConfig } from 'windicss/helpers';

export default defineConfig({
  attributify: { prefix: 'w:' },
  theme: {
    extend: {
      fontFamily: {
        sans: ['Noto Sans SC', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
});
