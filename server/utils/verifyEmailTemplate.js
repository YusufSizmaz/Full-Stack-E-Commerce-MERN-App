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
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
          }
          .container {
              width: 100%;
              max-width: 600px;
              margin: 30px auto;
              background: #ffffff;
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
              text-align: center;
          }
          .logo {
              width: 100px;
              margin-bottom: 20px;
          }
          h2 {
              color: #071263;
          }
          p {
              color: #333;
              font-size: 16px;
              line-height: 1.5;
          }
          .button {
              display: inline-block;
              padding: 12px 25px;
              font-size: 16px;
              color: #fff;
              background-color: #071263;
              text-decoration: none;
              border-radius: 5px;
              margin-top: 20px;
              font-weight: bold;
          }
          .footer {
              margin-top: 20px;
              font-size: 12px;
              color: #666;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <img src="https://www.creativefabrica.com/wp-content/uploads/2019/03/Monogram-YS-Logo-Design-by-Greenlines-Studios.jpg" class="logo" alt="Email Icon">
          <h2>Welcome, ${name}!</h2>
          <p>Thank you for registering at <strong>Binkeyit</strong>. Please click the button below to verify your email address.</p>
          <a href="${url}" class="button">Verify Email</a>
          <p class="footer">If you did not create an account, you can ignore this email.</p>
      </div>
  </body>
  </html>
  `;
};

export default verifyEmailTemplate;
