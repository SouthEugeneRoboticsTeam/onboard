const request = require('request')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()

const PORT = process.env.PORT || 3000

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const GITHUB_ORG = 'SouthEugeneRoboticsTeam'

const GITHUB_BASE = 'https://api.github.com'
const USER_INFO = 'https://www.googleapis.com/oauth2/v3/userinfo'

const inviteUser = (githubAccount) => {
  const headers = {
    'Authorization': `token ${GITHUB_TOKEN}`,
    'User-Agent': 'SERT-Invite'
  }

  return new Promise((resolve, reject) => {
    request.get(
      `${GITHUB_BASE}/orgs/${GITHUB_ORG}/members/${githubAccount}`,
      { headers, json: true },
      (err, response, body) => {
        if (response.statusCode !== 404) {
          reject('already member')
        } else {
          request.put(
            `${GITHUB_BASE}/orgs/${GITHUB_ORG}/memberships/${githubAccount}`,
            { headers, json: true },
            (err, response, body) => {
              if (err) {
                reject(err)
              } else {
                resolve(body)
              }
            }
          )
        }
      }
    )
  })
}

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => res.redirect('https://github.sert2521.org'))
app.post('/invite/:github', (req, res) => {
  const { github } = req.params
  const { email, accessToken } = req.body

  const headers = { 'Authorization': `Bearer ${accessToken}` }

  request.get(USER_INFO, { headers, json: true }, (err, response, body) => {
    if (err || !body) {
      console.error(`Error getting user info for ${email} (GitHub: ${github}):`)
      console.error(err)

      res.status(500).json({
        success: false,
        message: 'An internal server error occurred while verifying your ' +
                 'account. Please try again.'
      })
    } else {
      if (body.hd == '4j.lane.edu' || body.email.endsWith('@4j.lane.edu')) {
        inviteUser(github).then(() => {
          res.json({ success: true })
        }).catch((err) => {
          console.error(`Error inviting ${github}:`)
          console.error(err)

          if (err === 'already member') {
            res.status(400).json({
              success: false,
              message: 'You are already a member of the GitHub organization.'
            })
          } else {
            res.status(500).json({
              success: false,
              message: 'An internal server error occurred while inviting you to' +
                       'the GitHub organization. Please try again.'
            })
          }
        })
      } else {
        console.log(`User with email ${body.email} failed to login (not 4j)`)

        res.status(401).json({
          success: false,
          message: 'Your credentials could not be verified. Ensure you are ' +
                   'logged in with a 4j.lane.edu account.'
        })
      }
    }
  })
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
