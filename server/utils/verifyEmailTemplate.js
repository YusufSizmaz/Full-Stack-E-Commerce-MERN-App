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
                    background-color: #fff8dc;
                    margin: 0;
                    padding: 0;
                }
                table {
                    width: 100%;
                    height: 100vh;
                    text-align: center;
                }
                .container {
                    width: 100%;
                    max-width: 500px;
                    background: #fff;
                    padding: 35px;
                    border-radius: 12px;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                    margin: auto;
                }
                .icon {
                    width: 85px;
                    margin: 0 auto 15px;
                }
                .icon img {
                    width: 100%;
                }
                h2 {
                    color: #d69e2e;
                    font-size: 22px;
                    font-weight: bold;
                    margin: 10px 0;
                }
                .welcome {
                    font-size: 17px;
                    color: #8b4513;
                    font-weight: bold;
                    margin-bottom: 8px;
                }
                p {
                    color: #654321;
                    font-size: 15px;
                    line-height: 1.6;
                    margin: 10px 0;
                }
                .button {
                    display: inline-block;
                    padding: 12px 26px;
                    font-size: 16px;
                    color: #ffffff;
                    background-color: #ffba08;
                    text-decoration: none;
                    border-radius: 8px;
                    font-weight: bold;
                    transition: background 0.3s;
                    margin-top: 15px;
                }
                .button:hover {
                    background-color: #ff9f00;
                }
                .footer {
                    margin-top: 18px;
                    font-size: 12px;
                    color: #8b4513;
                }
            </style>
        </head>
        <body>
            <table>
                <tr>
                    <td align="center">
                        <div class="container">
                            <div class="icon">
                                <img src="https://your-logo-url.com/logo.png" alt="Email Verify Icon">
                            </div>
                            <p class="welcome">Hello, ${name}!</p>
                            <h2>Verify Your Email</h2>
                            <p>You're almost there! Click the button below to verify your email and activate your account.</p>
                            <a href="${url}" class="button">Verify Email</a>
                            <p>If you didn't request this, you can safely ignore this email.</p>
                            <p class="footer">Need help? Contact our support team.</p>
                        </div>
                    </td>
                </tr>
            </table>
        </body>
        </html>
    `;
};

export default verifyEmailTemplate;
