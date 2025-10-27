# Instagram Webhook 설정 가이드

## 개요

Instagram Webhook 엔드포인트가 `/api/instagram/webhook`에 생성되었습니다.

이 엔드포인트는 Instagram에서 발생하는 다양한 이벤트(댓글, 멘션, 메시지 등)를 실시간으로 수신할 수 있습니다.

## 📋 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 환경 변수를 추가하세요:

```bash
# Instagram Webhook 설정
INSTAGRAM_VERIFY_TOKEN=your-custom-verify-token-here
INSTAGRAM_APP_SECRET=your-instagram-app-secret-here
```

### 환경 변수 설명

- **INSTAGRAM_VERIFY_TOKEN**: Webhook 검증 시 사용할 임의의 토큰 (직접 생성)
  - 예: `my_secure_token_12345`
  - 20자 이상의 무작위 문자열 권장

- **INSTAGRAM_APP_SECRET**: Meta 개발자 콘솔에서 제공하는 앱 시크릿
  - Meta 개발자 대시보드 → 앱 설정 → 기본 설정에서 확인 가능

## 🚀 배포 및 엔드포인트 URL

### 로컬 개발 환경
```bash
npm start
# Webhook URL: http://localhost:8000/api/instagram/webhook
```

### 프로덕션 환경
배포 후 엔드포인트 URL 형식:
```
https://your-domain.com/api/instagram/webhook
```

**⚠️ 중요**: Instagram Webhook은 HTTPS가 필수입니다. 로컬 테스트를 위해서는 ngrok 같은 터널링 도구를 사용하세요.

## 🔧 Meta 개발자 콘솔에서 Webhook 설정

### 1. Meta 개발자 대시보드 접속
[https://developers.facebook.com/apps](https://developers.facebook.com/apps)

### 2. 앱 선택 또는 생성
- 기존 앱 선택하거나 새 앱 생성
- Instagram 제품 추가

### 3. Webhook 설정
1. **왼쪽 메뉴에서 "Webhooks" 선택**
2. **"Instagram" 선택**
3. **"Callback URL 수정" 클릭**

### 4. Webhook 구독 설정
```
Callback URL: https://your-domain.com/api/instagram/webhook
Verify Token: (환경 변수에 설정한 INSTAGRAM_VERIFY_TOKEN 값)
```

### 5. 구독할 필드 선택
다음 중 필요한 이벤트를 선택하세요:
- ✅ `comments` - 게시물 댓글
- ✅ `mentions` - 스토리/게시물 멘션
- ✅ `messages` - Direct Messages
- ✅ `story_insights` - 스토리 인사이트
- ✅ `live_comments` - 라이브 방송 댓글

### 6. 검증 및 저장
"변경 사항 확인" 버튼 클릭 → Meta가 GET 요청으로 Webhook 검증

## 🧪 Webhook 테스트

### 1. 로컬 테스트 (ngrok 사용)

```bash
# ngrok 설치 (https://ngrok.com/)
ngrok http 8000

# 출력된 HTTPS URL을 Meta 콘솔에 입력
# 예: https://abc123.ngrok.io/api/instagram/webhook
```

### 2. 검증 테스트 (GET 요청)

```bash
curl "https://your-domain.com/api/instagram/webhook?hub.mode=subscribe&hub.verify_token=your-verify-token&hub.challenge=test123"

# 성공 시 응답: test123
```

### 3. 이벤트 테스트 (POST 요청)

```bash
curl -X POST https://your-domain.com/api/instagram/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "object": "instagram",
    "entry": [{
      "id": "instagram-page-id",
      "time": 1234567890,
      "changes": [{
        "field": "comments",
        "value": {
          "id": "comment-id",
          "text": "테스트 댓글"
        }
      }]
    }]
  }'
```

## 📊 지원되는 Webhook 이벤트

### 1. 댓글 (comments)
```json
{
  "field": "comments",
  "value": {
    "id": "comment-id",
    "text": "댓글 내용",
    "from": { "id": "user-id", "username": "username" },
    "media": { "id": "media-id", "media_product_type": "FEED" }
  }
}
```

### 2. 멘션 (mentions)
```json
{
  "field": "mentions",
  "value": {
    "comment_id": "comment-id",
    "media_id": "media-id"
  }
}
```

### 3. 메시지 (messaging)
```json
{
  "sender": { "id": "user-id" },
  "recipient": { "id": "page-id" },
  "message": {
    "mid": "message-id",
    "text": "메시지 내용"
  }
}
```

## 🔒 보안 고려사항

### 1. 서명 검증
코드에서 `x-hub-signature-256` 헤더를 사용하여 요청의 진위를 검증합니다.

### 2. HTTPS 필수
Instagram Webhook은 HTTPS 엔드포인트만 허용합니다.

### 3. 환경 변수 보호
`.env` 파일을 `.gitignore`에 추가하여 버전 관리에서 제외하세요:

```bash
# .gitignore에 추가
.env
.env.local
.env.production
```

### 4. 응답 시간 제한
Instagram은 2초 이내에 200 응답을 기대합니다. 무거운 처리는 비동기로 처리하세요.

## 📝 커스터마이징

### 이벤트 처리 로직 수정

[src/api/instagram/webhook.ts](src/api/instagram/webhook.ts)의 다음 함수들을 수정하세요:

```typescript
// 댓글, 멘션 등 처리
async function processInstagramEvent(change: any): Promise<void> {
  // 여기에 비즈니스 로직 추가
}

// DM 메시지 처리
async function processMessagingEvent(message: any): Promise<void> {
  // 여기에 자동 응답 로직 등 추가
}
```

### 예제: 댓글 자동 응답

```typescript
async function processInstagramEvent(change: any): Promise<void> {
  const { field, value } = change;

  if (field === "comments") {
    const commentText = value.text.toLowerCase();

    // 특정 키워드에 자동 응답
    if (commentText.includes("문의")) {
      // Instagram Graph API를 통해 답글 작성
      await replyToComment(value.id, "문의 주셔서 감사합니다!");
    }
  }
}
```

## 🚨 문제 해결

### 검증 실패 시
- 환경 변수가 올바르게 설정되었는지 확인
- Verify Token이 Meta 콘솔과 일치하는지 확인
- 엔드포인트가 HTTPS로 접근 가능한지 확인

### 이벤트가 수신되지 않을 때
- Webhook 구독 필드가 올바르게 선택되었는지 확인
- Instagram 페이지가 올바르게 연결되었는지 확인
- 서버 로그 확인: `console.log` 출력 검토

### 서명 검증 오류
- `INSTAGRAM_APP_SECRET`이 올바른지 확인
- Meta 개발자 콘솔에서 앱 시크릿 재확인

## 📚 참고 자료

- [Instagram Webhooks 공식 문서](https://developers.facebook.com/docs/instagram-api/guides/webhooks)
- [Instagram Graph API 문서](https://developers.facebook.com/docs/instagram-api)
- [Gatsby Functions 문서](https://www.gatsbyjs.com/docs/reference/functions/)

## 💡 다음 단계

1. ✅ Webhook 엔드포인트 생성 완료
2. ⏳ 환경 변수 설정
3. ⏳ Meta 개발자 콘솔에서 Webhook 구독
4. ⏳ 이벤트 처리 로직 구현
5. ⏳ 프로덕션 배포 및 테스트

## 📞 지원

문제가 발생하면 다음을 확인하세요:
- 서버 로그 (콘솔 출력)
- Meta 개발자 대시보드의 Webhook 로그
- 네트워크 요청/응답 헤더
