import nodemailer from "nodemailer";
import env from "../env";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.GMAIL_USER,
    pass: env.GMAIL_APP_PASSWORD,
  },
});

type EmailOptions = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

const sendEmail = async ({ to, subject, text}: EmailOptions): Promise<void> => {
  try {
    await transporter.sendMail({
      from: env.GMAIL_USER,
      to,
      subject,
      text,
    });
  } catch (error) {
    console.error("Failed to send email:", error);
  }
};

const formatLimitWarningEmail = (
  serviceName: string,
  usage: number,
  limit: number,
  resetAt: Date
) => `
    API Rate Limit Warning
    
    The service ${serviceName} has reached its rate limit.
    
    Current Usage: ${usage}
    Limit: ${limit}
    Reset Time: ${resetAt.toLocaleString()}
    
    Please take necessary action to prevent service disruption, update to non-strict mode or increase the limit.
  `;

export { sendEmail, formatLimitWarningEmail }; 