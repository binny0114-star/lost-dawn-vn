(() => {
  "use strict";

  const catalog = {
    photos: {
      "cocoa-pair": {
        title: "코코아 두 잔",
        subtitle: "DATE 01 · PLATFORM CAFE",
        description: "기억보다 지금의 취향을 먼저 물었던 첫 번째 약속.",
        expression: "smile",
        scene: "cafe",
      },
      "photo-strip": {
        title: "표정 네 컷",
        subtitle: "BONUS GAME · PHOTO BOOTH",
        description: "정답보다 윤서가 웃은 순간이 더 많이 찍힌 사진.",
        expression: "shy",
        scene: "photo",
      },
      "vending-overflow": {
        title: "캔커피 서른두 개",
        subtitle: "DATE 03 · LOST STATION",
        description: "자판기의 계산 실수로 열린 뜻밖의 간식 파티.",
        expression: "surprised",
        scene: "platform",
      },
      "perfect-shutter": {
        title: "막차 셔터",
        subtitle: "BONUS GAME · 02:17",
        description: "흔들렸지만 두 사람 모두 웃고 있어서 남겨 둔 한 장.",
        expression: "smile",
        scene: "train",
      },
      "compatibility-slip": {
        title: "궁합 영수증",
        subtitle: "DATE 05 · 94%",
        description: "감점 사유까지 서로 닮았다는 유실역의 공식 판정.",
        expression: "soft",
        scene: "office",
      },
      "first-real-date": {
        title: "오전 2시 18분 이후",
        subtitle: "TRUE END · FIRST DATE",
        description: "기억 속 재현이 아닌, 두 사람이 함께 정한 첫 번째 내일.",
        expression: "smile",
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
        "dateSchedule03",
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
        "dateSchedule05",
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
  }

  window.LostDawnExtras = { apply, catalog };
})();
