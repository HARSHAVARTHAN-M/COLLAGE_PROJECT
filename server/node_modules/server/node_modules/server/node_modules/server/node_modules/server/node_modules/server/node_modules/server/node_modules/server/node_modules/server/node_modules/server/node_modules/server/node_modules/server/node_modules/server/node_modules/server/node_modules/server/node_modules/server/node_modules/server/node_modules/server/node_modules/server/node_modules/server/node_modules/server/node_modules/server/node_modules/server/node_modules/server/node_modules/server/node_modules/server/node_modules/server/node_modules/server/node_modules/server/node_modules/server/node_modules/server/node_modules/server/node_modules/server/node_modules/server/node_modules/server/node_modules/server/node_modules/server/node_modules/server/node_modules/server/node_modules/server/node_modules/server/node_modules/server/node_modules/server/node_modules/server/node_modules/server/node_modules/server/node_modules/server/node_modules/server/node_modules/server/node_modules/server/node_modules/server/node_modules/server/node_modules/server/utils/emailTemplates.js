/* export function generateVerificationOptEmailTemplate() {
    return ``
} */

export function generateVerificationOptEmailTemplate(name, otpCode) {
  return `
          <html>
            <head>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  background-color: #f9f9f9;
                  padding: 20px;
                }
                .container {
                  background-color: #ffffff;
                  padding: 20px;
                  border-radius: 10px;
                  max-width: 600px;
                  margin: auto;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }
                .otp-box {
                  font-size: 24px;
                  font-weight: bold;
                  color: #333;
                  background: #f0f0f0;
                  padding: 10px 20px;
                  border-radius: 6px;
                  text-align: center;
                  letter-spacing: 2px;
                  margin: 20px 0;
                }
                .footer {
                  font-size: 12px;
                  color: #777;
                  text-align: center;
                  margin-top: 30px;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h2>Hello ${name},</h2>
                <p>Thank you for signing up! Use the OTP code below to verify your email address. This code is valid for 10 minutes.</p>
                <div class="otp-box">${otpCode}</div>
                <p>If you didn’t request this, please ignore this email.</p>
                <p>Best regards,<br/>BIBLOGEN</p>
                <div class="footer">
                  © 2025 YourApp. All rights reserved.
                </div>
              </div>
            </body>
          </html>
        `;
}

export function generatePasswordResetEmailTemplate(name, resetPasswordUrl) {
  return `
          <!DOCTYPE html>
          <html>
          <head>
              <meta charset="UTF-8">
              <title>Password Reset Request</title>
              <style>
                  body {
                      font-family: Arial, sans-serif;
                      background-color: #f8f9fa;
                      padding: 20px;
                      margin: 0;
                  }
                  .container {
                      max-width: 600px;
                      margin: auto;
                      background: #ffffff;
                      padding: 20px;
                      border-radius: 8px;
                      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                      text-align: center;
                  }
                  h2 {
                      color: #333;
                  }
                  p {
                      font-size: 16px;
                      color: #555;
                  }
                  .button {
                      display: inline-block;
                      background-color: #007bff;
                      color: #ffffff;
                      padding: 12px 24px;
                      text-decoration: none;
                      border-radius: 5px;
                      font-size: 16px;
                      font-weight: bold;
                      margin-top: 20px;
                  }
                  .footer {
                      margin-top: 20px;
                      font-size: 14px;
                      color: #777;
                  }
              </style>
          </head>
          <body>
              <div class="container">
                  <h2>Password Reset Request</h2>
                  <p>Hello ${name},</p>
                  <p>You recently requested to reset your password. Click the button below to proceed:</p>
                  <p>
                      <a href="${resetPasswordUrl}">${resetPasswordUrl}</a>
                  </p>
                  <p>If you did not request a password reset, no further action is needed.</p>
                  <p class="footer">Need help? Contact our support team.</p>
                  <p class="footer"><strong>Your Company Name</strong></p>
              </div>
          </body>
          </html>
        `;
}

