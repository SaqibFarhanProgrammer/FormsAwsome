const EmailTemeplete = (name: string, email: string, token: string) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verification Code</title>
  <script src="https://cdn.tailwindcss.com"></script>
<base target="_blank">
</head>
<body class="bg-[#F5F5F5] py-12 px-4">
  <div class="mx-auto max-w-[520px]">
    <!-- Logo -->
    <div class="mb-8 text-center">
      <div class="inline-flex items-center gap-2.5">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 4C9.373 4 4 9.373 4 16s5.373 12 12 12 12-5.373 12-12S22.627 4 16 4z" fill="#0EA5E9"/>
          <path d="M12 14c0-1.105.895-2 2-2h4c1.105 0 2 .895 2 2v4c0 1.105-.895 2-2 2h-4c-1.105 0-2-.895-2-2v-4z" fill="white"/>
          <path d="M16 8v4M16 20v4M8 16h4M20 16h4" stroke="white" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <span class="text-2xl font-bold text-[#1E293B]">FormsAwsome</span>
      </div>
    </div>

    <!-- Card -->
    <div class="rounded-xl border border-[#E5E5E5] bg-white p-10 shadow-sm">
      <!-- Heading -->
      <p class="text-lg font-medium text-[#1E293B] leading-relaxed">
        Your verification code for FormsAwsome is
      </p>
      <p class="mt-2 text-3xl font-bold tracking-wider text-[#1E293B]">123456</p>

      <!-- Divider -->
      <div class="my-6 h-px bg-[#E5E5E5]"></div>

      <!-- Body -->
      <div class="space-y-4 text-[15px] leading-relaxed text-[#4B5563]">
        <p>Hi ${name},</p>
        <p>
          This is your one-time verification code. The code is only valid for <strong class="font-semibold text-[#1E293B]">10 minutes</strong>.
        </p>
        <p>
          Need help? Just reply to this email or contact us at <a href="mailto:support@formsawsome.com" class="font-medium text-[#620ee9] hover:underline">support@formsawsome.com</a>. We're happy to assist you.
        </p>
      </div>

      <!-- Sign off -->
      <div class="mt-6 text-[15px] leading-relaxed text-[#4B5563]">
        <p>Thank you,</p>
        <p class="font-medium text-[#1E293B]">The FormsAwsome team</p>
      </div>
    </div>

    <!-- Footer -->
    <p class="mt-8 text-center text-xs text-[#a59caf]">
      FormsAwsome Inc. &middot; 123 Innovation Drive, San Francisco, CA 94102
    </p>
  </div>
</body>
</html>`;
};

export default EmailTemeplete;
