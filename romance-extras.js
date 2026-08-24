(() => {
  "use strict";

  const catalog = {
    photos: {
      "cocoa-pair": {
        title: "코코아 두 잔",
        subtitle: "DATE 01 · PLATFORM CAFE",
        description: "기억보다 지금의 취향을 먼저 물었던 첫 번째 약속.",
        image: "assets/photos/cocoa-pair.png",
        alt: "야간 열차 카페에서 코코아를 앞에 두고 웃는 윤서",
        scene: "cafe",
      },
      "photo-strip": {
        title: "표정 네 컷",
        subtitle: "BONUS GAME · PHOTO BOOTH",
        description: "정답보다 윤서가 웃은 순간이 더 많이 찍힌 사진.",
        image: "assets/photos/photo-strip.png",
        alt: "놀람, 새침함, 웃음, 장난스러운 표정이 담긴 윤서의 네 컷 사진",
        scene: "photo",
      },
      "vending-overflow": {
        title: "캔커피 서른두 개",
        subtitle: "DATE 03 · LOST STATION",
        description: "자판기의 계산 실수로 열린 뜻밖의 간식 파티.",
        image: "assets/photos/vending-overflow.png",
        alt: "유실역 자판기 앞에서 쏟아진 캔커피를 붙잡으려는 윤서",
        scene: "platform",
      },
      "perfect-shutter": {
        title: "막차 셔터",
        subtitle: "BONUS GAME · 02:17",
        description: "흔들렸지만 두 사람 모두 웃고 있어서 남겨 둔 한 장.",
        image: "assets/photos/perfect-shutter.png",
        alt: "막차 안에서 도하와 윤서가 함께 웃으며 찍은 사진",
        scene: "train",
      },
      "compatibility-slip": {
        title: "궁합 영수증",
        subtitle: "DATE 05 · 94%",
        description: "감점 사유까지 서로 닮았다는 유실역의 공식 판정.",
        image: "assets/photos/compatibility-slip.png",
        alt: "유실역 매표소에서 궁합 결과지를 들고 윙크하는 윤서",
        scene: "office",
      },
      "first-real-date": {
        title: "오전 2시 18분 이후",
        subtitle: "TRUE END · FIRST DATE",
        description: "기억 속 재현이 아닌, 두 사람이 함께 정한 첫 번째 내일.",
        image: "assets/photos/first-real-date.png",
        alt: "해 뜨는 승강장에서 파란 승차권을 들고 도하를 바라보는 윤서",
        scene: "dawn",
      },
    },
    achievements: {
      "first-breather": {
        title: "잠깐 웃어도 괜찮아",
        description: "첫 번째 환기 이벤트를 발견했다.",
      },
      "expression-clear": {
        title: "표정 번역기",
        description: "윤서 표정 맞히기를 끝까지 완료했다.",
      },
      "expression-master": {
        title: "눈치 만점",
        description: "표정 맞히기에서 250점 이상을 기록했다.",
      },
      "snack-party": {
        title: "유실역 간식 담당",
        description: "캔커피 서른두 개를 무사히 정리했다.",
      },
      "shutter-clear": {
        title: "흔들려도 추억",
        description: "막차 셔터 게임을 완료했다.",
      },
      "perfect-timing": {
        title: "02:17 정각",
        description: "막차 셔터에서 240점 이상을 기록했다.",
      },
      "five-date-clear": {
        title: "다섯 번의 약속",
        description: "유실역의 데이트 일정을 모두 마쳤다.",
      },
      "affection-seven": {
        title: "다시 시작한 연애",
        description: "윤서의 호감도 7 이상으로 일정을 마쳤다.",
      },
      "true-dawn": {
        title: "여섯 번째 약속",
        description: "윤서와 함께 유실역 밖의 첫 데이트를 약속했다.",
      },
    },
  };

  const anomalies = {
    "wrong-summer": {
      bg: "memory",
      emotion: "surprised",
      text:
        "카페 문이 열리자 한여름 횡단보도가 이어졌다. 우산 아래에는 교복 차림의 윤서와 얼굴이 지워진 누군가가 서 있었다. 지금의 윤서가 내 소매를 잡았다. “이거 우리 기억 아닌 것 같아. 그래도 들어갈 거야?”",
      choices: [
        {
          text: "날짜와 소리를 기록한 뒤, 우리 것이 아닌 부분만 분리한다.",
          effects: { memory: 2, trust: -1 },
          result:
            "빗소리를 거꾸로 돌리자 낯선 이름과 유실물 번호가 떠올랐다. 장면은 다른 승객의 보관함으로 돌아갔지만, 윤서는 낯선 여름이 닫힐 때까지 말이 없었다.",
        },
        {
          text: "윤서가 낯설다고 한 순간을 믿고 재생을 중단한다.",
          effects: { trust: 1, affection: 1, memory: -1 },
          result:
            "문이 닫히자 단서와 함께 가짜 여름도 사라졌다. 윤서는 내 소매를 놓지 않은 채 웃었다. “기억보다 내 말을 먼저 믿어 준 건 처음이네.”",
        },
        {
          text: "[강행 · RESOLVE 60% 권장] 손을 잡고 가짜 여름의 끝까지 걸어간다.",
          risk: { stat: "courage", threshold: 3 },
          result: {
            success:
              "횡단보도 끝에서 장면의 진짜 주인 이름을 찾아냈다. 비가 걷히자 윤서가 젖지 않은 내 손을 흔들었다. “이번 무모함은 인정.”",
            failure:
              "걸을수록 지워진 얼굴이 윤서의 표정을 덮어썼다. 윤서가 먼저 손을 빼 장면을 끊었다. “다음에는 버티기 전에 나한테 말해 줘.”",
          },
        },
      ],
    },
    "crossed-voice": {
      bg: "office",
      emotion: "sad",
      text:
        "꺼진 스피커에서 2019년의 윤서와 지금의 윤서가 동시에 “도하야”라고 불렀다. 한쪽에만 대답하면 다른 목소리는 복원 기록에서 지워진다는 문구가 떴다.",
      choices: [
        {
          text: "먼저 2019년의 목소리에 대답해 원본 기억을 붙잡는다.",
          effects: { memory: 2, trust: -1 },
          result:
            "오래된 목소리는 또렷해졌지만 내 앞의 윤서는 조용해졌다. 기억 하나를 되찾는 동안, 지금 해야 할 대답을 한 박자 놓쳤다.",
        },
        {
          text: "스피커를 끄고 지금 내 앞의 윤서에게 다시 불러 달라고 한다.",
          effects: { trust: 1, affection: 1, memory: -1 },
          result:
            "윤서가 가까이 와 내 이름을 다시 불렀다. 스피커 속 과거의 목소리는 잡음 너머로 멀어졌지만, 지금 해야 할 대답만큼은 놓치지 않았다.",
        },
        {
          text: "[강행 · SYNC 60% 권장] 두 목소리의 호흡을 맞춰 한 문장으로 겹친다.",
          risk: { stat: "trust", threshold: 3 },
          result: {
            success:
              "숨을 맞춰 같은 이름을 부르자 두 목소리가 하나의 파형이 됐다. 과거의 윤서도 지금의 윤서도 지워지지 않았다.",
            failure:
              "박자가 어긋날 때마다 목소리가 서로를 잡아먹었다. 윤서가 전원을 내리고 길게 숨을 골랐다. 아직은 둘을 동시에 붙잡기 어려웠다.",
          },
        },
      ],
    },
    "duplicate-ticket": {
      bg: "office",
      emotion: "neutral",
      text:
        "개찰기에서 내 이름이 적힌 표 두 장이 나왔다. 한 장은 사고 전 날짜, 다른 한 장은 내일 날짜였다. 둘 다 윤서의 필체로 ‘같이’라고 쓰여 있었다.",
      choices: [
        {
          text: "종이의 마모와 잉크를 비교해 어느 쪽이 기억인지 확인한다.",
          effects: { memory: 2, trust: -1 },
          result:
            "낡은 표는 실제 승차권이었고 새 표는 아직 오지 않은 약속이 만든 가승인표였다. 답을 찾는 동안 윤서는 내가 표에서 눈을 들기를 기다렸다.",
        },
        {
          text: "윤서에게 어느 표를 남길지 먼저 고르게 한다.",
          effects: { trust: 1, affection: 1, memory: -1 },
          result:
            "진위 확인은 미뤄졌지만 윤서는 오래된 표를 내게, 내일 날짜의 표를 자신에게 건넸다. “과거는 네가 찾아 줬으니까, 다음은 내가 잃어버리지 않을게.”",
        },
        {
          text: "[강행 · RESOLVE 60% 권장] 두 장을 겹쳐 한꺼번에 개찰기에 넣는다.",
          risk: { stat: "courage", threshold: 3 },
          result: {
            success:
              "두 표의 절취선이 정확히 겹치며 ‘동반 귀환’이라는 숨은 문구가 나타났다. 윤서가 내 어깨를 쳤다. “그건 좀 멋있었다.”",
            failure:
              "개찰기가 두 표를 서로 다른 소유물로 밀어냈다. 찢어질 뻔한 표를 윤서가 가까스로 잡았다. 순서보다 합의가 먼저였다.",
          },
        },
      ],
    },
    "missing-minute": {
      bg: "platform",
      emotion: "surprised",
      text:
        "조명이 한 번 꺼졌다 켜지자 휴대폰 녹음이 47초 비어 있었다. 나는 반대편 승강장에, 윤서는 닫힌 열차 안에 서 있었다. 둘 다 어떻게 움직였는지 기억하지 못했다.",
      choices: [
        {
          text: "바닥의 물자국과 녹음 파형으로 사라진 동선을 역산한다.",
          effects: { memory: 2, trust: -1 },
          result:
            "두 사람의 발자국은 선로 앞에서 한 번 겹친 뒤 갈라졌다. 동선은 찾았지만, 윤서는 반대편 승강장에서 혼자 결과를 기다려야 했다.",
        },
        {
          text: "추리보다 먼저 윤서가 괜찮은지 확인하고 기억나는 감각을 맞춘다.",
          effects: { trust: 1, affection: 1, memory: -1 },
          result:
            "빈 47초는 복원하지 못했다. 대신 윤서는 손바닥에 남은 온기를, 나는 소매를 잡아당긴 감각을 기억했다. 서로를 놓치지 않았다는 사실은 같았다.",
        },
        {
          text: "[강행 · 기억 3칸 권장] 서로 보지 않고 각자의 47초를 동시에 써 내려간다.",
          risk: { stat: "memory", threshold: 3 },
          result: {
            success:
              "두 기록은 열차 문이 닫히는 순간까지 정확히 이어졌다. 비어 있던 시간은 한쪽의 기억이 아니라 두 사람의 기록으로 복원됐다.",
            failure:
              "문장마다 위치와 시간이 엇갈렸다. 빈칸을 억지로 채울수록 확신만 흐려졌다. 우리는 종이를 접고 처음부터 다시 숨을 맞췄다.",
          },
        },
      ],
    },
  };

  const anomalyIds = Object.keys(anomalies);

  function getAnomalySequence(state) {
    if (!state.variations || typeof state.variations !== "object") {
      state.variations = {};
    }
    const stored = state.variations.stationAnomalies;
    if (
      Array.isArray(stored) &&
      stored.length === 2 &&
      stored[0] !== stored[1] &&
      stored.every((id) => anomalyIds.includes(id))
    ) {
      return stored;
    }

    const seed = (Number(state.variationSeed) >>> 0) || 1;
    const firstIndex = seed % anomalyIds.length;
    const offset = 1 + (Math.floor(seed / anomalyIds.length) % (anomalyIds.length - 1));
    const sequence = [
      anomalyIds[firstIndex],
      anomalyIds[(firstIndex + offset) % anomalyIds.length],
    ];
    state.variations.stationAnomalies = sequence;
    return sequence;
  }

  function anomalyNodeId(state, slot) {
    const anomalyId = getAnomalySequence(state)[slot - 1];
    return `stationAnomaly${String(slot).padStart(2, "0")}_${anomalyId}`;
  }

  function nextAfterAnomaly(state, slot) {
    const fallback = slot === 1 ? "dateSchedule03" : "dateSchedule05";
    const catchUp = state.variations?.legacyAnomalyCatchUp;
    if (
      !catchUp ||
      !Array.isArray(catchUp.pending) ||
      catchUp.pending[0] !== slot
    ) {
      return fallback;
    }

    catchUp.pending.shift();
    if (catchUp.pending.length) {
      return `stationAnomaly${String(catchUp.pending[0]).padStart(2, "0")}`;
    }

    const resumeNode = catchUp.resumeNode;
    delete state.variations.legacyAnomalyCatchUp;
    return resumeNode || fallback;
  }

  function apply(story, line) {
    story.dateMessage01Result.next = "breather01a";
    story.dateMessage02Result.next = "bonusExpressionIntro";
    story.dateMessage03Result.next = "breather03a";
    story.dateMessage04Result.next = "bonusShutterIntro";
    story.dateMessage05Result.next = "breather05a";

    Object.assign(story, {
      breather01a: line(
        "platform",
        "seo",
        "안내 방송",
        "첫 번째 데이트 임시 평가. 한도하 감점 3점. 사유: 코코아가 식을 때까지 상대 얼굴만 봄.",
        "breather01b",
        {
          emotion: "surprised",
          unlocks: [
            { type: "photo", id: "cocoa-pair" },
            { type: "achievement", id: "first-breather" },
          ],
        },
      ),
      breather01b: line(
        "platform",
        "seo",
        "한윤서",
        "“잠깐, 그건 감점이 아니라 가산점 아니야?” 윤서가 천장 스피커를 향해 항의하자 안내음이 두 번 버벅였다.",
        "dateSchedule02",
        { emotion: "smile" },
      ),
      bonusExpressionIntro: line(
        "office",
        "seo",
        "한윤서",
        "사진 부스가 보너스 촬영을 열었다. “내 표정을 얼마나 기억하는지 맞혀 보래. 틀리면 이상한 사진도 전부 앨범에 넣을 거야.”",
        "bonusExpressionGame",
        { emotion: "shy" },
      ),
      bonusExpressionGame: line(
        "office",
        "seo",
        "안내 방송",
        "보너스 게임. 윤서의 대사와 가장 어울리는 표정을 선택하십시오.",
        null,
        {
          mode: "minigame",
          minigame: {
            id: "expression",
            type: "quiz",
            title: "윤서 표정 맞히기",
            subtitle: "대사를 읽고 가장 가까운 표정을 고르세요",
            next: "bonusExpressionAfter",
            reward: { affection: 1 },
            completeUnlocks: [
              { type: "photo", id: "photo-strip" },
              { type: "achievement", id: "expression-clear" },
            ],
            highScore: 250,
            highScoreUnlocks: [{ type: "achievement", id: "expression-master" }],
            questions: [
              {
                prompt: "“사진은 딱 한 장만 찍는 거야. 이상하게 나오면 네 책임.”",
                options: ["화남", "부끄러움", "무표정"],
                answer: 1,
              },
              {
                prompt: "“코코아에 마시멜로 두 개. 이런 건 기억했네?”",
                options: ["놀람", "슬픔", "미소"],
                answer: 2,
              },
              {
                prompt: "“밖에서 여섯 번째 약속을 잡자.”",
                options: ["미소", "화남", "당황"],
                answer: 0,
              },
            ],
          },
        },
      ),
      bonusExpressionAfter: line(
        "office",
        "seo",
        "나",
        (state) => {
          const score = state.minigames.expression || 0;
          return score >= 250
            ? `최종 점수 ${score}. 윤서는 “기억보다 눈치가 먼저 돌아왔네”라며 네 컷 사진에 커다란 별을 그렸다.`
            : `최종 점수 ${score}. 틀린 표정마다 윤서가 직접 시범을 보이는 바람에 사진은 오히려 더 많아졌다.`;
        },
        "stationAnomaly01",
        { emotion: "smile" },
      ),
      breather03a: line(
        "platform",
        "seo",
        "나",
        "자판기에서 캔커피를 하나 뽑자 멈추지 않고 서른두 개가 쏟아졌다. 윤서와 나는 굴러가는 캔을 잡느라 처음으로 역 안을 전력 질주했다.",
        "breather03b",
        {
          emotion: "surprised",
          unlocks: [
            { type: "photo", id: "vending-overflow" },
            { type: "achievement", id: "snack-party" },
          ],
        },
      ),
      breather03b: line(
        "platform",
        "seo",
        "한윤서",
        "“대피 인원이 서른두 명이라서 서른두 캔인가 봐.” 윤서는 잠깐 멈췄다가 내 손에 한 캔을 더 얹었다. “이건 구조자 수당.”",
        "dateSchedule04",
        { emotion: "smile" },
      ),
      bonusShutterIntro: line(
        "train",
        "seo",
        "한윤서",
        "열차 창에 카메라 프레임이 생겼다. “표시가 가운데 들어올 때 셔터를 눌러. 흔들리면 네 사진 실력 탓이야.”",
        "bonusShutterGame",
        { emotion: "smile" },
      ),
      bonusShutterGame: line(
        "train",
        "seo",
        "안내 방송",
        "보너스 게임. 움직이는 표시가 중앙의 빛에 겹칠 때 셔터를 누르십시오.",
        null,
        {
          mode: "minigame",
          minigame: {
            id: "shutter",
            type: "timing",
            title: "막차 셔터",
            subtitle: "중앙의 분홍색 구간에서 셔터를 누르세요",
            next: "bonusShutterAfter",
            rounds: 3,
            duration: 1450,
            reward: { affection: 1, courage: 1 },
            completeUnlocks: [
              { type: "photo", id: "perfect-shutter" },
              { type: "achievement", id: "shutter-clear" },
            ],
            highScore: 240,
            highScoreUnlocks: [{ type: "achievement", id: "perfect-timing" }],
          },
        },
      ),
      bonusShutterAfter: line(
        "train",
        "seo",
        "한윤서",
        (state) => {
          const score = state.minigames.shutter || 0;
          return score >= 240
            ? `“${score}점. 사진 싫다던 사람이 타이밍은 완벽하네.” 윤서는 결과 사진을 두 장 인화해 한 장을 내 주머니에 넣었다.`
            : `“${score}점. 조금 흔들렸지만 둘 다 웃고 있으니까 합격.” 윤서는 다시 찍자는 안내를 무시하고 사진을 챙겼다.`;
        },
        "stationAnomaly02",
        { emotion: "smile" },
      ),
      breather05a: line(
        "office",
        "seo",
        "안내 방송",
        "관계 복원 궁합 94퍼센트. 감점 사유: 두 승객 모두 고집이 세며, 사과보다 해결책을 먼저 제시함.",
        "breather05b",
        {
          emotion: "surprised",
          unlocks: (state) => [
            { type: "photo", id: "compatibility-slip" },
            { type: "achievement", id: "five-date-clear" },
            ...(state.stats.affection >= 7
              ? [{ type: "achievement", id: "affection-seven" }]
              : []),
          ],
        },
      ),
      breather05b: line(
        "office",
        "seo",
        "한윤서",
        "“나머지 6퍼센트는 네가 답장을 늦게 해서 깎인 거야.” 내가 항의하자 윤서는 궁합 영수증을 접어 자기 주머니에 넣었다.",
        "dateOutro01",
        { emotion: "smile" },
      ),
    });

    Object.assign(story, {
      stationAnomaly01: line(
        "office",
        "seo",
        "안내 방송",
        "관계 복원 기록에 주인 없는 기억이 섞였습니다. 유실역이 서로 다른 변칙 기록 두 건을 검증 대상으로 배정합니다. 접수된 기록은 재접속해도 교체되지 않습니다.",
        (state) => anomalyNodeId(state, 1),
        { emotion: "surprised" },
      ),
      stationAnomaly02: line(
        "platform",
        "seo",
        "나",
        "두 번째 변칙 기록이 열렸다. 첫 번째와는 다른 종류였다. 윤서는 상태창을 한 번 보고 내 쪽으로 가까이 붙었다. “이번엔 네가 혼자 정답 찾으러 뛰어들기 전에 말해.”",
        (state) => anomalyNodeId(state, 2),
        { emotion: "soft" },
      ),
    });

    [1, 2].forEach((slot) => {
      const slotId = String(slot).padStart(2, "0");
      Object.entries(anomalies).forEach(([anomalyId, anomaly]) => {
        const nodeId = `stationAnomaly${slotId}_${anomalyId}`;
        const resultId = `${nodeId}_result`;
        story[nodeId] = line(
          anomaly.bg,
          "seo",
          "나",
          anomaly.text,
          null,
          {
            emotion: anomaly.emotion,
            choices: anomaly.choices.map((choice, index) => ({
              text: choice.text,
              next: resultId,
              effects: choice.effects,
              outcome: choice.risk
                ? (state) => {
                    const succeeded =
                      (state.stats[choice.risk.stat] || 0) >= choice.risk.threshold;
                    return {
                      effects: succeeded
                        ? { memory: 1, trust: 1, courage: 1 }
                        : { trust: -1 },
                      flags: [
                        `${nodeId}_choice_${index}`,
                        `${nodeId}_risk_${succeeded ? "success" : "failure"}`,
                      ],
                    };
                  }
                : null,
              flags: choice.risk ? null : [`${nodeId}_choice_${index}`],
            })),
          },
        );
        story[resultId] = line(
          anomaly.bg,
          "seo",
          "한윤서",
          (state) => {
            const selectedIndex = anomaly.choices.findIndex(
              (_, index) => state.flags[`${nodeId}_choice_${index}`],
            );
            const selected = anomaly.choices[selectedIndex >= 0 ? selectedIndex : 0];
            if (!selected.risk) return selected.result;
            return selected.result[
              state.flags[`${nodeId}_risk_success`] ? "success" : "failure"
            ];
          },
          (state) => nextAfterAnomaly(state, slot),
          { emotion: slot === 1 ? "soft" : "smile" },
        );
      });
    });
  }

  window.LostDawnExtras = { apply, catalog };
})();
