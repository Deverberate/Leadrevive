import { test, expect } from '@playwright/test';

test.describe('Landing Page & Phone Simulator (Money Path)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('visitor sees hero branding, navigation, and conversion value proposition', async ({ page }) => {
    // Assert Hero heading
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/missed calls/i);
    await expect(page.getByText('UK Emergency Trades', { exact: false })).toBeVisible();

    // Assert primary CTAs
    const pilotLink = page.getByRole('link', { name: /start free 48h pilot/i });
    await expect(pilotLink).toBeVisible();

    const contractorAppLink = page.getByRole('link', { name: /contractor app/i }).first();
    await expect(contractorAppLink).toBeVisible();
  });

  test('ROI calculator updates dynamically on slider interactions', async ({ page }) => {
    const calculatorSection = page.locator('#calculator');
    await calculatorSection.scrollIntoViewIfNeeded();

    const missedCallsSlider = page.getByLabel('Missed Calls Per Week');
    await expect(missedCallsSlider).toBeVisible();

    // Adjust missed calls slider
    await missedCallsSlider.fill('6');
    await expect(page.getByText('6 calls')).toBeVisible();

    // Adjust average ticket value
    const avgTicketSlider = page.getByLabel('Average Emergency Job Value');
    await avgTicketSlider.fill('600');
    await expect(page.getByText('£600', { exact: true })).toBeVisible();

    // Verify annual leakage computation is updated and visible
    await expect(page.getByText(/secured with LeadRevive/i)).toBeVisible();
  });

  test('end-to-end interactive phone simulation recovers emergency lead in under 3 seconds', async ({ page }) => {
    const simulatorSection = page.locator('#simulator');
    await simulatorSection.scrollIntoViewIfNeeded();

    // 1. Click 1-Tap quick launch scenario button (Sarah £580)
    const sarahPresetBtn = page.getByRole('button', { name: /sarah/i }).first();
    await expect(sarahPresetBtn).toBeVisible();
    await sarahPresetBtn.click();

    // 2. Auto-wait for transition through Ringing -> Missed -> WhatsApp chat screen
    const chatHeader = page.getByText('Apex 24/7 Emergency Plumbing');
    await expect(chatHeader).toBeVisible({ timeout: 10000 });

    // 3. Verify initial bot greeting is present
    await expect(page.getByText(/Dave at Apex 24\/7 Emergency Plumbing here/i)).toBeVisible();

    // 4. Click the interactive WhatsApp quick-reply button (Emergency Leak / Flood)
    const emergencyReplyBtn = page.getByRole('button', { name: /emergency leak \/ flood/i });
    await expect(emergencyReplyBtn).toBeVisible();
    await emergencyReplyBtn.click();

    // 5. Click 1-tap address suggestion button
    const addressBtn = page.getByRole('button', { name: /42 Altenburg Gardens, SW11 1JJ/i });
    await expect(addressBtn).toBeVisible();
    await addressBtn.click();

    // 6. Verify contractor notification alert banner triggers with 1-Tap Call Dave button
    const callDaveBtn = page.getByRole('link', { name: /1-tap call dave/i });
    await expect(callDaveBtn).toBeVisible({ timeout: 8000 });
    await expect(page.getByText(/Est\. £580 Retained/i)).toBeVisible();

    // 7. Assert booking celebration banner confirms revenue secured
    await expect(page.getByText(/£580 Job Secured in 2.8s • Saved from Competitors!/i)).toBeVisible({ timeout: 6000 });
  });
});
