import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		exclude: [...configDefaults.exclude, 'test/browser/**'],
		environment: 'happy-dom',
		globals: true,
		setupFiles: ['./test/setup.js'],
	},
});
