crypto = require 'crypto'

class IntercomController
  getUserHash:  (request, response) =>
    { uuid } = request
    return response.sendStatus(403) unless uuid?
    hmac = crypto.createHmac 'sha256', 'W8cJWX6ZuAWWHpQ0QBMDZSb4RiFP5XeAv7RSoLrm'
    hmac.update uuid
    user_hash = hmac.digest 'hex'
    response.send { user_hash }

module.exports = IntercomController
