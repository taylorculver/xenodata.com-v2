const arc = require('@architect/functions')
const createContact = require('@architect/shared/helpers/create-contact')
const sendContactFormNotification = require('@architect/shared/helpers/send-contact-form-notification')

const { CONTACT_FORM_REDIRECT_URL } = process.env

const route = async (request, response) => {
  console.log('ROUTE REQ:', JSON.stringify(request, null, 2))
  console.log('CONTACT_FORM_REDIRECT_URL:', CONTACT_FORM_REDIRECT_URL)
  // console.log('ROUTE REQ BODY:', JSON.stringify(request.body, null, 2))
  const contact = { ...request.body }

  if (!Object.keys(contact).length === 0) {
    return response({
      html: '<h1>Missing Contact</h1>',
      status: 400, // Bad Request
    })
  }

  try {
    await createContact(contact)
    await sendContactFormNotification(contact)

    return response({
      location: (CONTACT_FORM_REDIRECT_URL || '/contact-thank-you.html'),
      // location: '/contact-thank-you.html',
    })
  } catch (error) {
    console.error(JSON.stringify(error, null, 2))

    return response({
      html: '<h1>An error has occurred</h1>',
      status: 500,
    })
  }
}

exports.handler = arc.html.post(route)
