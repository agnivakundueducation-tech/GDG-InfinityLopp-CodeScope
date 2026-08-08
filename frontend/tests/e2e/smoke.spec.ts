import { test, expect } from '@playwright/test';

test('CodeScope homepage loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/CodeScope/i);
});

test('CodeScope exposes a project submission flow', async ({ page }) => {
  await page.goto('/');

  // Keep this smoke test intentionally tolerant of UI wording while still verifying
  // that the core submission controls exist.
  const uploadControl = page.locator('input[type="file"]');
  const githubInput = page.locator(
    'input[type="url"], input[placeholder*="GitHub" i], input[name*="github" i]'
  );

  const hasUpload = await uploadControl.count();
  const hasGithub = await githubInput.count();

  expect(hasUpload + hasGithub).toBeGreaterThan(0);
});
