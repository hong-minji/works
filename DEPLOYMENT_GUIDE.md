# Instagram Webhook 배포 가이드

## ⚠️ 중요: GitHub Pages 제한사항

**GitHub Pages는 정적 사이트만 호스팅하므로 서버리스 함수(API 엔드포인트)를 지원하지 않습니다.**

현재 URL: `https://hong-minji.github.io/works/api/instagram/webhook`는 **작동하지 않습니다**.

Instagram Webhook을 사용하려면 서버리스 함수를 지원하는 플랫폼에 배포해야 합니다.

---

## 🚀 권장 배포 플랫폼

### 1. Netlify (추천) ⭐

**장점:**
- ✅ 무료 플랜에서 Gatsby Functions 완벽 지원
- ✅ 자동 HTTPS 제공
- ✅ 빠른 배포 및 쉬운 설정
- ✅ 환경 변수 관리 UI 제공

**배포 방법:**

#### A. GitHub 연동 (자동 배포)

1. **Netlify 계정 생성**
   - [https://app.netlify.com/signup](https://app.netlify.com/signup) 접속
   - GitHub 계정으로 로그인

2. **새 사이트 추가**
   ```
   New site from Git → GitHub → hong-minji/works 선택
   ```

3. **빌드 설정**
   ```
   Build command: npm run build
   Publish directory: public
   ```

4. **환경 변수 설정**
   - Site settings → Environment variables
   - 다음 변수 추가:
   ```
   INSTAGRAM_VERIFY_TOKEN=fcd11d74f3e267777a6255981034939766871ff8f1c33616c4025a12a0950391
   INSTAGRAM_APP_SECRET=[Meta 콘솔에서 가져온 값]
   NOTION_API_KEY=[기존 값]
   NOTION_DATABASE_ID=[기존 값]
   NOTION_WEBHOOK_SECRET=[기존 값]
   ```

5. **배포 완료**
   - 자동으로 빌드 및 배포됨
   - Webhook URL: `https://your-site-name.netlify.app/api/instagram/webhook`

#### B. Netlify CLI (수동 배포)

```bash
# Netlify CLI 설치
npm install -g netlify-cli

# Netlify 로그인
netlify login

# 프로젝트 초기화
netlify init

# 환경 변수 설정
netlify env:set INSTAGRAM_VERIFY_TOKEN fcd11d74f3e267777a6255981034939766871ff8f1c33616c4025a12a0950391
netlify env:set INSTAGRAM_APP_SECRET your_app_secret_here

# 빌드 및 배포
npm run build
netlify deploy --prod
```

---

### 2. Vercel

**장점:**
- ✅ Gatsby 지원 (API Routes 대신 Serverless Functions 사용)
- ✅ 무료 플랜 제공
- ✅ 자동 HTTPS

**배포 방법:**

1. **Vercel 계정 생성**
   - [https://vercel.com/signup](https://vercel.com/signup)
   - GitHub 계정 연동

2. **프로젝트 가져오기**
   ```
   Add New... → Project → Import Git Repository → hong-minji/works
   ```

3. **프레임워크 설정**
   ```
   Framework Preset: Gatsby
   Build Command: gatsby build
   Output Directory: public
   ```

4. **환경 변수 설정**
   - Settings → Environment Variables
   ```
   INSTAGRAM_VERIFY_TOKEN=fcd11d74f3e267777a6255981034939766871ff8f1c33616c4025a12a0950391
   INSTAGRAM_APP_SECRET=[Meta 콘솔에서 가져온 값]
   ```

5. **배포 완료**
   - Webhook URL: `https://your-project.vercel.app/api/instagram/webhook`

**⚠️ Vercel 주의사항:**
Vercel은 `src/api/` 구조보다 `api/` 루트 디렉토리를 선호합니다. 필요시 파일 이동:
```bash
mkdir -p api/instagram
cp src/api/instagram/webhook.ts api/instagram/webhook.ts
```

---

### 3. Gatsby Cloud

**장점:**
- ✅ Gatsby 전용 플랫폼 (최적화됨)
- ✅ Gatsby Functions 네이티브 지원

**배포 방법:**

1. **Gatsby Cloud 계정 생성**
   - [https://www.gatsbyjs.com/dashboard/signup](https://www.gatsbyjs.com/dashboard/signup)

2. **사이트 추가**
   ```
   Add a site → Import from Git → GitHub → hong-minji/works
   ```

3. **환경 변수 설정**
   - Site Settings → Environment Variables

4. **배포 완료**
   - Webhook URL: `https://your-site.gatsbyjs.io/api/instagram/webhook`

---

## 📝 배포 후 설정 단계

### 1. 환경 변수 확인

배포 플랫폼에서 다음 환경 변수가 설정되었는지 확인:

```bash
INSTAGRAM_VERIFY_TOKEN=fcd11d74f3e267777a6255981034939766871ff8f1c33616c4025a12a0950391
INSTAGRAM_APP_SECRET=your_instagram_app_secret_here
```

### 2. Meta 개발자 콘솔에서 Webhook 설정

1. **Meta 개발자 대시보드 접속**
   - [https://developers.facebook.com/apps](https://developers.facebook.com/apps)

2. **앱 선택 → Webhooks**

3. **Instagram Webhook 설정**
   ```
   Callback URL: https://your-deployed-site.com/api/instagram/webhook
   Verify Token: fcd11d74f3e267777a6255981034939766871ff8f1c33616c4025a12a0950391
   ```

4. **구독 필드 선택**
   - ✅ comments
   - ✅ mentions
   - ✅ messages
   - ✅ story_insights

5. **변경 사항 확인 클릭**
   - Meta가 GET 요청으로 Webhook 검증
   - 성공 시 "Webhook verified" 메시지 표시

### 3. Webhook 테스트

```bash
# Webhook 검증 테스트
curl "https://your-deployed-site.com/api/instagram/webhook?hub.mode=subscribe&hub.verify_token=fcd11d74f3e267777a6255981034939766871ff8f1c33616c4025a12a0950391&hub.challenge=test123"

# 성공 시 응답: test123
```

---

## 🔧 로컬 개발 환경 설정

로컬에서 Webhook을 테스트하려면 **ngrok**을 사용하세요:

### ngrok 설정

```bash
# ngrok 설치 (macOS)
brew install ngrok

# 또는 직접 다운로드
# https://ngrok.com/download

# ngrok 실행
npm start  # Gatsby 개발 서버 시작 (포트 8000)
ngrok http 8000  # 다른 터미널에서 실행
```

### ngrok URL 사용

```bash
# ngrok이 제공하는 HTTPS URL 사용
# 예: https://abc123.ngrok.io

# Meta 콘솔에 입력할 URL:
https://abc123.ngrok.io/api/instagram/webhook
```

---

## 📊 생성된 인증 토큰 정보

### Instagram Verify Token

```
fcd11d74f3e267777a6255981034939766871ff8f1c33616c4025a12a0950391
```

**사용처:**
1. `.env` 파일의 `INSTAGRAM_VERIFY_TOKEN` 변수
2. 배포 플랫폼의 환경 변수 설정
3. Meta 개발자 콘솔의 "Verify Token" 필드

**보안 주의사항:**
- ✅ 이 토큰은 GitHub에 커밋하지 마세요
- ✅ `.env` 파일은 `.gitignore`에 포함되어 있습니다
- ✅ 배포 플랫폼의 환경 변수로만 설정하세요

---

## 🔐 Instagram App Secret 가져오기

1. **Meta 개발자 콘솔 접속**
   - [https://developers.facebook.com/apps](https://developers.facebook.com/apps)

2. **앱 선택**

3. **설정 → 기본 설정**

4. **"앱 시크릿" 필드에서 "표시" 클릭**

5. **값 복사 후 환경 변수에 설정**
   ```bash
   INSTAGRAM_APP_SECRET=복사한_앱_시크릿_값
   ```

---

## ✅ 체크리스트

배포 전:
- [ ] `.env.example` 파일 확인
- [ ] GitHub에 최신 코드 푸시
- [ ] Instagram App Secret 준비

배포 중:
- [ ] Netlify/Vercel/Gatsby Cloud 계정 생성
- [ ] GitHub 저장소 연동
- [ ] 환경 변수 설정
- [ ] 빌드 성공 확인

배포 후:
- [ ] Webhook URL 확인 (HTTPS)
- [ ] Meta 콘솔에서 Webhook 설정
- [ ] Webhook 검증 성공 확인
- [ ] 테스트 이벤트 수신 확인

---

## 🆘 문제 해결

### Webhook 검증 실패

**증상:** Meta 콘솔에서 "The URL couldn't be validated" 오류

**해결 방법:**
1. Webhook URL이 HTTPS인지 확인
2. 환경 변수 `INSTAGRAM_VERIFY_TOKEN`이 올바르게 설정되었는지 확인
3. Meta 콘솔의 Verify Token과 일치하는지 확인
4. 배포가 완료되었는지 확인 (빌드 로그 확인)

### 이벤트가 수신되지 않음

**해결 방법:**
1. Meta 콘솔에서 구독 필드가 선택되었는지 확인
2. 배포 플랫폼의 함수 로그 확인
3. Instagram 페이지가 올바르게 연결되었는지 확인

### 서명 검증 오류

**해결 방법:**
1. `INSTAGRAM_APP_SECRET`이 올바른지 확인
2. Meta 콘솔에서 앱 시크릿 재확인
3. 환경 변수 재배포 후 다시 빌드

---

## 📚 추가 참고 자료

- [Netlify Functions 문서](https://docs.netlify.com/functions/overview/)
- [Vercel Serverless Functions](https://vercel.com/docs/concepts/functions/serverless-functions)
- [Gatsby Cloud Functions](https://www.gatsbyjs.com/products/cloud/functions/)
- [Instagram Webhooks 공식 문서](https://developers.facebook.com/docs/instagram-api/guides/webhooks)
- [Meta 개발자 문서](https://developers.facebook.com/docs/)

---

## 💡 다음 단계

1. ✅ 인증 토큰 생성 완료
2. ⏳ Netlify/Vercel 중 하나에 배포
3. ⏳ 환경 변수 설정
4. ⏳ Meta 콘솔에서 Webhook 구독
5. ⏳ Webhook 테스트 및 검증

배포 완료 후 실제 Webhook URL을 Meta 개발자 콘솔에 입력하세요!
