const forgotPasswordTemplate = ({ name, otp }) => {
  return `
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Reset Your Password</title>
              <style>
                  body {
                      font-family: Arial, sans-serif;
                      background-color: #f9f9f9; /* Sarı tonları */
                      margin: 0;
                      padding: 0;
                  }
                  .container {
                      width: 100%;
                      max-width: 600px;
                      margin: 50px auto;
                      background: #ffffff;
                      padding: 40px;
                      border-radius: 12px;
                      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
                      text-align: center;
                  }
                  .icon {
                      width: 60px;
                      height: 60px;
                      margin: 0 auto 20px;
                  }
                  h2 {
                      color: #d69e2e; /* Sarı tonları */
                      font-size: 24px;
                      font-weight: bold;
                      margin-bottom: 10px;
                  }
                  .otp {
                      display: inline-block;
                      font-size: 20px;
                      font-weight: bold;
                      color: #4CAF50;
                      background: #f0f0f0;
                      padding: 10px 20px;
                      border-radius: 8px;
                      margin: 15px 0;
                  }
                  p {
                      color: #666;
                      font-size: 16px;
                      line-height: 1.5;
                      margin-bottom: 15px;
                  }
                  .footer {
                      margin-top: 20px;
                      font-size: 12px;
                      color: #888;
                  }
              </style>
             
              
          </head>
          <body>
              <div class="container">
              
              
                      <img src="https://i.hizliresim.com/rrd46xe.png" alt="Email Verify Icon">
                 
                  
                  
                  <h2>Password Reset Request</h2>
                  <p>Hello, <strong>${name}</strong></p>
                  <p>We received a request to reset your password. Use the OTP below to proceed.</p>
                  <div class="otp">${otp}</div>
                  <p>This OTP is valid for <strong>1 hour</strong>. If you did not request this, please ignore this email.</p>
                  <p class="footer">Need help? Contact our support team.</p>
              </div>
          </body>
          </html>
      `;
};

export default forgotPasswordTemplate;
