const { test, expect } = require("@playwright/test");

const PRE_DATE_ROUTE = [0, 2, 2, 0, 0, 2, 2];
const DATE_ROUTE = [0, 0, 0, 1, 0, 2, 2, 0, 1, 0, 0, 0, 1, 0, 2];
const POST_DATE_ROUTE = [2, 0, 0, 2, 0, 0, 2, 1, 2, 0, 2];
const TRUE_ROUTE_PREFIX = [...PRE_DATE_ROUTE, ...DATE_ROUTE, ...POST_DATE_ROUTE];
const PHOTO_IDS = [
  "cocoa-pair",
  "photo-strip",
  "vending-overflow",
  "perfect-shutter",
  "compatibility-slip",
  "first-real-date",
];

async function playRoute(page, routePicks) {
  return page.evaluate(async (picks) => {
    const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
    const gameScreen = document.querySelector("#gameScreen");
    let choiceIndex = 0;

    for (let step = 0; step < 620; step += 1) {
      if (document.querySelector("#endingScreen").classList.contains("is-active")) {
        return { choiceIndex };
      }

      const minigame = document.querySelector("#minigamePanel.is-visible");
      if (minigame) {
        const action =
          minigame.querySelector(
            ".minigame-action[data-minigame-best='true']:not(:disabled)",
          ) ||
          minigame.querySelector(
            ".minigame-action[data-minigame-primary='true']:not(:disabled)",
          );
        if (action) action.click();
        await sleep(12);
        continue;
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
  await expect(page.locator('script[src="dating-sim.js?v=6"]')).toHaveCount(1);
  await expect(page.locator('script[src="game.js?v=6"]')).toHaveCount(1);
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

test("all supplied album illustrations load at their source dimensions", async ({ page }) => {
  const images = await page.evaluate(async () => {
    const entries = Object.entries(window.LostDawnExtras.catalog.photos);
    return Promise.all(
      entries.map(
        ([id, photo]) =>
          new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () =>
              resolve({
                id,
                src: new URL(photo.image, window.location.href).pathname,
                width: image.naturalWidth,
                height: image.naturalHeight,
              });
            image.onerror = () => reject(new Error(`Could not load ${photo.image}`));
            image.src = photo.image;
          }),
      ),
    );
  });

  expect(images.map(({ id }) => id)).toEqual(PHOTO_IDS);
  images.forEach(({ id, src, width, height }) => {
    expect(src).toContain(`/assets/photos/${id}.png`);
    expect({ width, height }).toEqual({ width: 1280, height: 768 });
  });
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
  test.setTimeout(60_000);
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
  await expect(page.locator("#toast")).toContainText("윤서와의 동조율이 올랐다");
  await expect(page.locator("#toast")).not.toContainText("호감도");
  const messageResult = await playRoute(page, [0]);
  expect(messageResult).toEqual({ choiceIndex: 1, stoppedAtChoice: true });
  await expect(page.locator("#phonePanel")).toHaveClass(/is-visible/);
  await expect(page.locator("#choicePanel")).toHaveClass(/is-message/);
  await expect(page.locator(".phone-bubble")).toHaveCount(2);
  await expect(page.locator(".choice-button")).toHaveCount(4);
  await expect(page.locator(".choice-button.is-sticker-choice")).toHaveCount(1);
  await expect(page.locator(".choice-button").nth(1)).toContainText("오늘 생각보다 재밌었어");

  await page.locator(".choice-button").first().click();
  await expect(page.locator(".phone-bubble")).toHaveCount(4);
  await expect(page.locator(".phone-bubble").last()).toHaveText("그 말 나중에 취소하기 없기.");
  const savedState = await page.evaluate(() =>
    JSON.parse(window.localStorage.getItem("lost-dawn-save-v1")),
  );
  expect(savedState.stats.affection).toBe(2);
  expect(savedState.flags.date_1_cafe).toBe(true);
  expect(savedState.flags.date_reply_1_0).toBe(true);

  await page.waitForTimeout(400);
  const nextSchedule = await playRoute(page, []);
  expect(nextSchedule).toEqual({ choiceIndex: 0, stoppedAtChoice: true });
  await expect(page.locator("#schedulePhase")).toHaveText("MEMORY DATE 02 / 05");
  const advancedState = await page.evaluate(() =>
    JSON.parse(window.localStorage.getItem("lost-dawn-save-v1")),
  );
  expect(advancedState.node).toBe("dateSchedule02");

  await playRoute(page, DATE_ROUTE.slice(3));
  await expect(page.locator("#chapterNumber")).toHaveText("CHAPTER 03");
  await expect(page.locator("#chapterName")).toHaveText("보내지 못한 여름");
});

test("affection-only replies update the accessible meter without a visual notice", async ({
  page,
}) => {
  await page.evaluate(() => {
    window.sessionStorage.setItem("lost-dawn-test-preserve-save", "true");
    window.localStorage.setItem(
      "lost-dawn-save-v1",
      JSON.stringify({
        node: "dateMessage01",
        chapter: "romance",
        stats: { memory: 0, trust: 0, courage: 0, affection: 0 },
        flags: {},
        minigames: {},
        history: [],
        storyVersion: 3,
      }),
    );
  });
  await page.reload();
  await page.getByRole("button", { name: /이어하기/ }).click();

  const affectionMeter = page.locator("#affectionHearts");
  await expect(affectionMeter).toHaveAttribute("role", "status");
  await expect(affectionMeter).toHaveAttribute("aria-live", "polite");
  await page.locator(".choice-button.is-sticker-choice").click();

  await expect(affectionMeter).toHaveAttribute("aria-label", "윤서 호감도 1 / 10");
  await expect(page.locator("#toast")).not.toHaveClass(/is-visible/);
  await expect(page.locator("#toast")).toBeEmpty();
});

test("bonus games unlock persistent photos and achievements", async ({ page }) => {
  const seedBonusGame = async (node) => {
    await page.evaluate((savedNode) => {
      window.sessionStorage.setItem("lost-dawn-test-preserve-save", "true");
      window.localStorage.setItem(
        "lost-dawn-save-v1",
        JSON.stringify({
          node: savedNode,
          chapter: "romance",
          stats: { memory: 2, trust: 2, courage: 2, affection: 2 },
          flags: {},
          minigames: {},
          history: [],
          storyVersion: 3,
        }),
      );
    }, node);
    await page.reload();
    await page.getByRole("button", { name: /이어하기/ }).click();
    await expect(page.locator("#minigamePanel")).toHaveClass(/is-visible/);
  };

  await seedBonusGame("bonusExpressionGame");
  await expect(page.locator("#minigameTitle")).toHaveText("윤서 표정 맞히기");
  for (let round = 0; round < 3; round += 1) {
    await page.locator(".minigame-action[data-minigame-best='true']").click();
    await page.waitForTimeout(350);
  }
  await expect(page.locator(".minigame-result strong")).toHaveText("300");
  await expect(page.locator("#photoReveal")).toHaveClass(/is-visible/);
  await expect(page.locator("#photoReveal")).toHaveAttribute("data-photo-id", "photo-strip");

  let collection = await page.evaluate(() =>
    JSON.parse(window.localStorage.getItem("lost-dawn-collection-v1")),
  );
  expect(collection.photos).toContain("photo-strip");
  expect(collection.achievements).toEqual(
    expect.arrayContaining(["expression-clear", "expression-master"]),
  );

  await seedBonusGame("bonusShutterGame");
  await expect(page.locator("#minigameTitle")).toHaveText("막차 셔터");
  for (let round = 0; round < 3; round += 1) {
    await page.locator(".minigame-action[data-minigame-primary='true']").click();
    await page.waitForTimeout(350);
  }
  await expect(page.locator(".minigame-result")).toBeVisible();
  await expect(page.locator("#photoReveal")).toHaveClass(/is-visible/);
  await expect(page.locator("#photoReveal")).toHaveAttribute("data-photo-id", "perfect-shutter");

  collection = await page.evaluate(() =>
    JSON.parse(window.localStorage.getItem("lost-dawn-collection-v1")),
  );
  expect(collection.photos).toEqual(expect.arrayContaining(["photo-strip", "perfect-shutter"]));
  expect(collection.achievements).toEqual(
    expect.arrayContaining(["expression-clear", "shutter-clear"]),
  );

  await page.getByRole("button", { name: "사진 앨범과 업적" }).click();
  await expect(page.locator("#collectionModal")).toHaveClass(/is-open/);
  await expect(page.locator("#photoAlbum")).toContainText("표정 네 컷");
  await expect(page.locator("#achievementList")).toContainText("표정 번역기");
});

test("album cards use the supplied illustrations", async ({ page }) => {
  await page.evaluate((photoIds) => {
    window.localStorage.setItem(
      "lost-dawn-collection-v1",
      JSON.stringify({ photos: photoIds, achievements: [] }),
    );
  }, PHOTO_IDS);
  await page.getByRole("button", { name: /처음부터/ }).click();
  await page.getByRole("button", { name: "사진 앨범과 업적" }).click();

  await expect(page.locator(".photo-card.is-unlocked img")).toHaveCount(PHOTO_IDS.length);
  for (const id of PHOTO_IDS) {
    const image = page.locator(`.photo-card[data-photo-id="${id}"] img`);
    await expect(image).toHaveAttribute("src", `assets/photos/${id}.png`);
    await expect(image).not.toHaveAttribute("alt", "");
  }
});

test("a newly unlocked story illustration fades out on the next node", async ({ page }) => {
  await page.evaluate(() => {
    window.sessionStorage.setItem("lost-dawn-test-preserve-save", "true");
    window.localStorage.setItem(
      "lost-dawn-save-v1",
      JSON.stringify({
        node: "breather01a",
        chapter: "romance",
        stats: { memory: 1, trust: 1, courage: 1, affection: 2 },
        flags: {},
        minigames: {},
        history: [],
        storyVersion: 3,
      }),
    );
  });
  await page.reload();
  await page.getByRole("button", { name: /이어하기/ }).click();

  const reveal = page.locator("#photoReveal");
  await expect(reveal).toHaveClass(/is-visible/);
  await expect(reveal).toHaveAttribute("data-photo-id", "cocoa-pair");
  await expect(page.locator("#photoRevealImage")).toHaveJSProperty("naturalWidth", 1280);
  const fit = await page.evaluate(() => ({
    foreground: getComputedStyle(document.querySelector("#photoRevealImage")).objectFit,
    backdrop: getComputedStyle(document.querySelector("#photoRevealBackdrop")).objectFit,
  }));
  expect(fit).toEqual({ foreground: "contain", backdrop: "cover" });

  await page.evaluate(() => document.querySelector("#gameScreen").click());
  await page.evaluate(() => document.querySelector("#gameScreen").click());
  await expect(reveal).not.toHaveClass(/is-visible/);
  await expect(page.locator("#speakerName")).toHaveText("한윤서");
});

test("previously unlocked artwork still appears at its story moment", async ({ page }) => {
  await page.evaluate(() => {
    window.sessionStorage.setItem("lost-dawn-test-preserve-save", "true");
    window.localStorage.setItem(
      "lost-dawn-save-v1",
      JSON.stringify({
        node: "breather01a",
        chapter: "romance",
        stats: { memory: 1, trust: 1, courage: 1, affection: 2 },
        flags: {},
        minigames: {},
        history: [],
        storyVersion: 3,
      }),
    );
    window.localStorage.setItem(
      "lost-dawn-collection-v1",
      JSON.stringify({
        photos: ["cocoa-pair"],
        achievements: ["first-breather"],
      }),
    );
  });
  await page.reload();
  await page.getByRole("button", { name: /이어하기/ }).click();

  await expect(page.locator("#photoReveal")).toHaveClass(/is-visible/);
  await expect(page.locator("#photoReveal")).toHaveAttribute("data-photo-id", "cocoa-pair");
  const collection = await page.evaluate(() =>
    JSON.parse(window.localStorage.getItem("lost-dawn-collection-v1")),
  );
  expect(collection.photos).toEqual(["cocoa-pair"]);
  expect(collection.achievements).toEqual(["first-breather"]);
});

test("a cancelled reveal frame cannot restore the previous illustration", async ({ page }) => {
  await page.addInitScript(() => {
    const nativeRequestAnimationFrame = window.requestAnimationFrame.bind(window);
    let heldFrameId = 0;
    window.__holdAnimationFrames = false;
    window.__heldAnimationFrames = [];
    window.requestAnimationFrame = (callback) => {
      if (!window.__holdAnimationFrames) return nativeRequestAnimationFrame(callback);
      window.__heldAnimationFrames.push(callback);
      heldFrameId += 1;
      return -heldFrameId;
    };
    window.__releaseAnimationFrames = () => {
      window.__holdAnimationFrames = false;
      const callbacks = window.__heldAnimationFrames.splice(0);
      callbacks.forEach((callback) => callback(performance.now()));
    };
  });
  await page.evaluate(() => {
    window.sessionStorage.setItem("lost-dawn-test-preserve-save", "true");
    window.localStorage.setItem(
      "lost-dawn-save-v1",
      JSON.stringify({
        node: "breather01a",
        chapter: "romance",
        stats: { memory: 1, trust: 1, courage: 1, affection: 2 },
        flags: {},
        minigames: {},
        history: [],
        storyVersion: 3,
      }),
    );
  });
  await page.reload();
  await page.evaluate(() => {
    window.__holdAnimationFrames = true;
  });
  await page.getByRole("button", { name: /이어하기/ }).click();
  await expect(page.locator("#photoRevealImage")).toHaveJSProperty("naturalWidth", 1280);

  await page.evaluate(() => document.querySelector("#gameScreen").click());
  await page.evaluate(() => document.querySelector("#gameScreen").click());
  await page.evaluate(() => window.__releaseAnimationFrames());

  await expect(page.locator("#speakerName")).toHaveText("한윤서");
  await expect(page.locator("#photoReveal")).not.toHaveClass(/is-visible/);
});

test("restarting cancels pending minigame rewards", async ({ page }) => {
  await page.evaluate(() => {
    window.sessionStorage.setItem("lost-dawn-test-preserve-save", "true");
    window.localStorage.setItem(
      "lost-dawn-save-v1",
      JSON.stringify({
        node: "bonusExpressionGame",
        chapter: "romance",
        stats: { memory: 0, trust: 0, courage: 0, affection: 0 },
        flags: {},
        minigames: {},
        history: [],
        storyVersion: 3,
      }),
    );
  });
  await page.reload();
  await page.getByRole("button", { name: /이어하기/ }).click();

  for (let round = 0; round < 2; round += 1) {
    await page.locator(".minigame-action[data-minigame-best='true']").click();
    await page.waitForTimeout(350);
  }
  await page.locator(".minigame-action[data-minigame-best='true']").click();
  await page.evaluate(() => document.querySelector('[data-action="restart"]').click());
  await page.waitForTimeout(750);

  const savedState = await page.evaluate(() =>
    JSON.parse(window.localStorage.getItem("lost-dawn-save-v1")),
  );
  expect(savedState.node).toBe("p01");
  expect(savedState.stats.affection).toBe(0);
  expect(savedState.minigames).toEqual({});
});

test("held keys do not auto-complete minigame rounds", async ({ page }) => {
  await page.evaluate(() => {
    window.sessionStorage.setItem("lost-dawn-test-preserve-save", "true");
    window.localStorage.setItem(
      "lost-dawn-save-v1",
      JSON.stringify({
        node: "bonusExpressionGame",
        chapter: "romance",
        stats: { memory: 0, trust: 0, courage: 0, affection: 0 },
        flags: {},
        minigames: {},
        history: [],
        storyVersion: 3,
      }),
    );
  });
  await page.reload();
  await page.getByRole("button", { name: /이어하기/ }).click();

  await page.evaluate(() => {
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "2", repeat: true, bubbles: true }),
    );
  });
  await page.waitForTimeout(400);
  await expect(page.locator("#minigameRound")).toHaveText("ROUND 1 / 3");
  await expect(page.locator(".minigame-action:not(:disabled)")).toHaveCount(3);
});

