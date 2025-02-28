const verifyEmailTemplate = (name, url) => {
  return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f6f8;
                  margin: 0;
                  padding: 0;
              }
              .container {
                  width: 100%;
                  max-width: 480px;
                  margin: 40px auto;
                  background: #ffffff;
                  padding: 30px;
                  border-radius: 12px;
                  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                  text-align: center;
              }
              .icon {
                  background-color: #d4f4dd;
                  width: 70px;
                  height: 70px;
                  border-radius: 50%;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  margin: 0 auto 20px;
              }
              .icon img {
                  width: 40px;
              }
              h2 {
                  color: #333;
                  font-size: 22px;
                  font-weight: bold;
                  margin-bottom: 10px;
              }
              .welcome {
                  font-size: 18px;
                  color: #555;
                  margin-bottom: 5px;
              }
              p {
                  color: #666;
                  font-size: 16px;
                  line-height: 1.5;
                  margin-bottom: 15px;
              }
              .button {
                  display: inline-block;
                  padding: 12px 24px;
                  font-size: 16px;
                  color: #ffffff;
                  background-color: #4CAF50;
                  text-decoration: none;
                  border-radius: 6px;
                  margin-top: 15px;
                  font-weight: bold;
                  transition: background 0.3s;
              }
              .button:hover {
                  background-color: #43a047;
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
              <div class="icon">
                  <img src="https://cdn-icons-png.flaticon.com/512/845/845646.png" alt="Verified Check Icon">
              </div>
              <p class="welcome">Welcome, ${name}!</p>
              <h2>Verify Your Email</h2>
              <p>You're almost there! Click the button below to verify your email and activate your account.</p>
              <a href="${url}" class="button">Verify Email</a>
              <p>If you didn't request this, you can safely ignore this email.</p>
              <p class="footer">Need help? Contact our support team.</p>
          </div>
      </body>
      </html>
      `;
};

export default verifyEmailTemplate;
