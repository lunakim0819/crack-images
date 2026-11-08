// MOA 데모 동작 코드. 내용만 바꿀 거면 js/data.js 를 고치세요.
// 게시글 기본 숫자(가상): views/likes/reposts 없으면 자동 생성
// image 경로가 있으면 media 칸 자동 표시
posts.forEach(p => { if (p.image) p.media = 1; });
posts.forEach((p, i) => { p.views ??= 120 + i * 37; p.likesBase ??= 3 + (i * 5) % 17; p.rpBase ??= (i * 3) % 7; });
// 프로필 위치(location)·가입일(joined)은 선택 항목: 비어 있으면 표시 안 함
const clean = v => (typeof v === 'string' || typeof v === 'number') ? String(v).trim() : '';
// 답글 정규화 (예전 형식 postId만 있어도 작동)
function normReply(r, i){ if (r.image) r.media = 1; r.rootPostId ??= r.postId; r.postId = r.rootPostId; r.parentId ??= null; r.time ??= (i % 9 + 1) + '시간'; r.views ??= 20 + i * 11; r.likesBase ??= i % 5; r.rpBase ??= 0; r.isReply = true; return r; }
replies.forEach(normReply);

// ---- 아이콘 (직접 그린 단순 SVG) ----
const P = {
  home:'<path d="M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  bell:'<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 21h4"/>',
  chat:'<path d="M4 5h16v11H10l-4 4v-4H4z"/>',
  mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>',
  mark:'<path d="M6 3h12v18l-6-4-6 4z"/>',
  reply:'<path d="M4 5h16v11H9l-5 4z"/>',
  rp:'<path d="M7 4 4 7l3 3"/><path d="M4 7h11a4 4 0 0 1 4 4v1"/><path d="m17 20 3-3-3-3"/><path d="M20 17H9a4 4 0 0 1-4-4v-1"/>',
  heart:'<path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z"/>',
  views:'<path d="M5 20V12M10 20V6M15 20v-9M20 20V9"/>',
  share:'<path d="M12 15V3"/><path d="m7 8 5-5 5 5"/><path d="M5 13v7h14v-7"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  back:'<path d="M19 12H5"/><path d="m11 6-6 6 6 6"/>',
  gear:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/>',
  at:'<circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 5 0v-1a9 9 0 1 0-4 7.5"/>',
  phone:'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z"/>',
  video:'<rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3"/>',
  send:'<path d="M12 19V5"/><path d="m6 11 6-6 6 6"/>',
  down:'<path d="m6 9 6 6 6-6"/>',
  more:'<circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/>',
  pin:'<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  cal:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  quote:'<path d="M4 20l1-4L16 5l3 3L8 19z"/>',
  close:'<path d="M6 6l12 12M18 6 6 18"/>',
  left:'<path d="m15 6-6 6 6 6"/>', right:'<path d="m9 6 6 6-6 6"/>',
  img:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 17-5-5-9 8"/>',
  moa:'<circle cx="12" cy="12" r="9"/><path d="M7.5 16V8.5l4.5 5 4.5-5V16"/>', // 오리지널 MOA 심볼
};
const ic = k => `<svg viewBox="0 0 24 24" aria-hidden="true">${P[k]}</svg>`;

// ---- 저장 ----
const KEY = 'moa-demo-state-v1';
function load(){ try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch(e){ return {}; } }
const st = Object.assign({ likes:{}, marks:{}, reposts:{}, follows:null, mine:[] }, load());
if (!st.follows) { st.follows = {}; followingIds.forEach(id => st.follows[id] = true); }
if (!Array.isArray(st.myReplies)) st.myReplies = [];
if (!st.chats || typeof st.chats !== 'object') st.chats = {};   // { 계정id: [내가 보낸 메시지] }
if (!st.prefs) st.prefs = { likes: true };
st.myReplies.forEach((r, i) => { if (!replies.find(x => x.id === r.id)) replies.push(normReply(r, i)); });
st.mine.forEach(p => { if (!posts.find(x => x.id === p.id)) posts.unshift(p); });
function save(){ try { localStorage.setItem(KEY, JSON.stringify(st)); } catch(e){} }

