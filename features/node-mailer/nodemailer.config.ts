import { CatchErrorFunctionForService } from "@/utils/catchErrorFunction";
import nodemailer from "nodemailer";
import EmailTemplate from "./nodemail-email-template";

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporter;
}

async function SendVerificationEmail({
  code,
  email,
  name,
}: {
  code: string;
  email: string;
  name: string;
}) {
  try {
    const transporter = getTransporter();
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Email Verification",
      html: EmailTemplate(name, email, code),
    });

    return {
      message: "Verification email sent successfully",
      success: true,
      messageId: info.messageId,
    };
  } catch (err: any) {
    CatchErrorFunctionForService(err, "SendVerificationEmail", "Error sending verification email");
    return {
      message: "Failed to send verification email",
      success: false,
    };
  }
}

export default SendVerificationEmail;
