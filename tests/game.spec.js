const { test, expect } = require("@playwright/test");

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.clear();
    window.localStorage.setItem(
      "lost-dawn-settings-v1",
      JSON.stringify({ textSpeed: 8, sound: false }),
    );
  });
  await page.goto("/");
});

test("title screen exposes the game and attribution", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "분실된 새벽" })).toBeVisible();
  await expect(page.getByRole("button", { name: /이어하기/ })).toBeDisabled();
  await expect(page.getByRole("link", { name: "XIAEL" })).toHaveAttribute(
    "href",
    "https://xiael.itch.io/tia-sprite",
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex, nofollow, noarchive",
  );
});

test("first branch saves progress and displays the character sprite", async ({ page }) => {
  await page.getByRole("button", { name: /처음부터/ }).click();
  await expect(page.locator("#gameScreen")).toHaveClass(/is-active/);

  for (let index = 0; index < 3; index += 1) {
    await page.keyboard.press("Space");
    await page.keyboard.press("Space");
  }

  const choices = page.locator(".choice-button");
  await expect(choices).toHaveCount(2);
  await choices.first().click();

  await page.keyboard.press("Space");
  await page.keyboard.press("Space");
  await expect(page.locator("#speakerName")).toHaveText("???");

  const savedState = await page.evaluate(() =>
    JSON.parse(window.localStorage.getItem("lost-dawn-save-v1")),
  );
  expect(savedState.node).toBe("p06");
  expect(savedState.stats.courage).toBe(1);
  expect(savedState.flags.stepped_out).toBe(true);

  const sprites = await page.evaluate(async () => {
    const names = ["neutral", "soft", "sad", "smile", "surprised", "shy", "cry"];
    return Promise.all(
      names.map(
        (name) =>
          new Promise((resolve) => {
            const image = new Image();
            image.onload = () =>
              resolve({ name, width: image.naturalWidth, height: image.naturalHeight });
            image.onerror = () => resolve({ name, width: 0, height: 0 });
            image.src = `assets/characters/yoonseo/${name}.png`;
          }),
      ),
    );
  });
  expect(sprites).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ name: "neutral", width: 720, height: 1280 }),
      expect.objectContaining({ name: "cry", width: 720, height: 1280 }),
    ]),
  );
  expect(sprites.every((sprite) => sprite.width > 0 && sprite.height > 0)).toBe(true);
});

test("the high-affinity route unlocks the true ending", async ({ page }) => {
  await page.getByRole("button", { name: /처음부터/ }).click();
  await expect(page.locator("#gameScreen")).toHaveClass(/is-active/);

  const picks = [0, 2, 0, 0, 0, 0, 2, 0, 3];
  const routeResult = await page.evaluate(async (routePicks) => {
    const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
    const gameScreen = document.querySelector("#gameScreen");
    let choiceIndex = 0;

    for (let step = 0; step < 220; step += 1) {
      if (document.querySelector("#endingScreen").classList.contains("is-active")) {
        return { choiceIndex };
      }

      const choices = [...document.querySelectorAll(".choice-button")];
      if (choices.length) {
        const targetIndex = routePicks[choiceIndex];
        const target = choices[targetIndex];
        if (!target) return { choiceIndex, error: `unexpected choice group ${choiceIndex + 1}` };
        if (target.disabled) return { choiceIndex, error: `choice ${targetIndex + 1} is locked` };
        target.click();
        choiceIndex += 1;
      } else {
        gameScreen.click();
      }
      await sleep(20);
    }

    return { choiceIndex, error: "route did not reach an ending" };
  }, picks);

  await expect(page.locator("#endingScreen")).toHaveClass(/is-active/);
  await expect(page.locator("#endingEyebrow")).toHaveText("TRUE END");
  await expect(page.locator("#endingTitle")).toHaveText("분실되지 않은 내일");
  expect(routeResult.error).toBeUndefined();
  expect(routeResult.choiceIndex).toBe(picks.length);

  const unlocked = await page.evaluate(() =>
    JSON.parse(window.localStorage.getItem("lost-dawn-endings-v1")),
  );
  expect(unlocked).toContain("dawn");
});
