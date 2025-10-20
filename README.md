# Gatsby + Notion CMS 블로그

**[English](README.en.md) | 한국어**

Notion을 CMS로 사용하고 GitHub Actions를 통해 자동으로 동기화되는 Gatsby 기반 블로그입니다. Notion에서 글을 작성하면 10분마다 자동으로 웹사이트에 반영됩니다.

## 🌟 주요 기능

- **Notion을 CMS로 사용**: Notion에서 직접 글 작성 및 관리
- **자동 동기화**: GitHub Actions가 10분마다 Notion 콘텐츠를 자동으로 가져옴
- **슬러그 관리**: Notion에서 직접 URL 슬러그 제어
- **템플릿 선택**: Notion에서 'post'와 'page' 템플릿 중 선택
- **초안 지원**: 초안으로 표시하여 게시된 사이트에서 숨김 처리
- **풍부한 콘텐츠**: Notion의 리치 텍스트, 이미지, 코드 블록 등 완벽 지원
- **SEO 최적화**: 메타 태그, 사이트맵, RSS 피드 자동 생성
- **빠르고 반응형**: Gatsby의 최적화된 성능

## 🔐 보안 개요

> **⚠️ 매우 중요: 이 프로젝트는 절대로 저장소에 커밋해서는 안 되는 API 키를 사용합니다**

이 프로젝트는 여러 보안 조치를 구현하고 있습니다:
- 민감한 데이터를 위한 환경 변수(`.env` 파일)
- CI/CD 인증을 위한 GitHub Secrets
- 인증 정보 유출 방지를 위한 `.gitignore` 설정
- 소스 코드에 API 키 없음

**GitHub에 푸시하기 전에 반드시 아래의 보안 설정 지침을 따르세요.**

## 📋 사전 요구사항

- Node.js 18+ 및 npm
- Notion 계정 및 워크스페이스
- GitHub 계정 (자동 동기화 및 배포용)
- Git 및 커맨드 라인 기본 지식

## 🚀 설정 가이드

### 1단계: Notion 통합 설정

#### 1.1 Notion 통합 생성

