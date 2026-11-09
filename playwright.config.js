import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: './test/browser',
	fullyParallel: true,
	workers: 2,
	reporter: 'list',
	use: {
		viewport: { width: 1000, height: 800 },
	},
	projects: [
		{ name: 'chromium', use: { ...devices['Desktop Chrome'] } },
		{ name: 'firefox', use: { ...devices['Desktop Firefox'] } },
		{ name: 'webkit', use: { ...devices['Desktop Safari'] } },
	],
});
