const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } =  require("./sesClient.js");

const createSendEmailCommand = (toAddress, fromAddress, subject, body) => {
  return new SendEmailCommand({
    Destination: {
      /* required */
      CcAddresses: [
        /* more items */
      ],
      ToAddresses: [
        toAddress,
        /* more To-email addresses */
      ],
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: "UTF-8",
          Data: `<h1>${body}</h1>`
        },
        Text: {
          Charset: "UTF-8",
          Data: "This is. the text format of the email",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [
      /* more items */
    ],
  });
};

const run = async (subject, mailBody) => {
  const sendEmailCommand = createSendEmailCommand(
    "mayurkasherwal.mk@gmail.com",
    "noreply@twingle.live",
    subject,
    mailBody
  );

  try {
    console.log( process.env.AWA_SES_ACCESS_KEY, process.env.AWS_SES_SECRET,"email command sent=-=-=-=-=->", sendEmailCommand);
    
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    console.log("stuck in caught error", caught);
    
    if (caught instanceof Error && caught.name === "MessageRejected") {
      /** @type { import('@aws-sdk/client-ses').MessageRejected} */
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};

module.exports =  {run}