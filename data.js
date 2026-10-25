/* =========================================================
 * data.js — 모든 문구 / 날짜 / 비밀번호 / 타이밍 설정
 * 이 파일만 고치면 사이트 내용을 바꿀 수 있어요.
 * ========================================================= */
window.PHONE_DATA = {
  // 잠금화면 / 상태바에 표시할 시간과 날짜
  clock: "9:41",
  dateText: "10월 28일 수요일",
  password: "0826",

  // 잠금화면 알림
  lockNotification: { app: "디데이", text: "200일 축하드려요! 🎉", time: "방금" },

  // 위젯
  calendarWidget: { month: "10월", day: 28, weekday: "수요일" },
  weather: { location: "아이기스", temp: "9℃", desc: "맑음" },

  // 카톡 알림 트리거 (ms)
  kakaoNotifyDelay: 10000,
  bannerHideDelay: 5000,

  // 카톡
  kakao: {
    partnerName: "파트너",
    banner: "너 설마 까먹은 거 아니지?",
    messages: [
      { type: "date", text: "2026년 10월 26일 월요일" },
      { from: "them", image: "images/puppy.jpg", time: "오후 10:12" },
      { from: "them", text: "너 닮았어", time: "오후 10:12" },
      { from: "me", text: "뭐래", time: "오후 10:15" },
      { from: "me", text: "내가 저런 강아지처럼 보이냐?", time: "오후 10:15" },
      { from: "me", text: "이상한 카톡 보낼 시간 있으면 안기기나 해", time: "오후 10:16" },
      { type: "date", text: "2026년 10월 28일 수요일" },
      { from: "them", text: "너 설마 까먹은 거 아니지?", time: "오전 9:41" },
    ],
    draft: "그럴 리가. 200일 동안 함께해줘서 고마워, 파트너.",
    replies: [
      { delay: 1500, text: "ㅎㅎ" },
      { delay: 2000, text: "쑥스럽게… 나도 사랑해 태양아!!" },
    ],
    otherChats: [
      { name: "엄마", text: "밥은 먹었니?", time: "어제" },
      { name: "동기 단톡방", text: "이번 주 모임 어디서 해?", time: "어제" },
    ],
  },

  // 더미 앱 내용
  instagram: [
    { user: "partner_sun", caption: "오늘 하늘 맑음 ☀️", color: "#f6c9a8" },
    { user: "cafe_daily", caption: "가을 신메뉴 출시 🍂", color: "#e8d5b5" },
    { user: "travel.kr", caption: "단풍 명소 추천 🍁", color: "#f2a98e" },
  ],
  memos: [
    { title: "200일 준비 ✔", body: "꽃다발 예약, 편지 쓰기, 레스토랑 7시" },
    { title: "장보기", body: "우유, 계란, 사과" },
    { title: "읽을 책", body: "『작별하지 않는다』" },
  ],
  calendarEvents: { 28: "200일 🎉", 26: "강아지 사진" },
  settings: ["Wi-Fi", "Bluetooth", "알림", "소리 및 진동", "디스플레이", "배터리", "개인정보 보호", "일반"],
  youtube: [
    { title: "200일 기념 브이로그 | 우리의 하루", channel: "커플로그", color: "#f3b9a0" },
    { title: "가을 감성 플레이리스트 🍂", channel: "Music Lab", color: "#e7c79a" },
    { title: "강아지 잠자는 영상 10시간", channel: "Puppy TV", color: "#cfc6bd" },
  ],
  gallery: ["images/dday.jpg", "images/puppy.jpg"],
};
