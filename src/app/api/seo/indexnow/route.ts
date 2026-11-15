import { NextRequest, NextResponse } from "next/server";

const INDEXNOW_KEY = "41c142700df57257a0d155c86abe345f";
const HOST = "valoreamarket.com";
const LOCALES = ["en", "ar", "fr", "es", "zh-Hans", "ja", "de", "ru"];
const PATHS = ["", "catalog", "about", "faq", "contact", "legal/terms", "legal/privacy", "legal/ncnda", "legal/brokerage"];

export async function POST(req: NextRequest) {
  try {
    const urlList: string[] = [];

    for (const locale of LOCALES) {
      for (const p of PATHS) {
        urlList.push(p ? `https://${HOST}/${locale}/${p}` : `https://${HOST}/${locale}`);
      }
    }

    urlList.push(`https://${HOST}/llms.txt`);
    urlList.push(`https://${HOST}/pricing.md`);

    const payload = {
      host: HOST,
      key: INDEXNOW_KEY,
      keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
      urlList,
    };

    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      submittedUrlsCount: urlList.length,
      message: response.ok
        ? "Successfully submitted URLs to IndexNow network (Bing, Yandex, etc.)"
        : "IndexNow submission returned status " + response.status,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    protocol: "IndexNow",
    host: HOST,
    keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
    endpoint: "POST /api/seo/indexnow to trigger re-index across Bing & Yandex",
  });
}
