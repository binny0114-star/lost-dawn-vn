(() => {
  "use strict";

  // Extends the original route while preserving existing node IDs for old saves.
  function apply(story, chapters, endings, line) {
    Object.assign(chapters, {
      prologue: { number: "PROLOGUE", name: "막차" },
      one: { number: "CHAPTER 01", name: "유실물 보관소" },
      two: { number: "CHAPTER 02", name: "보내지 못한 여름" },
      three: { number: "CHAPTER 03", name: "사라진 1분" },
      four: { number: "CHAPTER 04", name: "유실역의 규칙" },
      five: { number: "FINAL CHAPTER", name: "오전 2시 18분" },
    });

    Object.assign(endings, {
      memory: {
        eyebrow: "NORMAL END 01",
        title: "이름을 간직한 사람",
        subtitle: "THE ONE WHO REMEMBERS",
        body:
          "오전 2시 18분, 도하는 혼자 지상으로 돌아왔다.\n윤서는 역에 남았지만 그녀의 이름, 목소리, 사랑했던 계절은 더 이상 분실물이 아니었다.\n도하는 비어 있던 사고 기록을 다시 열고 윤서의 가족에게 붉은 테이프를 건넸다. 매년 같은 날이면 빈 승강장에 파란 표 한 장이 놓였다.",
        scene: "dawn",
      },
      oblivion: {
        eyebrow: "NORMAL END 02",
        title: "깨끗한 분실물",
        subtitle: "UNCLAIMED",
        body:
          "아침은 놀랄 만큼 평범했고, 한도하의 지난 7년에는 아무런 흠집도 남지 않았다.\n다만 비가 오는 날이면 이유 없이 막차를 피했고, 오래된 녹음 파일 하나를 끝내 지우지 못했다.\n파일 이름은 비어 있었다. 재생 버튼을 누를 때마다 누군가 웃으며 그의 이름을 불렀다.",
        scene: "train",
      },
      keeper: {
        eyebrow: "ANOTHER END",
        title: "다음 막차의 역무원",
        subtitle: "THE NEW KEEPER",
        body:
          "윤서는 잃어버린 7년이 기다리는 지상으로 돌아갔고, 도하는 멈춘 1분을 이어받았다.\n그녀는 매년 유실역을 찾았지만 입구는 다시 열리지 않았다.\n새벽 2시 17분. 새 역무원은 다음 승객에게 묻는다. 무엇을 잃었고, 누구와 함께 찾아야 하느냐고.",
        scene: "office",
      },
      dawn: {
        eyebrow: "TRUE END",
        title: "분실되지 않은 내일",
        subtitle: "A DAWN THAT WAS NEVER LOST",
        body:
          "한 장의 표는 두 사람의 것이었고, 두 사람은 단 한 번 함께 돌아왔다.\n오전 2시 18분. 윤서에게는 낯선 7년이, 도하에게는 돌려줘야 할 7년이 시작됐다.\n잃어버린 시간을 되돌릴 수는 없었다. 그래도 이번에는 어느 쪽도 상대의 내일을 대신 결정하지 않았다.",
        scene: "dawn",
      },
    });

    story.p01.text =
      "새벽 2시 13분. 야근 끝에 올라탄 막차에는 나 말고 아무도 없었다. 창밖의 터널만 검은 필름처럼 끝없이 감겼다.";
    story.p02.text =
      "오전 2시 17분. 꺼져 있던 휴대폰 화면에 7년 전 오늘의 날짜와, 발신자 없는 메시지 한 통이 떠올랐다.";
    story.p02.next = "p02a";
    story.p05a.next = "p05c";
    story.p10.next = "p11";

    Object.assign(story, {
      p02a: line(
        "train",
        null,
        "나",
        "노선 앱에서 현재 위치가 사라졌다. 다음 역을 알리던 전광판에는 잠시 ‘반환 기한 00:01’이라는 문장이 깜빡였다.",
        "p02b",
      ),
      p02b: line(
        "train",
        null,
        "나",
        "코트 주머니에는 처음 보는 파란 왕복표가 있었다. 가운데에는 반으로 나눌 수 있는 가느다란 절취선이 나 있었다.",
        "p02c",
      ),
      p02c: line(
        "train",
        null,
        "나",
        "발행일은 2019년 8월 23일. 승객 이름 두 칸 중 내 이름만 읽을 수 있었고, 다른 한 칸은 물에 번진 듯 지워져 있었다.",
        "p03",
      ),
      p05c: line(
        "platform",
        null,
        "나",
        "승강장 시계는 2시 17분 59초에서 멎어 있었다. 초침은 앞으로 가려 할 때마다 보이지 않는 벽에 부딪혀 떨렸다.",
        "p05d",
      ),
      p05d: line(
        "platform",
        null,
        "안내문",
        "「보관 기간 7년. 기간이 끝난 유실물은 첫차 도착과 함께 역의 소유가 됩니다.」",
        "p05e",
      ),
      p05e: line(
        "platform",
        null,
        "나",
        "파란 표의 ‘입장’ 칸에는 이미 네 번의 흐린 도장이 겹쳐 있었다. 하지만 ‘귀환’ 칸은 한 번도 찍히지 않았다.",
        "p06",
      ),
      p11: line(
        "platform",
        "seo",
        "한윤서",
        "정확히는 네 번째야. 세 번의 너는 여기까지 왔고, 세 번 모두 마지막에 내 이름을 놓쳤어.",
        "p12",
        { emotion: "sad" },
      ),
      p12: line(
        "platform",
        "seo",
        "나",
        "기억나지 않는 실패를 들킨 사람처럼 목이 말랐다. 윤서는 화를 내지 않았고, 그래서 더 오래 기다린 사람처럼 보였다.",
        null,
        {
          emotion: "neutral",
          choices: [
            {
              text: "“기억 못 한다고 없던 일이 되는 건 아니겠지.”",
              next: "p13",
              effects: { courage: 1 },
              flag: "accepted_missing_visits",
            },
            {
              text: "“네 말을 바로 믿기는 어려워. 증거를 보여 줘.”",
              next: "p13",
              effects: { courage: 1 },
              flag: "demanded_proof",
            },
            {
              text: "“세 번이나 떠나는 걸 지켜봤어? 혼자서?”",
              next: "p13",
              effects: { trust: 1, courage: 1 },
              flag: "noticed_loop_pain",
            },
          ],
        },
      ),
      p13: line(
        "platform",
        "seo",
        "한윤서",
        (state) => {
          if (state.flags.noticed_loop_pain) {
            return "응. 네가 나를 잊는 순간까지 전부. 그래도 네가 네 발로 돌아올 때마다, 한 번쯤은 달라질 거라고 생각했어.";
          }
          if (state.flags.accepted_missing_visits) {
            return "그 말, 전의 너희는 하지 않았어. 이번에는 정말 조금 다를지도 모르겠다.";
          }
          return "그래서 증거를 모아 뒀어. 역이 지우지 못하게, 우리 둘이 함께 만졌던 물건들만.";
        },
        "p14",
        { emotion: "soft" },
      ),
      p14: line(
        "platform",
        "seo",
        "한윤서",
        "역은 한 번에 하나의 유실물만 돌려줘. 하나를 제대로 기억하면 다음 기억으로 갈 수 있어.",
        "p15",
        { emotion: "neutral" },
      ),
      p15: line(
        "platform",
        "seo",
        "나",
        "윤서는 앞서 걷다가 한 번 뒤를 돌아봤다. 내가 따라오는지 확인하는 버릇을, 몸이 먼저 기억하고 있었다.",
        "c101",
        { emotion: "soft" },
      ),
    });

    story.cassette02.next = "cassette03";
    story.camera02.next = "camera03";
    story.umbrella02.next = "umbrella03";

    Object.assign(story, {
      cassette03: line(
        "memory",
        "seo",
        "녹음 속 나",
        "「오늘의 도시 소리 17번. 비가 오고, 막차를 놓쳤고, 한윤서가 내 여자친구가 됐다. 중요한 순서대로 녹음함.」",
        "cassette04",
        { emotion: "shy" },
      ),
      cassette04: line(
        "memory",
        "seo",
        "녹음 속 윤서",
        "「한도하, 나중에 딴소리하지 마. 한쪽이 잊어도 이 테이프가 우리 둘 몫으로 기억할 거니까.」",
        "cassette05",
        { emotion: "smile" },
      ),
      cassette05: line(
        "office",
        "seo",
        "나",
        "말끝마다 겹쳐 웃는 두 사람의 숨소리까지 남아 있었다. 나는 그 친밀함을 부러워하다가, 그것이 과거의 나라는 사실에 숨이 막혔다.",
        "c110",
        { emotion: "soft" },
      ),
      camera03: line(
        "memory",
        "seo",
        "한윤서",
        "사진 싫어하는 거 알아. 그래도 한 장은 남겨야지. 네 기억력은 미래의 나한테 전혀 도움이 안 되거든.",
        "camera04",
        { emotion: "smile" },
      ),
      camera04: line(
        "memory",
        "seo",
        "나",
        "사진 구석에는 파란 표가 찍혀 있었다. 윤서와 내가 각자 한쪽 끝을 잡고, 절취선을 사이에 둔 채 장난스럽게 당기고 있었다.",
        "camera05",
        { emotion: "shy" },
      ),
      camera05: line(
        "office",
        "seo",
        "한윤서",
        "나는 예쁜 장면만 남기자는 말을 싫어했어. 잘린 프레임 밖에도 우리가 계속 있었으니까.",
        "c110",
        { emotion: "soft" },
      ),
      umbrella03: line(
        "memory",
        "seo",
        "나",
        "우산 아래에서 내가 고백을 세 번 연습하는 동안, 윤서는 모르는 척 자기 쪽 어깨를 비에 내주고 있었다.",
        "umbrella04",
        { emotion: "shy" },
      ),
      umbrella04: line(
        "memory",
        "seo",
        "한윤서",
        "손잡이 한쪽에 네 이름을 새겨. 반대쪽에는 내가 쓸게. 잃어버려도 둘 중 한 명은 찾으러 오게.",
        "umbrella05",
        { emotion: "smile" },
      ),
      umbrella05: line(
        "office",
        "seo",
        "나",
        "‘도하’는 내 필체였고 ‘윤서’는 그녀의 필체였다. 하나의 물건에 서로의 이름을 나눠 쓴 첫날이 돌아왔다.",
        "c110",
        { emotion: "soft" },
      ),
    });

    story.c114.next = "c115";

    Object.assign(story, {
      c115: line(
        "office",
        "seo",
        "나",
        "별처럼 켜진 기억들 사이에서 낡은 장부 한 권이 떨어졌다. 표지에는 ‘유실역 보관 규정’이라고 적혀 있었다.",
        "c116",
        { emotion: "neutral" },
      ),
      c116: line(
        "office",
        "seo",
        "안내 방송",
        "보관 기한 종료까지 43초. 품목 HYS-0217은 귀속 절차를 준비합니다.",
        "c117",
        { emotion: "sad" },
      ),
      c117: line(
        "office",
        "seo",
        "나",
        "장부의 같은 페이지에 서로 다른 세 종류의 흔적이 겹쳐 있었다. 지금은 하나만 자세히 볼 시간이 있었다.",
        null,
        {
          emotion: "neutral",
          choices: [
            {
              text: "붉은 글씨로 적힌 ‘7년 후 귀속’ 조항",
              next: "c118",
              effects: { memory: 1, courage: 1 },
              flag: "read_disposal_rule",
            },
            {
              text: "내 필체로 세 번 반복된 방문자 서명",
              next: "c118",
              effects: { memory: 1, trust: 1 },
              flag: "found_previous_visits",
            },
            {
              text: "파란 왕복표 옆에 적힌 두 사람의 메모",
              next: "c118",
              effects: { memory: 1, trust: 1, courage: 1 },
              flag: "saw_shared_ticket",
            },
          ],
        },
      ),
      c118: line(
        "office",
        "seo",
        "나",
        (state) => {
          if (state.flags.saw_shared_ticket) {
            return "메모는 절취선을 사이에 두고 이어졌다. 내 글씨로 ‘갈 때도’, 윤서의 글씨로 ‘돌아올 때도’, 그 아래 함께 ‘둘이서’라고 적혀 있었다.";
          }
          if (state.flags.found_previous_visits) {
            return "서명 옆에는 매번 같은 문장이 있었다. 「이름을 확인하지 못함. 기억 원위치. 승객 재출발.」 세 번 모두 내 서명이었다.";
          }
          return "조항 아래 작은 글씨가 이어졌다. 「귀속된 기억은 역사와 관계자의 기록에서 소급 말소한다.」 윤서는 죽는 것보다 완전히 없던 사람이 될 참이었다.";
        },
        "c119",
        { emotion: "sad" },
      ),
      c119: line(
        "office",
        "seo",
        "나",
        "품목 번호의 HYS는 한윤서의 이니셜이었다. 물건을 보관하듯 사람의 이름을 번호로 바꿔 놓은 기록이었다.",
        "c120",
        { emotion: "neutral" },
      ),
      c120: line(
        "office",
        "seo",
        "한윤서",
        "첫차가 들어오면 나는 역의 일부가 돼. 그러면 네가 다시 와도, 기다렸다는 사실조차 기억하지 못할 거야.",
        "c121",
        { emotion: "sad" },
      ),
      c121: line(
        "office",
        "seo",
        "나",
        "“왜 처음부터 말하지 않았어?” 윤서는 대답 대신 장부 모서리를 눌렀다. 종이가 떨리는 건지 손이 떨리는 건지 알 수 없었다.",
        "c122",
        { emotion: "sad" },
      ),
      c122: line(
        "office",
        "seo",
        "한윤서",
        "시간이 없다는 걸 알면 넌 또 네 잘못부터 찾을 테니까. 나는 네가 죄책감 말고 다른 이유로 기억해 줬으면 했어.",
        null,
        {
          emotion: "soft",
          choices: [
            {
              text: "“또 혼자 결정했네. 화낼 시간도 나한테 남겨 줘.”",
              next: "c123",
              effects: { courage: 1 },
              flag: "confronted_deadline",
            },
            {
              text: "“무서웠겠다. 사라지는 것보다 잊히는 게.”",
              next: "c123",
              effects: { trust: 1 },
              flag: "accepted_her_fear",
            },
            {
              text: "“이번 결정은 둘이 하자. 어떤 결말이든.”",
              next: "c123",
              effects: { trust: 1, courage: 1 },
              flag: "promised_together",
            },
          ],
        },
      ),
      c123: line(
        "office",
        "seo",
        "한윤서",
        (state) => {
          if (state.flags.promised_together) {
            return "윤서는 한참 뒤에 고개를 끄덕였다. “약속은 기억이 아니라 선택으로 지키는 거야. 이번에는 확인할게.”";
          }
          if (state.flags.accepted_her_fear) {
            return "“응. 네 기억에서 사라졌을 때보다, 내가 나를 잊게 될까 봐 더 무서워.”";
          }
          return "“그 화, 나중까지 기억해 둬. 나도 네가 세 번 도망친 거 전부 몰아서 화낼 거니까.”";
        },
        "m01",
        { emotion: "smile" },
      ),
    });

    story.m03.next = "m03a";

    Object.assign(story, {
      m03a: line(
        "memory",
        "seo",
        "나",
        "새끼손가락이 맞닿는 순간, 같은 여름의 세 장면이 동시에 열렸다. 무엇부터 기억할지는 내가 정할 수 있었다.",
        null,
        {
          emotion: "soft",
          choices: [
            {
              text: "우리의 목소리가 처음 겹친 방송실 옥상",
              next: "summerA01",
              effects: { memory: 1, trust: 1 },
              flag: "remembered_first_confession",
            },
            {
              text: "‘다음에’라는 말로 끝낸 마지막 다툼",
              next: "summerB01",
              effects: { memory: 1, courage: 1 },
              flag: "remembered_last_argument",
            },
            {
              text: "두 사람의 이름을 적은 파란 동반 왕복표",
              next: "summerC01",
              effects: { memory: 1, trust: 1, courage: 1 },
              flag: "saw_shared_ticket",
            },
          ],
        },
      ),
      summerA01: line(
        "memory",
        "seo",
        "기억 속 윤서",
        "도시의 밤 소리를 모은다면서 정작 네 목소리는 하나도 안 넣었네. 마이크 이쪽으로 줘 봐.",
        "summerA02",
        { emotion: "smile" },
      ),
      summerA02: line(
        "memory",
        "seo",
        "기억 속 나",
        "“한윤서가 좋아서 같이 있고 싶다.” 녹음된 고백이 스피커로 재생되자, 나는 전원을 끄려다 윤서에게 손목을 잡혔다.",
        "summerA03",
        { emotion: "shy" },
      ),
      summerA03: line(
        "memory",
        "seo",
        "기억 속 윤서",
        "지우지 마. 대답도 같이 녹일 거니까. 나도 너 좋아해, 한도하.",
        "summerCommon",
        { emotion: "smile" },
      ),
      summerB01: line(
        "memory",
        "seo",
        "기억 속 윤서",
        "바다는 다음 달, 저녁은 다음 주, 전화는 내일. 도하야, 네 ‘다음’에는 자꾸 내가 없어.",
        "summerB02",
        { emotion: "sad" },
      ),
      summerB02: line(
        "memory",
        "seo",
        "기억 속 나",
        "나는 프로젝트만 끝나면 달라질 거라고 말했다. 윤서는 막차 시간을 확인하며 “다음이 꼭 온다는 보장은 없어”라고 답했다.",
        "summerB03",
        { emotion: "sad" },
      ),
      summerB03: line(
        "memory",
        "seo",
        "나",
        "그것이 우리의 마지막 평범한 다툼이었다. 사고 뒤 나는 사과할 상대뿐 아니라, 사과하지 못했다는 사실까지 잃었다.",
        "summerCommon",
        { emotion: "sad" },
      ),
      summerC01: line(
        "memory",
        "seo",
        "기억 속 윤서",
        "동반 왕복권은 한 장인데 이름 칸은 두 개네. 갈 때 싸웠다가 돌아올 때 화해하라는 뜻인가?",
        "summerC02",
        { emotion: "smile" },
      ),
      summerC02: line(
        "memory",
        "seo",
        "기억 속 나",
        "우리는 절취선 양쪽에 이름을 하나씩 적었다. 윤서는 내 쪽 표를, 나는 윤서 쪽 표를 보관하기로 했다.",
        "summerC03",
        { emotion: "soft" },
      ),
      summerC03: line(
        "memory",
        "seo",
        "기억 속 윤서",
        "한쪽이 길을 잃어도 다른 한쪽이 데리러 오는 거야. 왕복은 장소가 아니라 약속이니까.",
        "summerCommon",
        { emotion: "shy" },
      ),
      summerCommon: line(
        "memory",
        "seo",
        "나",
        "행복한 장면 뒤에는 다툼이, 다툼 뒤에는 화해할 약속이 있었다. 어느 하나를 지워서는 우리를 설명할 수 없었다.",
        "m04",
        { emotion: "soft" },
      ),
    });

    story.m04.text =
      "2019년 8월 23일, 약속을 미룬 채 돌아오던 막차에서 터널이 무너졌다. 불이 꺼졌고 맨 앞 칸에서 연기가 밀려왔다.";
    story.m06.next = "m06a";
    story.m07.text =
      "마지막 승객을 내보낸 순간 시계가 2시 17분 59초에 멎었다. 닫혀야 할 비상문 대신, 지도에 없는 승강장이 열렸다.";
    story.m08.text =
      "윤서는 우리가 함께 산 파란 표를 낯선 개찰기에 넣었다. ‘공동 소유 기억’을 맡기는 대가로 내 귀환 한 번을 요구했다.";

    Object.assign(story, {
      m06a: line(
        "memory",
        "seo",
        "나",
        "기관사는 의식을 잃었고 비상문은 반쯤 열리다 멈췄다. 벽의 안내문에는 수동 레버를 누르는 동안만 문이 열린다고 적혀 있었다.",
        "m06b",
        { emotion: "neutral" },
      ),
      m06b: line(
        "memory",
        "seo",
        "기억 속 윤서",
        "내가 레버를 잡을게. 너는 사람들을 밖으로 보내. 서른한 명 다 나가면 바로 따라갈게.",
        "m06c",
        { emotion: "soft" },
      ),
      m06c: line(
        "memory",
        "seo",
        "나",
        "나는 다친 아이를 업고 대피로를 오갔다. 마지막 사람이 터널 밖으로 나갔을 때, 천장에서 두 번째 붕괴음이 들렸다.",
        "m06d",
        { emotion: "sad" },
      ),
      m06d: line(
        "memory",
        "seo",
        "기억 속 나",
        "윤서를 데리러 돌아왔지만 레버에서 손을 떼면 문이 닫혔다. 윤서는 웃으며 내게 파란 표를 던졌다.",
        "m06e",
        { emotion: "cry" },
      ),
      m06e: line(
        "memory",
        "seo",
        "안내 방송",
        "귀환 가능 횟수 1회. 공동 소유물 한 건을 운임으로 보관합니다. 보관자 또는 청구인을 지정하십시오.",
        "m06f",
        { emotion: "neutral" },
      ),
      m06f: line(
        "memory",
        "seo",
        "기억 속 윤서",
        "“보관자는 한윤서. 청구인은 한도하.” 내가 반대할 틈도 없이 윤서는 개찰 버튼을 눌렀고, 내 손의 표만 문밖으로 밀려났다.",
        "m07",
        { emotion: "cry" },
      ),
    });

    story.t01.chapter = "three";
    story.t09.next = "t10";

    Object.assign(story, {
      t10: line(
        "tunnel",
        "seo",
        "나",
        "흰빛 속에서 내 발자국 세 쌍이 반대편으로 지나갔다. 모두 지금의 나와 같은 얼굴이었고, 모두 윤서를 지나쳐 혼자 걷고 있었다.",
        "t11",
        { emotion: "surprised" },
      ),
      t11: line(
        "tunnel",
        "seo",
        "한윤서",
        "첫 번째 너는 나를 환상이라고 했어. 두 번째는 기억만 가져가겠다고 했고, 세 번째는 대신 남겠다고 했지만 내 대답을 묻지 않았어.",
        "t12",
        { emotion: "sad" },
      ),
      t12: line(
        "tunnel",
        "seo",
        "나",
        "기억 없는 내가 저지른 선택들이었다. 하지만 윤서에게는 세 번 모두 실제로 남아 있었다.",
        null,
        {
          emotion: "neutral",
          choices: [
            {
              text: "“도망친 세 번도 내 선택이야. 이번에는 외면하지 않을게.”",
              next: "t13",
              effects: { courage: 1, trust: 1 },
              flag: "owned_previous_returns",
            },
            {
              text: "“그래도 왜 나를 네 번째까지 불렀어?”",
              next: "t13",
              effects: { trust: 1 },
              flag: "asked_why_called",
            },
            {
              text: "“기억하지 못한 선택까지 내 책임일 수는 없어.”",
              next: "t13",
              effects: { trust: -1 },
              flag: "rejected_previous_returns",
            },
          ],
        },
      ),
      t13: line(
        "tunnel",
        "seo",
        "한윤서",
        (state) => {
          if (state.flags.owned_previous_returns) {
            return "책임지라는 뜻으로 말한 게 아니야. 다만 이번 네가 전의 너희와 다르다는 걸, 말이 아니라 선택으로 보고 싶었어.";
          }
          if (state.flags.asked_why_called) {
            return "네가 나를 잊어도 몸은 항상 같은 막차를 탔으니까. 마음보다 질긴 습관을 한 번만 더 믿어 보고 싶었어.";
          }
          return "그래. 기억 없는 너를 벌줄 생각은 없어. 하지만 내가 겪은 세 번까지 없던 일로 만들지는 말아 줘.";
        },
        "t14",
        { emotion: "soft" },
      ),
      t14: line(
        "tunnel",
        "seo",
        "나",
        "지나간 세 명의 손에도 같은 파란 표가 있었다. 기억은 매번 지워졌는데 공동 소유물인 표만은 역이 회수하지 못했다.",
        "t15",
        { emotion: "neutral" },
      ),
      t15: line(
        "tunnel",
        "seo",
        "한윤서",
        "한 사람이 버려도 다른 사람 몫이 남아 있으니까. 그래서 내가 메시지를 숨길 수 있었고, 네가 다시 찾아올 길도 남았어.",
        "t16",
        { emotion: "soft" },
      ),
      t16: line(
        "tunnel",
        "seo",
        "안내 방송",
        "기억 복원 완료. 소유권 심사를 시작합니다. 청구인과 보관자는 규정실로 이동하십시오.",
        "r01",
        { emotion: "neutral" },
      ),
    });

    Object.assign(story, {
      r01: line(
        "office",
        "seo",
        "나",
        "보관소의 선반이 갈라지며 텅 빈 심사실이 나타났다. 가운데에는 파란 표와 한 장의 소유권 기록만 놓여 있었다.",
        "r02",
        { chapter: "four", emotion: "neutral" },
      ),
      r02: line(
        "office",
        "seo",
        "안내 방송",
        "품목 HYS-0217. 내용물: 한윤서와 관련된 공동 기억 7년분. 보관자: 한윤서. 청구인: 한도하. 소유자 항목은 미확정입니다.",
        "r03",
        { emotion: "sad" },
      ),
      r03: line(
        "office",
        "seo",
        "안내 방송",
        "질문. 이 분실은 누구의 것입니까?",
        null,
        {
          emotion: "neutral",
          choices: [
            {
              text: "“내가 윤서를 잃었다.”",
              next: "r04",
              effects: { memory: 1 },
              flag: "named_single_loss",
            },
            {
              text: "“윤서가 자기 삶을 잃었다.”",
              next: "r04",
              effects: { trust: 1 },
              flag: "named_yoonseo_loss",
            },
            {
              text: "“우리는 서로와 함께 보낼 7년을 잃었다.”",
              next: "r04",
              effects: { memory: 1, trust: 1, courage: 1 },
              flag: "named_joint_loss",
            },
          ],
        },
      ),
      r04: line(
        "office",
        "seo",
        "안내 방송",
        (state) => {
          if (state.flags.named_joint_loss) {
            return "공동 손실 진술을 접수합니다. 두 사람의 기억이 동일한 품목으로 등록된 이유와 일치합니다.";
          }
          if (state.flags.named_yoonseo_loss) {
            return "보관자의 손실은 확인됩니다. 그러나 청구인이 자신의 손실을 분리하여 진술했습니다.";
          }
          return "청구인의 손실은 확인됩니다. 그러나 보관자의 7년은 청구 대상에서 제외됩니다.";
        },
        "r05",
        { emotion: "neutral" },
      ),
      r05: line(
        "office",
        "seo",
        "한윤서",
        "그날 나는 우리 둘의 기억을 혼자 맡겼어. 널 살리고 싶었지만, 네 몫까지 결정한 건 잘못이었어.",
        "r06",
        { emotion: "sad" },
      ),
      r06: line(
        "office",
        "seo",
        "나",
        "윤서는 내 선택을 빼앗은 일을 사과하면서도, 같은 상황이라면 또 그럴 사람처럼 보였다.",
        null,
        {
          emotion: "soft",
          choices: [
            {
              text: "“살려 줬잖아. 그 선택까지 잘못이라고 하지는 마.”",
              next: "r07",
              effects: { trust: 1 },
              flag: "accepted_sacrifice",
            },
            {
              text: "“고맙지만, 내 미래까지 혼자 정하지는 마.”",
              next: "r07",
              effects: { trust: 1, courage: 1 },
              flag: "refused_sacrifice",
            },
            {
              text: "“이번에는 내가 대신 남으면 공평해져.”",
              next: "r07",
              effects: { courage: 1 },
              flag: "offered_exchange",
            },
          ],
        },
      ),
      r07: line(
        "office",
        "seo",
        "한윤서",
        (state) => {
          if (state.flags.refused_sacrifice) {
            return "윤서는 천천히 고개를 끄덕였다. “알았어. 살리는 쪽도, 살아가는 쪽도 같이 정하자.”";
          }
          if (state.flags.offered_exchange) {
            return "“그건 공평한 게 아니라 역할만 바꾸는 거야.” 윤서가 처음으로 단호하게 내 말을 잘랐다.";
          }
          return "“네가 그렇게 말해 주길 바란 적도 있어. 그런데 고마움만으로 7년을 갚게 하고 싶지는 않아.”";
        },
        "r08",
        { emotion: "soft" },
      ),
      r08: line(
        "office",
        "seo",
        "안내 방송",
        "귀환 운임을 선택하십시오. 행복한 기억 또는 고통스러운 기억 한 종류를 역에 남겨야 합니다.",
        "r09",
        { emotion: "neutral" },
      ),
      r09: line(
        "office",
        "seo",
        "나",
        "빛 속에 옥상의 고백과 무너지는 터널이 나란히 떠올랐다. 역은 우리를 견디기 쉬운 반쪽으로 만들려 했다.",
        null,
        {
          emotion: "neutral",
          choices: [
            {
              text: "행복했던 기억만 가지고 간다.",
              next: "r10",
              effects: { trust: 1 },
              flag: "kept_only_happiness",
            },
            {
              text: "고통스러운 기억만 가지고 간다.",
              next: "r10",
              effects: { courage: 1 },
              flag: "kept_only_pain",
            },
            {
              text: "“기억은 나눌 수 없어. 좋은 날도 나쁜 날도 전부 우리야.”",
              next: "r10",
              effects: { memory: 1, trust: 1, courage: 1 },
              flag: "accepted_whole_memory",
            },
          ],
        },
      ),
      r10: line(
        "office",
        "seo",
        "안내 방송",
        (state) => {
          if (state.flags.accepted_whole_memory) {
            return "분류 실패. 복합 기억의 전량 반환을 요청했습니다. 추가 운임 산정을 위해 원본 승차권을 제시합니다.";
          }
          if (state.flags.kept_only_happiness) {
            return "고통 기록을 분리합니다. 분리 후 보관자 한윤서의 선택과 희생은 청구인의 기억에서 제외됩니다.";
          }
          return "행복 기록을 분리합니다. 분리 후 보관자 한윤서와 청구인의 관계는 사고 기록으로만 남습니다.";
        },
        "r11",
        { emotion: "neutral" },
      ),
      r11: line(
        "office",
        "seo",
        "나",
        "2019년의 파란 동반 왕복표가 유리 위에 나타났다. 절취선, 두 개의 이름, ‘귀환 1회’라는 도장 중 하나가 유난히 빛났다.",
        null,
        {
          emotion: "soft",
          choices: [
            {
              text: "한 장을 두 몫으로 나누는 절취선을 살핀다.",
              next: "r12",
              effects: { memory: 1 },
              flag: "read_perforation",
            },
            {
              text: "양쪽 끝에 서로 바꿔 적은 두 이름을 살핀다.",
              next: "r12",
              effects: { trust: 1 },
              flag: "confirmed_joint_ownership",
            },
            {
              text: "‘한 사람’이 아닌 ‘귀환 1회’라고 적힌 도장을 살핀다.",
              next: "r12",
              effects: { courage: 1 },
              flag: "read_return_wording",
            },
          ],
        },
      ),
      r12: line(
        "office",
        "seo",
        "나",
        (state) => {
          if (state.flags.read_perforation) {
            return "표는 찢어져도 무효가 되지 않도록 만들어져 있었다. 두 조각은 따로 쓰는 표가 아니라, 한 번의 왕복을 함께 증명하는 반쪽들이었다.";
          }
          if (state.flags.confirmed_joint_ownership) {
            return "내 쪽에는 윤서의 이름이, 윤서 쪽에는 내 이름이 있었다. 어느 한쪽도 상대 없이 소유권을 완성할 수 없었다.";
          }
          return "규정은 승객 수를 제한하지 않았다. 단 한 번의 귀환만 허락했다. 함께 돌아가면 귀환은 여전히 한 번이었다.";
        },
        "r13",
        { emotion: "surprised" },
      ),
      r13: line(
        "office",
        "seo",
        "한윤서",
        "한 장의 공동 소유 표, 한 번의 귀환……. 도하야, 네가 생각하는 그 방법이 맞더라도 역이 순순히 보내 줄까?",
        "r14",
        { emotion: "surprised" },
      ),
      r14: line(
        "office",
        "seo",
        "안내 방송",
        "규정 해석 오류. 보관 기한 종료까지 9초. 즉시 한 명의 귀환자를 지정하십시오.",
        "r15",
        { emotion: "neutral" },
      ),
      r15: line(
        "office",
        "seo",
        "나",
        "방법을 알아도 윤서의 삶을 또 대신 결정한다면 7년 전과 달라지는 것은 없었다.",
        null,
        {
          emotion: "soft",
          choices: [
            {
              text: "윤서가 대답하기 전에 표를 집어 든다.",
              next: "r16",
              effects: { courage: 1 },
              flag: "acted_alone",
            },
            {
              text: "“내가 정할게. 이번에는 나를 믿어.”",
              next: "r16",
              effects: { courage: 1 },
              flag: "asked_for_blind_trust",
            },
            {
              text: "“윤서야, 무서워도 나랑 같이 돌아갈래?”",
              next: "r16",
              effects: { trust: 1, courage: 1 },
              flag: "asked_consent",
            },
          ],
        },
      ),
      r16: line(
        "office",
        "seo",
        "한윤서",
        (state) => {
          if (state.flags.asked_consent) {
            return "“응. 밖이 얼마나 달라졌든, 이번에는 내가 직접 갈 곳을 고를게.” 윤서는 내 손이 아니라 표의 반대쪽을 잡았다.";
          }
          if (state.flags.asked_for_blind_trust) {
            return "윤서는 손을 내밀었지만 표정은 굳어 있었다. “믿을게. 대신 네 선택이 우리 둘을 위한 거였으면 좋겠어.”";
          }
          return "내가 표를 쥐자 윤서가 손목을 붙잡았다. “또 혼자 결정하려고? 그게 우리를 여기 묶어 둔 방식이었어.”";
        },
        "r17",
        { emotion: "soft" },
      ),
      r17: line(
        "office",
        "seo",
        "나",
        "심사실 문이 열리고 새벽빛이 번졌다. 초침이 마지막 한 칸을 움직이기 전에, 우리는 최종 승강장으로 달렸다.",
        "f01",
        { emotion: "neutral" },
      ),
    });

    story.f01.chapter = "five";
    story.f02.text =
      "역은 새 파란 표를 한 장 내놓았다. ‘귀환 1회’라는 글자 아래, 보관자와 청구인의 이름 칸이 나란히 비어 있었다.";
    story.f03.text =
      "윤서가 남으면 기억을 가진 내가 돌아간다. 내가 기억을 버리면 처음으로 돌아간다. 내가 남으면 윤서는 나갈 수 있다. 규정이 원하는 답은 셋뿐이었다.";
    story.f04.text =
      "열차 문이 열리고 초침이 떨렸다. 손안의 표에는 우리가 찾아낸 모든 단서와, 서로에게 묻지 않았던 선택들이 겹쳐 있었다.";
    story.f04.choices = [
      {
        text: "윤서의 기억을 안고 혼자 돌아간다.",
        next: "em01",
      },
      {
        text: "모든 기억을 역에 두고 혼자 돌아간다.",
        next: "eo01",
      },
      {
        text: "내가 역에 남고 윤서를 보낸다.",
        next: "ek01",
      },
      {
        text: "공동 소유 표를 반으로 나눠 윤서와 함께 돌아간다.",
        next: "ed01",
        require: (state) =>
          state.flags.legacy_true_ending_eligible ||
          (state.stats.memory >= 4 &&
            state.stats.trust >= 4 &&
            state.stats.courage >= 3 &&
            state.flags.accepted_whole_memory &&
            (state.flags.read_perforation ||
              state.flags.confirmed_joint_ownership ||
              state.flags.read_return_wording) &&
            state.flags.asked_consent &&
            (state.flags.named_joint_loss || state.flags.saw_shared_ticket)),
        lockedText: "온전한 기억 · 공동 소유 · 윤서의 동의 필요",
      },
    ];

    delete story.em02.ending;
    story.em02.next = "em03";
    delete story.eo02.ending;
    story.eo02.next = "eo03";
    delete story.ek02.ending;
    story.ek02.next = "ek03";
    delete story.ed05.ending;
    story.ed05.next = "ed06";

    Object.assign(story, {
      em03: line(
        "train",
        null,
        "나",
        "오전 2시 18분. 휴대폰에는 2019년에 멈춘 연락처 하나가 돌아와 있었다. 이름은 한윤서, 마지막 메시지는 ‘다음에는 꼭 바다’였다.",
        "em04",
      ),
      em04: line(
        "dawn",
        null,
        "나",
        "사고 기록의 사망자 칸은 비어 있었지만 대피 인원은 서른한 명이 아니라 서른두 명으로 고쳐졌다. 세상은 윤서를 희미하게나마 다시 기억하기 시작했다.",
        "em05",
      ),
      em05: line(
        "dawn",
        null,
        "나",
        "나는 붉은 테이프와 사진을 들고 윤서의 가족을 찾아갔다. 돌아오지 못한 사람의 이름을, 돌아온 사람이 끝까지 말하기 위해.",
        null,
        { ending: "memory" },
      ),
      eo03: line(
        "train",
        null,
        "나",
        "종점에서 눈을 떴을 때 주머니에는 이름 없는 파란 표가 있었다. 버리려 했지만 손가락이 이상하리만큼 세게 움켜쥐었다.",
        "eo04",
      ),
      eo04: line(
        "train",
        null,
        "메시지",
        "몇 달 뒤 오래된 클라우드에서 붉은 테이프의 음성 파일이 발견됐다. 재생 버튼 위에서 손이 멈췄고, 나는 이유 없이 울었다.",
        "eo05",
      ),
      eo05: line(
        "train",
        null,
        "나",
        "끝내 파일을 열지 못했다. 다만 비 오는 날 막차에서 내 이름을 부르는 목소리를 들으면, 빈 옆자리에 조용히 자리를 내주었다.",
        null,
        { ending: "oblivion" },
      ),
      ek03: line(
        "office",
        null,
        "안내 방송",
        "새 보관자 등록 완료. 품목 HDH-0218. 첫 업무를 시작합니다.",
        "ek04",
      ),
      ek04: line(
        "dawn",
        "seo",
        "한윤서",
        "오전 2시 18분의 지상은 7년이나 낯설었다. 윤서는 역 입구를 찾아 매년 같은 막차를 탔지만 문은 다시 열리지 않았다.",
        "ek05",
        { emotion: "sad" },
      ),
      ek05: line(
        "office",
        null,
        "나",
        "나는 역무원 모자를 쓰고 다음 열차를 기다렸다. 언젠가 윤서가 청구인으로 돌아오면, 이번에는 내 선택이 아니었다고 화내 주기를 바라면서.",
        null,
        { ending: "keeper" },
      ),
      ed06: line(
        "dawn",
        "seo",
        "안내 방송",
        "승차권 훼손. 무효 처리……. 오류. 두 조각에서 동일한 소유권과 동일한 귀환 요청을 확인했습니다.",
        "ed07",
        { emotion: "surprised" },
      ),
      ed07: line(
        "dawn",
        "seo",
        "나",
        "“표는 한 장이고 귀환도 한 번이야. 우리는 따로 돌아가는 두 사람이 아니라, 함께 잃어버린 걸 함께 찾은 공동 청구인이야.”",
        "ed08",
        { emotion: "smile" },
      ),
      ed08: line(
        "dawn",
        "seo",
        "안내 방송",
        "공동 청구 승인. 품목 HYS-0217과 관련 기억 전량을 반환합니다. 유실역 보관 절차를 종료합니다.",
        "ed09",
        { emotion: "surprised" },
      ),
      ed09: line(
        "dawn",
        "seo",
        "한윤서",
        "플랫폼 간판이 빛 속에서 무너졌다. 문을 넘기 직전 윤서가 말했다. “밖에서는 나 스물다섯이고 너 서른둘이네. 존댓말 해야 해?”",
        "ed10",
        { emotion: "smile" },
      ),
      ed10: line(
        "dawn",
        "seo",
        "나",
        "“일단 아침부터 먹자. 그다음 네가 잃어버린 7년을 하나씩 돌려줄게.” 초침이 움직였고, 윤서는 이번에는 내 손을 놓지 않았다.",
        null,
        { ending: "dawn", emotion: "smile" },
      ),
    });
  }

  window.LostDawnStoryExpansion = { apply };
})();
