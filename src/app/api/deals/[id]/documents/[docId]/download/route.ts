import { NextRequest, NextResponse } from "next/server";
import { gvceStore } from "@/lib/store";
import { verifyServerSession } from "@/lib/auth-server";

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

  // 1. Session verification & deal room participation check
  const authResult = verifyServerSession(req, {
    allowExplicitDemo: true, // Allows client viewing with demo tag
  });

  if ("errorResponse" in authResult) {
    return authResult.errorResponse;
  }

  const { user } = authResult;
  const isParticipant =
    user.role === "broker" ||
    user.role === "compliance_officer" ||
    user.role === "platform_admin" ||
    deal.participants.some((p) => p.orgId === user.orgId);

  if (!isParticipant) {
    return NextResponse.json(
      {
        error: "FORBIDDEN_DEAL_ACCESS_DENIED",
        message: "Your organization is not a verified participant in this private deal room.",
      },
      { status: 403 }
    );
  }

  const isOriginalRequested = req.nextUrl.searchParams.get("original") === "true";

  // 2. Original Download Gating: Requires explicit document owner authorization
  if (isOriginalRequested) {
    const isOwner = doc.ownerOrgId === user.orgId;
    const isExplicitlyAuthorized = doc.isOriginalAuthorized && doc.authorizedForOrgId === user.orgId;

    if (!isOwner && !isExplicitlyAuthorized) {
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
    actor: `${user.name} (${user.orgName})`,
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
      requester: {
        orgId: user.orgId,
        role: user.role,
      },
    },
  });
}
