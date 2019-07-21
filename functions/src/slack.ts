import axios from 'axios'

import { slackToken } from './config'

const SLACK_BASE = 'https://slack.com/api'

export default async (email: string): Promise<boolean> => {
  const slackRequest = axios.create({
    baseURL: SLACK_BASE,
  })

  try {
    await slackRequest.post(`/users.admin.invite?token=${slackToken}&email=${email}`)
    return true
  } catch (e) {
    return false
  }
}
