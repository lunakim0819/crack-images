/* =========================================================
   [이미지 넣는 법] 사진을 assets/images/ 폴더에 넣고 경로를 적으세요.
     계정:   avatar: 'assets/images/haneul.jpg', banner: 'assets/images/haneul-banner.jpg'
     게시글: image: 'assets/images/sunset.jpg'   (적으면 이미지 칸이 자동으로 생김)
     답글:   image: 'assets/images/reply1.jpg'
   경로를 비워 두거나 파일이 없으면 '이미지 없음' 빈 칸이 보입니다.
   ========================================================= */
/* =========================================================
   데모 데이터 — 여기만 고치면 내용이 바뀝니다.
   - accounts: 계정 목록 (id는 영문, 주소에 쓰임)
   - posts: 게시글. media = 이미지 칸 개수(0이면 없음)
   - replies: 답글. postId = 어느 게시글의 답글인지
   이미지는 나중에 넣을 수 있도록 지금은 '이미지 없음' 칸으로 표시
   ========================================================= */
const ME = 'me'; // 보는 사람(나) 계정 id

const accounts = {
  me:    { name: '구독', handle: 'viewer', bio: '구독계', following: 2, followers: 2, avatar: 'assets/images/sample-avatar.svg', banner: 'assets/images/sample-landscape.svg' },
  haneul:{ name: '현이', handle: 'woo_hyun26', avatar: 'assets/images/KJ_25-5.png', bio: '오프는 VIP랑만 해요~ #섹트 #걸레', following: 180, followers: 12430 , location: '서울', joined: '2021년 2월' , banner: 'assets/images/KK.png'},
  dain:  { name: 'W', handle: 'jin23', bio: '경험 없어요,, DM 환영.. #23 #마조 #처녀', following: 27, followers: 650, avatar: 'assets/images/KJ_19.png',location: '인천', joined: '2026년 10월' , banner: 'assets/images/KK.png'},
  min: { name: '20살', handle: 'qwaaps', following: 181, followers: 25, avatar: 'assets/images/sample-avatar.svg',banner: 'assets/images/sample-landscape.svg' },
  mini: { name: '진', handle: 'esrplqqqe', following: 287, followers: 12, avatar: 'assets/images/sample-avatar.svg',banner: 'assets/images/sample-landscape.svg' },
  yul:   { name: 'nina', handle: 'ninini02', bio: '서울 거주중.', following: 240, followers: 6, avatar: 'assets/images/sample-avatar.svg',banner: 'assets/images/sample-landscape.svg' },
};

// 팔로잉 피드에 보일 계정
const followingIds = ['haneul', 'dain'];

const posts = [
  { id: 'p1', author: 'haneul', time: '10분전', text: '오늘 만날 사람? #번개 #기승위', media: 1 , image: 'assets/images/KJ_25.png', likesBase: 59, rpBase: 14, views: 580},
  { id: 'p2', author: 'dain',   time: '20분전', text: '옷 위로 만지다가 사진 찍음.. 너무 커진 것 같은데 어쩌지.. #섹트 #자위', image: 'assets/images/KJ_21.png', media: 1 , likesBase: 15, rpBase: 47, views: 1200},
  { id: 'p3', author: 'haneul', time: '어제', text: '오늘은 호텔에서 VIP 형들이랑~~ #섹트 #서울 #오프 #아헤가오', media: 1 , image: 'assets/images/KJ_25-4.png' , likesBase: 7680, rpBase: 482, views: 15000},
  { id: 'p4', author: 'haneul', time: '어제', text: '다음 VIP 형들 만날 장소 추천 받아요~ 사람 많은 동네면 좋겠어ㅎㅎ #섹트', media: 0 },
  { id: 'p5', author: 'dain',   time: '어제', text: '주말 장보기 리스트 공유합니다. 양파, 두부, 애호박, 버섯.. 현모양처가 꿈,,', media: 0 },
  { id: 'p6', author: 'dain',    time: '어제', text: '오늘 젖꼭지로만 드라이 오르가즘 10번 연속 달성했어요,, 변태 같다고 괴롭힘 당한 다음에 칭찬 받고싶다... #섹트 #게이 #마조 #로망트', media: 1 , image: 'assets/images/KJ_23.png', media: 1 , likesBase: 238, rpBase: 43, views: 3890 },
  { id: 'p7', author: 'haneul', time: '2일', text: '열심히 운동 하는중ㅋㅎ.', media: 1 , image: 'assets/images/KJ_25-1.png' , likesBase: 890, rpBase: 176, views: 5600},
  { id: 'p8', author: 'dain',   time: '3일', text: '오늘은 처음 케이크 만들었음.. 요리는 즐거워..!', media: 0 },
  { id: 'p9', author: 'dain',    time: '4일', text: '공중화장실 칸막이 안에서... 안에 아무것도 안 입어서 지퍼 내리니까 가슴 다 나왔어,, 누가 들어올까 봐 계속 문 보면서 만지다가 사진만 찍고 바로 지퍼 올림. #섹트 #노출 #가슴 #변남 #멜섭', media: 1 , image: 'assets/images/KJ_20.png', likesBase: 2598, rpBase: 160, views: 12000},
  { id: 'p9', author: 'dain',    time: '4일', text: '새로 찾은 노출 코스 오늘 갈 예정이라 설레네... 들켜보고싶다.. #노출 #섹트', media: 0, likesBase: 24, rpBase: 2, views: 2500  },
  { id: 'p10', author: 'haneul',    time: '5일', text: '형, 누나들 신작에서 현이가 박아달라고 조르는 중이야❤️‍🔥 #섹트 #온리팬스 #절정',image: 'assets/images/KJ_25-2.png', media: 1, likesBase: 5680, rpBase: 452, views: 23100  },
  { id: 'p11', author: 'dain',    time: '6일', text: '침대에 강아지 패드 깔고 혼자.. #섹트 #자위',image: 'assets/images/KJ_24.png', media: 1, likesBase: 320, rpBase: 61, views: 1900  },
];

