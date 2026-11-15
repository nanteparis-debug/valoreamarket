import os

svgs = {}

# 1. VISA Official (Iconic bold italic wordmark + gold flick)
svgs['visa-official.svg'] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 60" fill="none">
  <rect width="96" height="60" rx="10" fill="#090C16" stroke="#262B40" stroke-width="1.5"/>
  <g transform="translate(14, 15)">
    <!-- Gold / Yellow top-left flick on V -->
    <path d="M10.8 3.5H1.2L1 3.9C7.2 5.6 11.4 10 13.1 13.5L11.2 4.9C10.9 3.8 10.3 3.5 10.8 3.5Z" fill="#F7B600"/>
    <!-- V letter -->
    <path d="M19.8 3.5L13.8 20.3L13.1 16.9C12.1 13.4 9.3 9.3 5.9 7.3L11.2 27.2H17.7L27.4 3.5H19.8Z" fill="#FFFFFF"/>
    <!-- I letter -->
    <path d="M26.5 27.2L31.4 3.5H37.9L33 27.2H26.5Z" fill="#FFFFFF"/>
    <!-- S letter -->
    <path d="M51.8 4.2C50.5 3.7 48.4 3.1 45.7 3.1C38.6 3.1 33.6 7 33.6 12.3C33.6 16.4 37.1 18.6 39.8 20C42.5 21.4 43.5 22.2 43.5 23.6C43.5 25.5 41.3 26.3 39.3 26.3C36.3 26.3 34.6 25.8 32.4 24.7L31.5 24.3L30.5 29.5C31.9 30.2 34.9 30.8 38 30.8C45.5 30.8 50.4 27 50.4 21.3C50.4 18 48.4 15.6 44.2 13.5C41.7 12.3 40.2 11.5 40.2 10.1C40.2 8.9 41.6 7.8 44.4 7.8C46.7 7.8 48.5 8.3 49.9 8.9L50.5 9.2L51.8 4.2Z" fill="#FFFFFF"/>
    <!-- A letter -->
    <path d="M61.8 3.5H56.8C55.2 3.5 54 4 53.3 5.7L43.2 27.2H50L51.4 23.3H59.8L60.6 27.2H66.6L61.8 3.5ZM53.1 18.3C53.7 16.9 55.7 11.1 55.7 11.1C55.7 11.1 56.3 9.6 56.5 8.6L57 10.8C57 10.8 58.5 16.9 58.7 18.3H53.1Z" fill="#FFFFFF"/>
  </g>
</svg>"""

# 2. MASTERCARD Official
svgs['mastercard-official.svg'] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 60" fill="none">
  <rect width="96" height="60" rx="10" fill="#090C16" stroke="#262B40" stroke-width="1.5"/>
  <g transform="translate(0, -1)">
    <!-- Red Circle -->
    <circle cx="38" cy="27" r="16" fill="#EB001B"/>
    <!-- Yellow Circle -->
    <circle cx="58" cy="27" r="16" fill="#F79E1B"/>
    <!-- Overlapping Lens -->
    <path d="M48 14.5A16 16 0 0 0 48 39.5 16 16 0 0 0 48 14.5Z" fill="#FF5F00"/>
  </g>
  <!-- Text: mastercard -->
  <text x="48" y="50" text-anchor="middle" fill="#FFFFFF" font-family="'Helvetica Neue', Arial, sans-serif" font-weight="700" font-size="9" letter-spacing="0.2">mastercard</text>
</svg>"""

# 3. AMERICAN EXPRESS Official (Iconic Blue Box + Centered Double-Line Bold Typography)
svgs['amex-official.svg'] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 60" fill="none">
  <rect width="96" height="60" rx="10" fill="#006FCF" stroke="#005AA8" stroke-width="1.5"/>
  <!-- Inner Border Line -->
  <rect x="5" y="5" width="86" height="50" rx="7" stroke="#40A4FF" stroke-width="1.2" fill="none" opacity="0.7"/>
  <text x="48" y="27" text-anchor="middle" fill="#FFFFFF" font-family="'Arial Black', Impact, 'Helvetica Neue', sans-serif" font-weight="900" font-size="11" letter-spacing="1.5">AMERICAN</text>
  <text x="48" y="42" text-anchor="middle" fill="#FFFFFF" font-family="'Arial Black', Impact, 'Helvetica Neue', sans-serif" font-weight="900" font-size="11" letter-spacing="1.5">EXPRESS</text>
