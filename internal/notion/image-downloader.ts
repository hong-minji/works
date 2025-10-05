import { createWriteStream, existsSync, mkdirSync } from "fs";
import { pipeline } from "stream/promises";
import { join } from "path";
import crypto from "crypto";

// 이미지를 저장할 디렉토리 경로
const IMAGES_DIR = join(process.cwd(), "static", "notion-images");

// 디렉토리가 없으면 생성
if (!existsSync(IMAGES_DIR)) {
  mkdirSync(IMAGES_DIR, { recursive: true });
}

/**
 * URL에서 파일 확장자 추출
 */
function getFileExtension(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const match = pathname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);
    return match ? match[0] : ".png"; // 기본값은 .png
  } catch {
    return ".png";
  }
}

/**
 * URL을 기반으로 고유한 파일명 생성
 */
function generateFileName(url: string): string {
  const hash = crypto.createHash('md5').update(url).digest('hex').substring(0, 10);
  const ext = getFileExtension(url);
  return `${hash}${ext}`;
}

/**
 * 이미지 다운로드 및 로컬 경로 반환
 * @param imageUrl Notion 이미지 URL
 * @returns 로컬 이미지 경로 (/notion-images/filename.ext)
 */
export async function downloadImage(imageUrl: string): Promise<string> {
  try {
    // 이미 로컬 경로인 경우 그대로 반환
    if (imageUrl.startsWith('/') || imageUrl.startsWith('./')) {
      return imageUrl;
    }

    // 파일명 생성
    const fileName = generateFileName(imageUrl);
    const filePath = join(IMAGES_DIR, fileName);
    const publicPath = `/notion-images/${fileName}`;

    // 이미 다운로드된 파일이 있으면 재사용
    if (existsSync(filePath)) {
      console.log(`📷 Reusing cached image: ${fileName}`);
      return publicPath;
    }

    console.log(`📥 Downloading image: ${fileName}`);

    // 이미지 다운로드
    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error('Response body is null');
    }

    // Node.js Readable Stream으로 변환
    const reader = response.body.getReader();
    const writeStream = createWriteStream(filePath);

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          writeStream.write(Buffer.from(value));
        }
      }
    } finally {
      writeStream.end();
    }

    console.log(`✅ Downloaded image: ${fileName}`);
    return publicPath;
  } catch (error) {
    console.error(`❌ Failed to download image from ${imageUrl}:`, error);
    // 다운로드 실패 시 원본 URL 반환 (fallback)
    return imageUrl;
  }
}

/**
 * Markdown 내의 모든 이미지 URL을 찾아서 다운로드하고 로컬 경로로 교체
 * @param markdown Markdown 컨텐츠
 * @returns 이미지 경로가 로컬로 교체된 Markdown
 */
export async function processMarkdownImages(markdown: string): Promise<string> {
  // Markdown 이미지 패턴 찾기: ![alt](url)
  const imagePattern = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const matches = Array.from(markdown.matchAll(imagePattern));

  let processedMarkdown = markdown;

  for (const match of matches) {
    const [fullMatch, alt, url] = match;

    // Notion 이미지 URL인 경우에만 처리
    if (url.includes('notion') || url.includes('amazonaws')) {
      try {
        const localPath = await downloadImage(url);
        const newImageTag = `![${alt}](${localPath})`;
        processedMarkdown = processedMarkdown.replace(fullMatch, newImageTag);
      } catch (error) {
        console.error(`Failed to process image: ${url}`, error);
        // 실패한 경우 원본 유지
      }
    }
  }

  return processedMarkdown;
}