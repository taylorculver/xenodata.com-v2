const arc = require('@architect/functions')
const createContact = require('@architect/shared/helpers/create-contact')
const sendContactFormNotification = require('@architect/shared/helpers/send-contact-form-notification')

const route = async (request, response) => {
  const { contact } = request.body

  if (!contact) {
    return response({
      json: {
        error: 'Missing contact',
      },
      status: 400, // Bad Request
    })
  }

  try {
    const record = await createContact(contact)
    const message = 'Thank you, we will be in contact soon!'

    await sendContactFormNotification(contact)

    return response({
      json: {
        id: record.contactID,
        message,
        success: true,
        timestamp: record.createdAt,
      }
    })
  }
  catch (error) {
    console.error(JSON.stringify(error, null, 2))

    return response({
      json: {
        error: 'An error has occurred',
      },
      status: 400, // Bad Request
    })
  }
}

exports.handler = arc.json.post(route)
