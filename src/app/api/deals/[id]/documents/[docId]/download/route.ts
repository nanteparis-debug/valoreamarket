import { NextRequest, NextResponse } from "next/server";
import { gvceStore } from "@/lib/store";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; docId: string }> }
) {
  const { id, docId } = await params;
  const deal = gvceStore.getDeal(id);

  if (!deal) {
    return NextResponse.json({ error: "Deal room not found" }, { status: 404 });
  }

  const doc = deal.documents.find((d) => d.id === docId);
  if (!doc) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  const requestingOrgId = req.headers.get("x-organization-id") || req.nextUrl.searchParams.get("orgId");
  const isOriginalRequested = req.nextUrl.searchParams.get("original") === "true";

  // Security Rule: Original download REQUIRES explicit owner authorization for that organization
  if (isOriginalRequested) {
    if (!doc.isOriginalAuthorized || (doc.authorizedForOrgId && doc.authorizedForOrgId !== requestingOrgId)) {
      return NextResponse.json(
        {
          error: "FORBIDDEN_ORIGINAL_DOWNLOAD_UNAUTHORIZED",
          message:
            "The document owner has not approved release of the unredacted original to your organization. Broker approval alone does not replace document owner authorization.",
          docId,
          requiresIdentityDisclosure: true,
        },
        { status: 403 }
      );
    }
  }

  // Record audit of download
  doc.downloadCount += 1;
  deal.auditLog.push({
    action: isOriginalRequested ? "ORIGINAL_DOWNLOADED" : "REDACTED_PREVIEW_FETCHED",
    actor: requestingOrgId || "Anonymous",
    timestamp: new Date().toISOString(),
  });

  return NextResponse.json({
    success: true,
    file: {
      docId: doc.id,
      title: doc.title,
      type: isOriginalRequested ? "UNREDACTED_ORIGINAL" : "WATERMARKED_REDACTED_PREVIEW",
      downloadToken: `tok_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 9)}`,
      expiresInSeconds: 300,
      downloadCount: doc.downloadCount,
    },
  });
}
