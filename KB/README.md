# MOA · 비공식 UI 데모 (VS Code 편집용)

인터넷 없이 내 컴퓨터에서만 작동하는 가상 SNS 화면입니다. 실제로 전송되는 것은 없습니다.

- 열기: `index.html` 더블클릭 (또는 VS Code Live Server)
- 자세한 수정 방법: **`guide.html`을 브라우저로 여세요** (이미지 추가, 계정·글·답글·알림·쪽지 수정, 색 변경, 문제 해결)

## 파일
- `js/data.js` 내용(계정, 게시글, 답글, 알림, 쪽지) ← 주로 여기만 수정
- `js/app.js` 동작 코드
- `css/style.css` 색·글꼴 (맨 위 `:root` 변수)
- `assets/images/` 이미지 폴더. `avatar`, `banner`, `image` 필드에 `'assets/images/파일명.jpg'` 형식으로 적기

## 저장
좋아요·답글·쪽지 등 화면에서 한 것은 브라우저에만 저장됩니다. 내 프로필의 '데모 저장 데이터 초기화'로 지울 수 있어요(data.js 원본은 그대로).
