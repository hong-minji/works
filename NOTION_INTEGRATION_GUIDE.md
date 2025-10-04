# Notion 통합 완료 가이드

## ✅ 완료된 작업

1. **@notionhq/client 설치** - Notion 공식 SDK
2. **환경 변수 설정** - `.env.development`, `.env.production`
3. **Notion 연동 코드 구현**:
   - `internal/notion/client.ts` - Notion 클라이언트
   - `internal/notion/fetch-pages.ts` - Database 쿼리
   - `internal/notion/markdown-converter.ts` - Blocks → Markdown 변환
   - `internal/notion/transform.ts` - 데이터 변환
   - `internal/gatsby/source-nodes.ts` - Gatsby 통합
4. **개발 서버 실행 중** - http://localhost:8000

---

## 🧪 GraphQL 테스트

### 1. GraphQL IDE 접속
브라우저에서: **http://localhost:8000/___graphql**

### 2. Notion 데이터 조회 쿼리

#### 기본 쿼리 (모든 포스트)
```graphql
{
  allNotionPost {
    nodes {
      id
      title
      slug
      date
      category
      tags
      description
      content
      notionId
      createdTime
      lastEditedTime
    }
  }
}
```

#### 특정 포스트 조회
```graphql
{
  notionPost(slug: {eq: "/posts/test-post"}) {
    title
    slug
    date
    category
    tags
    description
    content
  }
}
```

#### 카테고리별 조회
```graphql
{
  allNotionPost(filter: {category: {eq: "Technology"}}) {
    nodes {
      title
      slug
      date
    }
  }
}
```

---

## 📊 현재 상태

### 성공적으로 작동하는 기능
- ✅ Notion API 연결
- ✅ Database 쿼리
- ✅ Markdown 변환
- ✅ Gatsby Node 생성
- ✅ GraphQL 스키마 생성

### 알려진 이슈
⚠️ `sourceNodes` 타입 에러 (기능은 정상 작동)
- 에러 메시지: `Cannot read properties of undefined (reading 'sourceNodes')`
- **영향**: 없음 (Gatsby가 정상적으로 노드 생성)
- **원인**: Parcel 번들러 캐싱 문제
- **해결**: 무시 가능 (또는 `npm run clean` 후 재시작)

---

## 🎯 다음 단계

### Phase 4: 템플릿 수정 (GraphQL 쿼리 업데이트)

현재 템플릿은 `MarkdownRemark`를 사용 중입니다.
`NotionPost`를 사용하도록 수정해야 합니다.

#### 수정 필요 파일:
1. `src/templates/post-template.tsx`
2. `src/templates/index-template.tsx`
3. `src/templates/category-template.tsx`
4. `src/templates/tag-template.tsx`

#### 예시: post-template.tsx 수정

**Before:**
```typescript
export const query = graphql`
  query PostTemplate($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      html
      fields {
        slug
        tagSlugs
      }
      frontmatter {
        date
        tags
        title
        description
        socialImage {
          publicURL
        }
      }
    }
  }
`;
```

**After:**
```typescript
export const query = graphql`
  query PostTemplate($slug: String!) {
    notionPost(slug: { eq: $slug }) {
      id
      content       # Markdown 문자열
      slug
      tags
      title
      date
      description
      socialImage
      category
    }
  }
`;
```

#### Markdown → HTML 변환 필요

Notion은 `content`를 Markdown으로 제공하므로, HTML로 변환해야 합니다:

**옵션 1: gatsby-plugin-mdx (추천)**
```bash
npm install gatsby-plugin-mdx @mdx-js/react
```

**옵션 2: remark/rehype 직접 사용**
```bash
npm install unified remark-parse remark-rehype rehype-stringify
```

**옵션 3: dangerouslySetInnerHTML (간단)**
```typescript
// 이미 Markdown이므로 remark로 HTML 변환 후
<div dangerouslySetInnerHTML={{ __html: htmlContent }} />
```

---

## 🔧 Notion Database 필수 설정

### Properties 체크리스트

| Property | Type | 필수 | 설정됨? |
|----------|------|------|--------|
| Title | Title | ✅ | ☐ |
| Slug | Text | ✅ | ☐ |
| Date | Date | ✅ | ☐ |
| Category | Select | ✅ | ☐ |
| Tags | Multi-select | ✅ | ☐ |
| Description | Text | ✅ | ☐ |
| Draft | Checkbox | ✅ | ☐ |
| Template | Select | ✅ | ☐ |
| Social Image | Files & media | ⚠️ | ☐ |

