const Hashids = require('hashids')
const data = require('@architect/data')
const sanitizeHtml = require('sanitize-html')

const createContact = async contact => {
  const hashids = new Hashids('xdp-web')
  const validKeys = [
    'company',
    'email',
    'message',
    'name',
    'phone',
    'subject'
  ]

  // Sanitize the incoming data
  const record = validKeys.reduce((object, key) => {
    const value = Reflect.get(contact, key)
    const sanitizedValue = sanitizeHtml(value)

    Reflect.set(object, key, sanitizedValue)
    return object
  }, {})

  record.createdAt = Date.now()
  record.contactID = hashids.encode(record.createdAt)

  try {
    return await data.contacts.put(record)
  }
  catch (error) {
    console.error(JSON.stringify(error, null, 2))
    throw error
  }
}

module.exports = createContact