test("existing true-ending archives migrate into the collection", async ({ page }) => {
  await page.evaluate(() => {
    window.sessionStorage.setItem("lost-dawn-test-preserve-save", "true");
    window.localStorage.setItem("lost-dawn-endings-v1", JSON.stringify(["dawn"]));
  });
  await page.reload();
  await page.getByRole("button", { name: /처음부터/ }).click();
  await page.getByRole("button", { name: "사진 앨범과 업적" }).click();

  await expect(page.locator("#photoAlbum")).toContainText("오전 2시 18분 이후");
  await expect(page.locator("#achievementList")).toContainText("여섯 번째 약속");
  await expect(page.locator("#photoReveal")).not.toHaveClass(/is-visible/);
  const collection = await page.evaluate(() =>
    JSON.parse(window.localStorage.getItem("lost-dawn-collection-v1")),
  );
  expect(collection.photos).toContain("first-real-date");
  expect(collection.achievements).toContain("true-dawn");
});

test("the collection remains scrollable in short landscape", async ({ page }) => {
  await page.setViewportSize({ width: 480, height: 320 });
  await page.getByRole("button", { name: /처음부터/ }).click();
  await page.getByRole("button", { name: "사진 앨범과 업적" }).click();
  const lastAchievement = page.locator(".achievement-item").last();
  await lastAchievement.scrollIntoViewIfNeeded();

  const layout = await page.evaluate(() => {
    const panel = document.querySelector(".collection-panel").getBoundingClientRect();
    const last = document.querySelector(".achievement-item:last-child").getBoundingClientRect();
    return {
      panelTop: panel.top,
      panelBottom: panel.bottom,
      itemTop: last.top,
      itemBottom: last.bottom,
      viewportHeight: window.innerHeight,
    };
  });
  expect(layout.panelTop).toBeGreaterThanOrEqual(0);
  expect(layout.panelBottom).toBeLessThanOrEqual(layout.viewportHeight);
  expect(layout.itemTop).toBeGreaterThanOrEqual(layout.panelTop);
  expect(layout.itemBottom).toBeLessThanOrEqual(layout.panelBottom);
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

    if (ending.id === "dawn") {
      await expect(page.locator("#photoReveal")).toHaveClass(/is-visible/);
      await expect(page.locator("#photoReveal")).toHaveAttribute(
        "data-photo-id",
        "first-real-date",
      );
      const collection = await page.evaluate(() =>
        JSON.parse(window.localStorage.getItem("lost-dawn-collection-v1")),
      );
      expect(collection.photos).toEqual(
        expect.arrayContaining([
          "cocoa-pair",
          "photo-strip",
          "vending-overflow",
          "perfect-shutter",
          "compatibility-slip",
          "first-real-date",
        ]),
      );
      expect(collection.achievements).toEqual(
        expect.arrayContaining([
          "first-breather",
          "expression-clear",
          "snack-party",
          "shutter-clear",
          "five-date-clear",
          "affection-seven",
          "true-dawn",
        ]),
      );
    }
  });
});