const app = document.getElementById('app'), layer = document.getElementById('layer');
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// 본문 표시: 먼저 원문에서 #해시태그를 찾고, 나머지는 안전하게 이스케이프 (저장된 원문은 그대로)
// #한국어 #English #태그123 #under_score 인식, '#' 단독·단어 중간의 #은 무시
const TAG = /#[\p{L}\p{N}_]+/gu;
function fmt(s){
  s = String(s ?? ''); let out = '', last = 0;
  for (const m of s.matchAll(TAG)) {
    const prev = s[m.index - 1];
    if (prev && /[\p{L}\p{N}_&]/u.test(prev)) continue;
    out += esc(s.slice(last, m.index)) + `<span class="tag">${esc(m[0])}</span>`; last = m.index + m[0].length;
  }
  return out + esc(s.slice(last));
}
const acc = id => accounts[id] || { name:'알 수 없음', handle:'unknown', bio:'', following:0, followers:0 };
const go = h => { location.hash = h; };
// 이미지 칸: src(이미지 경로)가 있으면 사진, 없거나 못 찾으면 '이미지 없음' 글자만 보임
const imgTag = src => src ? `<img src="${esc(src)}" alt="" loading="lazy" onerror="this.parentNode.classList.remove('has');this.remove()">` : '';
// src가 있으면 'has' 클래스: 게시글·답글 사진은 원본 비율/크기 그대로 표시 (style.css 참고)
const ph = (label='이미지 없음', cls='', src='') => `<div class="ph ${cls} ${src ? 'has' : ''}" role="img" aria-label="${label}">${imgTag(src)}<span>${label}</span></div>`;
const mph = it => ph('이미지 없음', '', it.image);
const avIn = id => `${imgTag(acc(id).avatar)}<i>없음</i>`;
const item = id => posts.find(p => p.id === id) || replies.find(r => r.id === id);
const link = it => (it.isReply ? '#/r/' : '#/p/') + it.id;
const replyCount = id => posts.some(p => p.id === id) ? replies.filter(r => r.rootPostId === id).length : replies.filter(r => r.parentId === id).length;
const kids = (pid, parent) => replies.filter(r => r.rootPostId === pid && r.parentId === parent);
const chain = r => [r].concat(...kids(r.rootPostId, r.id).map(chain)); // 답글 + 모든 하위 답글(깊이 우선)
const toHandle = r => acc((item(r.parentId) || posts.find(p => p.id === r.rootPostId) || {}).author).handle;
const num = n => n >= 10000 ? (n/10000).toFixed(1).replace('.0','') + '만' : n >= 1000 ? (n/1000).toFixed(1).replace('.0','') + '천' : String(n);
const avatarBtn = (id, cls='') => `<button class="av ${cls}" data-go="#/u/${id}" aria-label="${esc(acc(id).name)} 프로필">${avIn(id)}</button>`;

function counts(p){ return { like:p.likesBase + (st.likes[p.id]?1:0), rp:p.rpBase + (st.reposts[p.id]?1:0) }; }
function actsHTML(p, cls='acts'){
  const l = !!st.likes[p.id], m = !!st.marks[p.id], r = !!st.reposts[p.id], c = counts(p), d = cls !== 'acts';
  return `<div class="${cls}">
    <button class="act r" data-reply="${p.id}" aria-label="답글 ${replyCount(p.id)}">${ic('reply')}${d?'':replyCount(p.id)}</button>
    <button class="act rp ${r?'on':''}" data-rpmenu="${p.id}" aria-pressed="${r}" aria-label="재게시 ${c.rp}">${ic('rp')}${d?'':c.rp}</button>
    <button class="act l ${l?'on':''}" data-like="${p.id}" aria-pressed="${l}" aria-label="마음에 들어요 ${c.like}">${ic('heart')}${d?'':c.like}</button>
    ${d?'':`<button class="act v" data-go="${link(p)}" aria-label="조회수 ${p.views}">${ic('views')}${num(p.views)}</button>`}
    <span class="grp"><button class="act m ${m?'on':''}" data-mark="${p.id}" aria-pressed="${m}" aria-label="북마크">${ic('mark')}</button>
    <button class="act s" data-share="${p.id}" aria-label="공유">${ic('share')}</button></span></div>`;
}
function postHTML(p){
  const a = acc(p.author);
  return `<article class="post" data-post="${p.id}" tabindex="0">
    ${avatarBtn(p.author)}
    <div class="body">
      <div class="meta"><button class="name" data-go="#/u/${p.author}">${esc(a.name)}</button>
      <span class="handle">@${esc(a.handle)}</span><span class="time">· ${esc(p.time)}</span></div>
      <div class="txt">${fmt(p.text)}</div>
      ${p.media ? mph(p) : ''}
      ${actsHTML(p)}
    </div></article>`;
}
// 스레드 한 줄: 왼쪽 아바타 열 + 세로 연결선
function threadRow(it, o = {}){
  const a = acc(it.author);
  return `<article class="post th ${o.from?'from':''} ${o.line?'':'end'} ${o.branch?'branch':''}" data-open="${link(it)}" tabindex="0">
    <div class="col">${avatarBtn(it.author)}${o.line?'<span class="line"></span>':''}</div>
    <div class="body">
      <div class="meta"><button class="name" data-go="#/u/${it.author}">${esc(a.name)}</button>
      <span class="handle">@${esc(a.handle)}</span><span class="time">· ${esc(it.time)}</span></div>
      ${it.isReply ? `<div class="rto">@${esc(toHandle(it))} 님에게 보내는 답글</div>` : ''}
      <div class="txt">${fmt(it.text)}</div>
      ${it.media ? mph(it) : ''}
      ${actsHTML(it)}
    </div></article>`;
}
// 독립된 답글 묶음마다 구분선, 묶음 안은 연결선
function chainsHTML(tops){
  return tops.map(t => { const c = chain(t); return c.map((r, i) => threadRow(r, { from: i > 0, line: i < c.length - 1, branch: i > 0 && r.parentId !== c[i-1].id })).join(''); }).join('');
}
const list = (arr, msg='게시물이 없어요.') => arr.length ? arr.map(postHTML).join('') : `<div class="empty">${msg}</div>`;

