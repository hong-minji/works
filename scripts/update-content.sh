#!/bin/bash

# Notion 콘텐츠 업데이트 스크립트
echo "🔄 Notion 콘텐츠 업데이트 시작..."

# 캐시 삭제
echo "🧹 캐시 정리 중..."
npx gatsby clean

# 개발 서버 재시작으로 최신 콘텐츠 가져오기
echo "📥 Notion에서 최신 콘텐츠 가져오는 중..."
npx gatsby develop

echo "✅ 업데이트 완료!"