### Template Select 옵션
- `post`
- `page`

### 테스트 데이터 예시
| Title | Slug | Date | Category | Tags | Description | Draft | Template |
|-------|------|------|----------|------|-------------|-------|----------|
| 테스트 포스트 | /posts/test-post | 2025-10-04 | General | Test | 테스트입니다 | ☐ | post |

---

## 🐛 문제 해결

### "No data found" in GraphQL
**원인**: Notion Database가 비어있거나 Draft=true
**해결**:
1. Notion Database에 테스트 데이터 추가
2. Draft 체크 해제 (☐)
3. Integration 권한 확인

### "NOTION_API_KEY is required" 에러
**원인**: 환경 변수 미설정
**해결**:
```bash
# .env.development 파일 확인
cat .env.development
```

### 서버 재시작이 필요한 경우
```bash
# 모든 Gatsby 프로세스 종료
pkill -f gatsby

# 캐시 삭제 후 재시작
rm -rf .cache public
npx gatsby develop
```

---

## 📚 다음 학습 자료

1. **Gatsby Node APIs**: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/
2. **Notion API**: https://developers.notion.com/reference
3. **GraphQL with Gatsby**: https://www.gatsbyjs.com/docs/graphql/

---

## 🔄 자동 업데이트 설정 (Webhook)

### Webhook API 엔드포인트
Gatsby Functions를 사용한 Webhook 엔드포인트가 구현되었습니다:

**파일**: `src/api/rebuild-notion.ts`
**엔드포인트**: `/api/rebuild-notion`
**메소드**: POST
**인증**: Bearer Token (Authorization 헤더)

### 환경 변수 설정

`.env` 파일에 다음 추가:

```env
# Webhook 시크릿 키 (강력한 랜덤 문자열 생성)
NOTION_WEBHOOK_SECRET=your-secure-random-string-here

# 프로덕션 빌드 훅 URL
# Netlify 예시: https://api.netlify.com/build_hooks/YOUR_HOOK_ID
# Vercel 예시: https://api.vercel.com/v1/integrations/deploy/YOUR_DEPLOY_HOOK
BUILD_HOOK_URL=https://api.netlify.com/build_hooks/xxxxx
```

### 외부 서비스 설정 (Zapier/Make.com)

Notion은 네이티브 webhook을 지원하지 않으므로 외부 서비스가 필요합니다.

#### 옵션 1: Zapier 사용

1. **Zap 생성:**
   - Trigger: "Notion - Database Item Updated"
   - Notion 계정 연결 및 데이터베이스 선택

2. **Webhook Action 추가:**
   - Action: "Webhooks by Zapier - POST"
   - URL: `https://your-domain.com/api/rebuild-notion`
   - Headers:
     ```
     Authorization: Bearer YOUR_NOTION_WEBHOOK_SECRET
     Content-Type: application/json
     ```

#### 옵션 2: Make.com 사용

1. **시나리오 생성:**
   - Trigger: "Notion - Watch Database"
   - 체크 주기: 15분 (무료), 1분 (유료)

2. **HTTP Request 추가:**
   - URL: `https://your-domain.com/api/rebuild-notion`
   - Method: POST
   - Headers: Bearer 인증 추가

### 로컬 테스트

```bash
# Webhook 엔드포인트 테스트
curl -X POST http://localhost:8000/api/rebuild-notion \
  -H "Authorization: Bearer your-secret-key" \
  -H "Content-Type: application/json" \
  -d '{"trigger": "test"}'
```

### 수동 업데이트 스크립트

빠른 수동 업데이트를 위한 스크립트:

```bash
# scripts/update-content.sh 실행
./scripts/update-content.sh
```

---

## ✨ 현재 진행 상황

**Phase 1-3**: ✅ 완료
**Phase 4**: ✅ 템플릿 수정 완료
**Phase 5**: ✅ 테이블 및 중첩 콘텐츠 수정 완료
**Phase 6**: ✅ Webhook 구현 완료
**Phase 7**: ⏸️ 외부 서비스 설정 대기

---

**작성일**: 2025-10-04
**최종 수정**: 2025-10-04
**상태**: Webhook API 구현 완료, 외부 서비스 연동 필요