</svg>"""

# 4. APPLE PAY Official (Apple Leaf + Apple Body with Bite + Pay)
svgs['apple-pay-official.svg'] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 60" fill="none">
  <rect width="96" height="60" rx="10" fill="#000000" stroke="#33384C" stroke-width="1.5"/>
  <g transform="translate(8, 2)">
    <!-- Apple Leaf -->
    <path d="M31.2 13.8C30.1 15.2 28.5 16 27.2 16C27 14.6 27.6 13.1 28.6 12.2C29.6 11.2 31.2 10.4 32.5 10.4C32.6 11.8 32 13 31.2 13.8Z" fill="#FFFFFF"/>
    <!-- Apple Body with Bite -->
    <path d="M32.5 16.7C30.4 16.7 29.4 15.4 27.9 15.4C26.3 15.4 24.9 16.7 23.6 16.7C21.5 16.7 19.3 18.6 19.3 22.2C19.3 26.3 22.8 31.7 25.5 31.7C26.8 31.7 27.6 30.7 29.3 30.7C31 30.7 31.5 31.7 33.2 31.7C35.8 31.7 38.2 27.1 38.2 26.7C37.9 26.6 35.5 25.4 35.5 22.5C35.5 19.7 37.6 18.4 37.7 18.2C36.2 16.1 33.7 16.7 32.5 16.7Z" fill="#FFFFFF"/>
    <!-- Pay Wordmark in Apple San Francisco Sans -->
    <text x="42" y="29.5" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-weight="600" font-size="20" letter-spacing="-0.4">Pay</text>
  </g>
</svg>"""

# 5. GOOGLE PAY Official (Google 4-Color G + Pay)
svgs['google-pay-official.svg'] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 60" fill="none">
  <rect width="96" height="60" rx="10" fill="#090C16" stroke="#262B40" stroke-width="1.5"/>
  <g transform="translate(10, 4)">
    <!-- Google G 4-Color Mark -->
    <g transform="translate(8, 14)">
      <path d="M17.6 9C17.6 8.4 17.5 7.8 17.4 7.2H8.8V10.6H13.7C13.5 11.7 12.8 12.6 11.8 13.3V15.5H14.6C16.3 13.9 17.6 11.6 17.6 9Z" fill="#4285F4"/>
      <path d="M8.8 17.6C11.2 17.6 13.2 16.8 14.6 15.5L11.8 13.3C11 13.9 10 14.2 8.8 14.2C6.5 14.2 4.6 12.6 3.9 10.6H1V12.9C2.5 15.7 5.4 17.6 8.8 17.6Z" fill="#34A853"/>
      <path d="M3.9 10.6C3.7 10 3.6 9.4 3.6 8.8C3.6 8.2 3.7 7.6 3.9 7H1V4.7C0.4 6 0 7.4 0 8.8C0 10.2 0.4 11.6 1 12.9L3.9 10.6Z" fill="#FBBC04"/>
      <path d="M8.8 3.4C10.1 3.4 11.3 3.9 12.2 4.7L14.7 2.2C13.1 0.8 11.1 0 8.8 0C5.4 0 2.5 1.9 1 4.7L3.9 7C4.6 5 6.5 3.4 8.8 3.4Z" fill="#EA4335"/>
    </g>
    <!-- Pay Wordmark in Google Sans -->
    <text x="32" y="29" fill="#FFFFFF" font-family="'Google Sans', 'Product Sans', -apple-system, Roboto, Helvetica, Arial, sans-serif" font-weight="600" font-size="20" letter-spacing="-0.3">Pay</text>
  </g>
</svg>"""

# 6. DISCOVER Official (DISC + Central Orange Sun O + VER)
svgs['discover-official.svg'] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 60" fill="none">
  <rect width="96" height="60" rx="10" fill="#090C16" stroke="#262B40" stroke-width="1.5"/>
  <text x="13" y="35" fill="#FFFFFF" font-family="'Arial Black', 'Helvetica Neue', Arial, sans-serif" font-weight="900" font-size="12.5" letter-spacing="0.5">DISC</text>
  <circle cx="53" cy="30.5" r="7" fill="#FF6000"/>
  <text x="61" y="35" fill="#FFFFFF" font-family="'Arial Black', 'Helvetica Neue', Arial, sans-serif" font-weight="900" font-size="12.5" letter-spacing="0.5">VER</text>
</svg>"""

# 7. SWIFT & SEPA Official
svgs['swift-sepa-official.svg'] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 60" fill="none">
  <rect width="120" height="60" rx="10" fill="#090C16" stroke="#262B40" stroke-width="1.5"/>
  <!-- Classical Bank Pediment & Pillars in Copper -->
  <g transform="translate(12, 15)">
    <path d="M13 2L2 8V10H24V8L13 2Z" fill="#d4956b"/>
    <rect x="4" y="11" width="3.5" height="11" fill="#d4956b"/>
    <rect x="11.2" y="11" width="3.5" height="11" fill="#d4956b"/>
    <rect x="18.5" y="11" width="3.5" height="11" fill="#d4956b"/>
    <rect x="2" y="23" width="22" height="4" rx="0.5" fill="#d4956b"/>
  </g>
  <!-- Text: SWIFT & SEPA WIRE -->
  <text x="44" y="29" fill="#FFFFFF" font-family="'Helvetica Neue', Arial, sans-serif" font-weight="800" font-size="14" letter-spacing="0.8">SWIFT</text>
  <text x="44" y="43" fill="#d4956b" font-family="'Helvetica Neue', Arial, sans-serif" font-weight="700" font-size="10" letter-spacing="0.8">SEPA WIRE</text>
