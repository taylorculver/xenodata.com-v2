const AWS = require('aws-sdk')
const arc = require('@architect/workflows')
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
test('POST /contact', async t => {
  t.plan(4)

  try {
    const result = await tiny.post(
      {
        data: {
          contact: {
            email: 'test@test.com',
            message: 'Hello Test!',
            name: 'Test Testerson',
          },
        },
        headers: {
          'Content-Type': 'application/json',
        },
        url: `${httpEndpoint}/contact`,
      },
    )

    t.ok(result.body, 'got 200 response')

    const { id, success, timestamp } = result.body

    t.is(success, true, 'response is success')
    t.ok(id.match(/\w+/), 'response `id` matches expected format')
    t.ok(typeof timestamp === 'number', 'response `timestamp` is numeric')
  }
  catch (err) {
    throw err
  }
})

/**
 * Verify the DB contents
 */
test('contact DB record exists', t => {
  t.plan(3)

  const query = {
    Key: {
      email: 'test@test.com'
    },
    TableName: 'xdp-website-staging-contacts'
  }
  dbClient.get(query, (err, data) => {
    if (err) throw err

    const { Item: { email, message, name } } = data

    t.equal(email, 'test@test.com', 'got expected email')
    t.equal(message, 'Hello Test!', 'got expected message')
    t.equal(name, 'Test Testerson', 'got expected name')
  })
})

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
