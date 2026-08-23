const { test, expect } = require("@playwright/test");

const PRE_DATE_ROUTE = [0, 2, 2, 0, 0, 2, 2];
const DATE_ROUTE = [0, 0, 0, 1, 0, 2, 2, 0, 1, 0, 0, 0, 1, 0, 2];
const POST_DATE_ROUTE = [2, 0, 0, 2, 0, 0, 2, 1, 2, 0, 2];
const TRUE_ROUTE_PREFIX = [...PRE_DATE_ROUTE, ...DATE_ROUTE, ...POST_DATE_ROUTE];

async function playRoute(page, routePicks) {
  return page.evaluate(async (picks) => {
    const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
    const gameScreen = document.querySelector("#gameScreen");
    let choiceIndex = 0;

    for (let step = 0; step < 620; step += 1) {
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
      await sleep(12);
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
  await expect(page.locator(".title-kicker")).toContainText("SINGLE-HEROINE ROMANCE SIM");
  await expect(page.locator("#affectionHearts")).toHaveAttribute("aria-label", "윤서 호감도 0 / 10");
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

test("the schedule, date, and message loop raises persistent affection", async ({ page }) => {
  await page.getByRole("button", { name: /처음부터/ }).click();
  await expect(page.locator("#gameScreen")).toHaveClass(/is-active/);

  const scheduleResult = await playRoute(page, PRE_DATE_ROUTE);
  expect(scheduleResult).toEqual({
    choiceIndex: PRE_DATE_ROUTE.length,
    stoppedAtChoice: true,
  });
  await expect(page.locator("#schedulePanel")).toHaveClass(/is-visible/);
  await expect(page.locator("#schedulePhase")).toHaveText("MEMORY DATE 01 / 05");
  await expect(page.locator("#chapterNumber")).toHaveText("CHAPTER 02");
  await expect(page.locator("#chapterName")).toHaveText("다시 만나는 5일");
  await expect(page.locator("#choicePanel")).toHaveClass(/is-schedule/);
  await expect(page.locator(".choice-button")).toHaveCount(3);

  await page.locator(".choice-button").first().click();
  const messageResult = await playRoute(page, [0]);
  expect(messageResult).toEqual({ choiceIndex: 1, stoppedAtChoice: true });
  await expect(page.locator("#phonePanel")).toHaveClass(/is-visible/);
  await expect(page.locator("#choicePanel")).toHaveClass(/is-message/);
  await expect(page.locator(".phone-bubble")).toHaveCount(2);

  await page.locator(".choice-button").first().click();
  await expect(page.locator(".phone-bubble")).toHaveCount(4);
  const savedState = await page.evaluate(() =>
    JSON.parse(window.localStorage.getItem("lost-dawn-save-v1")),
  );
  expect(savedState.stats.affection).toBe(2);
  expect(savedState.flags.date_1_cafe).toBe(true);
  expect(savedState.flags.date_reply_1_0).toBe(true);

  await page.waitForTimeout(400);
  await page.keyboard.press("Enter");
  await expect(page.locator("#schedulePhase")).toHaveText("MEMORY DATE 02 / 05");
  const advancedState = await page.evaluate(() =>
    JSON.parse(window.localStorage.getItem("lost-dawn-save-v1")),
  );
  expect(advancedState.node).toBe("dateSchedule02");

  await playRoute(page, DATE_ROUTE.slice(3));
  await expect(page.locator("#chapterNumber")).toHaveText("CHAPTER 03");
  await expect(page.locator("#chapterName")).toHaveText("보내지 못한 여름");
});

[
  { id: "memory", choice: 0, eyebrow: "NORMAL END 01", title: "이름을 간직한 사람" },
  { id: "oblivion", choice: 1, eyebrow: "NORMAL END 02", title: "깨끗한 분실물" },
  { id: "keeper", choice: 2, eyebrow: "ANOTHER END", title: "다음 막차의 역무원" },
  { id: "dawn", choice: 3, eyebrow: "TRUE END", title: "분실되지 않은 내일" },
].forEach((ending) => {
  test(`the expanded route reaches the ${ending.id} ending`, async ({ page }) => {
    test.setTimeout(60_000);
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
  test.setTimeout(60_000);
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
  await expect(finalChoices.last()).toContainText(
    "호감 7 · 온전한 기억 · 공동 소유 · 윤서의 동의 필요",
  );
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
  const migratedState = await page.evaluate(() =>
    JSON.parse(window.localStorage.getItem("lost-dawn-save-v1")),
  );
  expect(migratedState.stats.affection).toBe(7);
  await trueEndingChoice.click();
  await expect(page.locator("#endingEyebrow")).toHaveText("TRUE END");
});

test("dating interfaces do not overlap on a short phone screen", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 540 });
  await page.getByRole("button", { name: /처음부터/ }).click();
  await expect(page.locator("#gameScreen")).toHaveClass(/is-active/);
  await playRoute(page, PRE_DATE_ROUTE);

  const scheduleLayout = await page.evaluate(() => {
    const choices = document.querySelector("#choicePanel").getBoundingClientRect();
    const dialogue = document.querySelector(".dialogue-box");
    return {
      choicesBottom: choices.bottom,
      dialogueVisibility: getComputedStyle(dialogue).visibility,
      viewportHeight: window.innerHeight,
    };
  });
  expect(scheduleLayout.choicesBottom).toBeLessThanOrEqual(scheduleLayout.viewportHeight - 8);
  expect(scheduleLayout.dialogueVisibility).toBe("hidden");

  await page.locator(".choice-button").first().click();
  await playRoute(page, [0]);
  const messageLayout = await page.evaluate(() => {
    const phone = document.querySelector("#phonePanel").getBoundingClientRect();
    const replies = document.querySelector("#choicePanel").getBoundingClientRect();
    return { phoneBottom: phone.bottom, repliesTop: replies.top };
  });
  expect(messageLayout.phoneBottom).toBeLessThanOrEqual(messageLayout.repliesTop - 8);
});

test("all dating choices remain reachable in phone landscape", async ({ page }) => {
  await page.setViewportSize({ width: 667, height: 375 });
  await page.getByRole("button", { name: /처음부터/ }).click();
  await expect(page.locator("#gameScreen")).toHaveClass(/is-active/);
  await playRoute(page, PRE_DATE_ROUTE);

  const scheduleCards = await page.locator(".choice-button").evaluateAll((buttons) =>
    buttons.map((button) => {
      const bounds = button.getBoundingClientRect();
      return { top: bounds.top, bottom: bounds.bottom };
    }),
  );
  expect(scheduleCards.every((card) => card.top >= 0 && card.bottom <= 375)).toBe(true);

  await page.locator(".choice-button").first().click();
  await playRoute(page, [0]);
  const replyButtons = await page.locator(".choice-button").evaluateAll((buttons) =>
    buttons.map((button) => {
      const bounds = button.getBoundingClientRect();
      return { top: bounds.top, bottom: bounds.bottom };
    }),
  );
  expect(replyButtons.every((button) => button.top >= 0 && button.bottom <= 375)).toBe(true);
});

test("dating choices remain scroll-reachable at compact breakpoint edges", async ({ page }) => {
  test.setTimeout(60_000);

  for (const viewport of [
    { width: 761, height: 540 },
    { width: 480, height: 320 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await page.getByRole("button", { name: /처음부터/ }).click();
    await expect(page.locator("#gameScreen")).toHaveClass(/is-active/);
    await playRoute(page, PRE_DATE_ROUTE);

    const lastScheduleCard = page.locator(".choice-button").last();
    await lastScheduleCard.scrollIntoViewIfNeeded();
    const scheduleBounds = await lastScheduleCard.boundingBox();
    expect(scheduleBounds.y).toBeGreaterThanOrEqual(0);
    expect(scheduleBounds.y + scheduleBounds.height).toBeLessThanOrEqual(viewport.height);

    await page.locator(".choice-button").first().click();
    await playRoute(page, [0]);
    const lastReply = page.locator(".choice-button").last();
    await lastReply.scrollIntoViewIfNeeded();
    const replyBounds = await lastReply.boundingBox();
    expect(replyBounds.y).toBeGreaterThanOrEqual(0);
    expect(replyBounds.y + replyBounds.height).toBeLessThanOrEqual(viewport.height);
  }
});

test("the preferred-date hint stays visible near the portrait breakpoint", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 671 });
  await page.getByRole("button", { name: /처음부터/ }).click();
  await expect(page.locator("#gameScreen")).toHaveClass(/is-active/);
  await playRoute(page, PRE_DATE_ROUTE);

  const layout = await page.evaluate(() => {
    const hint = document.querySelector("#scheduleHint").getBoundingClientRect();
    const firstChoice = document.querySelector(".choice-button").getBoundingClientRect();
    return { hintBottom: hint.bottom, firstChoiceTop: firstChoice.top };
  });

  expect(layout.firstChoiceTop).toBeGreaterThanOrEqual(layout.hintBottom + 8);
});

test("compact phone messages can be scrolled without advancing", async ({ page }) => {
  await page.setViewportSize({ width: 480, height: 320 });
  await page.getByRole("button", { name: /처음부터/ }).click();
  await expect(page.locator("#gameScreen")).toHaveClass(/is-active/);
  await playRoute(page, PRE_DATE_ROUTE);
  await page.locator(".choice-button").first().click();
  await playRoute(page, [0]);

  const messages = page.locator("#phoneMessages");
  const before = await messages.evaluate((element) => ({
    clientHeight: element.clientHeight,
    scrollHeight: element.scrollHeight,
    pointerEvents: getComputedStyle(element).pointerEvents,
  }));
  expect(before.scrollHeight).toBeGreaterThan(before.clientHeight);
  expect(before.pointerEvents).toBe("auto");

  await messages.click({ position: { x: 10, y: 10 } });
  const savedState = await page.evaluate(() =>
    JSON.parse(window.localStorage.getItem("lost-dawn-save-v1")),
  );
  expect(savedState.node).toBe("dateMessage01");

  await messages.hover();
  await page.mouse.wheel(0, -500);
  await expect.poll(() => messages.evaluate((element) => element.scrollTop)).toBe(0);
});

test("double-clicking a reply does not skip Yoonseo's response", async ({ page }) => {
  await page.getByRole("button", { name: /처음부터/ }).click();
  await expect(page.locator("#gameScreen")).toHaveClass(/is-active/);
  await playRoute(page, PRE_DATE_ROUTE);
  await page.locator(".choice-button").first().click();
  await playRoute(page, [0]);

  const replyBounds = await page.locator(".choice-button").first().boundingBox();
  await page.mouse.dblclick(
    replyBounds.x + replyBounds.width / 2,
    replyBounds.y + replyBounds.height / 2,
  );

  const savedState = await page.evaluate(() =>
    JSON.parse(window.localStorage.getItem("lost-dawn-save-v1")),
  );
  expect(savedState.node).toBe("dateMessage01Result");
  await expect(page.locator(".phone-bubble")).toHaveCount(4);
});

test("final choices stay above the dialogue on a short phone screen", async ({ page }) => {
  test.setTimeout(60_000);
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