</svg>"""

# 8. LEMON SQUEEZY Official
svgs['lemon-squeezy-official.svg'] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 176 60" fill="none">
  <rect width="176" height="60" rx="10" fill="#090C16" stroke="#262B40" stroke-width="1.5"/>
  <!-- Lemon Icon -->
  <g transform="translate(12, 13)">
    <path d="M17 2C9 2 2 9 2 17C2 25 9 32 17 32C25 32 32 25 32 17C32 9 25 2 17 2Z" fill="#FFC233"/>
    <path d="M32 8C29 5 24 4 20 4C21 7 23 9 25 11C28 12 32 11 32 8Z" fill="#2BB673"/>
    <path d="M9 14C11 10.5 15 8.5 20 8.5" stroke="#FFFFFF" stroke-width="1.6" stroke-linecap="round"/>
  </g>
  <!-- Text -->
  <text x="52" y="30" fill="#FFFFFF" font-family="'Helvetica Neue', Arial, sans-serif" font-weight="800" font-size="15" letter-spacing="0.2">lemon squeezy</text>
  <text x="52" y="44" fill="#d4956b" font-family="'Helvetica Neue', Arial, sans-serif" font-weight="700" font-size="10" letter-spacing="0.8">VERIFIED MERCHANT</text>
</svg>"""

# 9. DLC / SBLC Official
svgs['dlc-letter-credit-official.svg'] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 176 60" fill="none">
  <rect width="176" height="60" rx="10" fill="#090C16" stroke="#262B40" stroke-width="1.5"/>
  <!-- Shield & Vault Lock Icon -->
  <g transform="translate(12, 14)">
    <path d="M14 2L2 7.5V16.5C2 23.5 7.1 30 14 31.8C20.9 30 26 23.5 26 16.5V7.5L14 2Z" fill="#b87333" opacity="0.2"/>
    <path d="M14 2L2 7.5V16.5C2 23.5 7.1 30 14 31.8C20.9 30 26 23.5 26 16.5V7.5L14 2Z" stroke="#d4956b" stroke-width="1.8"/>
    <path d="M10.5 15H17.5V22H10.5V15ZM12.2 15V12.8C12.2 11.8 13 11 14 11C15 11 15.8 11.8 15.8 12.8V15" stroke="#FFFFFF" stroke-width="1.5"/>
  </g>
  <text x="48" y="29" fill="#FFFFFF" font-family="'Helvetica Neue', Arial, sans-serif" font-weight="800" font-size="13" letter-spacing="0.4">DLC / SBLC (MT700)</text>
  <text x="48" y="43" fill="#10B981" font-family="'Helvetica Neue', Arial, sans-serif" font-weight="700" font-size="10" letter-spacing="0.6">BANK-TO-BANK ESCROW</text>
</svg>"""

# 10. SSL ENCRYPTION Official
svgs['ssl-encryption-official.svg'] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 166 60" fill="none">
  <rect width="166" height="60" rx="10" fill="#090C16" stroke="#262B40" stroke-width="1.5"/>
  <g transform="translate(12, 14)">
    <path d="M14 2L2 7.5V16C2 23.5 7.1 30 14 31.8C20.9 30 26 23.5 26 16V7.5L14 2Z" fill="#10B981" opacity="0.15"/>
    <path d="M14 2L2 7.5V16C2 23.5 7.1 30 14 31.8C20.9 30 26 23.5 26 16V7.5L14 2Z" stroke="#10B981" stroke-width="1.8"/>
    <path d="M10.5 15H17.5V22H10.5V15ZM12.2 15V12.5C12.2 11.5 13 10.8 14 10.8C15 10.8 15.8 11.5 15.8 12.5V15" stroke="#FFFFFF" stroke-width="1.5"/>
  </g>
  <text x="46" y="29" fill="#FFFFFF" font-family="'Helvetica Neue', Arial, sans-serif" font-weight="800" font-size="13" letter-spacing="0.4">256-BIT SSL</text>
  <text x="46" y="43" fill="#10B981" font-family="'Helvetica Neue', Arial, sans-serif" font-weight="700" font-size="10" letter-spacing="0.6">PCI-DSS COMPLIANT</text>
</svg>"""

out_dir = r"d:\Utilitaires\gvce\public\images\payments"
for filename, content in svgs.items():
    filepath = os.path.join(out_dir, filename)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    # Also overwrite the old filename with the exact same content just in case!
    old_filename = filename.replace("-official.svg", ".svg")
    old_filepath = os.path.join(out_dir, old_filename)
    with open(old_filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Generated: {filename} & {old_filename}")

print("SUCCESS: All official SVGs created!")
