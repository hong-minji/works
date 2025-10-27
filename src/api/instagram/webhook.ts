import type { GatsbyFunctionRequest, GatsbyFunctionResponse } from "gatsby";
import crypto from "crypto";

// Instagram 환경 변수 설정
const INSTAGRAM_VERIFY_TOKEN = process.env.INSTAGRAM_VERIFY_TOKEN || "your-verify-token";
const INSTAGRAM_APP_SECRET = process.env.INSTAGRAM_APP_SECRET || "your-app-secret";

/**
 * Instagram Webhook 엔드포인트
 * - GET: Webhook 검증 (Meta의 초기 설정 시)
 * - POST: Webhook 이벤트 수신
 */
export default async function handler(
  req: GatsbyFunctionRequest,
  res: GatsbyFunctionResponse
) {
  try {
    // GET 요청: Webhook 검증
    if (req.method === "GET") {
      return handleVerification(req, res);
    }

    // POST 요청: Webhook 이벤트 수신
    if (req.method === "POST") {
      return handleWebhookEvent(req, res);
    }

    // 허용되지 않은 HTTP 메소드
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("❌ Instagram Webhook 오류:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "알 수 없는 오류"
    });
  }
}

/**
 * GET 요청: Webhook 검증 핸들러
 * Meta가 webhook 설정 시 보내는 challenge를 검증하고 응답
 */
function handleVerification(
  req: GatsbyFunctionRequest,
  res: GatsbyFunctionResponse
) {
  // Query 파라미터 추출
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  console.log("🔍 Webhook 검증 요청 수신:", { mode, token: token ? "***" : "없음" });

  // 검증 토큰 확인
  if (mode === "subscribe" && token === INSTAGRAM_VERIFY_TOKEN) {
    console.log("✅ Webhook 검증 성공");
    return res.status(200).send(challenge);
  }

  console.error("❌ Webhook 검증 실패: 토큰 불일치");
  return res.status(403).json({ error: "Forbidden" });
}

/**
 * POST 요청: Webhook 이벤트 핸들러
 * Instagram에서 보내는 실제 이벤트 데이터 처리
 */
async function handleWebhookEvent(
  req: GatsbyFunctionRequest,
  res: GatsbyFunctionResponse
) {
  // 서명 검증 (선택사항이지만 강력히 권장)
  const signature = req.headers["x-hub-signature-256"];
  if (signature && !verifySignature(req.body, signature as string)) {
    console.error("❌ 서명 검증 실패");
    return res.status(401).json({ error: "Invalid signature" });
  }

  // Webhook 이벤트 데이터
  const webhookData = req.body;

  console.log("📥 Instagram Webhook 이벤트 수신:", JSON.stringify(webhookData, null, 2));

  // 이벤트 처리 로직
  try {
    if (webhookData.object === "instagram") {
      for (const entry of webhookData.entry || []) {
        console.log("📝 Entry ID:", entry.id);

        // 댓글 이벤트 처리
        if (entry.changes) {
          for (const change of entry.changes) {
            console.log("🔔 Change Type:", change.field);
            console.log("📊 Change Value:", JSON.stringify(change.value, null, 2));

            // 여기에 실제 비즈니스 로직 추가
            // 예: 댓글 저장, 알림 전송, 데이터베이스 업데이트 등
            await processInstagramEvent(change);
          }
        }

        // 메시징 이벤트 처리
        if (entry.messaging) {
          for (const message of entry.messaging) {
            console.log("💬 Message:", JSON.stringify(message, null, 2));
            await processMessagingEvent(message);
          }
        }
      }
    }

    // Instagram은 2초 내에 200 응답을 받아야 함
    return res.status(200).json({ success: true, received: true });
  } catch (error) {
    console.error("❌ 이벤트 처리 중 오류:", error);
    // 오류가 발생해도 200을 반환하여 Instagram이 재시도하지 않도록 함
    return res.status(200).json({ success: false, error: "Processing failed" });
  }
}

/**
 * Instagram App Secret을 사용한 서명 검증
 */
function verifySignature(payload: any, signature: string): boolean {
  try {
    const expectedSignature = crypto
      .createHmac("sha256", INSTAGRAM_APP_SECRET)
      .update(JSON.stringify(payload))
      .digest("hex");

    const signatureHash = signature.split("sha256=")[1];
    return crypto.timingSafeEqual(
      Buffer.from(signatureHash),
      Buffer.from(expectedSignature)
    );
  } catch (error) {
    console.error("❌ 서명 검증 오류:", error);
    return false;
  }
}

/**
 * Instagram 이벤트 처리 (댓글, 멘션, 좋아요 등)
 */
async function processInstagramEvent(change: any): Promise<void> {
  const { field, value } = change;

  switch (field) {
    case "comments":
      console.log("💬 새 댓글:", value.text);
      // 댓글 처리 로직 추가
      break;

    case "mentions":
      console.log("👋 멘션됨:", value.media_id);
      // 멘션 처리 로직 추가
      break;

    case "story_insights":
      console.log("📈 스토리 인사이트:", value);
      // 인사이트 처리 로직 추가
      break;

    default:
      console.log("📦 기타 이벤트:", field);
  }
}

/**
 * Instagram 메시징 이벤트 처리 (DM)
 */
async function processMessagingEvent(message: any): Promise<void> {
  console.log("📨 메시지 수신:", message);
  // 메시지 처리 로직 추가
  // 예: 자동 응답, 고객 지원 연동 등
}
