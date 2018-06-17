const arc = require('@architect/functions')

const route = (request, response) => {
  // console.log(JSON.stringify(request, null, 2))
  const { email, message, name } = request.body

  return response({
    json: {
      email,
      message,
      name,
    }
  })
}

exports.handler = arc.json.post(route)
