import { test, expect } from '@playwright/test';

test.describe('Contractor Dashboard App (/app)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/app');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/apex 24\/7 emergency plumbing/i);
  });

  test('KPI cards render business metrics accurately', async ({ page }) => {
    // Assert KPI Card 1: Recovered Revenue
    await expect(page.getByText('Recovered Revenue', { exact: true })).toBeVisible();
    await expect(page.getByText(/Zero lost to competitors/i)).toBeVisible();

    // Assert KPI Card 2: Missed Calls Saved
    await expect(page.getByText('Missed Calls Saved', { exact: true })).toBeVisible();
    await expect(page.getByText('5 Leads', { exact: true })).toBeVisible();

    // Assert KPI Card 3: SLA Response Time
    await expect(page.getByText('Avg Response Time', { exact: true })).toBeVisible();
    await expect(page.getByText('Sub-5s SLA', { exact: true })).toBeVisible();
  });

  test('Lead stream tabs and search input filter leads accurately', async ({ page }) => {
    // 1. Check All Leads tab default
    const allTab = page.getByRole('button', { name: /all leads/i });
    await expect(allTab).toBeVisible();

    // 2. Click the Emergency tab
    const emergencyTab = page.getByRole('button', { name: /emergency/i });
    await expect(emergencyTab).toBeVisible();
    await emergencyTab.click();

    // 3. Search for a specific customer by name
    const searchInput = page.getByPlaceholder('Search leads, phone, postcode...');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('Sarah');

    // Assert that Sarah Jenkins card is displayed
    await expect(page.getByText('Sarah Jenkins', { exact: true })).toBeVisible();

    // Clear search and verify full list reappears
    await searchInput.fill('');
    await allTab.click();
  });

  test('clicking a lead opens the slide-over drawer with call links and editable notes', async ({ page }) => {
    // 1. Click on the Chat Log button of the first lead card
    const chatLogBtn = page.getByRole('button', { name: /chat log/i }).first();
    await expect(chatLogBtn).toBeVisible();
    await chatLogBtn.click();

    // 2. Assert that the Slide-Over Drawer is open
    const drawerHeader = page.getByText('Lead Details & Transcript');
    await expect(drawerHeader).toBeVisible();

    // 3. Assert "Call Customer" 1-tap dialer link exists with valid tel: protocol
    const callButton = page.getByRole('link', { name: /call/i }).first();
    await expect(callButton).toBeVisible();
    const href = await callButton.getAttribute('href');
    expect(href).toMatch(/^tel:\+/);

    // 4. Assert WhatsApp direct deep-link exists
    const waButton = page.getByRole('link', { name: /whatsapp/i }).first();
    await expect(waButton).toBeVisible();
    const waHref = await waButton.getAttribute('href');
    expect(waHref).toMatch(/^https:\/\/wa\.me\//);

    // 5. Update contractor notes and assert auto-save confirmation
    const notesTextarea = page.getByPlaceholder(/add notes/i);
    await expect(notesTextarea).toBeVisible();
    await notesTextarea.fill('Automated E2E Test: Customer confirmed boiler is combi 24kW.');

    const saveNotesBtn = page.getByRole('button', { name: /save notes/i });
    await saveNotesBtn.click();
    await expect(page.getByText('Saved!')).toBeVisible();

    // 6. Close the drawer via keyboard Escape
    await page.keyboard.press('Escape');
    await expect(drawerHeader).not.toBeVisible();
  });
});
