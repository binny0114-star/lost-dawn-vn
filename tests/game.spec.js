const { test, expect } = require("@playwright/test");

const TRUE_ROUTE_PREFIX = [0, 2, 2, 0, 0, 2, 2, 2, 0, 0, 2, 0, 0, 2, 1, 2, 0, 2];

async function playRoute(page, routePicks) {
  return page.evaluate(async (picks) => {
    const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
    const gameScreen = document.querySelector("#gameScreen");
    let choiceIndex = 0;

    for (let step = 0; step < 420; step += 1) {
      if (document.querySelector("#endingScreen").classList.contains("is-active")) {
        return { choiceIndex };
      }

      const choices = [...document.querySelectorAll(".choice-button")];
      if (choices.length) {
        if (choiceIndex >= picks.length) {
          return { choiceIndex, stoppedAtChoice: true };
        }
        const targetIndex = picks[choiceIndex];
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

    return { choiceIndex, error: "route did not reach its destination" };
  }, routePicks);
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const preserveSave = window.sessionStorage.getItem("lost-dawn-test-preserve-save") === "true";
    if (!preserveSave) window.localStorage.clear();
    window.sessionStorage.removeItem("lost-dawn-test-preserve-save");
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

  await page.evaluate(async () => {
    const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
    const gameScreen = document.querySelector("#gameScreen");

    for (let step = 0; step < 100; step += 1) {
      if (document.querySelectorAll(".choice-button").length > 0) return;
      gameScreen.click();
      await sleep(20);
    }
    throw new Error("The opening choice did not appear.");
  });

  const choices = page.locator(".choice-button");
  await expect(choices).toHaveCount(2);
  await choices.first().click();

  await page.evaluate(async () => {
    const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
    const gameScreen = document.querySelector("#gameScreen");

    for (let step = 0; step < 100; step += 1) {
      if (document.querySelector("#speakerName").textContent === "???") return;
      gameScreen.click();
      await sleep(20);
    }
    throw new Error("The stranger reveal did not appear.");
  });
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

[
  { id: "memory", choice: 0, eyebrow: "NORMAL END 01", title: "이름을 간직한 사람" },
  { id: "oblivion", choice: 1, eyebrow: "NORMAL END 02", title: "깨끗한 분실물" },
  { id: "keeper", choice: 2, eyebrow: "ANOTHER END", title: "다음 막차의 역무원" },
  { id: "dawn", choice: 3, eyebrow: "TRUE END", title: "분실되지 않은 내일" },
].forEach((ending) => {
  test(`the expanded route reaches the ${ending.id} ending`, async ({ page }) => {
    await page.getByRole("button", { name: /처음부터/ }).click();
    await expect(page.locator("#gameScreen")).toHaveClass(/is-active/);

    const picks = [...TRUE_ROUTE_PREFIX, ending.choice];
    const routeResult = await playRoute(page, picks);

    await expect(page.locator("#endingScreen")).toHaveClass(/is-active/);
    await expect(page.locator("#endingEyebrow")).toHaveText(ending.eyebrow);
    await expect(page.locator("#endingTitle")).toHaveText(ending.title);
    expect(routeResult.error).toBeUndefined();
    expect(routeResult.choiceIndex).toBe(picks.length);

    const unlocked = await page.evaluate(() =>
      JSON.parse(window.localStorage.getItem("lost-dawn-endings-v1")),
    );
    expect(unlocked).toContain(ending.id);
  });
});

test("the true ending stays locked without the shared-memory choices", async ({ page }) => {
  await page.getByRole("button", { name: /처음부터/ }).click();
  await expect(page.locator("#gameScreen")).toHaveClass(/is-active/);

  const routeResult = await playRoute(page, Array(TRUE_ROUTE_PREFIX.length).fill(0));
  const finalChoices = page.locator(".choice-button");

  expect(routeResult).toEqual({
    choiceIndex: TRUE_ROUTE_PREFIX.length,
    stoppedAtChoice: true,
  });
  await expect(finalChoices).toHaveCount(4);
  await expect(finalChoices.last()).toBeDisabled();
  await expect(finalChoices.last()).toContainText("온전한 기억 · 공동 소유 · 윤서의 동의 필요");
});

test("a qualifying save from the short edition keeps true-ending access", async ({ page }) => {
  await page.evaluate(() => {
    window.sessionStorage.setItem("lost-dawn-test-preserve-save", "true");
    window.localStorage.setItem(
      "lost-dawn-save-v1",
      JSON.stringify({
        node: "f04",
        chapter: "three",
        stats: { memory: 5, trust: 5, courage: 4 },
        flags: {},
        history: [],
      }),
    );
  });
  await page.reload();

  await page.getByRole("button", { name: /이어하기/ }).click();
  const trueEndingChoice = page.locator(".choice-button").last();

  await expect(page.locator(".choice-button")).toHaveCount(4);
  await expect(trueEndingChoice).toBeEnabled();
  await trueEndingChoice.click();
  await expect(page.locator("#endingEyebrow")).toHaveText("TRUE END");
});

test("final choices stay above the dialogue on a short phone screen", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 540 });
  await page.getByRole("button", { name: /처음부터/ }).click();
  await expect(page.locator("#gameScreen")).toHaveClass(/is-active/);
  await playRoute(page, Array(TRUE_ROUTE_PREFIX.length).fill(0));

  const layout = await page.evaluate(() => {
    const choicePanel = document.querySelector("#choicePanel").getBoundingClientRect();
    const dialogueBox = document.querySelector(".dialogue-box").getBoundingClientRect();
    return {
      choiceBottom: choicePanel.bottom,
      dialogueTop: dialogueBox.top,
    };
  });

  expect(layout.choiceBottom).toBeLessThanOrEqual(layout.dialogueTop - 8);
});
