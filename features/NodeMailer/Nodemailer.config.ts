import { CatchErrorFunctionForService } from "@/utils/CatchErrorFunction";
import nodemailer from "nodemailer";

async function SendVerificationEmail({ code, email }: { code: string; email: string }) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, 
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Email Verification",
      html: `Your verification code is: ${code}`,
    });

    console.log("Verification email sent: %s", info.messageId);

    return {
      message: "Verification email sent successfully",
      success: true,
    };
  } catch (err: any) {
    CatchErrorFunctionForService(err, "SendVerificationEmail", "Error sending verification email");
  }
}

export default SendVerificationEmail;
