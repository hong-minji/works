import type { GatsbyFunctionRequest, GatsbyFunctionResponse } from "gatsby";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

// Webhook 시크릿 키 (환경 변수로 설정)
const WEBHOOK_SECRET = process.env.NOTION_WEBHOOK_SECRET || "your-secret-key";

export default async function handler(
  req: GatsbyFunctionRequest,
  res: GatsbyFunctionResponse
) {
  // GET 요청 차단
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // 시크릿 키 검증
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${WEBHOOK_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    console.log("🔄 Notion 콘텐츠 업데이트 트리거됨");

    // Gatsby 캐시 클리어 및 리빌드 트리거
    // 프로덕션에서는 빌드 훅을 사용하는 것이 좋습니다
    if (process.env.NODE_ENV === "production") {
      // Netlify, Vercel 등의 빌드 훅 호출
      const buildHookUrl = process.env.BUILD_HOOK_URL;
      if (buildHookUrl) {
        const response = await fetch(buildHookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ trigger: "notion-update" })
        });

        if (!response.ok) {
          throw new Error("빌드 훅 호출 실패");
        }
      }
    } else {
      // 개발 환경에서는 캐시 클리어
      await execAsync("npx gatsby clean");
      console.log("✅ 캐시 클리어 완료");
    }

    return res.status(200).json({
      success: true,
      message: "업데이트 트리거 성공",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("❌ 업데이트 실패:", error);
    return res.status(500).json({
      error: "업데이트 실패",
      message: error instanceof Error ? error.message : "알 수 없는 오류"
    });
  }
}