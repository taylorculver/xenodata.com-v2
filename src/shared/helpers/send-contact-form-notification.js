const aws = require('aws-sdk')
const ses = new aws.SES()
const { CONTACT_FORM_EMAIL_ADDRESS } = process.env

const generateMessageParams = contact => {
  const {
    company,
    email,
    message,
    name,
    phone,
    subject,
  } = contact

  return {
    Source: CONTACT_FORM_EMAIL_ADDRESS,
      Destination: {
      ToAddresses: [CONTACT_FORM_EMAIL_ADDRESS]
    },
    ReplyToAddresses: [email],
      Message: {
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: `
Contact Form Details:

* Name: ${name}
* Company: ${company}
* Email: ${email}
* Phone: ${phone}
* Subject: ${subject}
* Message: ${message}
          `
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Website Contact Form Submission',
      }
    }
  }
}

const sendContactFormNotification = async contact => {
  try {
    const messageParams = generateMessageParams(contact)
    return await ses.sendEmail(messageParams).promise()
  }
  catch (err) {
    throw new err
  }
}

module.exports = sendContactFormNotification
