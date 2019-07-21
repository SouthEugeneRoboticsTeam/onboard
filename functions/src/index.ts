import * as functions from 'firebase-functions'
import axios from 'axios'

import inviteGitHubUser from './github'
import inviteSlackUser from './slack'
import inviteDriveUser from './drive'

import { domain } from './config'

const USER_INFO = 'https://www.googleapis.com/oauth2/v3/userinfo'

export const onboard = functions.https.onRequest((req, res) => {
  const { accessToken, ghUsername, slackEmail, driveEmail } = req.body

  console.log(JSON.stringify(req.body))
  const headers = { 'Authorization': `Bearer ${accessToken}` }

  axios.get(USER_INFO, { headers })
    .then((response) => {
      const { data } = response

      if (data.hd === domain || data.email.endsWith(`@${domain}`)) {
        Promise.all([
          inviteGitHubUser(ghUsername),
          inviteSlackUser(slackEmail),
          inviteDriveUser(driveEmail),
        ])
          .then(response => {
            res.send({
              github: response[0],
              slack: response[1],
              drive: response[2],
            })
          })
          .catch(console.error)
      } else {
        res.status(401)
      }
    })
    .catch((err) => {
      console.log(err)
      res.status(500)
    })
})
