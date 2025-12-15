import nodemailer from "nodemailer";
import { EMAIL_PASSWORD } from "../config/env.js";

export const createTransporter = () => {
  if (process.env.EMAIL_SERVICE === "gmail" || !process.env.EMAIL_HOST) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: 'sahilsamant97@gmail.com',
        pass: EMAIL_PASSWORD
      },
    });
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : 587,
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const transporter = createTransporter();

    await transporter.sendMail({
      from: `"Blood Donation System" <${'sahilsamant97@gmail.com'}>`,  // FIXED
      to,
      subject,
      text,
      html,
    });

    console.log("Email sent to:", to);
  } catch (err) {
    console.error("Email Error:", err);
  }
};