test("locked true-ending conditions can be recovered at the final choice", async ({ page }) => {
  test.setTimeout(60_000);
  await page.getByRole("button", { name: /처음부터/ }).click();
  await expect(page.locator("#gameScreen")).toHaveClass(/is-active/);

  const routeResult = await playRoute(page, Array(TRUE_ROUTE_PREFIX.length).fill(0));
  const finalChoices = page.locator(".choice-button");

  expect(routeResult).toEqual({
    choiceIndex: TRUE_ROUTE_PREFIX.length,
    stoppedAtChoice: true,
  });
  await expect(finalChoices).toHaveCount(5);
  await expect(finalChoices.nth(3)).toBeDisabled();
  await expect(finalChoices.nth(3)).toContainText(/호감 \d\/7/);
  await expect(finalChoices.last()).toContainText("부족한 조건을 윤서와 다시 확인한다");

  await page.keyboard.press("5");
  await playRoute(page, []);
  await expect(page.locator(".choice-button")).toHaveCount(4);

  for (const choiceIndex of [0, 1, 2]) {
    await page.locator(".choice-button").nth(choiceIndex).click();
    await playRoute(page, []);
  }

  const reviewChoices = page.locator(".choice-button");
  await expect(reviewChoices).toHaveCount(4);
  await expect(reviewChoices.nth(0)).toBeDisabled();
  await expect(reviewChoices.nth(1)).toBeDisabled();
  await expect(reviewChoices.nth(2)).toBeDisabled();
  await reviewChoices.nth(3).click();
  await playRoute(page, []);

  const recoveredChoices = page.locator(".choice-button");
  await expect(recoveredChoices).toHaveCount(4);
  await expect(recoveredChoices.nth(3)).toBeEnabled();
  const recoveredState = await page.evaluate(() =>
    JSON.parse(window.localStorage.getItem("lost-dawn-save-v1")),
  );
  expect(recoveredState.stats).toEqual(
    expect.objectContaining({ memory: 5, trust: 5, courage: 5, affection: 10 }),
  );
  expect(recoveredState.flags).toEqual(
    expect.objectContaining({
      accepted_whole_memory: true,
      confirmed_joint_ownership: true,
      named_joint_loss: true,
      asked_consent: true,
    }),
  );

  await recoveredChoices.nth(3).click();
  await playRoute(page, []);
  await expect(page.locator("#endingEyebrow")).toHaveText("TRUE END");
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

test("the survivor-guilt choice states its meaning clearly", async ({ page }) => {
  await page.evaluate(() => {
    window.sessionStorage.setItem("lost-dawn-test-preserve-save", "true");
    window.localStorage.setItem(
      "lost-dawn-save-v1",
      JSON.stringify({
        node: "t07",
        chapter: "three",
        stats: { memory: 3, trust: 3, courage: 2, affection: 5 },
        flags: {},
        minigames: {},
        history: [],
        storyVersion: 3,
      }),
    );
  });
  await page.reload();
  await page.getByRole("button", { name: /이어하기/ }).click();

  await expect(page.locator(".choice-button").first()).toContainText(
    "네가 살려 준 삶을 죄책감으로만 보내지는 않을게",
  );
  await expect(page.locator(".choice-button").first()).not.toContainText(
    "살려 줘서 미안하다고는 안 할게",
  );
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
    { width: 1024, height: 601 },
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

test("the final recovery choice stays above dialogue on a short-wide screen", async ({ page }) => {
  for (const height of [540, 671]) {
    await page.setViewportSize({ width: 1024, height });
    await page.evaluate(() => {
      window.sessionStorage.setItem("lost-dawn-test-preserve-save", "true");
      window.localStorage.setItem(
        "lost-dawn-save-v1",
        JSON.stringify({
          node: "f04",
          chapter: "five",
          stats: { memory: 0, trust: 0, courage: 0, affection: 0 },
          flags: {},
          minigames: {},
          history: [],
          storyVersion: 3,
        }),
      );
    });
    await page.reload();
    await page.getByRole("button", { name: /이어하기/ }).click();

    const recoveryChoice = page.locator(".choice-button").last();
    await expect(page.locator(".choice-button")).toHaveCount(5);
    await recoveryChoice.scrollIntoViewIfNeeded();
    const layout = await page.evaluate(() => {
      const choicePanel = document.querySelector("#choicePanel").getBoundingClientRect();
      const recovery = document.querySelector(".choice-button:last-child").getBoundingClientRect();
      const dialogue = document.querySelector(".dialogue-box").getBoundingClientRect();
      return {
        panelBottom: choicePanel.bottom,
        recoveryTop: recovery.top,
        recoveryBottom: recovery.bottom,
        dialogueTop: dialogue.top,
      };
    });

    expect(layout.panelBottom).toBeLessThanOrEqual(layout.dialogueTop - 8);
    expect(layout.recoveryTop).toBeGreaterThanOrEqual(0);
    expect(layout.recoveryBottom).toBeLessThanOrEqual(layout.dialogueTop - 8);
  }
});

test("the final recovery choices stay below mobile status meters", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 700 });
  await page.evaluate(() => {
    window.sessionStorage.setItem("lost-dawn-test-preserve-save", "true");
    window.localStorage.setItem(
      "lost-dawn-save-v1",
      JSON.stringify({
        node: "f04",
        chapter: "five",
        stats: { memory: 0, trust: 0, courage: 0, affection: 0 },
        flags: {},
        minigames: {},
        history: [],
        storyVersion: 3,
      }),
    );
  });
  await page.reload();
  await page.getByRole("button", { name: /이어하기/ }).click();

  const firstChoice = page.locator(".choice-button").first();
  const recoveryChoice = page.locator(".choice-button").last();
  await expect(page.locator(".choice-button")).toHaveCount(5);
  const initialLayout = await page.evaluate(() => {
    const status = document.querySelector(".status-cluster").getBoundingClientRect();
    const first = document.querySelector(".choice-button").getBoundingClientRect();
    return { statusBottom: status.bottom, firstTop: first.top };
  });
  expect(initialLayout.firstTop).toBeGreaterThanOrEqual(initialLayout.statusBottom + 8);

  await recoveryChoice.scrollIntoViewIfNeeded();
  const recoveryLayout = await page.evaluate(() => {
    const recovery = document.querySelector(".choice-button:last-child").getBoundingClientRect();
    const dialogue = document.querySelector(".dialogue-box").getBoundingClientRect();
    return { recoveryTop: recovery.top, recoveryBottom: recovery.bottom, dialogueTop: dialogue.top };
  });
  expect(recoveryLayout.recoveryTop).toBeGreaterThanOrEqual(0);
  expect(recoveryLayout.recoveryBottom).toBeLessThanOrEqual(recoveryLayout.dialogueTop - 8);
  await recoveryChoice.click();
  await expect(page.locator("#speakerName")).toHaveText("나");
});
