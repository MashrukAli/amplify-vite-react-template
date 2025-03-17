const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

const ses = new SESClient({ region: 'ap-northeast-1' });

exports.handler = async (event) => {
  // Handle OPTIONS requests for CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key",
        "Access-Control-Allow-Methods": "OPTIONS,POST"
      },
      body: JSON.stringify({})
    };
  }
  
  try {
    const { name, email, message, subject } = JSON.parse(event.body);
    
    const params = {
      Source: process.env.SENDER_EMAIL,
      Destination: {
        ToAddresses: [process.env.SENDER_EMAIL]
      },
      Message: {
        Subject: { Data: subject || 'New Contact Form Submission' },
        Body: {
          Text: { Data: `Name: ${name}\nEmail: ${email}\nMessage: ${message}` },
          Html: { 
            Data: `<h1>New Contact Form Submission</h1>
                   <p><strong>Name:</strong> ${name}</p>
                   <p><strong>Email:</strong> ${email}</p>
                   <p><strong>Message:</strong> ${message}</p>` 
          }
        }
      }
    };

    // Ensure ToAddresses contains only string values, not undefined
    if (params.Destination.ToAddresses.includes(undefined)) {
      params.Destination.ToAddresses = params.Destination.ToAddresses.filter(
        (address) => address !== undefined
      );
    }

    // Ensure Source is a string
    if (params.Source === undefined) {
      throw new Error('SENDER_EMAIL environment variable is not defined');
    }

    await ses.send(new SendEmailCommand(params));
    
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key",
        "Access-Control-Allow-Methods": "OPTIONS,POST"
      },
      body: JSON.stringify({ message: 'Email sent successfully' })
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key",
        "Access-Control-Allow-Methods": "OPTIONS,POST"
      },
      body: JSON.stringify({ error: 'Failed to send email' })
    };
  }
};