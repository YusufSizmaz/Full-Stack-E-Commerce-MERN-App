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
                    font-family: 'Arial', sans-serif;
                    background-color: #f9f9f9;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    width: 100%;
                    max-width: 600px;
                    background: #ffffff;
                    padding: 40px;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                    margin: 50px auto;
                    text-align: center;
                }
                .icon {
                    width: 100px;
                    margin: 0 auto 20px;
                }
                .icon img {
                    width: 100%;
                }
                h2 {
                    color: #d69e2e;
                    font-size: 24px;
                    font-weight: bold;
                    margin: 20px 0;
                }
                .welcome {
                    font-size: 18px;
                    color: #333;
                    margin-bottom: 10px;
                }
                p {
                    color: #666;
                    font-size: 16px;
                    line-height: 1.5;
                    margin: 10px 0;
                }
                .button {
                    display: inline-block;
                    padding: 12px 30px;
                    font-size: 16px;
                    color: #ffffff;
                    background-color: #ffba08;
                    text-decoration: none;
                    border-radius: 8px;
                    font-weight: bold;
                    transition: background 0.3s;
                    margin-top: 20px;
                }
                .button:hover {
                    background-color: #ff9f00;
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
                    <img src="https://i.hizliresim.com/rrd46xe.png" alt="Email Verify Icon">
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
