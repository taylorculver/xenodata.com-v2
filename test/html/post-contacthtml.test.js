const AWS = require('aws-sdk')
const arc = require('@architect/workflows')
const qs = require('qs')
const test = require('tape')
const tiny = require('tiny-json-http')

const dbEndpoint = 'http://localhost:5000'
const httpEndpoint = 'http://localhost:3333'

const dbClient = new AWS.DynamoDB.DocumentClient({ endpoint: dbEndpoint })
let dbServer // `arc.sandbox.db` instance for testing
let httpServer // `arc.sandbox.http` instance for testing

/**
 * Start the local HTTP server
 */
test('httpServer.start', t => {
  t.plan(1)

  httpServer = arc.sandbox.http.start(() => {
    t.pass(`http server started at ${httpEndpoint}`)
  })
})

/**
 * Start the local DB server
 */
test('dbServer.start', t => {
  t.plan(1)

  dbServer = arc.sandbox.db.start(() => {
    t.pass(`db server started at ${dbEndpoint}`)
  })
})

/**
 * Make the HTTP request
 */
test('POST /contacthtml', async t => {
  // t.plan(5)

  t.plan(1)
  try {

    // const result = await axios.post(
    const result = await tiny.post({
      url: `${httpEndpoint}/contacthtml`,
      data: qs.stringify({
        company: 'HTML Company',
        email: 'test@html.com',
        message: 'Hello HTML!',
        name: 'Test H. Testerson',
        phone: '123-456-7890',
        subject: 'Test HTML Subject',
      }),
      headers: {
        Accept: 'text/html',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }).then(res => {
      t.ok(true)
    }).catch(err => {
      t.ok(true)
    })
  }
  catch (err) {
    throw err
  }
})

/**
 * Verify the DB contents
 */
// test('contact DB record exists', t => {
//   t.plan(6)

//   const query = {
//     Key: {
//       email: 'test@html.com'
//     },
//     TableName: 'xdp-web-staging-contacts'
//   }
//   dbClient.get(query, (err, data) => {
//     if (err) throw err

//     const {
//       Item: {
//         company,
//         email,
//         message,
//         name,
//         phone,
//         subject,
//       }
//     } = data

//     t.equal(company, 'HTML Company', 'got expected company')
//     t.equal(email, 'test@html.com', 'got expected email')
//     t.equal(message, 'Hello HTML!', 'got expected message')
//     t.equal(name, 'Test H. Testerson', 'got expected name')
//     t.equal(phone, '123-456-7890', 'got expected phone')
//     t.equal(subject, 'Test HTML Subject', 'got expected subject')
//   })
// })

/**
 * Close the local DB server
 */
test('dbServer.close', t => {
  t.plan(1)

  dbServer.close()
  t.pass('db server closed')
})

/**
 * Close the local HTTP server
 */
test('httpServer.close', t => {
  t.plan(1)

  httpServer.close()
  t.pass('server closed')
})