1. [Notion Integrations](https://www.notion.so/my-integrations)로 이동
2. **"+ New integration"** 클릭
3. 통합 정보 입력:
   - Name: `My Blog Integration` (원하는 이름 사용)
   - Associated workspace: 워크스페이스 선택
   - Capabilities: Read content, Read comments
4. **"Submit"** 클릭
5. **"Internal Integration Token" 복사** - `NOTION_API_KEY`로 사용됩니다

> **🔒 보안 경고**: 이 토큰은 Notion 워크스페이스에 대한 접근 권한을 부여합니다. 비밀로 유지하고 절대 저장소에 커밋하지 마세요.

#### 1.2 Notion 데이터베이스 생성

1. Notion에서 새 **데이터베이스** 생성 (테이블 또는 갤러리 뷰)
2. 다음 속성들을 데이터베이스에 추가:

| 속성 이름 | 타입 | 필수 여부 | 설명 |
|-----------|------|-----------|------|
| `Title` 또는 `Name` | 제목 | ✅ 필수 | 게시글 제목 |
| `Slug` | 텍스트 | ✅ 필수 | URL 경로 (예: "my-first-post") |
| `Date` | 날짜 | ✅ 필수 | 게시 날짜 |
| `Category` | 선택 | ✅ 필수 | 게시글 카테고리 |
| `Tags` | 다중 선택 | ⚪ 선택 | 게시글 태그 |
| `Description` | 텍스트 | ✅ 필수 | 게시글 요약/설명 |
| `Draft` | 체크박스 | ✅ 필수 | 사이트에서 숨기려면 체크 |
| `Template` | 선택 | ✅ 필수 | 옵션: "post" 또는 "page" |
| `Social Image` | 파일 | ⚪ 선택 | 소셜 미디어 미리보기 이미지 |

3. **데이터베이스를 통합과 공유**:
   - 데이터베이스 우측 상단의 **"공유"** 버튼 클릭
   - **"초대"** 클릭
   - 통합 선택 (예: "My Blog Integration")
   - **"초대"** 클릭

4. **데이터베이스 ID 가져오기**:
   - 데이터베이스를 전체 페이지로 열기
   - URL 복사: `https://notion.so/workspace/DATABASE_ID?v=...`
   - `DATABASE_ID` 추출 (? 앞의 32자 문자열)

### 2단계: 로컬 개발 환경 설정

#### 2.1 클론 및 설치

```bash
# 저장소 클론 (또는 이 저장소 포크)
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO

# 의존성 설치
npm install
```

#### 2.2 환경 변수 설정

1. **예제 환경 변수 파일 복사**:
   ```bash
   cp .env.example .env.development
   ```

2. **`.env.development` 파일 수정**하여 Notion 인증 정보 추가:
   ```env
   NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

3. **`.env` 파일이 `.gitignore`에 있는지 확인**:
   ```bash
   # .gitignore에 다음 줄이 있는지 확인
   cat .gitignore | grep ".env"
   # 다음이 표시되어야 함:
   # .env
   # .env.*
   # !.env.example
   ```

> **🔒 보안 체크포인트**:
> - `.env.development` 또는 `.env` 파일을 절대 커밋하지 마세요
> - `.env.example`만 커밋하세요 (실제 인증 정보 없이)
> - 매번 `git add` 전에 재확인하세요

#### 2.3 사이트 설정 업데이트

[`content/config.json`](content/config.json)을 본인의 정보로 수정:

```json
{
  "title": "본인 이름",
  "url": "https://yourusername.github.io/repository-name",
  "description": "사이트 설명",
  "pathPrefix": "/repository-name",
  "googleAnalyticsId": "G-XXXXXXXXXX",
  "author": {
    "title": "본인 이름",
    "photo": "/profile.jpg",
    "description": "소개",
    "contacts": [
      {
        "name": "linkedin",
        "contact": "your-linkedin"
      }
    ]
  }
}
```

#### 2.4 로컬 테스트

```bash
# 개발 서버 시작
npm start

# http://localhost:8000 에서 사이트 확인 가능
```

Notion 게시글이 나타나면 통합이 정상 작동하는 것입니다! 🎉

### 3단계: GitHub 저장소 설정

#### 3.1 GitHub 저장소 생성

1. [GitHub](https://github.com/new)로 이동
2. **새 저장소** 생성 (public 또는 private)
3. **README로 초기화하지 마세요** (이미 있음)

#### 3.2 GitHub Secrets 설정

> **🔒 중요한 보안 단계**: API 키를 절대 GitHub에 푸시하지 마세요. 대신 GitHub Secrets를 사용하세요.

1. GitHub 저장소로 이동
2. **Settings** → **Secrets and variables** → **Actions**로 이동
3. **"New repository secret"** 클릭
4. 다음 시크릿 추가:

| 시크릿 이름 | 값 | 가져오는 방법 |
|------------|-----|--------------|
| `NOTION_API_KEY` | `secret_...` | 1.1단계에서 (Notion 통합 토큰) |
| `NOTION_DATABASE_ID` | `32자 문자열` | 1.2단계에서 (데이터베이스 URL) |

**각 시크릿 추가하기**:
- **"New repository secret"** 클릭
- Name: `NOTION_API_KEY`
- Secret: Notion 통합 토큰 붙여넣기
- **"Add secret"** 클릭
- `NOTION_DATABASE_ID`에 대해 반복

> **✅ 보안 확인**:
> - GitHub Secrets는 암호화되어 로그에 노출되지 않습니다
> - GitHub Actions 실행 중에만 접근 가능합니다
> - 생성 후에는 볼 수 없습니다 (업데이트/삭제만 가능)

#### 3.3 GitHub Pages 활성화

1. **Settings** → **Pages**로 이동
2. **Source**에서 선택:
   - Source: **Deploy from a branch**
   - Branch: **gh-pages** / **(root)**
3. **"Save"** 클릭

사이트는 다음 주소에서 접근 가능합니다: `https://yourusername.github.io/repository-name`

#### 3.4 코드 푸시

```bash
# 푸시하기 전: 코드에 시크릿이 없는지 확인
git status
# .env 파일이 목록에 없는지 확인

# 초기화 및 푸시
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git add .
git commit -m "Initial commit: Gatsby + Notion blog"
git push -u origin main
```

### 4단계: GitHub Actions 설정

저장소에는 두 개의 워크플로우가 포함되어 있습니다:

#### 4.1 자동 동기화 워크플로우 (`.github/workflows/sync-notion.yml`)

- **트리거**: 10분마다 자동 실행
- **목적**: 최신 Notion 콘텐츠를 가져와 변경사항이 있으면 배포
- **설정**:
  ```yaml
  schedule:
    - cron: '*/10 * * * *'  # 10분마다
  ```

**동기화 주기를 변경하려면** cron 표현식 수정:
- 5분마다: `*/5 * * * *`
- 30분마다: `*/30 * * * *`
- 1시간마다: `0 * * * *`

#### 4.2 수동 배포 워크플로우 (`.github/workflows/deploy.yml`)

- **트리거**: GitHub Actions 탭에서 수동 실행
- **목적**: 예약된 동기화를 기다리지 않고 강제 배포

**수동으로 트리거하기**:
1. GitHub의 **Actions** 탭으로 이동
2. **"Manual Deploy to GitHub Pages"** 선택
3. **"Run workflow"** 클릭
4. 선택적으로 배포 메시지 추가
5. **"Run workflow"** 클릭

### 5단계: 배포 확인

1. **GitHub Actions 확인**:
   - **Actions** 탭으로 이동
   - 첫 번째 워크플로우 실행이 완료될 때까지 대기 (녹색 체크마크)
   - 워크플로우를 클릭하여 상세 로그 확인

2. **사이트 확인**:
   - `https://yourusername.github.io/repository-name` 방문
   - Notion 게시글이 표시되어야 합니다!

3. **자동 동기화 테스트**:
   - Notion에서 새 게시글 추가
   - "Draft" 체크박스 해제
   - 최대 10분 대기
   - 웹사이트 새로고침 - 새 게시글이 나타나야 합니다!

## 📁 프로젝트 구조

```
.
├── .github/
│   └── workflows/
│       ├── sync-notion.yml      # 10분마다 자동 동기화
│       └── deploy.yml           # 수동 배포
├── content/
│   ├── config.json              # 사이트 설정
│   └── logo.png                 # 사이트 로고
├── internal/
│   ├── gatsby/                  # Gatsby 설정
│   │   ├── source-nodes.ts      # Notion 데이터 소싱
│   │   ├── create-pages.ts      # 페이지 생성
│   │   └── queries/             # GraphQL 쿼리
│   └── notion/                  # Notion 통합
│       ├── client.ts            # Notion API 클라이언트
│       ├── fetch-pages.ts       # Notion 페이지 가져오기
│       ├── transform.ts         # 프론트매터로 변환
│       ├── markdown-converter.ts # 블록을 마크다운으로 변환
│       └── image-downloader.ts  # Notion 이미지 다운로드
├── src/
│   ├── components/              # React 컴포넌트
│   ├── templates/               # 페이지 템플릿
│   ├── types/                   # TypeScript 타입
│   └── utils/                   # 유틸리티 함수
├── gatsby-config.ts             # Gatsby 설정
├── gatsby-node.ts               # Gatsby Node API
├── .env.example                 # 예제 환경 변수
└── .gitignore                   # 무시할 파일 (.env 포함)
```

## 🔧 설정

### Notion 데이터베이스 속성

시스템은 다음 Notion 속성을 찾습니다 (대소문자 구분):

- **Title/Name**: 게시글 제목 (없으면 "Untitled"로 설정)
- **Slug**: URL 경로 (없으면 제목에서 자동 생성)
- **Date**: 게시 날짜 (없으면 생성 날짜 사용)
- **Category**: 게시글 카테고리 (없으면 "uncategorized"로 설정)
- **Tags**: 태그 배열 (선택사항)
- **Description**: 게시글 요약 (선택사항)
- **Draft**: 불린 값 - true이면 게시되지 않음
- **Template**: "post" 또는 "page" (없으면 "post"로 설정)
- **Social Image**: 소셜 미디어용 미리보기 이미지 (선택사항)

### Gatsby 설정

[`gatsby-config.ts`](gatsby-config.ts)를 수정하여 다음 설정:
- 플러그인 설정
- SEO 설정
- RSS 피드 옵션
- Google Analytics

## 🐛 문제 해결

### 게시글이 나타나지 않을 때

1. **Notion 데이터베이스 공유 확인**:
   - Notion 데이터베이스 열기
   - "공유" 클릭 → 통합이 접근 권한을 가지고 있는지 확인

2. **초안 상태 확인**:
   - Notion에서 "Draft" 체크박스가 체크 해제되어 있는지 확인

3. **GitHub Secrets 확인**:
   - Settings → Secrets → `NOTION_API_KEY`와 `NOTION_DATABASE_ID`가 존재하는지 확인

4. **GitHub Actions 로그 검토**:
   - Actions 탭 → 최근 워크플로우 실행 클릭
   - 오류 메시지 확인

### GitHub Actions 실패 시

1. **"NOTION_API_KEY is required"**:
   - GitHub Secrets에 시크릿이 없거나 철자가 틀림
   - Settings → Secrets → 시크릿 추가/업데이트

2. **"unauthorized" 오류**:
   - 잘못된 Notion API 키
   - Notion에서 통합 토큰 재생성
   - GitHub Secret 업데이트

3. **"object_not_found" 오류**:
   - 잘못된 데이터베이스 ID
   - 데이터베이스가 통합과 공유되지 않음
   - 데이터베이스 ID 및 공유 설정 확인

### 로컬 개발 오류

1. **"NOTION_API_KEY is required"**:
   - `.env.development` 파일 생성
   - `.env.example`에서 인증 정보 복사

2. **포트 8000이 이미 사용 중**:
   ```bash
   # 기존 프로세스 종료
   lsof -ti:8000 | xargs kill -9

   # 또는 다른 포트 사용
   gatsby develop -p 8001
   ```

## 🔒 보안 모범 사례

### ✅ 해야 할 것:
- ✅ 모든 API 키에 GitHub Secrets 사용
- ✅ `.env` 파일을 `.gitignore`에 유지
- ✅ 실제 인증 정보 없이 `.env.example` 사용
- ✅ 실수로 노출된 경우 API 키 교체
- ✅ 푸시하기 전에 커밋 히스토리 검토
- ✅ 환경별 env 파일 사용 (`.env.development`, `.env.production`)

### ❌ 하지 말아야 할 것:
- ❌ `.env` 파일을 Git에 커밋
- ❌ 이슈나 풀 리퀘스트에서 API 키 공유
- ❌ 소스 파일에 인증 정보 하드코딩
- ❌ 시크릿 확인 없이 공개 저장소에 푸시
- ❌ 개발 환경에서 프로덕션 키 사용
- ❌ Git이나 GitHub의 보안 경고 무시

### 🚨 실수로 시크릿을 커밋한 경우:

1. **즉시 노출된 모든 키 교체**:
   - Notion: 새 통합 생성, 시크릿 업데이트
   - GitHub: 새 개인 액세스 토큰 생성

2. **Git 히스토리에서 제거**:
   ```bash
   # BFG Repo-Cleaner 또는 git filter-branch 사용
   # 그 다음 강제 푸시 (경고: 파괴적)
   git push --force
   ```

3. **GitHub에서 확인**:
   - 커밋 히스토리가 깨끗한지 확인
   - 모든 브랜치에 시크릿이 없는지 확인

## 📝 커스터마이징

### 스타일링

- [`src/assets/scss/`](src/assets/scss/)의 SCSS 파일 수정
- [`src/assets/scss/_variables.scss`](src/assets/scss/_variables.scss)에서 주요 색상 및 폰트 수정

### 기능 추가

- **새 Notion 속성**: [`internal/notion/transform.ts`](internal/notion/transform.ts) 업데이트
- **새 페이지 타입**: [`src/templates/`](src/templates/)에 템플릿 추가
- **커스텀 컴포넌트**: [`src/components/`](src/components/)에 생성

## 📚 리소스

- [Gatsby 문서](https://www.gatsbyjs.com/docs/)
- [Notion API 문서](https://developers.notion.com/)
- [GitHub Actions 문서](https://docs.github.com/en/actions)
- [마크다운 가이드](https://www.markdownguide.org/)

## 🤝 기여하기

1. 저장소 포크
2. 기능 브랜치 생성 (`git checkout -b feature/amazing-feature`)
3. 변경사항 커밋 (`git commit -m 'Add amazing feature'`)
4. 브랜치에 푸시 (`git push origin feature/amazing-feature`)
5. Pull Request 열기

## 📄 라이선스

이 프로젝트는 [Gatsby Lumen Theme](https://github.com/alxshelepenok/gatsby-starter-lumen)을 기반으로 합니다 - MIT License

## 💬 지원

문제가 발생한 경우:

1. [문제 해결](#-문제-해결) 섹션 확인
2. [GitHub Issues](../../issues) 검토
3. 다음 내용으로 새 이슈 생성:
   - 오류 메시지 (시크릿은 제거!)
   - 재현 단계
   - 환경 정보 (Node 버전, OS 등)

---

**Gatsby와 Notion으로 ❤️를 담아 제작되었습니다**
