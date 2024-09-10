// utils/htmlResponseHelper.ts

export const generateHtmlResponse = (message: string, success: boolean): string => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: ${success ? '#d5eef0' : '#ffe0e0'};
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
          }
          .container {
            text-align: center;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            background-color: white;
          }
          .message {
            font-size: 1.5em;
            color: ${success ? '#4CAF50' : '#F44336'};
            margin-bottom: 20px;
          }
          .btn {
            display: inline-block;
            padding: 10px 20px;
            text-decoration: none;
            color: white;
            background-color: ${success ? '1a8797' : '#F44336'};
            border-radius: 5px;
            transition: background-color 0.3s;
          }
          .btn:hover {
            background-color: ${success ? '#45a049' : '#e53935'};
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="message">${message}</div>
          <a href="" class="btn">Go to Homepage</a>
        </div>
      </body>
      </html>
    `;
  };
  