// ---- 화면 ----
function viewFeed(tab){
  const arr = tab === 'all' ? posts : posts.filter(p => st.follows[p.author] || p.author === ME);
  app.innerHTML = `<div class="top"><div class="bar" style="position:relative">
      <button class="av sm" data-go="#/u/me" aria-label="내 프로필">${avIn(ME)}</button>
      <span class="logo" aria-label="MOA">${ic('moa')}</span></div>
    <div class="tabs" role="tablist">
      <button class="tab ${tab==='all'?'on':''}" role="tab" aria-selected="${tab==='all'}" data-go="#/feed/all">추천</button>
      <button class="tab ${tab!=='all'?'on':''}" role="tab" aria-selected="${tab!=='all'}" data-go="#/feed">팔로잉</button>
    </div></div>${list(arr, '팔로잉한 계정이 없어요.')}`;
}

const EMPTY = `<div class="empty big"><h2>아직 게시물이 없습니다</h2></div>`;
function viewProfile(id, tab='posts'){
  const a = acc(id), isMe = id === ME, f = !!st.follows[id];
  const mine = posts.filter(p => p.author === id);
  let content;
  if (tab === 'media') {
    const m = mine.filter(p => p.media);
    content = !m.length ? EMPTY : `<div class="grid">${m.map((p,i)=>`<button data-media="${id}:${i}" aria-label="미디어 ${i+1} 크게 보기">${mph(p)}</button>`).join('')}</div>`;
  } else if (tab === 'replies') {
    const rs = replies.filter(r => r.author === id);
    content = rs.length ? rs.map(r => threadRow(r)).join('') : EMPTY;
  } else if (tab === 'likes') {
    const lk = posts.filter(p => st.likes[p.id]).map(postHTML).concat(replies.filter(r => st.likes[r.id]).map(r => threadRow(r)));
    content = lk.length ? lk.join('') : EMPTY;
  } else content = mine.length ? mine.map(postHTML).join('') : EMPTY;
  const base = followingIds.includes(id);
  const followers = a.followers + (f && !base ? 1 : 0) - (!f && base ? 1 : 0);
  app.innerHTML = `<div class="pbanner ${isMe?'mine':''}" role="img" aria-label="배너 이미지">${imgTag(a.banner)}<span>배너 이미지 없음</span>
      <button class="cbtn cb-back" data-back aria-label="뒤로">${ic('back')}</button>
      <button class="cbtn cb-s" data-nav="search" aria-label="검색">${ic('search')}</button>
      <button class="cbtn cb-m" data-moremenu="${id}" aria-label="더보기">${ic('more')}</button></div>
    <div class="prof"><div class="prow"><div class="av bigav" role="img" aria-label="프로필 이미지">${avIn(id)}</div>
      ${isMe ? `<div class="pbtns"><button class="obtn" data-reset>데모 저장 데이터 초기화</button><button class="obtn" data-toast="로컬 데모라 프로필 수정은 지원하지 않아요">프로필 수정</button></div>`
        : `<div class="pbtns"><button class="obtn ic" data-dm="${id}" aria-label="쪽지">${ic('mail')}</button>
        <button class="follow ${f?'on':''}" data-follow="${id}" aria-pressed="${f}">${f?'팔로잉':'팔로우'}</button></div>`}</div>
      <div class="pname">${esc(a.name)}</div><div class="handle">@${esc(a.handle)}</div>
      <p class="bio" style="margin:10px 0 0">${fmt(a.bio)}</p>
      ${(() => { const loc = clean(a.location), jn = clean(a.joined);
        return (loc || jn) ? `<div class="pmeta">${loc ? `<span class="joined">${ic('pin')}${esc(loc)}</span>` : ''}${jn ? `<span class="joined">${ic('cal')}가입일: ${esc(jn)}</span>` : ''}</div>` : ''; })()}
      <div class="counts"><span><b>${num(a.following)}</b> 팔로우 중</span><span><b>${num(followers)}</b> 팔로워</span></div>
    </div>
    <div class="tabs ptabs" role="tablist">${[['posts','게시물'],['replies','답글'],['media','미디어'],['likes','마음에 들어요']].map(([k,l]) =>
      `<button class="tab ${tab===k?'on':''}" role="tab" aria-selected="${tab===k}" data-go="#/u/${id}/${k}">${l}</button>`).join('')}</div>
    ${content}`;
}

