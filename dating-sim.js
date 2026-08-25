(() => {
  "use strict";

  const TOTAL_DATES = 5;

  const LOCATIONS = {
    cafe: {
      code: "PLATFORM CAFE",
      name: "승강장 카페",
      description: "따뜻한 음료와 마주 앉는 대화",
      reward: "동조 +1",
      bg: "platform",
      stat: "trust",
    },
    photo: {
      code: "PHOTO BOOTH",
      name: "증명사진 부스",
      description: "남기지 못한 두 사람의 사진",
      reward: "기억 +1",
      bg: "office",
      stat: "memory",
    },
    rooftop: {
      code: "MEMORY ROOFTOP",
      name: "기억의 옥상",
      description: "도시의 소리와 미완성된 약속",
      reward: "결심 +1",
      bg: "memory",
      stat: "courage",
    },
  };

  const DAYS = [
    {
      number: 1,
      title: "다시 알아가기",
      hint: "윤서 · 사실 오늘은 따뜻한 게 마시고 싶어.",
      preferred: "cafe",
      scenes: {
        cafe: {
          text:
            "불이 켜진 자판기 앞에서 윤서는 코코아와 블랙커피를 번갈아 눌렀다. “내가 어느 쪽을 좋아했는지 기억나?”",
          answers: [
            {
              text: "“코코아. 휘핑은 빼고, 대신 마시멜로는 두 개.”",
              result:
                "윤서가 종이컵을 받아 들고 웃었다. “이런 쓸데없는 건 기억하면서 내 이름은 잊었네.” 핀잔과 달리 목소리는 조금 따뜻해졌다.",
              effects: { memory: 1 },
            },
            {
              text: "“예전 취향 말고, 지금 좋아하는 걸 다시 알려 줘.”",
              result:
                "윤서는 잠시 고민하다 코코아를 골랐다. “좋아. 과거의 정답 말고 지금의 나부터 외워.”",
              effects: { trust: 1 },
            },
          ],
        },
        photo: {
          text:
            "낡은 부스 화면에 ‘두 사람의 거리를 맞추세요’라는 문구가 떴다. 윤서는 어깨를 붙였다가 내가 굳자 슬쩍 떨어졌다.",
          answers: [
            {
              text: "“둘 다 어색한 채로 찍자. 이것도 지금의 우리니까.”",
              result:
                "셔터가 터지는 순간 윤서도 결국 웃었다. 사진 속 두 사람은 연인보다 다시 친해지는 중인 사람들처럼 보였다.",
              effects: { trust: 1 },
            },
            {
              text: "윤서가 물러나기 전에 먼저 어깨를 맞댄다.",
              result:
                "윤서의 눈이 둥그래졌다. “기억 없을 때가 더 과감하네.” 두 번째 셔터에는 붉어진 귀까지 찍혔다.",
              effects: { courage: 1 },
            },
          ],
        },
        rooftop: {
          text:
            "옥상 난간 아래로 존재하지 않는 도시의 불빛이 흘렀다. 윤서는 녹음기를 켜며 지금 가장 선명한 소리를 골라 보라고 했다.",
          answers: [
            {
              text: "“열차 소리보다 네가 웃는 소리.”",
              result:
                "녹음기 파형이 크게 흔들렸다. 윤서는 웃음을 참지 못하고 말했다. “그 답, 예전에도 써먹었어.”",
              effects: { trust: 1 },
            },
            {
              text: "눈을 감고 멀어지는 막차 소리를 끝까지 듣는다.",
              result:
                "철로의 진동 사이로 오래전 윤서와 나란히 걷던 발소리가 돌아왔다. 잊힌 밤은 생각보다 조용했다.",
              effects: { memory: 1 },
            },
          ],
        },
      },
      message: {
        time: "02:17 + 00:48",
        incoming: [
          "오늘은 네가 기억 속의 나만 찾을까 봐 조금 겁났어.",
          "그래도 지금의 나한테 질문해 줘서 좋았어.",
        ],
        replies: [
          {
            text: "나도 지금의 너부터 다시 좋아해 보고 싶어.",
            response: "그 말 나중에 취소하기 없기.",
            effects: { affection: 1, trust: 1 },
          },
          {
            text: "오늘 생각보다 재밌었어.",
            response: "나도. 첫날치고는 꽤 괜찮았지?",
            effects: { courage: 1 },
          },
          {
            text: "필요한 기억은 찾았으니 오늘은 이만 쉬자.",
            response: "응. 그런데 내일은 기억 말고 나 만나러 와 줘.",
            effects: { trust: -1 },
          },
          {
            text: "[스티커] 코코아 두 잔",
            response: "컵 하나는 내 거 맞지?",
            effects: { affection: 1 },
            sticker: { symbol: "☕", label: "같이 마시자" },
          },
        ],
      },
    },
    {
      number: 2,
      title: "좋아하는 것 수집하기",
      hint: "윤서 · 우리 둘이 같이 찍힌 사진은 정말 한 장도 안 남았을까?",
      preferred: "photo",
      scenes: {
        cafe: {
          text:
            "오늘의 메뉴판에는 서로의 취향을 맞혀야 주문할 수 있다고 적혀 있었다. 윤서는 내 몫의 버튼 앞에서 일부러 오래 망설였다.",
          answers: [
            {
              text: "“내 건 아무거나. 대신 네가 고른 이유까지 알려 줘.”",
              result:
                "윤서는 가장 쓴 커피를 골랐다. “넌 단 걸 싫어해서가 아니라, 내가 뺏어 마실 걸 남겨 두려고 이걸 골랐어.”",
              effects: { memory: 1 },
            },
            {
              text: "윤서에게 내 취향을 새로 정해 달라고 한다.",
              result:
                "“그럼 오늘부터 라테.” 윤서는 컵에 자기 이름을 적었다. “잊으면 이걸 보고 다시 물어봐.”",
              effects: { trust: 1 },
            },
          ],
        },
        photo: {
          text:
            "부스가 2019년 날짜를 인식하자 빈 필름 다섯 칸이 나타났다. 윤서는 첫 칸을 가리켰다. “우리한테 없던 다음 사진을 찍자.”",
          answers: [
            {
              text: "“첫 장은 네가 고르고, 마지막 장은 밖에서 같이 고르자.”",
              result:
                "윤서는 첫 장에 장난스러운 표정을 골랐다. 마지막 칸은 비워 둔 채 ‘지상에서 촬영 예정’이라는 글자가 새겨졌다.",
              effects: { trust: 1, courage: 1 },
            },
            {
              text: "예전 사진과 똑같은 구도를 재현한다.",
              result:
                "사진은 닮았지만 표정은 달랐다. 윤서는 두 장을 겹쳐 보며 말했다. “복원 말고 새로 찍는 것도 괜찮네.”",
              effects: { memory: 1 },
            },
          ],
        },
        rooftop: {
          text:
            "옥상 스피커가 우리가 듣던 노래의 전주만 반복했다. 윤서는 제목 대신 그 노래를 좋아했던 이유를 맞혀 보라고 했다.",
          answers: [
            {
              text: "“노래가 좋아서가 아니라, 같이 듣던 시간이 좋아서.”",
              result:
                "멈췄던 전주 뒤로 후렴이 이어졌다. 윤서는 난간에 기대며 아주 작게 따라 불렀다.",
              effects: { trust: 1 },
            },
            {
              text: "멜로디를 흥얼거리며 기억나는 가사를 찾아본다.",
              result:
                "틀린 가사마다 윤서가 웃었다. 마지막 한 소절만큼은 두 사람의 목소리가 정확히 겹쳤다.",
              effects: { memory: 1 },
            },
          ],
        },
      },
      message: {
        time: "02:17 + 01:36",
        incoming: [
          "사진 속 나는 스물다섯인데, 지금 내 기억도 거기서 멈춰 있어.",
          "밖에 나가면 네가 모르는 내가 될까 봐 조금 무서워.",
        ],
        replies: [
          {
            text: "예전 모습부터 천천히 되찾으면 괜찮아질 거야.",
            response: "되찾는다는 말은 좋지만, 예전으로만 돌아가고 싶지는 않아.",
            effects: { memory: 1 },
          },
          {
            text: "그럼 앞으로 사진 많이 찍자. 네가 변하는 것도 다 남기게.",
            response: "좋아. 대신 이상하게 나온 것도 못 지운다.",
            effects: { courage: 1 },
          },
          {
            text: "어떤 모습이 되든, 그때의 너부터 다시 알아 갈게.",
            response: "응. 처음 보는 내가 돼도 다시 인사할게. 한윤서라고.",
            effects: { affection: 1, trust: 1 },
          },
          {
            text: "[스티커] 브이 하는 윤서",
            response: "이 표정 언제 저장했어? ……지우지는 마.",
            effects: { affection: 1 },
            sticker: { symbol: "✌", label: "찰칵!" },
          },
        ],
      },
    },
    {
      number: 3,
      title: "다투고 화해하는 법",
      hint: "윤서 · 옥상에서 끝내 못 한 얘기가 아직 남아 있어.",
      preferred: "rooftop",
      scenes: {
        cafe: {
          text:
            "윤서는 설탕을 두 봉지 넣은 내 컵을 보며 예전에도 건강 잔소리로 자주 싸웠다고 했다. 웃는 얼굴이었지만 시선은 컵에 머물렀다.",
          answers: [
            {
              text: "변명하지 않고 그때 윤서가 어떤 기분이었는지 묻는다.",
              result:
                "“네가 내 걱정을 통제로 받아들이는 게 속상했어.” 나는 대답보다 먼저 끝까지 들었다. 윤서의 어깨가 조금 내려갔다.",
              effects: { trust: 1 },
            },
            {
              text: "“이번에는 한 봉지만 넣을게. 타협 어때?”",
              result:
                "윤서가 내 컵에서 설탕 한 봉지를 빼 갔다. “협상은 합격. 경청은 다음 시험.”",
              effects: { courage: 1 },
            },
          ],
        },
        photo: {
          text:
            "화면에 눈을 감은 사진과 웃는 사진이 함께 떴다. 한 장만 남길 수 있다는 안내에 윤서는 내 선택을 기다렸다.",
          answers: [
            {
              text: "“둘 다 우리니까 한 장으로 합쳐서 남기자.”",
              result:
                "부스는 두 사진을 겹쳐 인화했다. 완벽하지 않은 얼굴들이 한 프레임 안에서 더 자연스럽게 보였다.",
              effects: { memory: 1, trust: 1 },
            },
            {
              text: "윤서가 마음에 들어 하는 쪽을 먼저 묻는다.",
              result:
                "윤서는 눈을 감은 사진을 골랐다. “이때 네가 나만 보고 웃었거든. 남들이 보기 좋은 건 상관없어.”",
              effects: { trust: 1 },
            },
          ],
        },
        rooftop: {
          text:
            "마지막 다툼의 바람이 그대로 재생됐다. 윤서는 ‘프로젝트가 끝나면’이라는 내 말을 따라 하고 물었다. “왜 늘 우리 일은 다음이었어?”",
          answers: [
            {
              text: "“중요하지 않아서가 아니라, 잃을까 봐 계속 미뤘어.”",
              result:
                "“미루면 잃지 않는 줄 알았구나.” 윤서는 화를 삼키지 않았다. 나는 이번에는 그 화가 끝날 때까지 자리를 지켰다.",
              effects: { trust: 1, courage: 1 },
            },
            {
              text: "“내 사정만 설명하고 네 기다림은 계산하지 않았어.”",
              result:
                "윤서는 한참 뒤 고개를 끄덕였다. “그 말을 그날 들었으면 그래도 싸우고 같이 내려갔을 텐데.”",
              effects: { courage: 1 },
            },
          ],
        },
      },
      message: {
        time: "02:17 + 02:24",
        incoming: [
          "아까는 좀 심하게 말했나 싶어서.",
          "근데 좋은 말만 하고 넘기면 또 예전이랑 똑같을 것 같았어.",
        ],
        replies: [
          {
            text: "심한 말 아니었어. 나도 제대로 들었어야 했고.",
            response: "그럼 됐어. 대충 괜찮다고 넘기지만 말자.",
            effects: { trust: 1 },
          },
          {
            text: "다투더라도 답 피하지 않을게. 미루지도 않고.",
            response: "응. 난 답 없는 게 제일 싫었어.",
            effects: { affection: 1, courage: 1 },
          },
          {
            text: "지금은 시간이 없으니까 중요한 이야기부터 하자.",
            response: "알아. 그래도 우리 얘기가 또 밀리지는 않았으면 해.",
            effects: { trust: -1 },
          },
          {
            text: "[스티커] 먼저 손 내밀기",
            response: "이걸로 다 넘어가진 않을 거야. 그래도 화해는 할래.",
            effects: { affection: 1 },
            sticker: { symbol: "✓", label: "화해할래?" },
          },
        ],
      },
    },
    {
      number: 4,
      title: "평범한 하루 연습",
      hint: "윤서 · 오늘만큼은 사건도 규정도 없는 척해 보자.",
      preferred: "cafe",
      scenes: {
        cafe: {
          text:
            "카페가 편의점 테이블로 바뀌고 새벽 라면 냄새가 났다. 윤서는 계란 하나를 내 그릇에 넣으며 평범한 아침을 연습하자고 했다.",
          answers: [
            {
              text: "계란을 반으로 나눠 윤서의 그릇에 돌려준다.",
              result:
                "“이런 건 정확히 반으로 나누네.” 윤서는 웃으며 국물까지 반씩 나눴다. 아무 일도 없는 시간이 이상할 만큼 좋았다.",
              effects: { trust: 1 },
            },
            {
              text: "“밖에 나가면 진짜 아침 메뉴부터 같이 정하자.”",
              result:
                "윤서는 휴대폰 메모에 ‘첫째 날 아침’이라고 적었다. 아직 오지 않은 일정이 처음으로 두 사람의 것이 됐다.",
              effects: { courage: 1 },
            },
          ],
        },
        photo: {
          text:
            "네 칸짜리 프레임의 주제는 ‘평범한 연인’이었다. 윤서는 평범한 표정이 뭔지 모르겠다며 진지하게 고민했다.",
          answers: [
            {
              text: "윤서가 고민하는 얼굴부터 몰래 찍는다.",
              result:
                "첫 칸에 놀란 얼굴, 둘째 칸에 화난 얼굴, 마지막 두 칸에 함께 웃는 얼굴이 남았다. 평범함은 생각보다 시끄러웠다.",
              effects: { memory: 1 },
            },
            {
              text: "앞으로 해 보고 싶은 표정을 한 칸씩 정한다.",
              result:
                "여행, 생일, 싸운 뒤 화해, 아무 이유 없는 웃음. 빈 미래가 네 칸으로 나뉘자 조금 덜 막막해졌다.",
              effects: { courage: 1 },
            },
          ],
        },
        rooftop: {
          text:
            "윤서는 이어폰 한쪽을 내게 건넸다. 아무 말도 하지 않는 것이 오늘 일정의 전부라는 듯 난간에 나란히 기대었다.",
          answers: [
            {
              text: "윤서의 어깨에 기대 노래가 끝날 때까지 그대로 있는다.",
              result:
                "다음 곡이 시작돼도 누구도 움직이지 않았다. 윤서는 아주 작게 말했다. “이런 걸 제일 오래 기다렸어.”",
              effects: { trust: 1 },
            },
            {
              text: "지금 흐르는 노래의 제목을 휴대폰에 기록한다.",
              result:
                "재생 목록 이름은 ‘밖에서 다시 들을 것’이 됐다. 윤서는 그 아래 바다 파도 소리도 추가했다.",
              effects: { memory: 1 },
            },
          ],
        },
      },
      message: {
        time: "02:17 + 03:12",
        incoming: [
          "오늘은 아무것도 해결 못 했는데 이상하게 제일 좋았어.",
          "맨날 뭘 해결해야만 같이 있는 건 아니잖아.",
        ],
        replies: [
          {
            text: "밖에 나가서도 가끔 이렇게 아무것도 하지 말자.",
            response: "좋아. 옆에만 있어도 되는 날로.",
            effects: { affection: 1, trust: 1 },
          },
          {
            text: "그래도 역에서 나갈 방법은 계속 생각해야 해.",
            response: "알아. 잠깐 쉬었다가 같이 찾자.",
            effects: { courage: 1 },
          },
          {
            text: "밖에 나가면 바쁠 텐데 이런 날이 자주 있을까.",
            response: "벌써부터 못 할 이유부터 찾네.",
            effects: { trust: -1 },
          },
          {
            text: "[스티커] 같이 멍때리기",
            response: "좋다. 나중에 진짜 옆에서 이러고 있자.",
            effects: { affection: 1 },
            sticker: { symbol: "…", label: "같이 멍때리자" },
          },
        ],
      },
    },
    {
      number: 5,
      title: "첫 번째 내일 정하기",
      hint: "윤서 · 마지막 사진 한 칸은 진짜 내일을 위해 남겨 두고 싶어.",
      preferred: "photo",
      scenes: {
        cafe: {
          text:
            "메뉴판에 ‘지상에서의 첫 아침’이라는 빈칸이 생겼다. 윤서는 7년 전의 자기 취향으로 미래까지 정하고 싶지는 않다고 했다.",
          answers: [
            {
              text: "“그날 아침에 네가 먹고 싶은 걸 다시 물어볼게.”",
              result:
                "윤서는 빈칸을 그대로 두었다. “좋아. 미래의 나는 미래에 대답할게.” 정하지 않은 약속이 오히려 선명했다.",
              effects: { trust: 1 },
            },
            {
              text: "내가 아는 맛집과 이동 경로를 전부 설명한다.",
              result:
                "윤서는 열심히 듣다가 메뉴판을 접었다. “계획은 고마운데, 한 군데쯤은 같이 헤매자.”",
              effects: { courage: 1 },
            },
          ],
        },
        photo: {
          text:
            "마지막 필름 한 장 앞에서 윤서는 촬영 버튼을 누르지 않았다. “이건 기억 속 우리가 아니라, 밖으로 나간 우리가 찍어야 해.”",
          answers: [
            {
              text: "빈 필름 아래에 두 사람의 다음 촬영 날짜만 적는다.",
              result:
                "날짜는 ‘오전 2시 18분 이후’였다. 윤서는 펜을 건네며 내 이름 옆에 자기 이름을 직접 적었다.",
              effects: { trust: 1, courage: 1 },
            },
            {
              text: "혹시 모르니 지금 한 장 더 찍자고 한다.",
              result:
                "윤서는 셔터 대신 내 손을 잡았다. “보험 말고 약속으로 남겨. 그래야 둘 다 나가려고 하지.”",
              effects: { memory: 1 },
            },
          ],
        },
        rooftop: {
          text:
            "도시 끝이 푸르게 밝아졌다. 가짜 새벽인 걸 알면서도 윤서는 바다 쪽이라고 생각되는 방향을 오래 바라봤다.",
          answers: [
            {
              text: "“바다는 네가 고르고, 가는 날은 같이 정하자.”",
              result:
                "윤서는 목적지보다 먼저 내 손을 잡았다. “이번에는 한쪽이 정하고 다른 쪽이 따라가는 여행 말고.”",
              effects: { trust: 1, courage: 1 },
            },
            {
              text: "나가자마자 가장 빠른 바다행 표를 예매하겠다고 약속한다.",
              result:
                "“급한 건 맞는데, 우선 살아서 나가자.” 윤서는 웃었지만 맞잡은 손에는 힘이 들어갔다.",
              effects: { courage: 1 },
            },
          ],
        },
      },
      message: {
        time: "02:17 + 04:00",
        incoming: [
          "다섯 번이나 만나고 이런 걸 묻는 것도 좀 웃긴데.",
          "기억이 다 안 돌아와도, 지금의 나는 어때?",
        ],
        replies: [
          {
            text: "기억 속 너와 닮아서 안심돼.",
            response: "닮았어도 지금의 나는 따로 봐 줬으면 좋겠어.",
            effects: { memory: 1 },
          },
          {
            text: "아직 모르는 게 많아서, 더 알고 싶어.",
            response: "그럼 나도 더 보여 줄게. 너도 숨기지 말고.",
            effects: { trust: 1 },
          },
          {
            text: "좋아해. 기억이 돌아와서가 아니라 지금의 너를.",
            response: "……나도. 밖에 나가서 다시 만나자.",
            effects: { affection: 1, courage: 1 },
          },
          {
            text: "[스티커] 다음에도 만나자",
            response: "말로 해 주면 더 좋았을 텐데. 그래도 다음 약속은 잡은 거다?",
            effects: { affection: 1 },
            sticker: { symbol: "♥", label: "다음에도 만나자" },
          },
        ],
      },
    },
  ];

  function apply(story, chapters, endings, line) {
    Object.assign(chapters, {
      romance: { number: "2장", name: "다시 만나는 5일" },
      two: { number: "3장", name: "보내지 못한 여름" },
      three: { number: "4장", name: "사라진 1분" },
      four: { number: "5장", name: "유실역의 규칙" },
      five: { number: "마지막 장", name: "오전 2시 18분" },
    });
    story.c123.next = "dateIntro01";

    Object.assign(story, {
      dateIntro01: line(
        "office",
        "seo",
        "안내 방송",
        "관계 복원 심사를 시작합니다. 현실 시간 차감 없이, 분실된 다섯 번의 약속을 재구성합니다.",
        "dateIntro02",
        { chapter: "romance", emotion: "surprised" },
      ),
      dateIntro02: line(
        "office",
        "seo",
        "한윤서",
        "역이 우리한테 다시 데이트하래. 기억 검사보다 더 민망하지만……. 이번에는 네가 가고 싶은 곳을 골라 봐.",
        "dateSchedule01",
        { emotion: "shy" },
      ),
    });

    DAYS.forEach((day) => {
      const dayId = String(day.number).padStart(2, "0");
      const nextDay =
        day.number === TOTAL_DATES
          ? "dateOutro01"
          : `dateSchedule${String(day.number + 1).padStart(2, "0")}`;
      const scheduleChoices = Object.entries(LOCATIONS).map(([locationId, location]) => {
        const effects = { [location.stat]: 1 };
        if (locationId === day.preferred) effects.affection = 1;
        return {
          text: location.name,
          next: `date${dayId}_${locationId}`,
          effects,
          flags: [`date_day_${day.number}`, `date_${day.number}_${locationId}`],
          activity: {
            code: location.code,
            name: location.name,
            description: location.description,
            reward: location.reward,
          },
        };
      });

      story[`dateSchedule${dayId}`] = line(
        "office",
        "seo",
        "나",
        `복원된 ${day.number}일 차. 오늘 윤서와 보낼 장소를 하나 선택해야 한다.`,
        null,
        {
          mode: "schedule",
          emotion: "soft",
          schedule: {
            day: day.number,
            total: TOTAL_DATES,
            title: day.title,
            hint: day.hint,
          },
          choices: scheduleChoices,
        },
      );

      Object.entries(day.scenes).forEach(([locationId, scene]) => {
        const resultNode = `date${dayId}_${locationId}_result`;
        story[`date${dayId}_${locationId}`] = line(
          LOCATIONS[locationId].bg,
          "seo",
          "한윤서",
          scene.text,
          null,
          {
            emotion: day.number === 3 ? "sad" : "soft",
            choices: scene.answers.map((answer, index) => ({
              text: answer.text,
              next: resultNode,
              effects: answer.effects,
              flag: `date_answer_${day.number}_${locationId}_${index}`,
            })),
          },
        );

        story[resultNode] = line(
          LOCATIONS[locationId].bg,
          "seo",
          "나",
          (state) => {
            const firstAnswer = state.flags[`date_answer_${day.number}_${locationId}_0`];
            return firstAnswer ? scene.answers[0].result : scene.answers[1].result;
          },
          `dateMessage${dayId}`,
          { emotion: "smile" },
        );
      });

      const replyChoices = day.message.replies.map((reply, index) => ({
        text: reply.text,
        next: `dateMessage${dayId}Result`,
        effects: reply.effects,
        flag: `date_reply_${day.number}_${index}`,
        sticker: reply.sticker,
      }));

      story[`dateMessage${dayId}`] = line(
        "train",
        null,
        "메시지",
        day.message.incoming.at(-1),
        null,
        {
          mode: "message",
          phone: {
            day: `${TOTAL_DATES}일 중 ${day.number}일 차`,
            time: day.message.time,
            contact: "한윤서",
            messages: day.message.incoming.map((text) => ({ from: "seo", text })),
          },
          choices: replyChoices,
        },
      );

      story[`dateMessage${dayId}Result`] = line(
        "train",
        null,
        "메시지",
        (state) => {
          const selected =
            day.message.replies.find((_, index) => state.flags[`date_reply_${day.number}_${index}`]) ||
            day.message.replies[0];
          return selected.response;
        },
        nextDay,
        {
          mode: "message",
          phone: {
            day: `${TOTAL_DATES}일 중 ${day.number}일 차`,
            time: day.message.time,
            contact: "한윤서",
            messages: (state) => {
              const selected =
                day.message.replies.find(
                  (_, index) => state.flags[`date_reply_${day.number}_${index}`],
                ) || day.message.replies[0];
              return [
                ...day.message.incoming.map((text) => ({ from: "seo", text })),
                { from: "me", text: selected.text },
                { from: "seo", text: selected.response },
              ];
            },
          },
        },
      );
    });

    Object.assign(story, {
      dateOutro01: line(
        "platform",
        "seo",
        "나",
        (state) => {
          if (state.stats.affection >= 8) {
            return "다섯 번의 약속은 잃어버린 과거를 재현하는 시험으로 시작했지만, 마지막에는 아직 오지 않은 다음 약속만 남았다.";
          }
          if (state.stats.affection >= 5) {
            return "우리는 전처럼 가까워지지는 못했어도, 기억 속 연인을 흉내 내는 대신 지금의 서로를 조금씩 알아 갔다.";
          }
          return "다섯 번의 약속 동안 나는 자꾸 정답만 찾았다. 윤서는 기억보다 가까이 있었지만, 마음의 거리는 아직 남아 있었다.";
        },
        "dateOutro02",
        { emotion: "soft" },
      ),
      dateOutro02: line(
        "platform",
        "seo",
        "한윤서",
        (state) =>
          state.stats.affection >= 7
            ? "“이제 네가 기억해서 나를 좋아하는 건지 묻지 않을게. 밖에서 여섯 번째 약속을 잡자.”"
            : "“기억은 돌아와도 관계는 저절로 돌아오지 않나 봐. 그래도 남은 진실은 같이 보자.”",
        "m01",
        { emotion: (state) => (state.stats.affection >= 7 ? "smile" : "soft") },
      ),
    });

    story.r15.text = (state) =>
      state.stats.affection >= 7
        ? "다섯 번의 약속에서 배운 것은 정답이 아니라 묻는 법이었다. 방법을 알아도 윤서의 삶을 또 대신 결정한다면, 우리는 다시 처음으로 돌아간다."
        : "방법을 알아도 윤서의 삶을 또 대신 결정한다면 7년 전과 달라지는 것은 없었다.";

    story.ed10.text = (state) =>
      state.stats.affection >= 7
        ? "“유실역에서 다섯 번이나 데이트했으니까, 밖에서 하는 첫 약속은 같이 정하자.” 우리는 아침을 먹고, 사진을 찍고, 이번에는 정말 바다로 가기로 했다."
        : "“일단 아침부터 먹자. 그다음 네가 잃어버린 7년을 하나씩 돌려줄게.” 초침이 움직였고, 윤서는 이번에는 내 손을 놓지 않았다.";

    endings.dawn.body =
      "한 장의 표는 두 사람의 것이었고, 두 사람은 단 한 번 함께 돌아왔다.\n오전 2시 18분. 잃어버린 시간을 되돌리는 대신 서로의 달라진 오늘을 다시 알아 가기로 했다.\n기억 속 다섯 번의 약속이 끝난 자리에서, 두 사람은 지상에서의 첫 데이트를 함께 정했다.";

    const trueEndingChoice = story.f04.choices[3];
    const storyRequirement = trueEndingChoice.require;
    const hasWholeMemory = (state) =>
      state.stats.memory >= 4 && state.flags.accepted_whole_memory;
    const hasJointOwnership = (state) =>
      state.stats.trust >= 4 &&
      state.stats.courage >= 3 &&
      (state.flags.read_perforation ||
        state.flags.confirmed_joint_ownership ||
        state.flags.read_return_wording) &&
      (state.flags.named_joint_loss || state.flags.saw_shared_ticket);
    const hasMutualConsent = (state) =>
      state.stats.affection >= 7 && state.flags.asked_consent;
    const getMissingRequirements = (state) => {
      if (state.flags.legacy_true_ending_eligible) return [];
      const missing = [];
      if (!hasMutualConsent(state)) {
        missing.push(
          state.stats.affection >= 7 ? "윤서의 동의" : `호감 ${state.stats.affection}/7`,
        );
      }
      if (!hasWholeMemory(state)) missing.push("온전한 기억");
      if (!hasJointOwnership(state)) missing.push("공동 소유");
      return missing;
    };
    const trueEndingRequirement = (state) =>
      storyRequirement(state) &&
      (state.flags.legacy_true_ending_eligible || state.stats.affection >= 7);
    trueEndingChoice.require = trueEndingRequirement;
    trueEndingChoice.lockedText = (state) => getMissingRequirements(state).join(" · ");

    Object.assign(story, {
      trueEndingReview: line(
        "office",
        "seo",
        "나",
        (state) => {
          const missing = getMissingRequirements(state);
          return missing.length
            ? `개찰기가 멈춘 이유가 표면에 떠올랐다. 아직 확인하지 못한 조건은 ${missing.join(", ")}. 열차가 떠나기 전, 윤서와 하나씩 다시 결정할 수 있다.`
            : "파란 표의 두 이름과 우리의 선택이 모두 맞물렸다. 이제 마지막 승강장으로 돌아가면 함께 나가는 길을 고를 수 있다.";
        },
        null,
        {
          emotion: "soft",
          choices: [
            {
              text: "좋은 기억과 아픈 기억을 나누지 않고 전부 받아들인다.",
              next: "trueEndingReviewMemory",
              require: (state) => !hasWholeMemory(state),
              lockedText: "확인 완료",
              effects: { memory: 5 },
              flags: ["accepted_whole_memory"],
            },
            {
              text: "한 장의 표와 한 번의 귀환이 두 사람의 공동 소유임을 확인한다.",
              next: "trueEndingReviewOwnership",
              require: (state) => !hasJointOwnership(state),
              lockedText: "확인 완료",
              effects: { trust: 5, courage: 5 },
              flags: ["confirmed_joint_ownership", "named_joint_loss"],
            },
            {
              text: "윤서에게 지금의 마음을 고백하고 함께 돌아갈지 다시 묻는다.",
              next: "trueEndingReviewConsent",
              require: (state) => !hasMutualConsent(state),
              lockedText: "확인 완료",
              effects: { affection: 10 },
              flags: ["asked_consent"],
            },
            {
              text: "확인을 마치고 최종 승강장으로 돌아간다.",
              next: "f04",
            },
          ],
        },
      ),
      trueEndingReviewMemory: line(
        "memory",
        "seo",
        "나",
        "행복했던 순간만 남기면 윤서의 선택과 우리가 견딘 시간도 사라진다. 나는 편한 반쪽 대신, 아픈 날까지 이어진 우리 전부를 기억하기로 했다.",
        "trueEndingReview",
        { emotion: "soft" },
      ),
      trueEndingReviewOwnership: line(
        "office",
        "seo",
        "나",
        "절취선은 표를 두 장으로 만드는 선이 아니었다. 서로의 이름이 적힌 두 반쪽이 모여야 한 번의 귀환이 완성된다. 잃어버린 7년도, 돌아갈 자리도 우리 둘의 것이었다.",
        "trueEndingReview",
        { emotion: "surprised" },
      ),
      trueEndingReviewConsent: line(
        "dawn",
        "seo",
        "한윤서",
        "“응. 기억 속의 내가 아니라 지금의 나한테 물어봐 줘서 고마워. 나도 너랑 같이 나갈래.” 윤서는 내 손이 아니라 표의 반대쪽을 스스로 잡았다.",
        "trueEndingReview",
        { emotion: "smile" },
      ),
    });

    story.f04.choices.push({
      text: "잠시 멈추고 부족한 조건을 윤서와 다시 확인한다.",
      next: "trueEndingReview",
      visible: (state) => !trueEndingRequirement(state),
    });
  }

  window.LostDawnDatingSim = { apply };
})();
