/**
 * Trustpilot Integration Configuration & Automatic Feedback Service (AFS)
 * Official business profile: https://www.trustpilot.com/review/valoreamarket.com
 */

export const TRUSTPILOT_CONFIG = {
  domain: "valoreamarket.com",
  profileUrl: "https://www.trustpilot.com/review/valoreamarket.com",
  /**
   * Trustpilot Automatic Feedback Service (AFS) BCC email.
   * Send a copy (BCC) of transactional / order / subscription confirmation emails
   * to this address to automatically trigger verified customer review invitations.
   */
  inviteEmail:
    process.env.TRUSTPILOT_INVITE_EMAIL ||
    "valoreamarket.com+71dd23ef6e@invite.trustpilot.com",
};

/**
 * Generate Trustpilot AFS structured data snippet (JSON-LD)
 * for embedding inside transactional HTML emails.
 */
export function getTrustpilotAfsSnippet(data: {
  recipientEmail: string;
  recipientName: string;
  referenceId: string;
}): string {
  const payload = {
    recipientEmail: data.recipientEmail,
    recipientName: data.recipientName,
    referenceId: data.referenceId,
  };

  return `<script type="application/json+trustpilot">${JSON.stringify(payload)}</script>`;
}