function viewPost(pid){
  const p = posts.find(x => x.id === pid);
  if (!p) { app.innerHTML = `<div class="empty">게시물을 찾을 수 없어요.</div>`; return; }
  const a = acc(p.author), c = counts(p), tops = kids(pid, null);
  app.innerHTML = `<div class="top"><div class="bar c"><button data-back aria-label="뒤로" class="act">${ic('back')}</button><h1>게시</h1></div></div>
    <div class="detail" data-detail="${p.id}">
      <div class="dhead">${avatarBtn(p.author)}<div><button class="name" data-go="#/u/${p.author}">${esc(a.name)}</button><div class="handle">@${esc(a.handle)}</div></div></div>
      <div class="dtxt">${fmt(p.text)}</div>
      ${p.media ? mph(p) : ''}
      <div class="dmeta">${esc(p.time)} · <b>${num(p.views)}</b> 조회수</div>
      <div class="dmeta"><b>${c.rp}</b> 재게시 &nbsp; <b>${c.like}</b> 마음에 들어요</div>
      ${actsHTML(p, 'dacts')}
    </div>
    ${tops.length ? chainsHTML(tops) : '<div class="empty">아직 답글이 없어요. 첫 답글을 남겨보세요.</div>'}
    <div class="replybar"><button data-reply="${p.id}">답글 게시하기</button></div>`;
}

// 답글 하나에 집중한 대화: 원글 → 조상 답글 → 이 답글(크게) → 하위 답글
function viewConv(rid){
  const r = replies.find(x => x.id === rid), p = r && posts.find(x => x.id === r.rootPostId);
  if (!r || !p) { app.innerHTML = `<div class="top"><div class="bar c"><button data-back aria-label="뒤로" class="act">${ic('back')}</button><h1>게시</h1></div></div><div class="empty">답글을 찾을 수 없어요.</div>`; return; }
  const anc = []; let cur = r; while (cur.parentId && (cur = item(cur.parentId))) anc.unshift(cur);
  const up = [p].concat(anc), a = acc(r.author), c = counts(r), tops = kids(p.id, r.id);
  app.innerHTML = `<div class="top"><div class="bar c"><button data-back aria-label="뒤로" class="act">${ic('back')}</button><h1>게시</h1></div></div>
    ${up.map((it, i) => threadRow(it, { from: i > 0, line: true })).join('')}
    <div class="detail focus" data-detail="${r.id}">
      <div class="dhead"><div class="col">${avatarBtn(r.author)}</div><div><button class="name" data-go="#/u/${r.author}">${esc(a.name)}</button><div class="handle">@${esc(a.handle)}</div></div></div>
      <div class="rto">@${esc(toHandle(r))} 님에게 보내는 답글</div>
      <div class="dtxt">${fmt(r.text)}</div>
      ${r.media ? mph(r) : ''}
      <div class="dmeta">${esc(r.time)} · <b>${num(r.views)}</b> 조회수</div>
      ${actsHTML(r, 'dacts')}
    </div>
    ${tops.length ? chainsHTML(tops) : ''}
    <div class="replybar"><button data-reply="${r.id}">답글 게시하기</button></div>`;
}

function viewBookmarks(){
  app.innerHTML = `<div class="top"><div class="bar"><button data-back aria-label="뒤로" class="act">${ic('back')}</button><h1>북마크</h1></div></div>${list(posts.filter(p => st.marks[p.id]), '북마크한 게시물이 없어요.')}`;
}
// 검색 (계정 목록)
function viewSimple(kind){
  const extra = Object.keys(accounts).filter(i => i !== ME).map(i => `<div class="post" style="cursor:default;padding-bottom:12px">${avatarBtn(i)}<div class="body"><button class="name" data-go="#/u/${i}">${esc(accounts[i].name)}</button><div class="handle">@${esc(accounts[i].handle)}</div></div></div>`).join('');
  app.innerHTML = `<div class="top"><div class="bar"><h1>검색</h1></div></div><div class="empty">이 데모에서는 검색 대신 계정 목록을 보여줘요.</div>${extra}`;
}
const meBar = (title, right) => `<div class="bar c"><button class="av sm" data-go="#/u/me" aria-label="내 프로필">${avIn(ME)}</button><h1>${title}</h1><span style="margin-left:auto">${right}</span></div>`;

