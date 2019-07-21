import { google } from 'googleapis'

import { driveFileId, googleCredentials } from './config'

const drive = google.drive('v3')

export default async (email: string): Promise<boolean> => {
  const oAuth2Client = new google.auth.OAuth2(
    googleCredentials.clientId,
    googleCredentials.clientSecret,
  )

  oAuth2Client.setCredentials({
    refresh_token: googleCredentials.refreshToken,
  })

  try {
    await drive.permissions.create({
      auth: oAuth2Client,
      fileId: driveFileId,
      supportsAllDrives: true,
      supportsTeamDrives: true,
      requestBody: {
        role: 'writer',
        type: 'user',
        emailAddress: email,
      },
    })
    return true
  } catch (e) {
    return false
  }
}
