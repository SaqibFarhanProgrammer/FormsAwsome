const EmailTemplate = (name: string, email: string, token: string) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verification Code</title>
  <style>
    body {
      margin: 0;
      padding: 48px 16px;
      background-color: #F5F5F5;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    }
    .container {
      margin: 0 auto;
      max-width: 520px;
    }
    .logo-section {
      margin-bottom: 32px;
      text-align: center;
    }
    .logo-box {
      display: inline-flex;
      align-items: center;
      gap: 10px;
    }
    .logo-text {
      font-size: 24px;
      font-weight: bold;
      color: #1E293B;
    }
    .card {
      border-radius: 12px;
      border: 1px solid #E5E5E5;
      background-color: white;
      padding: 40px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    .heading {
      font-size: 18px;
      font-weight: 500;
      color: #1E293B;
      line-height: 1.6;
      margin: 0 0 8px 0;
    }
    .token {
      margin-top: 8px;
      font-size: 32px;
      font-weight: bold;
      letter-spacing: 3px;
      color: #1E293B;
    }
    .divider {
      margin: 24px 0;
      height: 1px;
      background-color: #E5E5E5;
    }
    .body-text {
      font-size: 15px;
      line-height: 1.6;
      color: #4B5563;
      margin: 0 0 16px 0;
    }
    .body-text strong {
      font-weight: 600;
      color: #1E293B;
    }
    .body-text a {
      color: #620ee9;
      text-decoration: none;
      font-weight: 500;
    }
    .body-text a:hover {
      text-decoration: underline;
    }
    .sign-off {
      margin-top: 24px;
      font-size: 15px;
      line-height: 1.6;
      color: #4B5563;
    }
    .sign-off-name {
      font-weight: 500;
      color: #1E293B;
    }
    .footer {
      margin-top: 32px;
      text-align: center;
      font-size: 12px;
      color: #a59caf;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Logo -->
    <div class="logo-section">
      <div class="logo-box">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 4C9.373 4 4 9.373 4 16s5.373 12 12 12 12-5.373 12-12S22.627 4 16 4z" fill="#0EA5E9"/>
          <path d="M12 14c0-1.105.895-2 2-2h4c1.105 0 2 .895 2 2v4c0 1.105-.895 2-2 2h-4c-1.105 0-2-.895-2-2v-4z" fill="white"/>
          <path d="M16 8v4M16 20v4M8 16h4M20 16h4" stroke="white" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <span class="logo-text">FormsAwsome</span>
      </div>
    </div>

    <!-- Card -->
    <div class="card">
      <!-- Heading -->
      <p class="heading">Your verification code for FormsAwsome is</p>
      <p class="token">${token}</p>

      <!-- Divider -->
      <div class="divider"></div>

      <!-- Body -->
      <p class="body-text">Hi ${name},</p>
      <p class="body-text">
        This is your one-time verification code. The code is only valid for <strong>10 minutes</strong>.
      </p>
      <p class="body-text">
        Need help? Just reply to this email or contact us at <a href="mailto:support@formsawsome.com">support@formsawsome.com</a>. We're happy to assist you.
      </p>

      <!-- Sign off -->
      <div class="sign-off">
        <p class="body-text">Thank you,</p>
        <p class="sign-off-name">The FormsAwsome team</p>
      </div>
    </div>

    <!-- Footer -->
    <p class="footer">
      FormsAwsome Inc. &middot; 123 Innovation Drive, San Francisco, CA 94102
    </p>
  </div>
</body>
</html>`;
};

export default EmailTemplate;