// ---- 알림 ----
const NTXT = { follow: '님이 회원님을 팔로우했습니다', like: '님이 회원님의 게시물을 마음에 들어 했습니다', mention: '님이 회원님을 멘션했습니다', reply: '님이 답글을 남겼습니다' };
const NICON = { follow: ['user','blue'], like: ['heart','pink'], mention: ['at','blue'], reply: ['reply','blue'] };
function viewNotifs(tab){
  const arr = notifications.filter(n => tab === 'mentions' ? (n.type === 'mention' || n.type === 'reply') : (st.prefs.likes || n.type !== 'like'));
  app.innerHTML = `<div class="top">${meBar('알림', `<button class="act" data-nsettings aria-label="알림 설정">${ic('gear')}</button>`)}
    <div class="tabs" role="tablist">
      <button class="tab ${tab!=='mentions'?'on':''}" role="tab" aria-selected="${tab!=='mentions'}" data-go="#/notifications">${ic('bell')} 모두</button>
      <button class="tab ${tab==='mentions'?'on':''}" role="tab" aria-selected="${tab==='mentions'}" data-go="#/notifications/mentions">멘션</button></div></div>
    ${arr.length ? arr.map(n => { const t = n.target && item(n.target), [i, c] = NICON[n.type], a = acc(n.actor);
      return `<article class="post nrow" data-open="${t ? link(t) : '#/u/' + n.actor}" tabindex="0">
        <div class="nic ${c}">${ic(i)}</div>
        <div class="body">${avatarBtn(n.actor, 'sm')}
          <div class="ntext"><button class="name" data-go="#/u/${n.actor}">${esc(a.name)}</button>${NTXT[n.type]} <span class="time">· ${esc(n.time)}</span></div>
          ${t ? `<div class="nsnip">${esc(t.text)}</div>` : ''}</div></article>`; }).join('') : `<div class="empty big"><h2>아직 알림이 없습니다</h2></div>`}`;
}

// ---- 쪽지 ----
function thread(id){ const s = (chats.find(c => c.with === id) || { messages: [] }).messages; return s.concat(st.chats[id] || []).slice().sort((x, y) => x.at < y.at ? -1 : 1); }
function chatIds(){ const ids = new Set(chats.map(c => c.with).concat(Object.keys(st.chats))); return [...ids].filter(i => accounts[i] && thread(i).length).sort((x, y) => { const a = thread(x).at(-1).at, b = thread(y).at(-1).at; return a < b ? 1 : -1; }); }
const pad = n => String(n).padStart(2, '0');
function tShort(iso){ const d = new Date(iso), n = new Date(); return d.toDateString() === n.toDateString() ? `${pad(d.getHours())}:${pad(d.getMinutes())}` : `${d.getMonth()+1}월 ${d.getDate()}일`; }
function tDay(iso){ const d = new Date(iso); return `${d.getFullYear()}년 ${d.getMonth()+1}월 ${d.getDate()}일`; }
function tTime(iso){ const d = new Date(iso), h = d.getHours(); return `${h < 12 ? '오전' : '오후'} ${h % 12 || 12}:${pad(d.getMinutes())}`; }
let inboxFilter = 'all', inboxQuery = '';
function inboxRows(){
  const q = inboxQuery.trim().toLowerCase();
  const ids = chatIds().filter(i => (inboxFilter === 'all' || st.follows[i]) && (!q || [acc(i).name, acc(i).handle].concat(thread(i).map(m => m.text || '')).join(' ').toLowerCase().includes(q)));
  return ids.length ? ids.map(i => { const last = thread(i).at(-1);
    return `<article class="post crow" data-open="#/messages/${i}" tabindex="0"><span class="av lg">${avIn(i)}</span><div class="body">
      <div class="meta"><span class="name">${esc(acc(i).name)}</span><span class="handle">@${esc(acc(i).handle)}</span><span class="time ctime">${tShort(last.at)}</span></div>
      <div class="handle clast">${last.from === ME ? '나: ' : ''}${clean(last.text) ? esc(last.text) : (clean(last.image) ? '사진을 보냈습니다' : '')}</div></div></article>`; }).join('') : `<div class="empty">${q ? '검색 결과가 없어요.' : '대화가 없어요.'}</div>`;
}
function viewInbox(){
  app.innerHTML = `<div class="top">${meBar('Chat', `<button class="pill" data-ifilter aria-label="대화 필터">${inboxFilter === 'all' ? '전체' : '팔로잉'} ${ic('down')}</button>`)}</div>
    <div class="sbox">${ic('search')}<input id="isearch" type="search" placeholder="검색" aria-label="쪽지 검색" value="${esc(inboxQuery)}" autocomplete="off"></div>
    <div id="ilist">${inboxRows()}</div>`;
  document.getElementById('isearch').addEventListener('input', e => { inboxQuery = e.target.value; document.getElementById('ilist').innerHTML = inboxRows(); });
}
function viewChat(id){
  if (!accounts[id] || id === ME) { app.innerHTML = `<div class="empty">대화를 찾을 수 없어요.</div>`; return; }
  const a = acc(id), msgs = thread(id), imgs = msgs.filter(m => clean(m.image)); let day = '';
  const body = msgs.map(m => { const dd = tDay(m.at), sep = dd !== day ? `<div class="dsep">${dd} ${tTime(m.at)}</div>` : ''; day = dd;
    const img = clean(m.image), txt = clean(m.text);
    if (!img && !txt) return sep;
    // image가 있으면 말풍선 안에 원본 비율로 표시, 누르면 크게 보기
    const pic = img ? `<button class="cimgbtn" data-cimg="${esc(id)}:${imgs.indexOf(m)}" aria-label="사진 크게 보기">${ph('이미지 없음', 'cimg', img)}</button>` : '';
    return `${sep}<div class="bub ${m.from === ME ? 'out' : 'in'} ${img ? 'hasimg' : ''}">${pic}${txt ? `<div class="btxt">${esc(m.text)}</div>` : ''}</div>`; }).join('');
  app.innerHTML = `<div class="top"><div class="bar c"><button data-back aria-label="뒤로" class="act">${ic('back')}</button>
      <button class="chead" data-go="#/u/${id}" aria-label="${esc(a.name)} 프로필"><span class="av sm">${avIn(id)}</span><b>${esc(a.name)}</b></button>
      <span style="margin-left:auto;display:flex"><button class="act" data-toast="로컬 데모라 통화는 지원하지 않아요" aria-label="음성 통화 (지원 안 됨)">${ic('phone')}</button><button class="act" data-toast="로컬 데모라 영상 통화는 지원하지 않아요" aria-label="영상 통화 (지원 안 됨)">${ic('video')}</button></span></div></div>
    <div class="cintro"><span class="av lg">${avIn(id)}</span><b>${esc(a.name)}</b><span class="handle">@${esc(a.handle)}</span>
      <span class="handle">${clean(a.joined) ? `가입일: ${esc(clean(a.joined))} · ` : ''}팔로워 ${num(a.followers)}명</span>
      <button class="obtn" data-go="#/u/${id}">프로필 보기</button></div>
    <div class="msgs" id="msgs">${body}</div>
    <div class="cbar"><div class="cnote">로컬 데모 · 실제 전송 안 됨</div><div class="crow2">
      <button class="act cplus" data-toast="로컬 데모라 첨부는 지원하지 않아요" aria-label="첨부 (지원 안 됨)">${ic('plus')}</button>
      <textarea id="cinput" rows="1" maxlength="1000" placeholder="쪽지" aria-label="쪽지 입력"></textarea>
      <button class="act csend" data-send="${id}" aria-label="보내기" hidden>${ic('send')}</button></div></div>`;
  const ta = document.getElementById('cinput'), sb = app.querySelector('.csend');
  ta.addEventListener('input', () => { sb.hidden = !ta.value.trim(); });
  ta.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing && e.keyCode !== 229) { e.preventDefault(); sendChat(id); } });
  try { window.scrollTo(0, document.body.scrollHeight); } catch(e){}
}
function sendChat(id){
  const ta = document.getElementById('cinput'), v = ta && ta.value.trim();
  if (!v) return toast('내용을 입력하세요');
  (st.chats[id] = st.chats[id] || []).push({ from: ME, text: v.slice(0, 1000), at: new Date().toISOString() });
  save(); viewChat(id); document.getElementById('cinput').focus();
}