// 답글. rootPostId = 어느 게시글 아래인지, parentId = 바로 위 답글 id (게시글에 직접 단 답글이면 null)
const replies = [
  { id: 'r1', rootPostId: 'p1', parentId: null, author: 'min',    text: '형 진짜 꼴린다' },
  { id: 'r2', rootPostId: 'p1', parentId: 'r1', author: 'haneul', text: 'ㅋㅋ 더 보고 싶으면 가입해!!' },
  { id: 'r9', rootPostId: 'p1', parentId: 'r2', author: 'min',    text: '내 사이즈 평가 해줄거?' },
  { id: 'r11', rootPostId: 'p1', parentId: null, author: 'mini',  text: '우현이형 이번 신작 레전드ㅋㅋ' },
  { id: 'r3', rootPostId: 'p2', parentId: null, author: 'mini', text: '와 만지고 싶다..' },
  { id: 'r12', rootPostId: 'p2', parentId: null, author: 'yul',    text: '엥 근데 님ㄱㅇㅈ임?' },
  { id: 'r13', rootPostId: 'p2', parentId: 'r12', author: 'dain',    text: '...혹시 무슨말이죠 그게ㅠㅠ' },
  { id: 'r4', rootPostId: 'p2', parentId: null, author: 'min',   text: '가슴 존나 크네' },
  { id: 'r5', rootPostId: 'p3', parentId: null, author: 'yul',    text: 'DM 봐줘요' },
  { id: 'r6', rootPostId: 'p3', parentId: null, author: 'min',   text: '형 나랑도 섹데 해줘ㅠㅠ' },
  { id: 'r7', rootPostId: 'p9', parentId: null, author: 'yul',    text: '변남ㅋㅋ' },
  { id: 'r8', rootPostId: 'p9', parentId: null, author: 'min', text: '능욕 시켜주고 싶다' },
  { id: 'r8', rootPostId: 'p6', parentId: null, author: 'min', text: '이걸로 3번 뻄' },
  { id: 'r14', rootPostId: 'p10', parentId: null, author: 'mini', text: '존나 야하다' },
];

// 알림 (가상). type: follow | like | mention | reply, target = 게시글/답글 id
const notifications = [
  { id: 'n1', type: 'follow',  actor: 'yul',    time: '20분' },
  { id: 'n2', type: 'like',    actor: 'dain',   time: '2시간' },
  { id: 'n4', type: 'reply',   actor: 'dain',   time: '어제' },
  { id: 'n5', type: 'like',    actor: 'haneul',  time: '2일' },
  { id: 'n6', type: 'follow',  actor: 'dain',   time: '5일' },
];

// 쪽지 (가상). with = 상대 계정 id, from = 보낸 사람, at = 시간(ISO)
const chats = [
  { with: 'haneul', messages: [
    { from: 'me',     text: '안녕하세요', at: '2026-11-06T19:14' },
    { from: 'haneul', text: '네~', at: '2026-11-07T21:02' },
  ]},
  { with: 'dain', messages: [
    { from: 'me',   text: '노출 어디서 하셨어요?', at: '2026-11-05T12:30' },
    { from: 'dain', text: '공원 화장실에서 했어요,,', at: '2026-11-05T13:01' },
    { from: 'dain', text: '', image: 'assets/images/KJ_22.png', at: '2026-11-05T13:01' },
    { from: 'dain', text: '이건 바닥에 앉아서 찍었어요..', at: '2026-11-05T13:01' },
  ]},
  { with: 'yul', messages: [
    { from: 'yul', text: '안녕하세요 혹시 W님이랑 아는 사이세요?', at: '2026-11-08T08:45' },
  ]},
];
/* ===================== 데이터 끝 ===================== */
