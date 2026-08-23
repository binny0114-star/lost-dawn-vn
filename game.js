(() => {
  "use strict";

  const SAVE_KEY = "lost-dawn-save-v1";
  const SETTINGS_KEY = "lost-dawn-settings-v1";
  const ENDINGS_KEY = "lost-dawn-endings-v1";
  const COLLECTION_KEY = "lost-dawn-collection-v1";
  const STORY_VERSION = 3;
  const ENDING_ORDER = ["memory", "oblivion", "keeper", "dawn"];

  const $ = (selector) => document.querySelector(selector);
  const elements = {
    app: $("#app"),
    canvas: $("#sceneCanvas"),
    fade: $("#sceneFade"),
    titleScreen: $("#titleScreen"),
    gameScreen: $("#gameScreen"),
    endingScreen: $("#endingScreen"),
    continueButton: $("#continueButton"),
    endingBadges: $("#endingBadges"),
    chapterNumber: $("#chapterNumber"),
    chapterName: $("#chapterName"),
    chapterCard: $("#chapterCard"),
    chapterCardNumber: $("#chapterCardNumber"),
    chapterCardName: $("#chapterCardName"),
    memoryShards: $("#memoryShards"),
    syncFill: $("#syncFill"),
    resolveFill: $("#resolveFill"),
    affectionHearts: $("#affectionHearts"),
    schedulePanel: $("#schedulePanel"),
    schedulePhase: $("#schedulePhase"),
    scheduleTitle: $("#scheduleTitle"),
    scheduleDays: $("#scheduleDays"),
    scheduleHint: $("#scheduleHint"),
    phonePanel: $("#phonePanel"),
    phoneDay: $("#phoneDay"),
    phoneContact: $("#phoneContact"),
    phoneTime: $("#phoneTime"),
    phoneMessages: $("#phoneMessages"),
    phoneHint: $("#phoneHint"),
    minigamePanel: $("#minigamePanel"),
    minigameTitle: $("#minigameTitle"),
    minigameRound: $("#minigameRound"),
    minigameSubtitle: $("#minigameSubtitle"),
    minigameStage: $("#minigameStage"),
    minigameFeedback: $("#minigameFeedback"),
    minigameControls: $("#minigameControls"),
    speakerName: $("#speakerName"),
    speakerEn: $("#speakerEn"),
    dialogueText: $("#dialogueText"),
    continueMark: $("#continueMark"),
    choicePanel: $("#choicePanel"),
    logModal: $("#logModal"),
    logContent: $("#logContent"),
    collectionModal: $("#collectionModal"),
    collectionCount: $("#collectionCount"),
    photoCount: $("#photoCount"),
    photoAlbum: $("#photoAlbum"),
    achievementCount: $("#achievementCount"),
    achievementList: $("#achievementList"),
    settingsModal: $("#settingsModal"),
    pauseModal: $("#pauseModal"),
    confirmModal: $("#confirmModal"),
    textSpeed: $("#textSpeed"),
    soundToggleButton: $("#soundToggleButton"),
    soundIcon: $("#soundIcon"),
    endingEyebrow: $("#endingEyebrow"),
    endingTitle: $("#endingTitle"),
    endingSubtitle: $("#endingSubtitle"),
    endingBody: $("#endingBody"),
    endingCount: $("#endingCount"),
    toast: $("#toast"),
  };

  const chapters = {
    prologue: { number: "PROLOGUE", name: "막차" },
    one: { number: "CHAPTER 01", name: "유실물 보관소" },
    two: { number: "CHAPTER 02", name: "기억의 승강장" },
    three: { number: "CHAPTER 03", name: "오전 2시 18분" },
  };

  const endings = {
    memory: {
      eyebrow: "NORMAL END 01",
      title: "이름을 간직한 사람",
      subtitle: "THE ONE WHO REMEMBERS",
      body:
        "열차가 지상으로 올라왔을 때, 휴대폰 시계는 오전 2시 18분이었다.\n윤서는 돌아오지 못했지만, 이제 누구도 그녀가 없었다고 말할 수 없다.\n나는 매년 같은 날, 빈 승강장에 파란 표 한 장을 놓아둔다.",
      scene: "dawn",
    },
    oblivion: {
      eyebrow: "NORMAL END 02",
      title: "깨끗한 분실물",
      subtitle: "UNCLAIMED",
      body:
        "아침은 놀랄 만큼 평범했다.\n주머니에는 반으로 접힌 파란 표가 있었지만, 누구에게 받은 것인지는 기억나지 않았다.\n이상하게도 비가 오는 날이면, 모르는 이름 하나가 목 끝까지 차오른다.",
      scene: "train",
    },
    keeper: {
      eyebrow: "ANOTHER END",
      title: "다음 막차의 역무원",
      subtitle: "THE NEW KEEPER",
      body:
        "윤서는 첫차를 타고 떠났고, 나는 남겨진 모자를 썼다.\n새벽 2시 17분. 지도에 없는 역으로 또 한 대의 열차가 들어온다.\n이번 승객도 잊어버린 이름을 찾을 수 있기를.",
      scene: "office",
    },
    dawn: {
      eyebrow: "TRUE END",
      title: "분실되지 않은 내일",
      subtitle: "A DAWN THAT WAS NEVER LOST",
      body:
        "표 한 장을 반으로 나누자, 역은 우리 중 누구를 붙잡아야 할지 결정하지 못했다.\n오전 2시 18분. 멈췄던 시간이 다시 흐르고, 윤서가 내 손을 더 세게 잡았다.\n우리는 이제부터 서로가 잃어버린 7년을 찾으러 간다.",
      scene: "dawn",
    },
  };

  const line = (bg, char, speaker, text, next, extra = {}) => ({
    bg,
    char,
    speaker,
    text,
    next,
    ...extra,
  });

  const STORY = {
    p01: line(
      "train",
      null,
      "나",
      "막차에는 나 말고 아무도 없었다. 창밖의 터널만 검은 필름처럼 끝없이 감겼다.",
      "p02",
      { chapter: "prologue" },
    ),
    p02: line(
      "train",
      null,
      "나",
      "오전 2시 17분. 꺼져 있던 휴대폰 화면에 발신자 없는 메시지가 떠올랐다.",
      "p03",
    ),
    p03: line(
      "train",
      null,
      "메시지",
      "「유실물 보관소에서 기다릴게. 이번에는 내 이름을 불러 줘.」",
      "p04",
    ),
    p04: line(
      "train",
      null,
      "안내 방송",
      "이번 역은 유실, 유실역입니다. 잃어버린 것을 두고 내리시기 바랍니다.",
      null,
      {
        choices: [
          {
            text: "문이 닫히기 전에 내린다.",
            next: "p05a",
            effects: { courage: 1 },
            flag: "stepped_out",
          },
          {
            text: "자리에 남아 상황을 지켜본다.",
            next: "p05b",
            flag: "hesitated",
          },
        ],
      },
    ),
    p05a: line(
      "platform",
      null,
      "나",
      "발을 내딛자 열차는 소리도 없이 사라졌다. 노선도 어디에도 없는, 젖은 승강장만 남았다.",
      "p06",
    ),
    p05b: line(
      "train",
      null,
      "나",
      "문이 닫혔다. 안도한 순간, 반대편 문이 다시 열렸다. 같은 승강장. 열차는 내가 내릴 때까지 갈 생각이 없었다.",
      "p05a",
    ),
    p06: line(
      "platform",
      "seo",
      "???",
      "늦었네. 7년하고도 4분.",
      "p07",
      { emotion: "neutral" },
    ),
    p07: line(
      "platform",
      "seo",
      "나",
      "처음 보는 얼굴인데, 그녀는 오래 기다린 사람처럼 내 이름을 불렀다.",
      "p08",
      { emotion: "soft" },
    ),
    p08: line("platform", "seo", "한윤서", "도하야. 이번에도 내가 누군지 모르겠어?", null, {
      emotion: "sad",
      choices: [
        {
          text: "“미안해. 네 이름부터 다시 알려 줘.”",
          next: "p09",
          effects: { trust: 1 },
          flag: "asked_name",
        },
        {
          text: "“어떻게 내 이름을 알지?”",
          next: "p09",
          effects: { courage: 1 },
          flag: "questioned_seo",
        },
        {
          text: "“……많이 기다렸어?”",
          next: "p09",
          effects: { trust: 1, courage: 1 },
          flag: "asked_wait",
        },
      ],
    }),
    p09: line(
      "platform",
      "seo",
      "한윤서",
      (state) => {
        if (state.flags.asked_wait) return "응. 그래도 네가 그렇게 물어봐 줘서, 조금은 덜 억울해졌어.";
        if (state.flags.asked_name) return "한윤서. 이번에는 잊지 마. 나도 다시 말할 기회가 많지는 않으니까.";
        return "그 질문도 벌써 세 번째야. 대답은 안에서 해 줄게.";
      },
      "p10",
      { emotion: "smile" },
    ),
    p10: line(
      "platform",
      "seo",
      "한윤서",
      "첫차가 오기 전까지 딱 하나만 찾아가. 네가 나한테 맡기고 간 유실물.",
      "c101",
      { emotion: "neutral" },
    ),

    c101: line(
      "office",
      "seo",
      "나",
      "승강장 끝 문 너머에는 낡은 보관소가 있었다. 우산, 카메라, 편지, 이름표 없는 수백 개의 상자.",
      "c102",
      { chapter: "one", emotion: "neutral" },
    ),
    c102: line(
      "office",
      "seo",
      "한윤서",
      "사람들은 물건만 잃어버리는 게 아니야. 견디기 힘든 마음도 어딘가에 놓고 가거든.",
      "c103",
      { emotion: "soft" },
    ),
    c103: line(
      "office",
      "seo",
      "한윤서",
      "DOHA라고 적힌 선반에서, 네 것 같은 물건을 골라 봐.",
      null,
      {
        emotion: "neutral",
        choices: [
          {
            text: "내 목소리가 녹음된 붉은 카세트테이프",
            next: "cassette01",
            effects: { memory: 1, trust: 1 },
            flag: "found_cassette",
          },
          {
            text: "필름이 한 장 남은 고장 난 카메라",
            next: "camera01",
            effects: { memory: 1, courage: 1 },
            flag: "found_camera",
          },
          {
            text: "손잡이에 두 글자가 새겨진 노란 우산",
            next: "umbrella01",
            effects: { memory: 1, trust: 1 },
            flag: "found_umbrella",
          },
        ],
      },
    ),
    cassette01: line(
      "office",
      "seo",
      "녹음 속 윤서",
      "「스물다섯의 한윤서. 오늘부로 한도하랑 연애 시작합니다. 증거 남겼다?」",
      "cassette02",
      { emotion: "surprised" },
    ),
    cassette02: line(
      "memory",
      "seo",
      "나",
      "테이프 너머로 내가 웃었다. 기억은 없는데, 그 웃음이 내 것이라는 사실만은 너무 선명했다.",
      "c110",
      { emotion: "shy" },
    ),
    camera01: line(
      "office",
      "seo",
      "나",
      "셔터를 누르자 마지막 필름이 뱉어졌다. 사진 속 우리는 막차에서 어깨를 맞대고 잠들어 있었다.",
      "camera02",
      { emotion: "surprised" },
    ),
    camera02: line(
      "memory",
      "seo",
      "나",
      "사진 뒷면의 글씨가 번졌다. 「도하가 또 종점까지 자면, 이번엔 내가 버리고 감. - 윤서」",
      "c110",
      { emotion: "smile" },
    ),
    umbrella01: line(
      "office",
      "seo",
      "나",
      "우산을 펴자 여름비 냄새가 쏟아졌다. 손잡이 안쪽에는 ‘도하 + 윤서’가 삐뚤게 새겨져 있었다.",
      "umbrella02",
      { emotion: "shy" },
    ),
    umbrella02: line(
      "memory",
      "seo",
      "한윤서",
      "비가 오면 항상 하나만 들고 나왔지. 네가 자연스럽게 내 쪽으로 붙어 오게.",
      "c110",
      { emotion: "smile" },
    ),
    c110: line(
      "office",
      "seo",
      "나",
      (state) => {
        if (state.flags.found_cassette) return "“저 목소리…… 정말 나야? 우리는 어떤 사이였던 거지?”";
        if (state.flags.found_camera) return "“사진 속 우리는 행복해 보여. 그런데 왜 너만 여기 남은 거야?”";
        return "“이걸 아직도 갖고 있었어? 아니, 내가 왜 이 우산을 잊은 거지?”";
      },
      "c111",
      { emotion: "sad" },
    ),
    c111: line(
      "office",
      "seo",
      "한윤서",
      "네가 잊고 싶어 했으니까. 정확히는, 나를 여기 두고 가야 네가 살아갈 수 있었으니까.",
      "c112",
      { emotion: "sad" },
    ),
    c112: line("office", "seo", "나", "선반의 물건들이 동시에 낮게 울었다. 나는 윤서를 똑바로 바라봤다.", null, {
      emotion: "neutral",
      choices: [
        {
          text: "“너는 유실물이 아니야. 내가 기억해야 할 사람이야.”",
          next: "c113",
          effects: { memory: 1, trust: 1 },
          flag: "called_person",
        },
        {
          text: "“7년 전, 우리에게 무슨 일이 있었어?”",
          next: "c113",
          effects: { courage: 1 },
          flag: "asked_truth",
        },
        {
          text: "“이 모든 게 내 죄책감이 만든 환상이라면?”",
          next: "c113",
          effects: { trust: -1 },
          flag: "called_illusion",
        },
      ],
    }),
    c113: line(
      "office",
      "seo",
      "한윤서",
      (state) => {
        if (state.flags.called_person) return "……그 말을 듣는 데 7년이나 걸렸네. 좋아, 그러면 끝까지 기억해 줘.";
        if (state.flags.asked_truth) return "그래. 직접 보는 편이 빠르겠다. 다만, 보고 나면 다시 모른 척할 수 없어.";
        return "환상이라도 상관없어. 네가 여기까지 온 이유만 진짜라면.";
      },
      "c114",
      { emotion: "soft" },
    ),
    c114: line(
      "office",
      "seo",
      "나",
      "윤서가 보관소의 불을 껐다. 어둠 속에서 수백 개의 기억이 별처럼 켜졌고, 바닥이 열차처럼 흔들렸다.",
      "m01",
      { emotion: "neutral" },
    ),

    m01: line(
      "memory",
      "seo",
      "나",
      "2019년 8월 23일. 잊었다고 믿었던 날짜가 빗물 위로 떠올랐다.",
      "m02",
      { chapter: "two", emotion: "soft" },
    ),
    m02: line(
      "memory",
      "seo",
      "기억 속 윤서",
      "도하야, 이번 프로젝트 끝나면 바다 보러 가자. 휴대폰은 끄고, 막차도 일부러 놓치고.",
      "m03",
      { emotion: "smile" },
    ),
    m03: line(
      "memory",
      "seo",
      "나",
      "기억 속 나는 대답 대신 윤서의 새끼손가락을 걸었다. 그다음 장면만 칼로 잘라낸 듯 비어 있었다.",
      "m04",
      { emotion: "shy" },
    ),
    m04: line(
      "memory",
      "seo",
      "한윤서",
      "그날 터널이 무너졌고 열차는 멈췄어. 나는 비상문을 열었고, 너는 끝까지 내 손을 놓지 않았지.",
      "m05",
      { emotion: "sad" },
    ),
    m05: line("memory", "seo", "나", "가슴 안쪽에서 오래 잠긴 문이 흔들렸다.", null, {
      emotion: "sad",
      choices: [
        {
          text: "“널 일부러 잊은 게 아니야. 잊었다고 믿고 싶었던 거야.”",
          next: "m06",
          effects: { memory: 1, trust: 1 },
          flag: "admitted_memory",
        },
        {
          text: "“기억하면 무너질까 봐 무서웠어.”",
          next: "m06",
          effects: { courage: 1, trust: 1 },
          flag: "admitted_fear",
        },
        {
          text: "“윤서야, 너는 그날 죽은 거야?”",
          next: "m06",
          effects: { memory: 1 },
          flag: "asked_death",
        },
      ],
    }),
    m06: line(
      "memory",
      "seo",
      "한윤서",
      (state) => {
        if (state.flags.admitted_memory) return "알아. 그래서 미워하다가도, 네가 잘 살았으면 했어.";
        if (state.flags.admitted_fear) return "무서워도 괜찮아. 이번에는 혼자 기억하게 두지 않을게.";
        return "죽었다면 더 간단했겠지. 나는 2시 17분과 18분 사이에 끼어 버렸어.";
      },
      "m07",
      { emotion: "soft" },
    ),
    m07: line(
      "memory",
      "seo",
      "한윤서",
      "마지막 승객을 내보내려 비상 레버를 당겼을 때, 멈춘 1분이 나를 역의 일부로 삼았어.",
      "m08",
      { emotion: "sad" },
    ),
    m08: line(
      "memory",
      "seo",
      "한윤서",
      "너는 나를 데려가려 했고, 나는 너를 문밖으로 밀었어. 살아남으라고. 대신 역이 네 기억을 표값으로 가져갔지.",
      "m09",
      { emotion: "sad" },
    ),
    m09: line(
      "memory",
      "seo",
      "나",
      "기억 속에서 경보음이 울렸다. 윤서가 내게 손을 내밀었다. 이번에는 떨리는 손이었다.",
      "m10",
      { emotion: "neutral" },
    ),
    m10: line("memory", "seo", "한윤서", "비어 있는 마지막 1분은 터널 안에 있어. 같이 들어갈래?", null, {
      emotion: "soft",
      choices: [
        {
          text: "말없이 윤서의 손을 잡는다.",
          next: "t01",
          effects: { trust: 1, courage: 1 },
          flag: "held_hand",
        },
        {
          text: "“이번에는 내가 먼저 갈게.”",
          next: "t01",
          effects: { courage: 2 },
          flag: "went_first",
        },
        {
          text: "“무서우면 돌아가도 돼. 기다릴게.”",
          next: "t01",
          effects: { trust: 2 },
          flag: "offered_wait",
        },
      ],
    }),

    t01: line(
      "tunnel",
      "seo",
      "나",
      "터널에는 선로 대신 검은 물이 흐르고 있었다. 발을 옮길 때마다 잊었던 목소리가 수면 아래서 깨어났다.",
      "t02",
      { emotion: "neutral" },
    ),
    t02: line(
      "tunnel",
      "seo",
      "안내 방송",
      "경고합니다. 고통스러운 기억은 두고 가십시오. 행복한 장면만 선택하십시오.",
      "t03",
      { emotion: "sad" },
    ),
    t03: line("tunnel", "seo", "나", "물 위로 세 개의 장면이 떠올랐다. 하나만 붙잡아도 나머지는 함께 딸려올 것 같았다.", null, {
      emotion: "neutral",
      choices: [
        {
          text: "처음 함께 막차를 놓친 행복한 밤",
          next: "t04",
          effects: { memory: 1, trust: 1 },
          flag: "chose_happy_memory",
        },
        {
          text: "윤서가 나를 밀어내던 마지막 순간",
          next: "t04",
          effects: { memory: 1, courage: 1 },
          flag: "chose_painful_memory",
        },
        {
          text: "모든 장면을 관통하는 이름, ‘한윤서’",
          next: "t04",
          effects: { memory: 2, trust: 1 },
          flag: "chose_name",
        },
      ],
    }),
    t04: line(
      "tunnel",
      "seo",
      "나",
      (state) => {
        if (state.flags.chose_name) return "이름을 부르자 행복과 공포, 후회와 사랑이 한꺼번에 돌아왔다. 기억은 원래 나눌 수 있는 것이 아니었다.";
        if (state.flags.chose_painful_memory) return "나는 가장 아픈 순간을 피하지 않았다. 그 뒤에 숨은 윤서의 표정까지 기억하기 위해.";
        return "행복했던 밤을 붙잡자 그 끝의 경보음도 따라왔다. 빛은 그림자까지 품어야 온전했다.";
      },
      "t05",
      { emotion: "surprised" },
    ),
    t05: line(
      "tunnel",
      "seo",
      "나",
      "무너진 터널, 비상문, 사람들의 비명. 그리고 문이 닫히기 직전 웃어 보이던 윤서. 나는 그 자리에서 그녀의 이름을 절규했다.",
      "t06",
      { emotion: "sad" },
    ),
    t06: line(
      "tunnel",
      "seo",
      "한윤서",
      "그 목소리를 듣고도 돌아가지 못해서 미안해. 네가 나를 잊는 걸 지켜보기만 해서…… 미안해.",
      "t07",
      { emotion: "cry" },
    ),
    t07: line("tunnel", "seo", "나", "이번에는 내가 대답할 차례였다.", null, {
      emotion: "cry",
      choices: [
        {
          text: "“살려 줘서 미안하다고는 안 할게. 고마워, 윤서야.”",
          next: "t08",
          effects: { trust: 1, courage: 1 },
          flag: "thanked_seo",
        },
        {
          text: "“왜 나만 살아야 했는지 아직은 모르겠어.”",
          next: "t08",
          effects: { memory: 1 },
          flag: "confessed_guilt",
        },
        {
          text: "아무 말 없이 윤서를 끌어안는다.",
          next: "t08",
          effects: { trust: 2 },
          flag: "hugged_seo",
        },
      ],
    }),
    t08: line(
      "tunnel",
      "seo",
      "한윤서",
      (state) => {
        if (state.flags.thanked_seo) return "……응. 그 한마디면 됐어. 내가 널 살린 일이 슬픈 결말만은 아니게 됐으니까.";
        if (state.flags.confessed_guilt) return "지금 당장 답을 몰라도 돼. 살아가면서 천천히 이유를 만들어 줘.";
        return "윤서는 한참 뒤에야 내 등을 마주 안았다. 차갑던 손끝에 조금씩 온기가 돌아왔다.";
      },
      "t09",
      { emotion: "smile" },
    ),
    t09: line(
      "tunnel",
      "seo",
      "나",
      "터널 끝에서 흰빛이 밀려왔다. 멈춰 있던 초침이 단 한 칸, 앞으로 움직였다.",
      "f01",
      { emotion: "soft" },
    ),

    f01: line(
      "dawn",
      "seo",
      "나",
      "승강장 시계는 2시 17분 59초를 가리켰다. 처음 보는 방향에서 은빛 열차가 들어왔다.",
      "f02",
      { chapter: "three", emotion: "soft" },
    ),
    f02: line(
      "dawn",
      "seo",
      "한윤서",
      "역이 표를 한 장만 내줬어. 기억을 가지고 네가 돌아가거나, 기억을 버리고 돌아가거나…….",
      "f03",
      { emotion: "sad" },
    ),
    f03: line(
      "dawn",
      "seo",
      "한윤서",
      "아니면 네가 여기 남아서 다음 역무원이 되면, 나는 나갈 수 있어. 어느 쪽이든 한 사람 몫이야.",
      "f04",
      { emotion: "neutral" },
    ),
    f04: line("dawn", "seo", "나", "손안의 파란 표가 새벽빛을 머금었다. 문이 닫히기까지 남은 시간은 몇 초뿐이었다.", null, {
      emotion: "soft",
      choices: [
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
          text: "표를 반으로 찢어 윤서와 나눠 든다.",
          next: "ed01",
          require: (state) =>
            state.stats.memory >= 4 && state.stats.trust >= 4 && state.stats.courage >= 3,
          lockedText: "기억 4 · 동조 4 · 용기 3 필요",
        },
      ],
    }),

    em01: line(
      "dawn",
      "seo",
      "한윤서",
      "잊지 않는다고 약속해 줘. 내가 정말 여기 있었다는 것, 그리고 우리가 서로를 아주 많이 좋아했다는 것.",
      "em02",
      { emotion: "smile" },
    ),
    em02: line(
      "train",
      null,
      "나",
      "문이 닫혔다. 창밖에서 윤서가 입 모양으로 내 이름을 불렀고, 나는 끝까지 그녀의 이름을 되풀이했다.",
      null,
      { ending: "memory" },
    ),
    eo01: line(
      "dawn",
      "seo",
      "한윤서",
      "그래. 네가 편안해지는 게 내 소원이었던 적도 있으니까. 이번에는 정말 잘 가.",
      "eo02",
      { emotion: "cry" },
    ),
    eo02: line(
      "train",
      null,
      "나",
      "나는 빈손으로 열차에 올랐다. 문이 닫히는 순간, 누군가의 이름과 함께 가슴 한쪽이 깨끗하게 비었다.",
      null,
      { ending: "oblivion" },
    ),
    ek01: line(
      "dawn",
      "seo",
      "나",
      "역무원 모자를 벗겨 윤서에게 표와 함께 쥐여 주었다. “네가 잃어버린 7년부터 찾고 와.”",
      "ek02",
      { emotion: "surprised" },
    ),
    ek02: line(
      "office",
      null,
      "한윤서",
      "열차 안의 윤서는 울면서 화를 냈다. 그 목소리가 멀어진 뒤, 보관소의 불이 하나씩 나를 향해 켜졌다.",
      null,
      { ending: "keeper" },
    ),
    ed01: line(
      "dawn",
      "seo",
      "한윤서",
      "잠깐, 한도하. 그거 찢으면 무효표가 될 수도 있어.",
      "ed02",
      { emotion: "surprised" },
    ),
    ed02: line(
      "dawn",
      "seo",
      "나",
      "“한 사람만 탈 수 있다는 말은 없었잖아. 표가 한 장이라고만 했지.”",
      "ed03",
      { emotion: "smile" },
    ),
    ed03: line(
      "dawn",
      "seo",
      "나",
      "반쪽 표를 맞잡고 문을 넘었다. 경고음이 비명을 질렀지만, 윤서는 7년 전과 달리 내 손을 놓지 않았다.",
      "ed04",
      { emotion: "smile" },
    ),
    ed04: line(
      "dawn",
      "seo",
      "한윤서",
      "그래서 이제 어디로 갈 건데?",
      "ed05",
      { emotion: "shy" },
    ),
    ed05: line(
      "dawn",
      "seo",
      "나",
      "“분실물 찾으러. 네가 잃어버린 7년 전부.”",
      null,
      { ending: "dawn", emotion: "smile" },
    ),
  };

  if (!window.LostDawnStoryExpansion) {
    throw new Error("확장 스토리 모듈을 불러오지 못했습니다.");
  }
  window.LostDawnStoryExpansion.apply(STORY, chapters, endings, line);
  if (!window.LostDawnDatingSim) {
    throw new Error("연애 시뮬레이션 모듈을 불러오지 못했습니다.");
  }
  window.LostDawnDatingSim.apply(STORY, chapters, endings, line);
  if (!window.LostDawnExtras) {
    throw new Error("보너스 콘텐츠 모듈을 불러오지 못했습니다.");
  }
  window.LostDawnExtras.apply(STORY, line);
  const collectionCatalog = window.LostDawnExtras.catalog;

  const defaultSettings = {
    textSpeed: 24,
    sound: true,
  };

  let settings = { ...defaultSettings, ...readStorage(SETTINGS_KEY, {}) };
  let state = createInitialState();
  let activeScreen = "title";
  let typingFrame = 0;
  let typing = false;
  let fullText = "";
  let typeStartedAt = 0;
  let currentNode = null;
  let chapterTimer = 0;
  let transitionTimer = 0;
  let transitioning = false;
  let toastTimer = 0;
  let advanceBlockedUntil = 0;
  let minigameState = null;
  let minigameFrame = 0;
  let minigameTimer = 0;

  function createInitialState() {
    return {
      node: "p01",
      chapter: "",
      stats: { memory: 0, trust: 0, courage: 0, affection: 0 },
      flags: {},
      minigames: {},
      history: [],
      startedAt: Date.now(),
      storyVersion: STORY_VERSION,
    };
  }

  function migrateSavedState(saved) {
    const migrated = {
      ...saved,
      stats: { ...(saved.stats || {}) },
      flags: { ...(saved.flags || {}) },
      minigames: { ...(saved.minigames || {}) },
      storyVersion: STORY_VERSION,
    };
    const stats = migrated.stats;
    const savedVersion = Number(saved.storyVersion) || 1;
    const isLegacyFinale = ["f01", "f02", "f03", "f04"].includes(saved.node);
    const passedDatingLoop = /^(m|summer|t|r|f|em|eo|ek|ed)/.test(saved.node);

    if (
      !saved.storyVersion &&
      isLegacyFinale &&
      stats.memory >= 4 &&
      stats.trust >= 4 &&
      stats.courage >= 3
    ) {
      migrated.flags.legacy_true_ending_eligible = true;
    }

    if (savedVersion < 3 && passedDatingLoop && typeof stats.affection !== "number") {
      stats.affection = 7;
    }

    return migrated;
  }

  function readStorage(key, fallback) {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      console.error(`저장 데이터(${key})를 읽지 못했습니다.`, error);
      window.setTimeout(() => showToast("저장 데이터를 읽지 못했습니다."), 0);
      return fallback;
    }
  }

  function writeStorage(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`저장 데이터(${key})를 기록하지 못했습니다.`, error);
      showToast("브라우저 저장 공간을 사용할 수 없습니다.");
      return false;
    }
  }

  function removeStorage(key) {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`저장 데이터(${key})를 삭제하지 못했습니다.`, error);
      showToast("진행 기록을 삭제하지 못했습니다.");
    }
  }

  class AudioEngine {
    constructor() {
      this.context = null;
      this.master = null;
      this.started = false;
      this.noise = null;
      this.hum = null;
    }

    start() {
      if (!settings.sound) return;
      if (this.started) {
        if (this.context?.state === "suspended") this.context.resume();
        this.setMuted(false);
        return;
      }

      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) {
        settings.sound = false;
        updateSoundUI();
        showToast("이 브라우저는 배경음을 지원하지 않습니다.");
        return;
      }

      this.context = new AudioContext();
      this.master = this.context.createGain();
      this.master.gain.value = 0.7;
      this.master.connect(this.context.destination);

      const buffer = this.context.createBuffer(1, this.context.sampleRate * 2, this.context.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i += 1) {
        data[i] = Math.random() * 2 - 1;
      }

      const noiseSource = this.context.createBufferSource();
      const noiseFilter = this.context.createBiquadFilter();
      const noiseGain = this.context.createGain();
      noiseSource.buffer = buffer;
      noiseSource.loop = true;
      noiseFilter.type = "lowpass";
      noiseFilter.frequency.value = 720;
      noiseGain.gain.value = 0.025;
      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.master);
      noiseSource.start();
      this.noise = noiseSource;

      const hum = this.context.createOscillator();
      const humGain = this.context.createGain();
      hum.type = "sine";
      hum.frequency.value = 48;
      humGain.gain.value = 0.013;
      hum.connect(humGain);
      humGain.connect(this.master);
      hum.start();
      this.hum = hum;
      this.started = true;
    }

    setMuted(muted) {
      if (!this.master || !this.context) return;
      this.master.gain.cancelScheduledValues(this.context.currentTime);
      this.master.gain.setTargetAtTime(muted ? 0 : 0.7, this.context.currentTime, 0.06);
    }

    chime(kind = "soft") {
      if (!settings.sound || !this.context || !this.master) return;
      const now = this.context.currentTime;
      const notes = kind === "choice" ? [392, 523.25] : kind === "ending" ? [261.63, 392, 523.25] : [523.25];

      notes.forEach((frequency, index) => {
        const oscillator = this.context.createOscillator();
        const gain = this.context.createGain();
        oscillator.type = "sine";
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(0, now + index * 0.08);
        gain.gain.linearRampToValueAtTime(0.045, now + index * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.65 + index * 0.08);
        oscillator.connect(gain);
        gain.connect(this.master);
        oscillator.start(now + index * 0.08);
        oscillator.stop(now + 0.72 + index * 0.08);
      });
    }
  }

  class SceneRenderer {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.width = 0;
      this.height = 0;
      this.dpr = 1;
      this.scene = "title";
      this.character = null;
      this.emotion = "neutral";
      this.targetScene = "title";
      this.startTime = performance.now();
      this.characterSprites = {};
      this.spriteLoadFailures = new Set();
      ["neutral", "soft", "sad", "smile", "surprised", "shy", "cry"].forEach((emotion) => {
        const image = new Image();
        image.decoding = "async";
        image.addEventListener("error", () => {
          this.spriteLoadFailures.add(emotion);
          console.error(`윤서 스프라이트를 불러오지 못했습니다: ${emotion}`);
        });
        image.src = `assets/characters/yoonseo/${emotion}.png`;
        this.characterSprites[emotion] = image;
      });
      this.particles = Array.from({ length: 70 }, (_, index) => ({
        x: (index * 137.5) % 1600,
        y: (index * 83.1) % 900,
        speed: 0.35 + ((index * 17) % 60) / 100,
        size: 0.8 + ((index * 13) % 20) / 10,
      }));
      this.resize = this.resize.bind(this);
      this.render = this.render.bind(this);
      window.addEventListener("resize", this.resize);
      this.resize();
      requestAnimationFrame(this.render);
    }

    setScene(scene, character, emotion = "neutral") {
      this.scene = scene;
      this.character = character;
      this.emotion = emotion;
    }

    resize() {
      const rect = this.canvas.getBoundingClientRect();
      this.width = Math.max(1, rect.width);
      this.height = Math.max(1, rect.height);
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.canvas.width = Math.round(this.width * this.dpr);
      this.canvas.height = Math.round(this.height * this.dpr);
    }

    render(timestamp) {
      const ctx = this.ctx;
      ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      ctx.clearRect(0, 0, this.width, this.height);

      const scale = Math.max(this.width / 1600, this.height / 900);
      const offsetX = (this.width - 1600 * scale) / 2;
      const offsetY = (this.height - 900 * scale) / 2;
      ctx.save();
      ctx.translate(offsetX, offsetY);
      ctx.scale(scale, scale);

      const t = (timestamp - this.startTime) / 1000;
      this.drawScene(ctx, t);
      if (this.character === "seo") this.drawSeo(ctx, t, this.emotion);
      this.drawAtmosphere(ctx, t);
      ctx.restore();

      requestAnimationFrame(this.render);
    }

    gradient(ctx, x0, y0, x1, y1, stops) {
      const gradient = ctx.createLinearGradient(x0, y0, x1, y1);
      stops.forEach(([position, color]) => gradient.addColorStop(position, color));
      return gradient;
    }

    drawScene(ctx, t) {
      if (this.scene === "train") this.drawTrain(ctx, t);
      else if (this.scene === "platform") this.drawPlatform(ctx, t, false);
      else if (this.scene === "office") this.drawOffice(ctx, t);
      else if (this.scene === "memory") this.drawMemory(ctx, t);
      else if (this.scene === "tunnel") this.drawTunnel(ctx, t);
      else if (this.scene === "dawn") this.drawPlatform(ctx, t, true);
      else this.drawTitle(ctx, t);
    }

    drawTitle(ctx, t) {
      ctx.fillStyle = this.gradient(ctx, 0, 0, 0, 900, [
        [0, "#06101e"],
        [0.55, "#102a3b"],
        [1, "#02070d"],
      ]);
      ctx.fillRect(0, 0, 1600, 900);

      const glow = ctx.createRadialGradient(1180, 300, 20, 1180, 300, 430);
      glow.addColorStop(0, "rgba(88, 199, 212, 0.24)");
      glow.addColorStop(1, "rgba(4, 14, 25, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(650, 0, 950, 750);

      ctx.fillStyle = "#07131f";
      ctx.fillRect(750, 180, 850, 500);
      ctx.strokeStyle = "rgba(108, 194, 211, 0.3)";
      ctx.lineWidth = 3;
      ctx.strokeRect(802, 235, 690, 310);

      ctx.save();
      ctx.beginPath();
      ctx.rect(805, 238, 684, 304);
      ctx.clip();
      for (let i = 0; i < 24; i += 1) {
        const x = 820 + ((i * 91 + t * 130) % 760);
        const y = 255 + ((i * 47) % 260);
        ctx.strokeStyle = `rgba(141, 217, 231, ${0.12 + (i % 3) * 0.04})`;
        ctx.lineWidth = 1 + (i % 2);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - 55, y + 140);
        ctx.stroke();
      }
      ctx.restore();

      ctx.fillStyle = "#08121d";
      ctx.beginPath();
      ctx.moveTo(0, 655);
      ctx.lineTo(1600, 600);
      ctx.lineTo(1600, 900);
      ctx.lineTo(0, 900);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = "rgba(96, 194, 209, 0.22)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(810, 900);
      ctx.lineTo(1100, 600);
      ctx.moveTo(1260, 900);
      ctx.lineTo(1190, 600);
      ctx.stroke();

      for (let y = 630; y < 920; y += 34) {
        const ratio = (y - 600) / 300;
        ctx.strokeStyle = `rgba(100, 176, 193, ${0.08 + ratio * 0.12})`;
        ctx.lineWidth = 2 + ratio * 4;
        ctx.beginPath();
        ctx.moveTo(1070 - ratio * 290, y);
        ctx.lineTo(1200 + ratio * 85, y);
        ctx.stroke();
      }

      ctx.fillStyle = "rgba(79, 207, 219, 0.85)";
      ctx.fillRect(1150, 245, 4, 360);
      ctx.shadowColor = "#65e6ef";
      ctx.shadowBlur = 25;
      ctx.fillRect(1150, 245, 2, 360);
      ctx.shadowBlur = 0;
    }

    drawTrain(ctx, t) {
      ctx.fillStyle = this.gradient(ctx, 0, 0, 0, 900, [
        [0, "#182937"],
        [0.42, "#0d1b28"],
        [1, "#050b12"],
      ]);
      ctx.fillRect(0, 0, 1600, 900);

      ctx.fillStyle = "#d7e3df";
      ctx.globalAlpha = 0.07 + Math.sin(t * 1.8) * 0.01;
      for (let x = 100; x < 1550; x += 320) {
        ctx.fillRect(x, 65, 210, 18);
      }
      ctx.globalAlpha = 1;

      const windows = [
        [70, 160, 360, 340],
        [465, 160, 360, 340],
        [860, 160, 360, 340],
        [1255, 160, 280, 340],
      ];
      windows.forEach(([x, y, w, h], index) => {
        ctx.fillStyle = "#03080e";
        ctx.fillRect(x, y, w, h);
        const windowGlow = ctx.createLinearGradient(x, y, x, y + h);
        windowGlow.addColorStop(0, "rgba(23, 68, 91, 0.72)");
        windowGlow.addColorStop(1, "rgba(4, 13, 22, 0.94)");
        ctx.fillStyle = windowGlow;
        ctx.fillRect(x + 8, y + 8, w - 16, h - 16);
        ctx.strokeStyle = "rgba(151, 201, 212, 0.18)";
        ctx.lineWidth = 5;
        ctx.strokeRect(x, y, w, h);

        ctx.save();
        ctx.beginPath();
        ctx.rect(x + 9, y + 9, w - 18, h - 18);
        ctx.clip();
        for (let line = 0; line < 8; line += 1) {
          const streakX = x + ((line * 83 + t * (220 + index * 18)) % (w + 160)) - 80;
          ctx.strokeStyle = `rgba(96, 178, 201, ${0.08 + (line % 3) * 0.04})`;
          ctx.lineWidth = 2 + (line % 3);
          ctx.beginPath();
          ctx.moveTo(streakX, y + 30);
          ctx.lineTo(streakX - 180, y + h - 20);
          ctx.stroke();
        }
        ctx.restore();
      });

      ctx.fillStyle = "#11212d";
      ctx.fillRect(0, 535, 1600, 365);
      ctx.fillStyle = this.gradient(ctx, 0, 570, 0, 880, [
        [0, "#295064"],
        [0.08, "#173748"],
        [1, "#08111b"],
      ]);
      ctx.beginPath();
      ctx.moveTo(0, 595);
      ctx.lineTo(1600, 595);
      ctx.lineTo(1600, 850);
      ctx.lineTo(0, 850);
      ctx.closePath();
      ctx.fill();

      for (let x = 0; x < 1600; x += 165) {
        ctx.strokeStyle = "rgba(158, 212, 224, 0.12)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, 598);
        ctx.lineTo(x, 844);
        ctx.stroke();
      }

      ctx.strokeStyle = "rgba(182, 222, 230, 0.25)";
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(80, 116);
      ctx.lineTo(1520, 116);
      ctx.stroke();
      for (let x = 160; x < 1500; x += 205) {
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(x, 116);
        ctx.lineTo(x, 190);
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(x, 209, 23, 18, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    drawPlatform(ctx, t, dawn) {
      const skyTop = dawn ? "#375d72" : "#07121f";
      const skyBottom = dawn ? "#d18b75" : "#123247";
      ctx.fillStyle = this.gradient(ctx, 0, 0, 0, 900, [
        [0, skyTop],
        [0.58, skyBottom],
        [1, "#091018"],
      ]);
      ctx.fillRect(0, 0, 1600, 900);

      const horizon = dawn ? 310 : 250;
      const glow = ctx.createRadialGradient(1120, horizon, 15, 1120, horizon, dawn ? 480 : 300);
      glow.addColorStop(0, dawn ? "rgba(255, 203, 151, 0.58)" : "rgba(72, 192, 214, 0.18)");
      glow.addColorStop(1, "rgba(4, 14, 24, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(500, 0, 1100, 720);

      ctx.fillStyle = "rgba(4, 13, 22, 0.75)";
      for (let x = 700; x < 1620; x += 76) {
        const h = 95 + ((x * 13) % 190);
        ctx.fillRect(x, 390 - h, 58, h);
        if (dawn) {
          ctx.fillStyle = "rgba(255, 198, 139, 0.22)";
          for (let wy = 410 - h; wy < 365; wy += 28) ctx.fillRect(x + 9, wy, 7, 10);
          ctx.fillStyle = "rgba(4, 13, 22, 0.75)";
        }
      }

      ctx.fillStyle = "#0a1722";
      ctx.fillRect(0, 0, 1600, 125);
      ctx.fillStyle = "rgba(175, 222, 229, 0.16)";
      ctx.fillRect(0, 124, 1600, 5);

      ctx.fillStyle = "#0b1822";
      ctx.beginPath();
      ctx.moveTo(0, 405);
      ctx.lineTo(1600, 405);
      ctx.lineTo(1600, 900);
      ctx.lineTo(0, 900);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = "rgba(141, 199, 211, 0.13)";
      ctx.lineWidth = 2;
      for (let y = 435; y < 900; y += 58) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(1600, y);
        ctx.stroke();
      }
      for (let x = -900; x < 2500; x += 135) {
        ctx.beginPath();
        ctx.moveTo(800, 405);
        ctx.lineTo(x, 900);
        ctx.stroke();
      }

      ctx.fillStyle = dawn ? "#e5b85a" : "#b58d35";
      ctx.fillRect(0, 520, 1600, 15);
      ctx.fillStyle = "rgba(244, 208, 108, 0.18)";
      for (let x = 0; x < 1600; x += 34) ctx.fillRect(x, 542, 20, 8);

      for (const x of [245, 720, 1215]) {
        ctx.fillStyle = "#122633";
        ctx.fillRect(x, 90, 64, 440);
        ctx.fillStyle = "rgba(141, 213, 224, 0.17)";
        ctx.fillRect(x + 8, 90, 6, 440);
      }

      ctx.fillStyle = "rgba(4, 18, 31, 0.92)";
      ctx.fillRect(420, 160, 390, 92);
      ctx.strokeStyle = "rgba(112, 220, 230, 0.7)";
      ctx.lineWidth = 2;
      ctx.strokeRect(420, 160, 390, 92);
      ctx.fillStyle = "#d5f5f7";
      ctx.font = '34px "Malgun Gothic", sans-serif';
      ctx.fillText("유실", 470, 217);
      ctx.fillStyle = "rgba(166, 226, 233, 0.55)";
      ctx.font = "14px Consolas, monospace";
      ctx.fillText("LOST & FOUND", 600, 212);
      ctx.fillStyle = "#65e6ef";
      ctx.fillRect(440, 183, 9, 45);

      ctx.fillStyle = "rgba(2, 10, 18, 0.82)";
      ctx.fillRect(960, 150, 185, 66);
      ctx.strokeStyle = "rgba(136, 204, 218, 0.35)";
      ctx.strokeRect(960, 150, 185, 66);
      ctx.fillStyle = dawn ? "#ffd4a1" : "#8deef2";
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 12;
      ctx.font = "31px Consolas, monospace";
      ctx.fillText(dawn ? "02:17:59" : "02:17", 985, 194);
      ctx.shadowBlur = 0;

      if (!dawn) {
        for (let i = 0; i < 42; i += 1) {
          const x = (i * 131 + t * 36) % 1650;
          const y = 120 + ((i * 71 + t * 120) % 420);
          ctx.strokeStyle = `rgba(168, 225, 235, ${0.08 + (i % 4) * 0.025})`;
          ctx.lineWidth = 1 + (i % 2);
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x - 12, y + 28);
          ctx.stroke();
        }
      }
    }

    drawOffice(ctx, t) {
      ctx.fillStyle = this.gradient(ctx, 0, 0, 0, 900, [
        [0, "#102433"],
        [0.52, "#142331"],
        [1, "#060c13"],
      ]);
      ctx.fillRect(0, 0, 1600, 900);

      const lamp = ctx.createRadialGradient(540, 280, 10, 540, 280, 470);
      lamp.addColorStop(0, "rgba(255, 190, 115, 0.3)");
      lamp.addColorStop(1, "rgba(255, 174, 92, 0)");
      ctx.fillStyle = lamp;
      ctx.fillRect(0, 0, 1100, 760);

      ctx.fillStyle = "#0a151e";
      for (let shelf = 0; shelf < 3; shelf += 1) {
        const x = 50 + shelf * 370;
        ctx.fillRect(x, 95, 320, 575);
        ctx.strokeStyle = "rgba(133, 186, 197, 0.2)";
        ctx.lineWidth = 4;
        ctx.strokeRect(x, 95, 320, 575);
        for (let row = 1; row < 5; row += 1) {
          const y = 95 + row * 112;
          ctx.fillStyle = "#142935";
          ctx.fillRect(x, y, 320, 12);
          for (let item = 0; item < 4; item += 1) {
            const itemX = x + 18 + item * 72;
            const itemY = y - 66 - ((shelf + row + item) % 3) * 7;
            ctx.fillStyle = ["#293d46", "#433b37", "#263844"][(shelf + row + item) % 3];
            ctx.fillRect(itemX, itemY, 53, y - itemY);
            ctx.fillStyle = "rgba(225, 215, 179, 0.48)";
            ctx.fillRect(itemX + 8, itemY + 12, 35, 9);
          }
        }
      }

      ctx.fillStyle = "#14181c";
      ctx.fillRect(0, 680, 1600, 220);
      ctx.fillStyle = "#24323a";
      ctx.beginPath();
      ctx.moveTo(240, 645);
      ctx.lineTo(1040, 645);
      ctx.lineTo(1180, 900);
      ctx.lineTo(100, 900);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "#d8b764";
      ctx.fillRect(470, 628, 70, 22);
      ctx.fillStyle = "#9c2e38";
      ctx.fillRect(485, 598, 44, 31);
      ctx.strokeStyle = "#1c1113";
      ctx.strokeRect(485, 598, 44, 31);

      ctx.strokeStyle = "#b7c4c4";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(690, 610, 29, 0, Math.PI * 2);
      ctx.moveTo(690, 581);
      ctx.lineTo(690, 638);
      ctx.stroke();
      ctx.fillStyle = "#1b252b";
      ctx.fillRect(674, 638, 32, 12);

      ctx.strokeStyle = "#e2b83f";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(850, 625, 43, Math.PI, Math.PI * 2);
      ctx.lineTo(893, 645);
      ctx.stroke();
      ctx.fillStyle = "rgba(226, 184, 63, 0.28)";
      ctx.beginPath();
      ctx.arc(850, 625, 43, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "rgba(242, 198, 126, 0.68)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(530, 0);
      ctx.lineTo(530, 185);
      ctx.stroke();
      ctx.fillStyle = "#26343a";
      ctx.beginPath();
      ctx.moveTo(455, 185);
      ctx.lineTo(605, 185);
      ctx.lineTo(570, 250);
      ctx.lineTo(490, 250);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = `rgba(255, 211, 146, ${0.38 + Math.sin(t * 2.1) * 0.03})`;
      ctx.fillRect(495, 250, 70, 8);
    }

    drawMemory(ctx, t) {
      this.drawTrain(ctx, t * 0.4);
      ctx.fillStyle = "rgba(111, 56, 53, 0.22)";
      ctx.fillRect(0, 0, 1600, 900);

      const bloom = ctx.createRadialGradient(760, 360, 40, 760, 360, 650);
      bloom.addColorStop(0, "rgba(255, 210, 159, 0.22)");
      bloom.addColorStop(1, "rgba(34, 18, 27, 0)");
      ctx.fillStyle = bloom;
      ctx.fillRect(0, 0, 1600, 900);

      ctx.globalAlpha = 0.13;
      for (let i = 0; i < 9; i += 1) {
        ctx.strokeStyle = i % 2 ? "#ffcc9c" : "#76dce5";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(800, 430, 130 + i * 42 + Math.sin(t + i) * 5, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    drawTunnel(ctx, t) {
      ctx.fillStyle = "#01050a";
      ctx.fillRect(0, 0, 1600, 900);

      const centerX = 790 + Math.sin(t * 0.22) * 12;
      const centerY = 370;
      for (let i = 12; i > 0; i -= 1) {
        const ratio = i / 12;
        ctx.strokeStyle = `rgba(71, 142, 160, ${0.04 + (1 - ratio) * 0.15})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, 115 + i * 77, 85 + i * 48, 0, Math.PI, Math.PI * 2);
        ctx.stroke();
      }

      const endGlow = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, 240);
      endGlow.addColorStop(0, "rgba(182, 246, 245, 0.52)");
      endGlow.addColorStop(0.22, "rgba(77, 180, 196, 0.15)");
      endGlow.addColorStop(1, "rgba(0, 8, 14, 0)");
      ctx.fillStyle = endGlow;
      ctx.fillRect(420, 60, 760, 620);

      ctx.fillStyle = "#030a10";
      ctx.beginPath();
      ctx.moveTo(0, 610);
      ctx.quadraticCurveTo(420, 525, centerX, 460);
      ctx.quadraticCurveTo(1180, 525, 1600, 610);
      ctx.lineTo(1600, 900);
      ctx.lineTo(0, 900);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = "rgba(78, 201, 216, 0.2)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(330, 900);
      ctx.lineTo(centerX - 65, 455);
      ctx.moveTo(1260, 900);
      ctx.lineTo(centerX + 65, 455);
      ctx.stroke();

      for (let i = 0; i < 30; i += 1) {
        const phase = (i * 0.17 + t * 0.08) % 1;
        const x = centerX + Math.sin(i * 4.2) * phase * 620;
        const y = 470 + phase * phase * 430;
        ctx.fillStyle = `rgba(98, 231, 235, ${(1 - phase) * 0.35})`;
        ctx.beginPath();
        ctx.arc(x, y, 1 + phase * 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    drawSeo(ctx, t, emotion) {
      const sprite = this.characterSprites[emotion] || this.characterSprites.neutral;
      const breathe = Math.sin(t * 1.45) * 4;
      const sway = Math.sin(t * 0.55) * 2;
      const portraitLayout = this.width / this.height < 0.95;
      const drawWidth = portraitLayout ? 580 : 650;
      const drawHeight = (drawWidth / 720) * 1280;
      const centerX = (portraitLayout ? 800 : 1180) + sway;
      const topY = 78 + breathe;

      const aura = ctx.createRadialGradient(centerX, 350, 50, centerX, 350, 420);
      aura.addColorStop(0, "rgba(99, 218, 228, 0.16)");
      aura.addColorStop(0.55, "rgba(44, 106, 132, 0.06)");
      aura.addColorStop(1, "rgba(10, 27, 42, 0)");
      ctx.fillStyle = aura;
      ctx.fillRect(720, 0, 880, 900);

      ctx.save();
      ctx.translate(centerX, topY);
      ctx.rotate(Math.sin(t * 0.42) * 0.0025);

      if (!sprite.complete || sprite.naturalWidth === 0) {
        ctx.strokeStyle = this.spriteLoadFailures.has(emotion)
          ? "rgba(255, 142, 158, 0.7)"
          : "rgba(101, 230, 239, 0.45)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 300, 82, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = "rgba(223, 247, 250, 0.55)";
        ctx.font = "12px Consolas, monospace";
        ctx.textAlign = "center";
        ctx.fillText(
          this.spriteLoadFailures.has(emotion) ? "CHARACTER ASSET ERROR" : "LOADING CHARACTER",
          0,
          305,
        );
        ctx.restore();
        return;
      }

      const sceneFilter =
        this.scene === "memory"
          ? "sepia(0.1) saturate(0.88) brightness(0.96)"
          : this.scene === "dawn"
            ? "saturate(0.9) brightness(1.06)"
            : "saturate(0.82) brightness(0.9) contrast(1.05)";
      ctx.filter = `drop-shadow(0 26px 28px rgba(0, 4, 10, 0.68)) ${sceneFilter}`;
      ctx.drawImage(sprite, -drawWidth / 2, 0, drawWidth, drawHeight);
      ctx.filter = "none";

      const rim = ctx.createLinearGradient(-drawWidth / 2, 0, drawWidth / 2, 0);
      rim.addColorStop(0, "rgba(101, 230, 239, 0.16)");
      rim.addColorStop(0.45, "rgba(101, 230, 239, 0)");
      rim.addColorStop(1, "rgba(255, 197, 141, 0.04)");
      ctx.globalCompositeOperation = "source-atop";
      ctx.fillStyle = rim;
      ctx.fillRect(-drawWidth / 2, 0, drawWidth, drawHeight);
      ctx.globalCompositeOperation = "source-over";

      if (emotion === "cry") {
        const tearLength = 29 + Math.sin(t * 2.2) * 4;
        ctx.strokeStyle = "rgba(177, 242, 249, 0.88)";
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.shadowColor = "rgba(101, 230, 239, 0.55)";
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(-45, 245);
        ctx.quadraticCurveTo(-50, 257, -46, 245 + tearLength);
        ctx.moveTo(38, 246);
        ctx.quadraticCurveTo(43, 258, 40, 266 + tearLength * 0.45);
        ctx.stroke();
      }

      ctx.restore();
    }

    drawAtmosphere(ctx, t) {
      this.particles.forEach((particle, index) => {
        const y = (particle.y + t * 16 * particle.speed) % 900;
        const x = particle.x + Math.sin(t * 0.35 + index) * 9;
        ctx.fillStyle = `rgba(169, 232, 238, ${0.025 + (index % 5) * 0.012})`;
        ctx.beginPath();
        ctx.arc(x, y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  }

  const audio = new AudioEngine();
  const renderer = new SceneRenderer(elements.canvas);

  function validateStory() {
    const errors = [];
    Object.entries(STORY).forEach(([id, node]) => {
      const destinations = [];
      if (typeof node.next === "string") destinations.push(node.next);
      if (node.choices) node.choices.forEach((choice) => destinations.push(choice.next));
      destinations.forEach((destination) => {
        if (!STORY[destination]) errors.push(`${id} → ${destination}`);
      });
      if (!node.text || !node.speaker || !node.bg) errors.push(`${id}에 필수 값 누락`);
    });
    if (errors.length) throw new Error(`잘못된 스토리 연결: ${errors.join(", ")}`);
  }

  function resolve(value) {
    return typeof value === "function" ? value(state) : value;
  }

  function changeScreen(screen) {
    activeScreen = screen;
    [elements.titleScreen, elements.gameScreen, elements.endingScreen].forEach((element) =>
      element.classList.remove("is-active"),
    );
    elements[`${screen}Screen`].classList.add("is-active");
  }

  function transitionTo(callback) {
    if (transitioning) return;
    transitioning = true;
    window.clearTimeout(transitionTimer);
    elements.fade.classList.add("is-active");
    transitionTimer = window.setTimeout(() => {
      try {
        callback();
      } finally {
        requestAnimationFrame(() => elements.fade.classList.remove("is-active"));
        transitioning = false;
      }
    }, 360);
  }

  function startNewGame() {
    closeAllModals();
    stopMinigame();
    state = createInitialState();
    audio.start();
    transitionTo(() => {
      changeScreen("game");
      showNode("p01", { fresh: true });
    });
  }

  function requestNewGame() {
    if (readStorage(SAVE_KEY, null) && activeScreen !== "ending") {
      openModal(elements.confirmModal);
    } else {
      startNewGame();
    }
  }

  function continueGame() {
    const saved = readStorage(SAVE_KEY, null);
    if (!saved || !STORY[saved.node]) {
      showToast("이어할 수 있는 기록이 없습니다.");
      updateContinueButton();
      return;
    }

    const initialState = createInitialState();
    const migrated = migrateSavedState(saved);
    state = {
      ...initialState,
      ...migrated,
      stats: { ...initialState.stats, ...migrated.stats },
      flags: migrated.flags,
      minigames: migrated.minigames,
      history: Array.isArray(migrated.history) ? migrated.history : [],
    };
    audio.start();
    transitionTo(() => {
      changeScreen("game");
      showNode(state.node, { fromLoad: true });
    });
  }

  function showNode(id, options = {}) {
    const node = STORY[id];
    if (!node) {
      console.error(`존재하지 않는 스토리 노드: ${id}`);
      showToast("스토리 데이터를 불러오지 못했습니다.");
      return;
    }

    stopMinigame();
    currentNode = node;
    state.node = id;
    fullText = String(resolve(node.text));
    renderer.setScene(node.bg, node.char, resolve(node.emotion || "neutral"));

    if (node.chapter && state.chapter !== node.chapter) {
      state.chapter = node.chapter;
      showChapter(node.chapter, options.fromLoad);
    } else {
      updateChapterUI();
    }

    elements.speakerName.textContent = node.speaker;
    elements.speakerEn.textContent = speakerEnglish(node.speaker);
    elements.choicePanel.innerHTML = "";
    elements.choicePanel.classList.remove("is-visible", "is-schedule", "is-message");
    elements.continueMark.classList.remove("is-visible");
    elements.gameScreen.dataset.mode = node.mode || "story";
    updateStoryModeUI(node);

    if (!options.fromLoad) {
      state.history.push({ speaker: node.speaker, text: fullText, choice: false });
      state.history = state.history.slice(-220);
    }

    if (node.unlocks) applyUnlocks(resolve(node.unlocks));
    updateStatusUI();
    if (node.mode === "minigame") startMinigame(node.minigame);
    else if (node.mode === "message" || node.mode === "schedule") completeTyping();
    else beginTyping();
    saveGame();
  }

  function speakerEnglish(speaker) {
    const names = {
      나: "DOHA",
      한윤서: "YOONSEO",
      "기억 속 윤서": "MEMORY",
      "녹음 속 윤서": "RECORD",
      "???": "UNKNOWN",
      메시지: "MESSAGE",
      "안내 방송": "ANNOUNCEMENT",
    };
    return names[speaker] || "VOICE";
  }

  function updateStoryModeUI(node) {
    const scheduleVisible = node.mode === "schedule" && node.schedule;
    const phoneVisible = node.mode === "message" && node.phone;
    const minigameVisible = node.mode === "minigame" && node.minigame;
    elements.schedulePanel.classList.toggle("is-visible", Boolean(scheduleVisible));
    elements.schedulePanel.setAttribute("aria-hidden", String(!scheduleVisible));
    elements.phonePanel.classList.toggle("is-visible", Boolean(phoneVisible));
    elements.phonePanel.setAttribute("aria-hidden", String(!phoneVisible));
    elements.minigamePanel.classList.toggle("is-visible", Boolean(minigameVisible));
    elements.minigamePanel.setAttribute("aria-hidden", String(!minigameVisible));

    if (scheduleVisible) {
      elements.schedulePhase.textContent = `MEMORY DATE ${String(node.schedule.day).padStart(2, "0")} / ${String(node.schedule.total).padStart(2, "0")}`;
      elements.scheduleTitle.textContent = node.schedule.title;
      elements.scheduleHint.textContent = node.schedule.hint;
      elements.scheduleDays.innerHTML = "";
      for (let day = 1; day <= node.schedule.total; day += 1) {
        const marker = document.createElement("span");
        const completed = Boolean(state.flags[`date_day_${day}`]);
        marker.className = `${completed ? "is-complete" : ""}${day === node.schedule.day ? " is-current" : ""}`;
        marker.textContent = String(day).padStart(2, "0");
        marker.title = completed ? `${day}일 차 완료` : `${day}일 차`;
        elements.scheduleDays.appendChild(marker);
      }
    }

    if (phoneVisible) {
      elements.phoneDay.textContent = node.phone.day;
      elements.phoneContact.textContent = node.phone.contact;
      elements.phoneTime.textContent = node.phone.time;
      elements.phoneMessages.innerHTML = "";
      const messages = resolve(node.phone.messages) || [];
      messages.forEach((message) => {
        const bubble = document.createElement("p");
        bubble.className = `phone-bubble ${message.from === "me" ? "is-me" : "is-seo"}`;
        bubble.textContent = message.text;
        elements.phoneMessages.appendChild(bubble);
      });
      elements.phoneMessages.scrollTop = elements.phoneMessages.scrollHeight;
      elements.phoneHint.textContent = node.choices ? "답장을 선택하세요" : "화면을 눌러 계속";
    }
  }

  function beginTyping() {
    window.cancelAnimationFrame(typingFrame);
    typing = true;
    typeStartedAt = performance.now();
    elements.dialogueText.textContent = "";

    const tick = (timestamp) => {
      const elapsed = timestamp - typeStartedAt;
      const count = Math.min(fullText.length, Math.floor(elapsed / settings.textSpeed) + 1);
      elements.dialogueText.textContent = fullText.slice(0, count);
      if (count < fullText.length) {
        typingFrame = requestAnimationFrame(tick);
      } else {
        completeTyping();
      }
    };
    typingFrame = requestAnimationFrame(tick);
  }

  function completeTyping() {
    window.cancelAnimationFrame(typingFrame);
    elements.dialogueText.textContent = fullText;
    typing = false;
    if (currentNode?.choices) {
      renderChoices(currentNode.choices);
    } else {
      elements.continueMark.classList.add("is-visible");
    }
  }

  function advanceStory() {
    if (activeScreen !== "game" || anyModalOpen() || transitioning) return;
    if (minigameState) return;
    if (performance.now() < advanceBlockedUntil) return;
    if (typing) {
      completeTyping();
      return;
    }
    if (currentNode?.choices) return;
    if (currentNode?.ending) {
      showEnding(currentNode.ending);
      return;
    }
    if (currentNode?.next) {
      audio.chime("soft");
      showNode(resolve(currentNode.next));
    }
  }

  function renderChoices(choices) {
    elements.choicePanel.innerHTML = "";
    elements.choicePanel.classList.toggle("is-schedule", currentNode?.mode === "schedule");
    elements.choicePanel.classList.toggle("is-message", currentNode?.mode === "message");
    choices.forEach((choice, index) => {
      const allowed = !choice.require || choice.require(state);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "choice-button";
      button.disabled = !allowed;
      button.style.transitionDelay = `${index * 65}ms`;

      const number = document.createElement("span");
      number.className = "choice-number";
      number.textContent = String(index + 1);
      const copy = document.createElement("span");
      copy.className = "choice-copy";

      if (choice.activity) {
        const code = document.createElement("small");
        const name = document.createElement("strong");
        const description = document.createElement("span");
        code.textContent = choice.activity.code;
        name.textContent = choice.activity.name;
        description.textContent = choice.activity.description;
        copy.append(code, name, description);
      } else if (choice.sticker) {
        button.classList.add("is-sticker-choice");
        const symbol = document.createElement("strong");
        const label = document.createElement("span");
        symbol.className = "choice-sticker-symbol";
        label.className = "choice-sticker-label";
        symbol.textContent = choice.sticker.symbol;
        label.textContent = choice.sticker.label;
        copy.append(symbol, label);
      } else {
        copy.textContent = choice.text;
      }

      button.append(number, copy);
      if (choice.activity) {
        const reward = document.createElement("span");
        reward.className = "choice-reward";
        reward.textContent = choice.activity.reward;
        button.appendChild(reward);
      } else if (!allowed) {
        const lock = document.createElement("span");
        lock.className = "choice-lock";
        lock.textContent = `LOCKED · ${choice.lockedText || "조건 미달"}`;
        button.appendChild(lock);
      }

      button.addEventListener("click", (event) => {
        event.stopPropagation();
        selectChoice(choice);
      });
      elements.choicePanel.appendChild(button);
    });
    requestAnimationFrame(() => elements.choicePanel.classList.add("is-visible"));
  }

  function selectChoice(choice) {
    if (choice.require && !choice.require(state)) return;
    const blockRapidAdvance = currentNode?.mode === "message";
    state.history.push({ speaker: "선택", text: choice.text, choice: true });
    applyEffects(choice.effects || {});
    if (choice.flag) state.flags[choice.flag] = true;
    if (Array.isArray(choice.flags)) {
      choice.flags.forEach((flag) => {
        state.flags[flag] = true;
      });
    }
    if (choice.unlocks) applyUnlocks(resolve(choice.unlocks));
    audio.start();
    audio.chime("choice");
    if (blockRapidAdvance) advanceBlockedUntil = performance.now() + 350;
    showNode(resolve(choice.next));
  }

  function applyEffects(effects) {
    const messages = [];
    Object.entries(effects).forEach(([stat, delta]) => {
      const previous = state.stats[stat] || 0;
      const cap = stat === "affection" ? 10 : 5;
      state.stats[stat] = Math.max(0, Math.min(cap, previous + delta));
      if (delta > 0 && stat === "memory") messages.push("기억 조각이 선명해졌다");
      if (delta > 0 && stat === "trust") messages.push("윤서와의 동조율이 올랐다");
      if (delta > 0 && stat === "courage") messages.push("진실을 마주할 용기를 얻었다");
      if (delta > 0 && stat === "affection") messages.push("윤서의 호감도가 올랐다");
      if (delta < 0 && stat === "trust") messages.push("윤서와의 거리가 멀어졌다");
    });
    if (messages.length) showToast(messages.join(" · "));
  }

  function readCollection() {
    const stored = readStorage(COLLECTION_KEY, {});
    return {
      photos: Array.isArray(stored.photos) ? stored.photos : [],
      achievements: Array.isArray(stored.achievements) ? stored.achievements : [],
    };
  }

  function applyUnlocks(unlocks, options = {}) {
    if (!Array.isArray(unlocks) || !unlocks.length) return;
    const collection = readCollection();
    const unlockedLabels = [];

    unlocks.forEach((unlock) => {
      const group = unlock.type === "photo" ? "photos" : "achievements";
      const catalogGroup = collectionCatalog[group];
      if (!catalogGroup?.[unlock.id]) {
        console.error(`존재하지 않는 수집 항목: ${unlock.type}:${unlock.id}`);
        return;
      }
      if (collection[group].includes(unlock.id)) return;
      collection[group].push(unlock.id);
      unlockedLabels.push(catalogGroup[unlock.id].title);
    });

    if (!unlockedLabels.length) return;
    writeStorage(COLLECTION_KEY, collection);
    updateCollectionCount();
    if (!options.quiet) showToast(`COLLECTION · ${unlockedLabels.join(" · ")}`);
  }

  function updateCollectionCount() {
    const collection = readCollection();
    elements.collectionCount.textContent = String(
      collection.photos.length + collection.achievements.length,
    );
  }

  function renderCollection() {
    const collection = readCollection();
    const photos = Object.entries(collectionCatalog.photos);
    const achievements = Object.entries(collectionCatalog.achievements);
    elements.photoCount.textContent = `${collection.photos.length} / ${photos.length}`;
    elements.achievementCount.textContent =
      `${collection.achievements.length} / ${achievements.length}`;
    elements.photoAlbum.innerHTML = "";
    elements.achievementList.innerHTML = "";

    photos.forEach(([id, photo]) => {
      const unlocked = collection.photos.includes(id);
      const card = document.createElement("article");
      card.className = `photo-card${unlocked ? " is-unlocked" : " is-locked"}`;
      card.dataset.scene = photo.scene;

      const visual = document.createElement("div");
      visual.className = "photo-visual";
      if (unlocked) {
        const image = document.createElement("img");
        image.src = `assets/characters/yoonseo/${photo.expression}.png`;
        image.alt = "";
        visual.appendChild(image);
      } else {
        visual.textContent = "?";
      }

      const copy = document.createElement("div");
      const subtitle = document.createElement("span");
      const title = document.createElement("strong");
      const description = document.createElement("p");
      subtitle.textContent = unlocked ? photo.subtitle : "LOCKED MEMORY";
      title.textContent = unlocked ? photo.title : "미발견 사진";
      description.textContent = unlocked ? photo.description : "데이트와 보너스 게임에서 해금됩니다.";
      copy.append(subtitle, title, description);
      card.append(visual, copy);
      elements.photoAlbum.appendChild(card);
    });

    achievements.forEach(([id, achievement], index) => {
      const unlocked = collection.achievements.includes(id);
      const item = document.createElement("article");
      item.className = `achievement-item${unlocked ? " is-unlocked" : " is-locked"}`;
      const number = document.createElement("span");
      const copy = document.createElement("div");
      const title = document.createElement("strong");
      const description = document.createElement("p");
      number.textContent = unlocked ? String(index + 1).padStart(2, "0") : "??";
      title.textContent = unlocked ? achievement.title : "미발견 업적";
      description.textContent = unlocked ? achievement.description : "조건을 만족하면 공개됩니다.";
      copy.append(title, description);
      item.append(number, copy);
      elements.achievementList.appendChild(item);
    });
  }

  function stopMinigame() {
    window.cancelAnimationFrame(minigameFrame);
    window.clearTimeout(minigameTimer);
    minigameFrame = 0;
    minigameTimer = 0;
    minigameState = null;
  }

  function startMinigame(config) {
    if (!config || !["quiz", "timing"].includes(config.type)) {
      throw new Error("지원하지 않는 미니게임 설정입니다.");
    }

    minigameState = {
      config,
      round: 0,
      score: 0,
      locked: false,
      position: 0,
    };
    elements.minigameTitle.textContent = config.title;
    elements.minigameSubtitle.textContent = config.subtitle;
    elements.minigameFeedback.textContent = "";
    elements.minigameStage.innerHTML = "";
    elements.minigameControls.innerHTML = "";

    if (typeof state.minigames[config.id] === "number") {
      renderMinigameResult(state.minigames[config.id], true);
      return;
    }

    if (config.type === "quiz") renderQuizRound();
    else renderTimingRound();
  }

  function renderQuizRound() {
    const { config, round } = minigameState;
    const question = config.questions[round];
    elements.minigameRound.textContent = `ROUND ${round + 1} / ${config.questions.length}`;
    elements.minigameStage.innerHTML = "";
    elements.minigameControls.innerHTML = "";
    elements.minigameFeedback.textContent = "윤서의 표정을 골라 주세요.";

    const prompt = document.createElement("p");
    prompt.className = "minigame-prompt";
    prompt.textContent = question.prompt;
    elements.minigameStage.appendChild(prompt);

    question.options.forEach((option, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "minigame-action";
      button.dataset.minigameAnswer = String(index);
      button.dataset.minigameBest = String(index === question.answer);
      button.textContent = `${index + 1}. ${option}`;
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        answerQuiz(index);
      });
      elements.minigameControls.appendChild(button);
    });
  }

  function answerQuiz(answer) {
    if (!minigameState || minigameState.locked) return;
    minigameState.locked = true;
    const question = minigameState.config.questions[minigameState.round];
    const correct = answer === question.answer;
    minigameState.score += correct ? 100 : 40;
    elements.minigameFeedback.textContent = correct
      ? "정답 · 윤서가 만족스럽게 웃었다."
      : `아쉽다 · 정답은 ‘${question.options[question.answer]}’`;
    elements.minigameControls.querySelectorAll("button").forEach((button) => {
      button.disabled = true;
      button.classList.toggle(
        "is-correct",
        Number(button.dataset.minigameAnswer) === question.answer,
      );
    });

    minigameTimer = window.setTimeout(() => {
      minigameState.round += 1;
      minigameState.locked = false;
      if (minigameState.round >= minigameState.config.questions.length) finishMinigame();
      else renderQuizRound();
    }, 320);
  }

  function renderTimingRound() {
    const { config, round } = minigameState;
    elements.minigameRound.textContent = `SHOT ${round + 1} / ${config.rounds}`;
    elements.minigameStage.innerHTML = "";
    elements.minigameControls.innerHTML = "";
    elements.minigameFeedback.textContent = "분홍색 구간에 맞춰 셔터를 누르세요.";

    const track = document.createElement("div");
    const target = document.createElement("i");
    const marker = document.createElement("span");
    track.className = "timing-track";
    target.className = "timing-target";
    marker.className = "timing-marker";
    track.append(target, marker);
    elements.minigameStage.appendChild(track);

    const shutter = document.createElement("button");
    shutter.type = "button";
    shutter.className = "minigame-action primary";
    shutter.dataset.minigamePrimary = "true";
    shutter.textContent = "SHUTTER";
    shutter.addEventListener("click", (event) => {
      event.stopPropagation();
      stopTimingRound(shutter);
    });
    elements.minigameControls.appendChild(shutter);

    const startedAt = performance.now();
    const tick = (timestamp) => {
      if (!minigameState || minigameState.locked) return;
      const phase = ((timestamp - startedAt) % config.duration) / config.duration;
      const position = phase <= 0.5 ? phase * 200 : (1 - phase) * 200;
      minigameState.position = position;
      marker.style.left = `${position}%`;
      minigameFrame = requestAnimationFrame(tick);
    };
    minigameFrame = requestAnimationFrame(tick);
  }

  function stopTimingRound(button) {
    if (!minigameState || minigameState.locked) return;
    minigameState.locked = true;
    window.cancelAnimationFrame(minigameFrame);
    button.disabled = true;
    const roundScore = Math.max(20, Math.round(100 - Math.abs(minigameState.position - 50) * 3));
    minigameState.score += roundScore;
    elements.minigameFeedback.textContent = `${roundScore}점 · ${
      roundScore >= 80 ? "윤서까지 선명하게 찍혔다!" : "조금 흔들렸지만 사진은 남았다."
    }`;

    minigameTimer = window.setTimeout(() => {
      minigameState.round += 1;
      minigameState.locked = false;
      if (minigameState.round >= minigameState.config.rounds) finishMinigame();
      else renderTimingRound();
    }, 320);
  }

  function finishMinigame() {
    const { config, score } = minigameState;
    state.minigames[config.id] = score;
    applyEffects(config.reward || {});
    applyUnlocks(config.completeUnlocks || []);
    if (score >= config.highScore) applyUnlocks(config.highScoreUnlocks || []);
    saveGame();
    renderMinigameResult(score, false);
  }

  function renderMinigameResult(score, restored) {
    const { config } = minigameState;
    minigameState.locked = true;
    elements.minigameRound.textContent = restored ? "SAVED RESULT" : "COMPLETE";
    elements.minigameStage.innerHTML = "";
    elements.minigameControls.innerHTML = "";

    const result = document.createElement("div");
    const label = document.createElement("span");
    const value = document.createElement("strong");
    result.className = "minigame-result";
    label.textContent = score >= config.highScore ? "S RANK" : score >= config.highScore * 0.7 ? "A RANK" : "B RANK";
    value.textContent = String(score);
    result.append(label, value);
    elements.minigameStage.appendChild(result);
    elements.minigameFeedback.textContent = restored
      ? "저장된 결과를 불러왔습니다."
      : "보상과 앨범 항목이 저장되었습니다.";

    const continueButton = document.createElement("button");
    continueButton.type = "button";
    continueButton.className = "minigame-action primary";
    continueButton.dataset.minigamePrimary = "true";
    continueButton.textContent = "계속";
    continueButton.addEventListener("click", (event) => {
      event.stopPropagation();
      showNode(config.next);
    });
    elements.minigameControls.appendChild(continueButton);
  }

  function showChapter(chapterId, quiet = false) {
    updateChapterUI();
    if (quiet) return;
    const chapter = chapters[chapterId];
    elements.chapterCardNumber.textContent = chapter.number;
    elements.chapterCardName.textContent = chapter.name;
    elements.chapterCard.classList.add("is-visible");
    window.clearTimeout(chapterTimer);
    chapterTimer = window.setTimeout(() => elements.chapterCard.classList.remove("is-visible"), 1900);
  }

  function updateChapterUI() {
    const chapter = chapters[state.chapter] || chapters.prologue;
    elements.chapterNumber.textContent = chapter.number;
    elements.chapterName.textContent = chapter.name;
  }

  function updateStatusUI() {
    elements.memoryShards.innerHTML = "";
    for (let i = 0; i < 5; i += 1) {
      const shard = document.createElement("i");
      shard.className = `memory-shard${i < state.stats.memory ? " is-active" : ""}`;
      elements.memoryShards.appendChild(shard);
    }
    elements.memoryShards.setAttribute("aria-label", `기억 조각 ${state.stats.memory}개`);
    const sync = Math.min(100, (state.stats.trust / 5) * 100);
    elements.syncFill.style.width = `${sync}%`;
    const resolve = Math.min(100, (state.stats.courage / 5) * 100);
    elements.resolveFill.style.width = `${resolve}%`;
    elements.affectionHearts.innerHTML = "";
    const affection = state.stats.affection || 0;
    for (let i = 0; i < 5; i += 1) {
      const heart = document.createElement("i");
      const threshold = i * 2;
      heart.textContent = "♥";
      if (affection >= threshold + 2) heart.className = "is-active";
      else if (affection === threshold + 1) heart.className = "is-half";
      elements.affectionHearts.appendChild(heart);
    }
    elements.affectionHearts.setAttribute("aria-label", `윤서 호감도 ${affection} / 10`);
  }

  function saveGame() {
    if (activeScreen !== "game") return;
    writeStorage(SAVE_KEY, state);
    updateContinueButton();
  }

  function showEnding(endingId) {
    const ending = endings[endingId];
    if (!ending) return;

    const unlocked = new Set(readStorage(ENDINGS_KEY, []));
    unlocked.add(endingId);
    writeStorage(ENDINGS_KEY, [...unlocked]);
    if (endingId === "dawn") {
      applyUnlocks([
        { type: "photo", id: "first-real-date" },
        { type: "achievement", id: "true-dawn" },
      ]);
    }
    removeStorage(SAVE_KEY);
    audio.chime("ending");
    renderer.setScene(ending.scene, endingId === "dawn" ? "seo" : null, endingId === "dawn" ? "smile" : "neutral");

    elements.endingEyebrow.textContent = ending.eyebrow;
    elements.endingTitle.textContent = ending.title;
    elements.endingSubtitle.textContent = ending.subtitle;
    elements.endingBody.textContent = ending.body;
    elements.endingCount.textContent = `ENDING ARCHIVE ${unlocked.size} / ${ENDING_ORDER.length}`;
    updateEndingBadges();
    updateContinueButton();

    transitionTo(() => changeScreen("ending"));
  }

  function updateEndingBadges() {
    const unlocked = new Set(readStorage(ENDINGS_KEY, []));
    elements.endingBadges.innerHTML = "";
    ENDING_ORDER.forEach((endingId, index) => {
      const badge = document.createElement("span");
      badge.className = `ending-badge${unlocked.has(endingId) ? " is-found" : ""}`;
      badge.textContent = unlocked.has(endingId) ? String(index + 1).padStart(2, "0") : "??";
      badge.title = unlocked.has(endingId) ? endings[endingId].title : "아직 발견하지 못한 엔딩";
      elements.endingBadges.appendChild(badge);
    });
  }

  function updateContinueButton() {
    const saved = readStorage(SAVE_KEY, null);
    elements.continueButton.disabled = !saved || !STORY[saved.node];
  }

  function openModal(modal) {
    closeAllModals();
    modal.classList.add("is-open");
    const focusTarget = modal.querySelector("button, input");
    if (focusTarget) window.setTimeout(() => focusTarget.focus(), 50);
    if (modal === elements.logModal) renderLog();
  }

  function closeAllModals() {
    document.querySelectorAll(".modal.is-open").forEach((modal) => modal.classList.remove("is-open"));
  }

  function anyModalOpen() {
    return Boolean(document.querySelector(".modal.is-open"));
  }

  function renderLog() {
    elements.logContent.innerHTML = "";
    if (!state.history.length) {
      elements.logContent.innerHTML = '<p class="empty-log">아직 기록된 대화가 없습니다.</p>';
      return;
    }
    state.history.forEach((entry) => {
      const item = document.createElement("article");
      item.className = `log-entry${entry.choice ? " is-choice" : ""}`;
      const speaker = document.createElement("span");
      const text = document.createElement("p");
      speaker.textContent = entry.speaker;
      text.textContent = entry.text;
      item.append(speaker, text);
      elements.logContent.appendChild(item);
    });
    elements.logContent.scrollTop = elements.logContent.scrollHeight;
  }

  function toggleSound() {
    settings.sound = !settings.sound;
    if (settings.sound) {
      audio.start();
      audio.setMuted(false);
      audio.chime("soft");
    } else {
      audio.setMuted(true);
    }
    writeStorage(SETTINGS_KEY, settings);
    updateSoundUI();
  }

  function updateSoundUI() {
    elements.soundIcon.textContent = settings.sound ? "♫" : "×";
    elements.soundToggleButton.textContent = settings.sound ? "ON" : "OFF";
    elements.soundToggleButton.classList.toggle("is-off", !settings.sound);
    document.querySelectorAll('[data-action="toggle-sound"]').forEach((button) => {
      button.setAttribute("aria-label", settings.sound ? "소리 끄기" : "소리 켜기");
    });
  }

  function showToast(message) {
    if (!elements.toast) return;
    window.clearTimeout(toastTimer);
    elements.toast.textContent = message;
    elements.toast.classList.add("is-visible");
    toastTimer = window.setTimeout(() => elements.toast.classList.remove("is-visible"), 1900);
  }

  function goToTitle() {
    closeAllModals();
    window.cancelAnimationFrame(typingFrame);
    stopMinigame();
    renderer.setScene("title", null, "neutral");
    transitionTo(() => {
      changeScreen("title");
      updateContinueButton();
      updateEndingBadges();
    });
  }

  function handleAction(action) {
    const actions = {
      "new-game": requestNewGame,
      "confirm-new": startNewGame,
      continue: continueGame,
      "open-settings": () => openModal(elements.settingsModal),
      "open-log": () => openModal(elements.logModal),
      "open-collection": () => {
        renderCollection();
        openModal(elements.collectionModal);
      },
      "open-menu": () => openModal(elements.pauseModal),
      "close-modal": closeAllModals,
      "toggle-sound": toggleSound,
      restart: startNewGame,
      "go-title": goToTitle,
    };
    if (actions[action]) actions[action]();
  }

  function onKeyDown(event) {
    if (event.repeat && minigameState) return;
    if (event.key === "m" || event.key === "M") {
      toggleSound();
      return;
    }

    if (event.key === "Escape") {
      if (anyModalOpen()) closeAllModals();
      else if (activeScreen === "game") openModal(elements.pauseModal);
      return;
    }

    if (anyModalOpen()) return;

    if (activeScreen === "game" && minigameState && /^[1-4]$/.test(event.key)) {
      const button = elements.minigameControls.querySelectorAll(".minigame-action")[
        Number(event.key) - 1
      ];
      if (button && !button.disabled) button.click();
      return;
    }

    if (activeScreen === "game" && /^[1-4]$/.test(event.key) && !typing) {
      const button = elements.choicePanel.querySelectorAll(".choice-button")[Number(event.key) - 1];
      if (button && !button.disabled) button.click();
      return;
    }

    if (activeScreen === "game" && (event.key === "Enter" || event.code === "Space")) {
      event.preventDefault();
      if (minigameState) {
        const primary = elements.minigameControls.querySelector(
          ".minigame-action[data-minigame-primary='true']:not(:disabled)",
        );
        if (primary) primary.click();
        return;
      }
      advanceStory();
    }
  }

  elements.app.addEventListener("click", (event) => {
    const actionButton = event.target.closest("[data-action]");
    if (actionButton) {
      event.stopPropagation();
      handleAction(actionButton.dataset.action);
      return;
    }
    if (event.target.classList.contains("modal")) {
      closeAllModals();
      return;
    }
    if (activeScreen === "game") advanceStory();
  });
  elements.schedulePanel.addEventListener("click", (event) => event.stopPropagation());
  elements.phoneMessages.addEventListener("click", (event) => event.stopPropagation());
  elements.minigamePanel.addEventListener("click", (event) => event.stopPropagation());

  elements.textSpeed.addEventListener("input", (event) => {
    settings.textSpeed = Number(event.target.value);
    writeStorage(SETTINGS_KEY, settings);
  });

  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && activeScreen === "game" && !anyModalOpen()) openModal(elements.pauseModal);
  });

  function initialize() {
    validateStory();
    settings.textSpeed = Math.max(8, Math.min(46, Number(settings.textSpeed) || defaultSettings.textSpeed));
    settings.sound = settings.sound !== false;
    elements.textSpeed.value = String(settings.textSpeed);
    updateSoundUI();
    updateEndingBadges();
    if (new Set(readStorage(ENDINGS_KEY, [])).has("dawn")) {
      applyUnlocks(
        [
          { type: "photo", id: "first-real-date" },
          { type: "achievement", id: "true-dawn" },
        ],
        { quiet: true },
      );
    }
    updateContinueButton();
    updateStatusUI();
    updateCollectionCount();
    renderer.setScene("title", null);
  }

  initialize();
})();
