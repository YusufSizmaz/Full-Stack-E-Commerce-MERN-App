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
                    font-family: 'Helvetica Neue', Arial, sans-serif;
                    background-color: #f4f6f8;
                    margin: 0;
                    padding: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                }
                .container {
                    width: 100%;
                    max-width: 500px;
                    background: #ffffff;
                    padding: 40px;
                    border-radius: 12px;
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
                    text-align: center;
                    border: 2px solid black;
                }
                .icon {
                    width: 90px;
                    height: 90px;
                    margin: 0 auto 20px;
                }
                .icon img {
                    width: 90px;
                }
                h2 {
                    color: #333;
                    font-size: 24px;
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
                    line-height: 1.6;
                    margin-bottom: 15px;
                }
                .button {
                    display: inline-block;
                    padding: 14px 28px;
                    font-size: 16px;
                    color: #ffffff;
                    background: linear-gradient(135deg, #6a11cb, #2575fc);
                    text-decoration: none;
                    border-radius: 8px;
                    font-weight: bold;
                    transition: opacity 0.3s;
                }
                .button:hover {
                    opacity: 0.9;
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
                    <img src="https://cdn-icons-png.flaticon.com/512/190/190411.png" alt="Email Verify Icon">
                </div>
                <p class="welcome">Hello, ${name}!</p>
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
