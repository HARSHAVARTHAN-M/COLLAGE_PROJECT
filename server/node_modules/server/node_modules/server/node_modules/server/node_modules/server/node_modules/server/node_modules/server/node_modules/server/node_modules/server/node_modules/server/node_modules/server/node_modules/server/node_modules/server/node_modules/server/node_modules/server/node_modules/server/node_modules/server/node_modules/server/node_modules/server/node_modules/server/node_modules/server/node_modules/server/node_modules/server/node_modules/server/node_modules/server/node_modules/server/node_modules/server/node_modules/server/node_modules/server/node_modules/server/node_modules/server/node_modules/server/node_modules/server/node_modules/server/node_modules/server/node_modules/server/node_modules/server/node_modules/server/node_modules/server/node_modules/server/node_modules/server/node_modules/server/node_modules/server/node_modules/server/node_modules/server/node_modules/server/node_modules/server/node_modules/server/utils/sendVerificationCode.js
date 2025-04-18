import { generateVerificationOptEmailTemplate } from "./emailTemplates.js"
import { sendEmail } from "./sendEmail.js";

/* export async function sendVerificationCode(verificationCode, email, res) {
    try {
        const message = generateVerificationOptEmailTemplate("User", verificationCode);
        await sendEmail({
            email,
            subject: "Verification Code (BIBLIOGEN library management system)",
            message,
        });
        res.status(200).json({
            success: true,
            message: "verification code sent successfully",
        });
    } catch (error) {
        console.error("Error sending verification email:", error);
        return res.status(500).json({
            success: false,
            message: "Verification code failed to send.",
        });
    }

} */

    export async function sendVerificationCode(verificationCode, email) {
        try {
          const message = generateVerificationOptEmailTemplate("User", verificationCode);
          await sendEmail({
            email,
            subject: "Verification Code (BIBLIOGEN library management system)",
            message,
          });
          console.log("Verification email sent successfully.");
        } catch (error) {
          console.error("Error sending verification email:", error);
          throw new Error("Verification email could not be sent.");
        }
      }