const arc = require('@architect/workflows')
const test = require('tape')
const tiny = require('tiny-json-http')

let server // `arc.sandbox.http` instance for testing

/**
 * first we need to start the local http server
 */
test('server.start', t => {
  t.plan(1)

  server = arc.sandbox.http.start(() => {
    t.ok(true, 'http server started on http://localhost:3333')
  })
})

/**
 * then we can make a request to it and check the result
 */
test('post /contact', t => {
  t.plan(2)

  const formBody = {
    email: 'test@test.com',
    message: 'Hello Test!',
    name: 'Test Testerson',
  }

  tiny.post(
    {
      data: formBody,
      headers: {
        'Content-Type': 'application/json',
      },
      url: 'http://localhost:3333/contact',
    },
    (err, result) => {
      if (err) throw err
      t.ok(result.body, 'got 200 response')

      const expected = formBody
      t.looseEquals(result.body, expected, 'got expected response object')
    }
  )
})

/**
 * finally close the server so we cleanly exit the test
 */
test('server.close', t => {
  t.plan(1)

  server.close()
  t.ok(true, 'server closed')
})