// ---- 레이어(시트/뷰어/작성) ----
let vs = null, lastFocus = null;
function openLayer(html){ lastFocus = document.activeElement; layer.innerHTML = html; const f = layer.querySelector('button,textarea'); f && f.focus(); }
function closeLayer(){ if (!layer.innerHTML) return; vs = null; layer.innerHTML = ''; if (lastFocus && document.contains(lastFocus)) lastFocus.focus(); }
function sheet(rows){ openLayer(`<div class="backdrop" data-close><div class="sheet" role="dialog" aria-modal="true"><div class="grab"></div>${rows}<button class="scancel" data-close>취소</button></div></div>`); }
function drawViewer(){
  const n = vs.items.length;
  layer.innerHTML = `<div class="viewer" role="dialog" aria-modal="true" aria-label="미디어 보기">
    <button class="vbtn vclose" data-close aria-label="닫기">${ic('close')}</button>
    ${n>1?`<button class="vbtn vprev" data-vprev aria-label="이전">${ic('left')}</button>`:''}
    ${mph(vs.items[vs.i])}
    ${n>1?`<button class="vbtn vnext" data-vnext aria-label="다음">${ic('right')}</button>`:''}
    <div class="vcap">${vs.i+1} / ${n}${vs.items[vs.i].text ? ' · ' + esc(vs.items[vs.i].text) : ''}</div></div>`;
  layer.querySelector('[data-close]').focus();
}
function step(d){ if (!vs) return; const n = vs.items.length; vs.i = (vs.i + d + n) % n; drawViewer(); }
function toast(msg){ const t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role','status'); t.textContent = msg; document.body.appendChild(t); setTimeout(() => t.remove(), 1800); }

// ---- 내비게이션 ----
const NAV = [['home','#/feed','홈'],['search','#/search','검색'],['moa','#/u/me','내 프로필 (MOA)'],['bell','#/notifications','알림'],['chat','#/messages','쪽지']];
const SIDE = NAV.filter(n => n[0] !== 'moa').concat([['mark','#/bookmarks','북마크'],['user','#/u/me','프로필']]);
document.querySelector('nav.mob').innerHTML = NAV.map(([i,h,l]) => `<button data-go="${h}" aria-label="${l}">${ic(i)}</button>`).join('');
document.querySelector('nav.side').innerHTML = `<button data-go="#/feed" aria-label="MOA 홈">${ic('moa')}</button>` + SIDE.map(([i,h,l]) => `<button data-go="${h}">${ic(i)}${l}</button>`).join('');
document.querySelector('.fab').innerHTML = ic('plus');

function route(){
  layer.innerHTML = ''; vs = null;
  const h = location.hash || '#/feed', parts = h.slice(2).split('/');
  if (parts[0] === 'u') viewProfile(parts[1] || ME, parts[2]);
  else if (parts[0] === 'p') viewPost(parts[1]);
  else if (parts[0] === 'r') viewConv(parts[1]);
  else if (parts[0] === 'bookmarks') viewBookmarks();
  else if (parts[0] === 'search') viewSimple('search');
  else if (parts[0] === 'notifications') viewNotifs(parts[1]);
  else if (parts[0] === 'messages') parts[1] ? viewChat(parts[1]) : viewInbox();
  else viewFeed(parts[1]);
  document.querySelectorAll('nav [data-go]').forEach(b => { const g = b.dataset.go, on = h === g || h.startsWith(g + '/'); b.classList.toggle('on', on); on ? b.setAttribute('aria-current','page') : b.removeAttribute('aria-current'); });
  const fab = document.querySelector('.fab'); fab.style.display = (parts[0] === 'p' || parts[0] === 'r' || (parts[0] === 'messages' && parts[1])) ? 'none' : '';
  fab.setAttribute('aria-label', parts[0] === 'messages' ? '새 쪽지' : '새 게시물 (로컬)');
}
const rerender = () => { const y = window.scrollY || 0; route(); try { window.scrollTo(0, y); } catch(e){} };

document.addEventListener('click', e => {
  const t = e.target.closest('button,[data-post],[data-open],[data-close]'); if (!t) return;
  const d = t.dataset;
  if ('close' in d){ if (t.tagName === 'BUTTON' || e.target === t) closeLayer(); return; }
  if (d.like){ st.likes[d.like] = !st.likes[d.like]; save(); rerender(); }
  else if (d.mark){ st.marks[d.mark] = !st.marks[d.mark]; save(); rerender(); toast(st.marks[d.mark] ? '북마크에 추가했어요' : '북마크에서 삭제했어요'); }
  else if (d.rpmenu){ const on = st.reposts[d.rpmenu];
    sheet(`<button class="srow" data-repost="${d.rpmenu}">${ic('rp')}${on?'재게시 취소':'재게시'}</button><button class="srow" data-quote="${d.rpmenu}">${ic('quote')}인용</button>`); }
  else if (d.repost){ st.reposts[d.repost] = !st.reposts[d.repost]; save(); rerender(); toast(st.reposts[d.repost] ? '재게시했어요 (로컬)' : '재게시를 취소했어요'); }
  else if ('compose' in d && location.hash.startsWith('#/messages')){
    sheet(`<div style="padding:0 20px 8px;font-weight:800;font-size:18px">새 쪽지</div>` + Object.keys(accounts).filter(i => i !== ME).map(i => `<button class="srow" data-go="#/messages/${i}"><span class="av sm">${avIn(i)}</span>${esc(acc(i).name)} <span class="handle">@${esc(acc(i).handle)}</span></button>`).join('')); }
  else if (d.send) sendChat(d.send);
  else if ('ifilter' in d){ sheet(['all','following'].map(k => `<button class="srow" data-setfilter="${k}">${k === inboxFilter ? '✓ ' : ''}${k === 'all' ? '전체' : '팔로잉'}</button>`).join('')); }
  else if (d.setfilter){ inboxFilter = d.setfilter; route(); }
  else if ('nsettings' in d){ sheet(`<div style="padding:0 20px 8px;font-weight:800;font-size:18px">알림 설정 (이 브라우저에만 저장)</div><button class="srow" data-togglelikes aria-pressed="${st.prefs.likes}">${st.prefs.likes ? '✓' : '　'} 마음에 들어요 알림 표시</button>`); }
  else if ('togglelikes' in d){ st.prefs.likes = !st.prefs.likes; save(); route(); }
  else if (d.quote || 'compose' in d){ const q = d.quote ? item(d.quote) : null;
    openLayer(`<div class="backdrop" data-close><div class="sheet" role="dialog" aria-modal="true"><div class="grab"></div>
      <textarea aria-label="게시물 내용" maxlength="280" placeholder="${q?'의견을 덧붙이세요':'무슨 일이 일어나고 있나요?'}"></textarea>
      ${q?`<div style="margin:0 16px;padding:10px;border:1px solid var(--line);border-radius:12px;color:var(--sub)">@${esc(acc(q.author).handle)}: ${esc(q.text)}</div>`:''}
      <div style="padding:8px 16px;color:var(--sub);font-size:12px">이 브라우저에만 저장되며 어디에도 전송되지 않아요.</div>
      <button class="scancel" data-publish style="background:var(--blue);border:0;color:#fff">게시하기</button><button class="scancel" data-close>취소</button></div></div>`); }
  else if ('publish' in d){ const v = layer.querySelector('textarea').value.trim(); if (!v) return toast('내용을 입력하세요');
    const p = { id:'m' + Date.now(), author:ME, time:'방금', text:v, media:0, views:0, likesBase:0, rpBase:0 };
    st.mine.unshift(p); posts.unshift(p); save(); closeLayer(); go('#/feed'); rerender(); toast('게시했어요 (로컬)'); }
  else if (d.reply){ const tg = item(d.reply); if (!tg) return; const h = acc(tg.author).handle;
    openLayer(`<div class="backdrop" data-close><div class="sheet" role="dialog" aria-modal="true" aria-label="답글 작성"><div class="grab"></div>
      <div class="ctx"><span class="av sm">${avIn(tg.author)}</span><div><b>${esc(acc(tg.author).name)}</b> <span class="handle">@${esc(h)}</span><div class="ctxt">${esc(tg.text.length > 60 ? tg.text.slice(0, 60) + '…' : tg.text)}</div></div></div>
      <div class="rto" style="padding:0 16px">@${esc(h)} 님에게 보내는 답글</div>
      <textarea aria-label="답글 내용" maxlength="280" placeholder="답글을 입력하세요">${tg.isReply ? '@' + esc(h) + ' ' : ''}</textarea>
      <div style="padding:8px 16px;color:var(--sub);font-size:12px">최대 280자 · 이 브라우저에만 저장되며 어디에도 전송되지 않아요.</div>
      <button class="scancel" data-sendreply="${tg.id}" style="background:var(--blue);border:0;color:#fff">답글</button><button class="scancel" data-close>취소</button></div></div>`);
    const ta = layer.querySelector('textarea'); ta.focus(); ta.selectionStart = ta.selectionEnd = ta.value.length; }
  else if (d.sendreply){ const tg = item(d.sendreply), ta = layer.querySelector('textarea'), v = ta.value.trim();
    if (!v || /^(@\w+\s*)+$/.test(v)) return toast('내용을 입력하세요');
    const r = normReply({ id: 'u' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), rootPostId: tg.isReply ? tg.rootPostId : tg.id, parentId: tg.isReply ? tg.id : null, author: ME, text: v.slice(0, 280), time: '방금', views: 0, likesBase: 0 }, replies.length);
    st.myReplies.push({ id: r.id, rootPostId: r.rootPostId, parentId: r.parentId, author: ME, text: r.text, time: '방금', views: 0, likesBase: 0 });
    replies.push(r); save(); closeLayer(); const dest = tg.isReply ? link(tg) : '#/p/' + tg.id;
    if (location.hash === dest) rerender(); else go(dest); toast('답글을 게시했어요 (로컬)'); }
  else if (d.share){ sheet(`<button class="srow" data-copy="${d.share}">${ic('share')}링크 복사</button>`); }
  else if (d.copy){ const url = location.href.split('#')[0] + link(item(d.copy)); try { navigator.clipboard.writeText(url); } catch(err){} closeLayer(); toast('링크를 복사했어요'); }
  else if (d.moremenu){ sheet(`<button class="srow" data-toast="로컬 데모라 지원하지 않아요">${ic('share')}프로필 공유</button>`); }
  else if ('reset' in d){ if (window.confirm('이 데모에서 저장한 좋아요·북마크·답글·쪽지 등을 모두 지울까요? (원본 data.js는 그대로)')) { try { localStorage.removeItem(KEY); } catch(e){} location.hash = '#/feed'; location.reload(); } }
  else if (d.dm){ go('#/messages/' + d.dm); }
  else if (d.toast){ closeLayer(); toast(d.toast); }
  else if (d.follow){ st.follows[d.follow] = !st.follows[d.follow]; save(); rerender(); }
  else if (d.cimg){ const k = d.cimg.lastIndexOf(':'), id = d.cimg.slice(0, k); lastFocus = t; vs = { items: thread(id).filter(m => clean(m.image)), i: +d.cimg.slice(k + 1) }; drawViewer(); }
  else if (d.media){ const [id,i] = d.media.split(':'); lastFocus = t; vs = { items: posts.filter(p => p.author===id && p.media), i:+i }; drawViewer(); }
  else if ('vprev' in d) step(-1);
  else if ('vnext' in d) step(1);
  else if ('back' in d){ history.length > 1 ? history.back() : go('#/feed'); }
  else if (d.nav){ go('#/' + d.nav); }
  else if (d.go) go(d.go);
  else if (d.post) go('#/p/' + d.post);
  else if (d.open) go(d.open);
  else return;
  e.stopPropagation();
});
app.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.dataset && e.target.matches('article')) { const d = e.target.dataset; if (d.post) go('#/p/' + d.post); else if (d.open) go(d.open); } });
document.addEventListener('keydown', e => {
  if (!layer.innerHTML) return;
  if (e.key === 'Escape') closeLayer();
  else if (vs && e.key === 'ArrowLeft') step(-1);
  else if (vs && e.key === 'ArrowRight') step(1);
});
addEventListener('hashchange', route);
route();
