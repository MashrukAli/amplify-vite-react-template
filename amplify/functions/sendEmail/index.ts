import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const ses = new SESClient({ region: 'ap-northeast-1' });

export const handler = async (event: any) => {
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
        (address): address is string => address !== undefined
      );
    }

    // Ensure Source is a string
    if (params.Source === undefined) {
      throw new Error('SENDER_EMAIL environment variable is not defined');
    }

    // Type assertion to ensure TypeScript knows we've handled undefined values
    const validParams = {
      ...params,
      Source: params.Source as string,
      Destination: {
        ToAddresses: params.Destination.ToAddresses as string[]
      }
    };

    await ses.send(new SendEmailCommand(validParams));
    
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
