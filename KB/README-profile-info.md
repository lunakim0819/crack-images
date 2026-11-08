# 프로필 위치·가입일 패치

1. 이 zip의 `moa-vscode/css/style.css`, `moa-vscode/js/app.js` 두 파일을 내 `moa-vscode` 폴더의 같은 파일에 덮어쓰기 (data.js·이미지는 그대로 둠).
2. `js/data.js`의 `accounts` 안 각 계정 줄 끝 `}` 바로 앞에 원하는 항목 추가 (값은 예시):

   haneul:{ ..., followers: 2430, location: '서울', joined: '2024년 2월' },

   - `followers: 2430` 뒤에 쉼표(,) 붙이고 추가
   - 비우거나('') 빼면 그 항목은 프로필에 안 보임
3. Ctrl+S → 브라우저 F5
