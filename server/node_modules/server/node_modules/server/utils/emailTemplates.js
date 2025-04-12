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
      