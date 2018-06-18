const Hashids = require('hashids')
const arc = require('@architect/functions')
const data = require('@architect/data')
const sanitizeHtml = require('sanitize-html')

const hashids = new Hashids('xdp-website')
const validKeys = [
  'company',
  'email',
  'message',
  'name',
  'phone',
  'subject',
]

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

  // Sanitize the incoming data
  const record = validKeys.reduce((object, key) => {
    const value = Reflect.get(contact, key)
    const sanitizedValue = sanitizeHtml(value)

    Reflect.set(object, key, sanitizedValue)
    return object
  }, {})

  record.createdAt = Date.now()
  record.contactID = hashids.encode(record.createdAt)

  const message = 'Thank you, we will be in contact soon!'

  try {
    await data.contacts.put(record)

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
